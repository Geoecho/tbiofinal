import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-1 pt-48 lg:pt-56 pb-24">
        <div className="container mx-auto px-4 lg:px-8">
          <button
            onClick={() => setLocation("/")}
            className="inline-flex items-center gap-2 font-display uppercase tracking-widest text-sm mb-12 hover:text-primary transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>

          <div className="border-b-4 border-foreground pb-8 mb-12">
            <span className="font-display text-sm uppercase tracking-widest text-primary block mb-3">
              Legal
            </span>
            <h1 className="font-display text-5xl md:text-7xl uppercase leading-[1.05]">
              <span className="inline-block bg-foreground text-background px-3 pb-1">Terms</span>
              <span className="block mt-3">of Service</span>
            </h1>
            <p className="mt-6 font-medium text-muted-foreground text-sm uppercase tracking-widest">
              Last updated: April 2026
            </p>
          </div>

          <div className="space-y-12 font-medium leading-relaxed text-lg">
            <Section title="01. Who We Are">
              <p>
                The Big Impact Organization is a non-profit organization dedicated to empowering young people through storytelling, mentorship, and community-led programs. By using this website, you agree to these Terms of Service.
              </p>
            </Section>

            <Section title="02. Use of This Website">
              <p>
                This site is provided for informational purposes — to learn about our programs, share your story, and connect with our community. You agree to use it lawfully and respectfully.
              </p>
              <ul className="mt-4 space-y-2 list-disc pl-6">
                <li>Do not submit false or misleading information.</li>
                <li>Do not attempt to interfere with or disrupt site functionality.</li>
                <li>Do not submit content that is harmful, abusive, or unlawful.</li>
                <li>We reserve the right to remove any submitted content at our discretion.</li>
              </ul>
            </Section>

            <Section title="03. Story Submissions">
              <p>
                When you share your story through our platform, you grant The Big Impact Organization a non-exclusive, royalty-free license to use, share, and display your submission for our programs and communications — with your name or anonymously, as you choose. We will never sell your story.
              </p>
            </Section>

            <Section title="04. Intellectual Property">
              <p>
                All content on this site — including design, copy, imagery, and code — belongs to The Big Impact Organization unless otherwise noted. You may not reproduce or redistribute it without written permission.
              </p>
            </Section>

            <Section title="05. Third-Party Links">
              <p>
                This site may contain links to external websites. We are not responsible for the content or practices of any third-party sites.
              </p>
            </Section>

            <Section title="06. Limitation of Liability">
              <p>
                This site is provided "as is." The Big Impact Organization makes no warranties about its availability or accuracy. We are not liable for any damages resulting from use of this website.
              </p>
            </Section>

            <Section title="07. Changes to These Terms">
              <p>
                We may update these Terms at any time. Continued use of the site after any update means you accept the revised Terms. The date at the top of this page reflects the most recent revision.
              </p>
            </Section>

            <Section title="08. Contact">
              <p>
                Questions about these Terms? Reach out via our{" "}
                <button
                  onClick={() => setLocation("/")}
                  className="underline underline-offset-2 hover:text-primary transition-colors font-bold"
                >
                  contact form
                </button>
                . We'll actually read it.
              </p>
            </Section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-l-4 border-primary pl-8">
      <h2 className="font-display text-2xl md:text-3xl uppercase tracking-wide mb-4">
        {title}
      </h2>
      <div className="text-foreground/80">{children}</div>
    </div>
  );
}
