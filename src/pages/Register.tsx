import { useEffect, useState, useRef } from "react";
import { useRoute, Link } from "wouter";
import { ArrowLeft, Calendar, MapPin, Check, Ticket, X } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";
import { useEvents } from "@/lib/adminStore";
import { maskImageUrl } from "@/lib/utils";
import NotFound from "@/pages/not-found";
import { submitToFormSubmit } from "@/lib/brevo";
import { isEmailRegistered, addRegistration } from "@/lib/registrations";
import { motion, AnimatePresence } from "framer-motion";
import eventImg from "@/assets/unnamed.webp";

type ModalStep = "closed" | "form" | "confirm" | "submitting" | "success";

export default function Register() {
  const [, params] = useRoute("/register/:slug");
  const slug = params?.slug;
  const [events] = useEvents();
  const event = events.find((e) => e.slug === slug);

  const [step, setStep] = useState<ModalStep>("closed");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [slug]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (step !== "closed") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [step]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && step !== "submitting") closeModal();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [step]);

  if (!event) {
    // Events may still be streaming in from Firestore on a direct load /
    // refresh — show a neutral loading state instead of a premature 404.
    if (events.length === 0) {
      return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Loading event…</p>
          </div>
        </div>
      );
    }
    return <NotFound />;
  }

  const heroImage = event.image ? maskImageUrl(event.image) : eventImg;

  function closeModal() {
    setStep("closed");
    setName("");
    setEmail("");
    setErrors({});
  }

  function validateForm(): boolean {
    const newErrors: { name?: string; email?: string } = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (trimmedName.length < 2) newErrors.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.email = "Valid email required";
    } else if (slug && isEmailRegistered(trimmedEmail, slug)) {
      newErrors.email = "This email is already registered for this event";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleFormNext() {
    if (validateForm()) setStep("confirm");
  }

  async function handleConfirm() {
    if (!event) return;
    setStep("submitting");
    try {
      await addRegistration(name.trim(), email.trim(), slug || "");

      // Web3Forms notifies the organisation AND, with the Autoresponder
      // enabled in the dashboard, emails a confirmation to the attendee
      // (it auto-sends to the submitted `email` field). The fields below are
      // shown in both emails, so they read as a friendly confirmation.
      const result = await submitToFormSubmit({
        name: name.trim(),
        email: email.trim(),
        replyto: email.trim(),
        subject: `You're registered: ${event.title}`,
        Event: event.title,
        Date: event.date,
        Venue: event.venue,
        message: `Hi ${name.trim()}, you're confirmed for ${event.title} on ${event.date} at ${event.venue}. We can't wait to see you there!`,
      });

      if (!result.success) throw new Error(result.error as string || "Failed to register");

      setStep("success");
      setTimeout(() => closeModal(), 8000);
    } catch (error) {
      console.error("Registration Error:", error);
      toast.error("Something went wrong. Please try again.");
      setStep("confirm");
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-44 lg:pt-52 pb-20 border-b border-foreground/15">
        <div className="container mx-auto px-4 lg:px-8">
          <Link href="/#events">
            <button className="inline-flex items-center gap-2 font-bold tracking-widest text-sm mb-8 hover:text-primary transition-colors">
              <ArrowLeft size={18} strokeWidth={2} /> Back
            </button>
          </Link>

          <div className="grid lg:grid-cols-5 gap-12 lg:gap-20 items-stretch">
            {/* Left: event info (3 columns) */}
            <div className="lg:col-span-3 flex flex-col justify-between">
              <div>
                <h1 className="font-display text-4xl sm:text-5xl leading-[1.1] mb-4">
                  {event.title}
                </h1>

                <div className="flex flex-col gap-3 text-sm font-medium text-muted-foreground mb-8">
                  <span className="inline-flex items-center gap-2">
                    <Calendar size={16} className="text-primary" />
                    {event.date}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <MapPin size={16} className="text-primary" />
                    {event.venue}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Ticket size={16} className="text-primary" />
                    Free Entry - Limited Seats
                  </span>
                </div>

                <div className="text-base leading-relaxed font-medium space-y-6 mb-12">
                  {event.desc.split('\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>

              <div>
                <button
                  onClick={() => setStep("form")}
                  className="w-full sm:w-auto font-display tracking-widest text-sm min-h-[44px] px-10 bg-primary text-white btn-primary"
                >
                  Save my spot
                </button>
              </div>
            </div>

            {/* Right: slightly bigger event image (2 columns) */}
            <div className="lg:col-span-2 order-first lg:order-last lg:self-start">
              <img
                src={heroImage}
                alt={event.title}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* ── Registration Modal ─────────────────────────────────── */}
      <AnimatePresence>
        {step !== "closed" && (
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === overlayRef.current && step !== "submitting") closeModal();
            }}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 1, y: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md bg-background border border-foreground/15 p-8 z-10"
            >
              {/* Close button */}
              {step !== "submitting" && (
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              )}

              <AnimatePresence mode="wait">
                {/* Step 1: Form */}
                {step === "form" && (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h2 className="font-display text-2xl mb-1">Save your spot</h2>
                    <p className="text-sm text-muted-foreground mb-6">
                      Enter your details to register for {event.title}.
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label className="block font-bold text-sm mb-1.5">Full Name</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => { setName(e.target.value); setErrors((prev) => ({ ...prev, name: undefined })); }}
                          placeholder="Your full name"
                          className="w-full border border-foreground/15 bg-transparent font-medium text-base h-11 px-3 outline-none focus:border-primary transition-colors"
                          autoFocus
                        />
                        {errors.name && <p className="text-primary text-xs mt-1 font-medium" aria-live="polite">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="block font-bold text-sm mb-1.5">Email Address</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: undefined })); }}
                          placeholder="you@example.com"
                          className="w-full border border-foreground/15 bg-transparent font-medium text-base h-11 px-3 outline-none focus:border-primary transition-colors"
                          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleFormNext(); } }}
                        />
                        {errors.email && <p className="text-primary text-xs mt-1 font-medium" aria-live="polite">{errors.email}</p>}
                      </div>
                    </div>

                    <button
                      onClick={handleFormNext}
                      className="w-full mt-6 font-display tracking-widest text-sm min-h-[44px] bg-primary text-white btn-primary"
                    >
                      Continue
                    </button>
                  </motion.div>
                )}

                {/* Step 2: Confirm */}
                {step === "confirm" && (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h2 className="font-display text-2xl mb-1">Confirm registration</h2>
                    <p className="text-sm text-muted-foreground mb-6">
                      Please verify your details before confirming.
                    </p>

                    <div className="border border-foreground/15 p-4 space-y-3 mb-6">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Name</p>
                        <p className="font-medium text-base">{name.trim()}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email</p>
                        <p className="font-medium text-base">{email.trim()}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Event</p>
                        <p className="font-medium text-base">{event.title}</p>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground mb-6">
                      A confirmation will be sent to your email address.
                    </p>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setStep("form")}
                        className="flex-1 font-display tracking-widest text-sm min-h-[44px] border border-foreground/15 bg-transparent text-foreground hover:bg-foreground/5 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleConfirm}
                        className="flex-1 font-display tracking-widest text-sm min-h-[44px] bg-primary text-white btn-primary"
                      >
                        Confirm
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2.5: Submitting */}
                {step === "submitting" && (
                  <motion.div
                    key="submitting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-8"
                  >
                    <div className="cube-loader mb-6">
                      <div className="cube-wrapper">
                        <div className="cube-face front"></div>
                        <div className="cube-face back"></div>
                        <div className="cube-face left"></div>
                        <div className="cube-face right"></div>
                        <div className="cube-face top"></div>
                        <div className="cube-face bottom"></div>
                      </div>
                    </div>
                    <p className="font-display tracking-widest text-sm uppercase font-bold">Registering...</p>
                  </motion.div>
                )}

                {/* Step 3: Success */}
                {step === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center py-8 text-center"
                  >
                    <div className="w-16 h-16 bg-[#e73e4c] flex items-center justify-center mb-6">
                      <Check className="w-8 h-8 text-white" strokeWidth={3} />
                    </div>
                    <h2 className="font-display text-2xl mb-2">You're in!</h2>
                    <p className="text-sm text-muted-foreground mb-1">
                      A confirmation has been sent to
                    </p>
                    <p className="font-bold text-sm mb-4">{email.trim()}</p>
                    <p className="text-xs text-muted-foreground">
                      See you on {event.date} at {event.venue}.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
