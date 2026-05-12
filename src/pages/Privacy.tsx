import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
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
              <span className="inline-block bg-foreground text-background px-3 pb-1">Privacy</span>
              <span className="block mt-3">&amp; Cookies</span>
            </h1>
            <p className="mt-6 font-medium text-muted-foreground text-sm uppercase tracking-widest">
              Last updated: April 2026
            </p>
          </div>

          <div className="space-y-12 font-medium leading-relaxed text-lg">
            <Section title="01. What We Collect">
              <p>
                We only collect information you voluntarily provide to us — such as your name, email address, and any story or message you submit through our forms. We do not collect any data automatically beyond what is necessary to run the website.
              </p>
            </Section>

            <Section title="02. How We Use Your Data">
              <ul className="space-y-2 list-disc pl-6">
                <li>To respond to your contact or story submission.</li>
                <li>To send you updates if you sign up to our newsletter (you can unsubscribe any time).</li>
                <li>To improve this website and our programs.</li>
              </ul>
              <p className="mt-4">
                We will never sell, rent, or share your personal information with third parties for marketing purposes.
              </p>
            </Section>

            <Section title="03. Cookies">
              <p>
                This website uses a small number of essential cookies. These are necessary for the site to function — they do not track you across other websites and are not used for advertising.
              </p>
              <div className="mt-6 border-2 border-foreground">
                <div className="grid grid-cols-3 border-b-2 border-foreground bg-foreground text-background">
                  <div className="px-4 py-3 font-display uppercase tracking-widest text-sm">Cookie</div>
                  <div className="px-4 py-3 font-display uppercase tracking-widest text-sm border-l-2 border-background/20">Purpose</div>
                  <div className="px-4 py-3 font-display uppercase tracking-widest text-sm border-l-2 border-background/20">Duration</div>
                </div>
                <div className="grid grid-cols-3 border-b-2 border-foreground">
                  <div className="px-4 py-3 text-sm font-bold">cookie-consent</div>
                  <div className="px-4 py-3 text-sm border-l-2 border-foreground">Stores your cookie preference</div>
                  <div className="px-4 py-3 text-sm border-l-2 border-foreground">1 year</div>
                </div>
                <div className="grid grid-cols-3">
                  <div className="px-4 py-3 text-sm font-bold">Session</div>
                  <div className="px-4 py-3 text-sm border-l-2 border-foreground">Keeps site working correctly</div>
                  <div className="px-4 py-3 text-sm border-l-2 border-foreground">Session</div>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                You can reset your cookie preference at any time by clearing your browser's local storage or clicking the button below.
              </p>
              <button
                onClick={() => {
                  localStorage.removeItem("cookie-consent");
                  window.location.reload();
                }}
                className="mt-4 inline-block font-display uppercase tracking-widest text-sm px-5 py-3 border-2 border-foreground hover:bg-muted/30 transition-colors"
              >
                Reset Cookie Preference
              </button>
            </Section>

            <Section title="04. Data Storage">
              <p>
                Your data is stored securely. We retain contact submissions and story submissions only as long as necessary to respond to you or to fulfill the purpose you submitted them for.
              </p>
            </Section>

            <Section title="05. Your Rights">
              <p>You have the right to:</p>
              <ul className="mt-4 space-y-2 list-disc pl-6">
                <li>Access the personal data we hold about you.</li>
                <li>Request correction or deletion of your data.</li>
                <li>Withdraw consent at any time (where consent is the basis of processing).</li>
                <li>Lodge a complaint with a data protection authority.</li>
              </ul>
            </Section>

            <Section title="06. Contact">
              <p>
                For any privacy-related questions or requests, contact us via the{" "}
                <button
                  onClick={() => setLocation("/")}
                  className="underline underline-offset-2 hover:text-primary transition-colors font-bold"
                >
                  contact form
                </button>
                . We take this seriously.
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
