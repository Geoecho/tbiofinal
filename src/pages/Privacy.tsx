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
              Last updated: June 2026
            </p>
          </div>

          <div className="space-y-12 font-medium leading-relaxed text-lg">
            <Section title="01. Who We Are">
              <p>
                The Big Impact Organization (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is a youth-focused non-profit. We are the data controller responsible for the personal information processed through this website (thebigimpact.mk). For any privacy request, email us at{" "}
                <a href="mailto:thebigimpactorg@gmail.com" className="underline underline-offset-2 hover:text-primary transition-colors font-bold">thebigimpactorg@gmail.com</a>.
              </p>
              <p className="mt-4">
                This policy explains what we collect, why, who we share it with, and the rights you have. It applies to visitors, people who register for our events, and people who submit stories or messages.
              </p>
            </Section>

            <Section title="02. Information We Collect">
              <p className="font-bold text-foreground">Information you give us</p>
              <ul className="mt-2 space-y-2 list-disc pl-6">
                <li><span className="font-bold">Event registrations:</span> your name and email address, and the event you registered for.</li>
                <li><span className="font-bold">Contact &amp; story submissions:</span> your name, email address, and any message, story text, or images you choose to send.</li>
              </ul>
              <p className="mt-4 font-bold text-foreground">Information collected automatically</p>
              <ul className="mt-2 space-y-2 list-disc pl-6">
                <li><span className="font-bold">Basic technical data:</span> our hosting provider and security layer process standard request data (such as IP address and browser type) to deliver and protect the site.</li>
                <li><span className="font-bold">Privacy-friendly analytics:</span> we use aggregated, cookieless analytics that do not identify you individually or track you across other sites.</li>
                <li><span className="font-bold">Local storage:</span> small items saved in your browser to keep the site working (see Section 06).</li>
              </ul>
              <p className="mt-4">We do not knowingly collect special-category data and we do not buy personal data from third parties.</p>
            </Section>

            <Section title="03. How We Use Your Information & Legal Bases">
              <ul className="space-y-2 list-disc pl-6">
                <li><span className="font-bold">To process event registrations</span> and send you a confirmation email — to take steps at your request and our legitimate interest in running our events.</li>
                <li><span className="font-bold">To respond</span> to your messages and story submissions — your consent and our legitimate interest in communicating with you.</li>
                <li><span className="font-bold">To publish stories</span> you submit (with your name or anonymously, as you choose) — on the basis of your consent.</li>
                <li><span className="font-bold">To operate, secure, and improve</span> the website — our legitimate interest in a safe, functional site.</li>
                <li><span className="font-bold">To meet legal obligations</span> where applicable.</li>
              </ul>
              <p className="mt-4 font-bold">
                We never sell or rent your personal information, and we never share it for third-party advertising.
              </p>
            </Section>

            <Section title="04. Service Providers We Use">
              <p>
                We rely on a small number of trusted providers (&ldquo;processors&rdquo;) to run the website. They only process your data on our instructions and for the purposes below.
              </p>
              <div className="mt-6 border-2 border-foreground">
                <div className="grid grid-cols-3 border-b-2 border-foreground bg-foreground text-background">
                  <div className="px-3 py-3 font-display uppercase tracking-widest text-xs sm:text-sm">Provider</div>
                  <div className="px-3 py-3 font-display uppercase tracking-widest text-xs sm:text-sm border-l-2 border-background/20">Purpose</div>
                  <div className="px-3 py-3 font-display uppercase tracking-widest text-xs sm:text-sm border-l-2 border-background/20">Policy</div>
                </div>
                <ProviderRow name="Google Firebase" purpose="Database (Firestore), admin sign-in (Authentication) and image hosting (Cloud Storage) for site content and event registrations." href="https://firebase.google.com/support/privacy" />
                <ProviderRow name="Vercel" purpose="Website hosting and aggregated, cookieless analytics." href="https://vercel.com/legal/privacy-policy" />
                <ProviderRow name="Web3Forms" purpose="Delivers form submissions (registrations, contact and story forms) to our inbox." href="https://web3forms.com/privacy" />
                <ProviderRow name="Resend" purpose="Sends event registration confirmation emails." href="https://resend.com/legal/privacy-policy" />
                <ProviderRow name="Google Fonts" purpose="Serves the website's fonts; may receive your IP address when fonts load." href="https://policies.google.com/privacy" last />
              </div>
            </Section>

            <Section title="05. International Data Transfers">
              <p>
                Some of our providers operate servers outside your country, including in the United States. Where personal data is transferred internationally, it is protected by appropriate safeguards (such as the providers&rsquo; Standard Contractual Clauses and equivalent measures).
              </p>
            </Section>

            <Section title="06. Cookies & Local Storage">
              <p>
                We do not use advertising or cross-site tracking cookies. We use a few small items stored in your browser&rsquo;s local storage to make the site work. Our analytics are cookieless.
              </p>
              <div className="mt-6 border-2 border-foreground">
                <div className="grid grid-cols-3 border-b-2 border-foreground bg-foreground text-background">
                  <div className="px-3 py-3 font-display uppercase tracking-widest text-xs sm:text-sm">Item</div>
                  <div className="px-3 py-3 font-display uppercase tracking-widest text-xs sm:text-sm border-l-2 border-background/20">Purpose</div>
                  <div className="px-3 py-3 font-display uppercase tracking-widest text-xs sm:text-sm border-l-2 border-background/20">Duration</div>
                </div>
                <StorageRow name="cookie-consent" purpose="Remembers your cookie choice" duration="Until cleared" />
                <StorageRow name="tbi_liked_…" purpose="Remembers stories you've liked so the count isn't doubled" duration="Until cleared" />
                <StorageRow name="tbi_events / tbi_stories / tbi_sponsors" purpose="Local cache of public content for faster loading" duration="Until cleared" />
                <StorageRow name="tbi_admin_authed" purpose="Keeps an administrator signed in (admin area only)" duration="Session" last />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                You can clear these at any time from your browser settings, or reset your cookie preference below.
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

            <Section title="07. Data Retention">
              <p>
                We keep your information only as long as needed for the purpose you provided it. Event registrations are retained to manage attendance and removed when no longer needed; contact and story submissions are kept only as long as necessary to respond to you or to display a story you asked us to publish. You can ask us to delete your data at any time.
              </p>
            </Section>

            <Section title="08. Your Rights">
              <p>Depending on your location, you may have the right to:</p>
              <ul className="mt-4 space-y-2 list-disc pl-6">
                <li>Access the personal data we hold about you.</li>
                <li>Request correction or deletion of your data.</li>
                <li>Restrict or object to certain processing.</li>
                <li>Request a copy of your data in a portable format.</li>
                <li>Withdraw consent at any time (where consent is the basis of processing).</li>
                <li>Lodge a complaint with your local data protection authority.</li>
              </ul>
              <p className="mt-4">
                To exercise any of these, email{" "}
                <a href="mailto:thebigimpactorg@gmail.com" className="underline underline-offset-2 hover:text-primary transition-colors font-bold">thebigimpactorg@gmail.com</a>.
              </p>
            </Section>

            <Section title="09. Data Security">
              <p>
                We protect your data with measures including encrypted (HTTPS) connections, access-controlled databases, authentication for the admin area, and security headers. No method of transmission or storage is ever 100% secure, but we work to keep your information safe.
              </p>
            </Section>

            <Section title="10. Children's Privacy">
              <p>
                Our programs involve young people. Where a participant is below the age of digital consent in their country, a parent or guardian should register and submit information on their behalf. If you believe a child has provided us data without appropriate consent, contact us and we will delete it.
              </p>
            </Section>

            <Section title="11. Changes to This Policy">
              <p>
                We may update this policy from time to time. The date at the top reflects the latest revision. Material changes will be reflected here.
              </p>
            </Section>

            <Section title="12. Contact">
              <p>
                For any privacy-related question or request, email{" "}
                <a href="mailto:thebigimpactorg@gmail.com" className="underline underline-offset-2 hover:text-primary transition-colors font-bold">thebigimpactorg@gmail.com</a>{" "}
                or use our{" "}
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

function ProviderRow({ name, purpose, href, last = false }: { name: string; purpose: string; href: string; last?: boolean }) {
  return (
    <div className={`grid grid-cols-3 ${last ? "" : "border-b-2 border-foreground"}`}>
      <div className="px-3 py-3 text-xs sm:text-sm font-bold break-words">{name}</div>
      <div className="px-3 py-3 text-xs sm:text-sm border-l-2 border-foreground">{purpose}</div>
      <div className="px-3 py-3 text-xs sm:text-sm border-l-2 border-foreground">
        <a href={href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-primary transition-colors font-bold break-words">
          View
        </a>
      </div>
    </div>
  );
}

function StorageRow({ name, purpose, duration, last = false }: { name: string; purpose: string; duration: string; last?: boolean }) {
  return (
    <div className={`grid grid-cols-3 ${last ? "" : "border-b-2 border-foreground"}`}>
      <div className="px-3 py-3 text-xs sm:text-sm font-bold break-words">{name}</div>
      <div className="px-3 py-3 text-xs sm:text-sm border-l-2 border-foreground">{purpose}</div>
      <div className="px-3 py-3 text-xs sm:text-sm border-l-2 border-foreground">{duration}</div>
    </div>
  );
}
