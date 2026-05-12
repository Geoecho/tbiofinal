import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { NAV_LINKS, navigateToSection } from "@/lib/nav";
import { useActiveSection } from "@/hooks/useActiveSection";
import { EventTicker } from "./EventTicker";
import { LogoSVG } from "./LogoSVG";
import logoImg from "@/assets/logo-v2.png";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const active = useActiveSection();

  const handleNavClick = (id: string) => {
    setIsOpen(false);
    navigateToSection(id, location, setLocation);
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:font-bold focus:uppercase focus:tracking-widest focus:text-sm"
      >
        Skip to main content
      </a>

      <header role="banner" className="fixed top-0 left-0 right-0 z-50 border-b-2 border-background/20 bg-foreground text-background">
        <div className="container mx-auto px-4 lg:px-8 py-5 lg:py-3 flex justify-between items-center">
          {/* Desktop Nav */}
          <nav aria-label="Main navigation" className="hidden lg:flex items-center w-full">
            <div className="flex-1 flex items-center justify-start">
              <Link
                href="/"
                aria-label="The Big Impact Organization — back to top"
                onClick={(e: React.MouseEvent) => {
                  if (location === "/" || location === "") {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
              >
                <LogoSVG size="md" />
              </Link>
            </div>

            <div className="flex-[2] flex items-center justify-center">
              <ul className="flex gap-10 font-display tracking-widest text-base" role="list">
                {NAV_LINKS.map((link) => {
                  const isActive = active === link.id;
                  return (
                    <li key={link.name}>
                      <button
                        onClick={() => handleNavClick(link.id)}
                        className={`relative transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2
                          after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:transition-transform after:origin-left
                          ${isActive
                            ? "text-primary after:bg-primary after:scale-x-100"
                            : "hover:text-primary after:bg-primary after:scale-x-0 hover:after:scale-x-100"
                          }`}
                        aria-current={isActive ? "location" : undefined}
                      >
                        {link.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="flex-1 flex items-center justify-end">
              <Button
                className="font-display tracking-widest text-base px-6 py-5 border-2 border-primary bg-primary text-white transition-all duration-200 shrink-0 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                onClick={() => handleNavClick("contact")}
              >
                Join Us
              </Button>
            </div>
          </nav>

          {/* Mobile: logo + hamburger */}
          <div className="lg:hidden flex items-center justify-between w-full">
            <div className="flex-1"></div>
            <Link
              href="/"
              aria-label="The Big Impact Organization — back to top"
              className="flex justify-center"
              onClick={(e: React.MouseEvent) => {
                if (location === "/" || location === "") {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
            >
              <LogoSVG size="sm" />
            </Link>
            <div className="flex-1 flex justify-end">
              <button
                className="relative p-2 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                onClick={() => setIsOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
              >
                <Menu size={32} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <EventTicker />
      </header>

      {/* Mobile Menu Overlay */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-label="Navigation menu"
        aria-modal="true"
        className={`fixed inset-0 bg-foreground text-background z-[60] transition-transform duration-500 ease-[cubic-bezier(0.83,0,0.17,1)] flex flex-col justify-center items-stretch px-6 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={() => setIsOpen(false)}
          aria-label="Close navigation menu"
          className="absolute top-5 right-5 border-2 border-background/40 p-3 hover:border-background hover:bg-background/10 transition-all focus-visible:outline-2 focus-visible:outline-secondary focus-visible:outline-offset-2"
        >
          <X size={28} className="text-background" aria-hidden="true" />
        </button>

        <nav aria-label="Mobile navigation" className="flex flex-col gap-6 w-full max-w-md mx-auto">
          {NAV_LINKS.map((link, i) => {
            const isActive = active === link.id;
            return (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.id)}
                className={`font-display text-3xl sm:text-4xl uppercase tracking-wider transition-colors text-left border-b-2 pb-4 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2
                  ${isActive
                    ? "!text-primary !border-primary"
                    : "text-white hover:text-primary border-background/30"
                  }`}
                style={{
                  transitionDelay: `${isOpen ? i * 80 + 200 : 0}ms`,
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? "translateY(0)" : "translateY(20px)",
                  transitionProperty: "opacity, transform, color, border-color",
                  transitionDuration: "500ms",
                }}
                aria-current={isActive ? "location" : undefined}
              >
                {link.name}
              </button>
            );
          })}
          <Button
            variant="default"
            className="w-full font-display uppercase tracking-widest text-xl py-7 mt-4 border-2 border-primary !bg-primary !text-white hover:bg-white hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-background focus-visible:outline-offset-2"
            onClick={() => handleNavClick("contact")}
            style={{
              transitionDelay: `${isOpen ? NAV_LINKS.length * 80 + 200 : 0}ms`,
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? "translateY(0)" : "translateY(20px)",
              transitionProperty: "opacity, transform, background-color, color",
              transitionDuration: "500ms",
            }}
          >
            Join Us
          </Button>
        </nav>
      </div>
    </>
  );
}
