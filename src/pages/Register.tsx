import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@/lib/zodResolver";
import { ArrowLeft, Calendar, MapPin, Check } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { getEvents } from "@/lib/adminStore";
import NotFound from "@/pages/not-found";
import { submitToFormSubmit } from "@/lib/brevo";
import { motion, AnimatePresence } from "framer-motion";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  role: z.string().min(2, "Tell us a little about you"),
  notes: z.string().optional(),
});

export default function Register() {
  const [, params] = useRoute("/register/:slug");
  const slug = params?.slug;
  const event = getEvents().find((e) => e.slug === slug);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", role: "", notes: "" },
  });

  const isPending = form.formState.isSubmitting;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [slug]);

  if (!event) {
    return <NotFound />;
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result = await submitToFormSubmit({
        email: values.email,
        name: values.name,
        role: values.role,
        notes: values.notes,
        subject: `Interest Registered: ${event?.title}`,
        source: `Interest: ${event?.title}`,
      });

      if (!result.success) {
        throw new Error(result.error as string || "Failed to register interest");
      }

      setIsSubmitted(true);
      form.reset();
      
      // Reset success state after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error("Registration Error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-44 lg:pt-52 pb-20 border-b border-foreground/15">
        <div className="container mx-auto px-4 lg:px-8">
          <Link href="/#events">
            <button className="inline-flex items-center gap-2 font-bold tracking-widest text-sm mb-8 hover:text-primary transition-colors">
              <ArrowLeft size={18} strokeWidth={2} /> Back to Agenda
            </button>
          </Link>

          <div className="mb-10">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1] mb-6">
              {event.title}
            </h1>
            <div className="w-full h-px bg-foreground/15"></div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            <div className="border border-foreground/15 bg-background p-5 flex items-start gap-3">
              <Calendar size={24} strokeWidth={2} className="text-primary mt-1 shrink-0" />
              <div>
                <div className="font-bold uppercase tracking-widest text-xs text-muted-foreground">
                  Date
                </div>
                <div className="font-display text-2xl">{event.date}</div>
              </div>
            </div>
            <div className="border border-foreground/15 bg-background p-5 flex items-start gap-3">
              <MapPin size={24} strokeWidth={2} className="text-primary mt-1 shrink-0" />
              <div>
                <div className="font-bold uppercase tracking-widest text-xs text-muted-foreground">
                  Venue
                </div>
                <div className="font-display text-2xl leading-tight">
                  {event.venue}
                </div>
              </div>
            </div>
          </div>

          <div className="border border-foreground/15 bg-background p-6 md:p-10 mb-12">
            <h2 className="font-display text-2xl md:text-3xl mb-3 border-b border-foreground/15 pb-2">
              About this gathering
            </h2>
            <p className="text-lg leading-relaxed font-medium">{event.desc}</p>
          </div>

          <div className="border border-foreground/15 bg-background p-6 md:p-10">
            <h2 className="font-display text-3xl md:text-4xl mb-6 border-b border-foreground/15 pb-3">
              Save your spot
            </h2>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-xs">
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Jane Doe"
                            {...field}
                            className="border border-foreground/15 h-14 font-medium focus-visible:ring-0 focus-visible:border-primary transition-all bg-background shadow-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-xs">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="jane@example.com"
                            {...field}
                            className="border border-foreground/15 h-14 font-medium focus-visible:ring-0 focus-visible:border-primary transition-all bg-background shadow-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-xs">
                        I'm coming as a...
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Youth / Mentor / Sponsor / Supporter"
                          {...field}
                          className="border border-foreground/15 h-14 font-medium focus-visible:ring-0 focus-visible:border-primary transition-all bg-background shadow-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-xs">
                        Anything else? (Optional)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Questions, accessibility needs, ideas..."
                          {...field}
                          className="resize-none border border-foreground/15 min-h-[120px] font-medium focus-visible:ring-0 focus-visible:border-primary transition-all bg-background shadow-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="w-full bg-secondary text-secondary-foreground font-display text-lg md:text-xl py-6 flex items-center justify-center gap-3 border border-foreground/15"
                    >
                      <Check className="w-6 h-6" />
                      INTEREST REGISTERED
                    </motion.div>
                  ) : (
                    <motion.div
                      key="button"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full"
                    >
                      <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full font-display text-sm py-3 tracking-wide border border-foreground/15 transition-all disabled:opacity-50"
                      >
                        {isPending ? "Registering..." : "Save my spot"}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </Form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
