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
              Last updated: June 2026
            </p>
          </div>

          <div className="space-y-12 font-medium leading-relaxed text-lg">
            <Section title="01. Who We Are">
              <p>
                The Big Impact Organization (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is a non-profit dedicated to empowering young people through storytelling, mentorship, and community-led programs. These Terms of Service (&ldquo;Terms&rdquo;) govern your use of this website (thebigimpact.mk). By using the site, you agree to these Terms. If you do not agree, please do not use the site.
              </p>
            </Section>

            <Section title="02. Eligibility">
              <p>
                You may browse the site at any age. To register for an event or submit a story or message, you must be old enough to consent under the laws of your country, or have the consent and supervision of a parent or guardian. By submitting information, you confirm it is accurate and that you have the right to share it.
              </p>
            </Section>

            <Section title="03. Use of This Website">
              <p>
                This site is provided to help you learn about our programs, register for events, share your story, and connect with our community. You agree to use it lawfully and respectfully.
              </p>
              <ul className="mt-4 space-y-2 list-disc pl-6">
                <li>Do not submit false, misleading, or fraudulent information.</li>
                <li>Do not attempt to interfere with, probe, or disrupt the site, its security, or its infrastructure.</li>
                <li>Do not submit content that is harmful, abusive, infringing, or unlawful.</li>
                <li>Do not use the site to send spam or to collect others&rsquo; data without permission.</li>
                <li>We may remove any submitted content and restrict access at our discretion.</li>
              </ul>
            </Section>

            <Section title="04. Event Registration">
              <p>
                Registering for an event records your interest and reserves a place where seats are available. Events are typically free with limited capacity, and details (date, venue, availability) may change or be cancelled. Submitting a registration does not guarantee admission. If your plans change, you may ask us to cancel your registration at any time.
              </p>
            </Section>

            <Section title="05. Story & Content Submissions">
              <p>
                When you share a story, message, or image with us, you grant The Big Impact Organization a non-exclusive, royalty-free, worldwide license to use, reproduce, edit for length or clarity, share, and display your submission across our programs and communications — with your name or anonymously, as you choose. You retain ownership of your content, you confirm you have the rights to share it, and we will never sell your story. You can ask us to stop using it going forward at any time.
              </p>
            </Section>

            <Section title="06. Intellectual Property">
              <p>
                All content on this site — including its design, copy, imagery, branding, and code — belongs to The Big Impact Organization unless otherwise noted, and is protected by applicable laws. You may not reproduce or redistribute it without our written permission, except for submissions you provided yourself.
              </p>
            </Section>

            <Section title="07. Third-Party Services & Links">
              <p>
                The site relies on third-party providers to function — including Google Firebase (data and image hosting), Vercel (hosting and analytics), Web3Forms (form delivery), and Resend (confirmation emails). Your use of the site is also subject to those providers&rsquo; terms, and we are not responsible for their availability or actions. The site may also link to external websites we do not control or endorse. How these providers handle your data is described in our{" "}
                <button
                  onClick={() => setLocation("/privacy-policy")}
                  className="underline underline-offset-2 hover:text-primary transition-colors font-bold"
                >
                  Privacy Policy
                </button>
                .
              </p>
            </Section>

            <Section title="08. Disclaimers">
              <p>
                The site and its content are provided &ldquo;as is&rdquo; and &ldquo;as available,&rdquo; without warranties of any kind, whether express or implied. The Big Impact Organization makes no guarantee that the site will be uninterrupted, secure, error-free, or that information on it is complete or current.
              </p>
            </Section>

            <Section title="09. Limitation of Liability">
              <p>
                To the fullest extent permitted by law, The Big Impact Organization and its volunteers will not be liable for any indirect, incidental, or consequential damages, or for any loss arising from your use of, or inability to use, this website.
              </p>
            </Section>

            <Section title="10. Indemnity">
              <p>
                You agree to hold The Big Impact Organization harmless from any claims or costs arising out of content you submit or your misuse of the site in breach of these Terms.
              </p>
            </Section>

            <Section title="11. Governing Law">
              <p>
                These Terms are governed by the laws of the Republic of North Macedonia, without regard to conflict-of-law rules. Any dispute will be subject to the competent courts located there, unless mandatory consumer-protection laws of your country of residence provide otherwise.
              </p>
            </Section>

            <Section title="12. Changes to These Terms">
              <p>
                We may update these Terms at any time. Continued use of the site after an update means you accept the revised Terms. The date at the top of this page reflects the most recent revision.
              </p>
            </Section>

            <Section title="13. Contact">
              <p>
                Questions about these Terms? Email{" "}
                <a href="mailto:thebigimpactorg@gmail.com" className="underline underline-offset-2 hover:text-primary transition-colors font-bold">thebigimpactorg@gmail.com</a>{" "}
                or reach out via our{" "}
                <button
                  onClick={() => setLocation("/")}
                  className="underline underline-offset-2 hover:text-primary transition-colors font-bold"
                >
                  contact form
                </button>
                . We&rsquo;ll actually read it.
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
