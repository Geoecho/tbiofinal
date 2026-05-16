import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@/lib/zodResolver";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Mail, Check } from "lucide-react";
import { useLocation } from "wouter";
import { navigateToSection } from "@/lib/nav";
import { submitToFormSubmit } from "@/lib/brevo";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export function Contact() {
  const [location, setLocation] = useLocation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
    mode: "onBlur",
  });

  const isPending = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result = await submitToFormSubmit({
        email: values.email,
        name: values.name,
        subject: values.subject,
        message: values.message,
        source: "Contact Form",
      });

      if (!result.success) {
        throw new Error(result.error as string || "Failed to send message");
      }

      setIsSubmitted(true);
      form.reset();
      
      // Reset success state after 5 seconds to allow sending another message if needed
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-28 lg:scroll-mt-36 py-20 lg:py-32 bg-background border-b border-foreground/15"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1.6fr] gap-12 lg:gap-20">

          {/* ── Left column: heading + info ──────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6 items-center text-center lg:items-start lg:text-left w-full"
          >
            <div>
              <h2 className="font-display text-5xl md:text-6xl leading-[1.1] uppercase">
                Get in touch
              </h2>
            </div>
            <p className="text-base font-medium text-muted-foreground leading-relaxed max-w-lg">
              Questions? Ideas? Want to fund a project? Drop us a line and let's build.
            </p>

            {/* Email */}
            <div className="w-full flex justify-start">
              <a
                href="mailto:thebigimpactorg@gmail.com"
                aria-label="Send us an email"
                className="flex items-center gap-4 group w-fit"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-black transition-colors border border-foreground/10">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Email us</p>
                  <p className="font-bold text-foreground hover:underline transition-colors">thebigimpactorg@gmail.com</p>
                </div>
              </a>
            </div>

            {/* Ready to partner */}
            <div className="border border-foreground/15 p-6 bg-black text-white w-full">
              <p className="font-display text-2xl mb-2 leading-tight">Ready to partner?</p>
              <p className="font-medium text-sm text-white/80 leading-relaxed">
                Whether it's your time, name, or resources — we want to hear from you.
              </p>
            </div>
          </motion.div>

          {/* ── Right column: form ───────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-background border border-foreground/15 p-6 sm:p-10"
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-sm">Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your name"
                            className="border border-foreground/15 font-medium focus-visible:ring-0 focus-visible:border-primary transition-all text-base h-11 shadow-none"
                            {...field}
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
                        <FormLabel className="font-bold text-sm">Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="you@example.com"
                            className="border border-foreground/15 font-medium focus-visible:ring-0 focus-visible:border-primary transition-all text-base h-11 shadow-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-sm">Subject</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Partnership inquiry, idea, question…"
                          className="border border-foreground/15 font-medium focus-visible:ring-0 focus-visible:border-primary transition-all text-base h-11 shadow-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-sm">Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about your project, your idea, or how you'd like to help…"
                          className="min-h-[120px] border border-foreground/15 font-medium focus-visible:ring-0 focus-visible:border-primary transition-all text-base resize-none shadow-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <AnimatePresence mode="wait">
                    {isSubmitted ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full bg-[#e73e4c] text-white font-display tracking-widest text-sm min-h-[44px] sm:h-10 flex items-center justify-center gap-3 border border-[#e73e4c]"
                      >
                        <Check className="w-5 h-5" />
                        MESSAGE SENT
                      </motion.div>
                    ) : (
                      <motion.div
                        key="button"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full"
                      >
                        <button
                          type="submit"
                          disabled={isPending}
                          className="w-full font-display tracking-widest text-sm min-h-[44px] px-6 bg-primary text-white btn-primary disabled:opacity-50"
                        >
                          {isPending ? "Sending..." : "Get in touch"}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </form>
            </Form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
