import { ArrowRight } from "lucide-react";
import { useLocation, Link } from "wouter";
import { NAV_LINKS, navigateToSection } from "@/lib/nav";
import { toast } from "sonner";
import { LogoSVG } from "./LogoSVG";
import logoImg from "@/assets/logo-v2.png";
import { submitToFormSubmit } from "@/lib/brevo";

export function Footer() {
  const [location, setLocation] = useLocation();
  const SOCIAL_LINKS = [
    {
      name: "Instagram",
      href: "https://www.instagram.com/thebigimpact.mk/",
      hoverClass: "hover:bg-[#E1306C] hover:text-white hover:border-[#E1306C]",
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/company/the-big-impact/about/",
      hoverClass: "hover:bg-[#0077B5] hover:text-white hover:border-[#0077B5]",
    },
  ];

  const handleNewsletter = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    if (!email) return;

    const result = await submitToFormSubmit({
      email,
      subject: `Newsletter signup: ${email}`,
      source: "Newsletter",
      name: "Newsletter Subscriber",
    });

    if (result.success) {
      toast.success("YOU'RE ON THE LIST", {
        description: "We'll send updates as the movement takes shape.",
        style: {
          borderRadius: "0px",
          border: "4px solid hsl(var(--secondary))",
          background: "hsl(var(--foreground))",
          color: "hsl(var(--background))",
          fontFamily: "Montserrat, sans-serif",
          fontWeight: "bold",
        },
        classNames: {
          description: "!text-background/80 !font-medium",
        },
      });
      e.currentTarget.reset();
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location === "/" || location === "") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setLocation("/");
    }
  };

  return (
    <footer className="bg-foreground text-background pt-20 pb-8 overflow-hidden relative">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          <div className="lg:col-span-1 flex flex-col gap-3">
            <a
              href="/"
              onClick={handleLogoClick}
              aria-label="The Big Impact Organization — back to home"
            >
              <LogoSVG size="md" />
            </a>
            <div className="flex flex-col gap-1 text-sm font-medium text-background/60">
              <a href="mailto:thebigimpactorg@gmail.com" className="hover:underline transition-colors">thebigimpactorg@gmail.com</a>
              <span>Skopje, North Macedonia</span>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="font-display text-xl uppercase tracking-widest text-muted">
              Navigation
            </h4>
            <ul className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() =>
                      navigateToSection(link.id, location, setLocation)
                    }
                    className="font-bold tracking-wider hover:text-primary transition-colors inline-block hover:translate-x-2 duration-300 text-left cursor-pointer"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="font-display text-xl uppercase tracking-widest text-muted">
              Socials
            </h4>
            <div className="flex flex-wrap gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`border-2 border-background/20 px-4 py-2 font-bold uppercase tracking-widest text-sm transition-colors ${social.hoverClass}`}
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="font-display text-xl uppercase tracking-widest text-muted">
              Newsletter
            </h4>
            <p className="font-medium text-background/70 text-sm">
              No spam. Just updates on what we're building.
            </p>
            <form
              className="flex border-2 border-background/20 focus-within:border-primary transition-colors"
              onSubmit={handleNewsletter}
            >
              <input
                type="email"
                name="email"
                placeholder="Email address"
                className="bg-transparent text-background px-4 py-3 outline-none w-full font-bold placeholder:text-background/30"
                required
              />
              <button
                type="submit"
                className="bg-background text-foreground px-4 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                aria-label="Subscribe"
              >
                <ArrowRight strokeWidth={3} />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t-2 border-background/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-bold text-sm tracking-widest text-background/50">
            © 2026 The Big Impact Organization. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/terms-of-service"
              className="font-bold text-xs tracking-widest text-background/40 hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy-policy"
              className="font-bold text-xs tracking-widest text-background/40 hover:text-primary transition-colors"
            >
              Privacy &amp; Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
