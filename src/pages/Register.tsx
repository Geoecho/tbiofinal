import { useEffect } from "react";
import { useRoute, Link } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Calendar, MapPin, Users } from "lucide-react";
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", role: "", notes: "" },
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [slug]);

  if (!event) {
    return <NotFound />;
  }

  function onSubmit(_values: z.infer<typeof formSchema>) {
    toast.success("INTEREST REGISTERED", {
      description:
        "We'll email you the moment a date and venue are confirmed.",
      style: {
        borderRadius: "0px",
        border: "4px solid black",
        background: "hsl(var(--secondary))",
        color: "black",
        fontFamily: "Space Grotesk, sans-serif",
        fontWeight: "bold",
      },
    });
    form.reset();
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

          <div className="grid sm:grid-cols-3 gap-4 mb-10">
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
            <div className="border border-foreground/15 bg-background p-5 flex items-start gap-3">
              <Users size={24} strokeWidth={2} className="text-primary mt-1 shrink-0" />
              <div>
                <div className="font-bold uppercase tracking-widest text-xs text-muted-foreground">
                  Capacity
                </div>
                <div className="font-display text-2xl">12 / 120</div>
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
                <Button
                  type="submit"
                  size="lg"
                  className="w-full font-display text-lg md:text-xl py-6 tracking-wide border border-foreground/15 transition-all"
                >
                  Save my spot
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
