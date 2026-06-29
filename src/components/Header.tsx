import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { NAV_LINKS, navigateToSection } from "@/lib/nav";
import { useActiveSection } from "@/hooks/useActiveSection";
import { EventTicker } from "./EventTicker";
import { useEvents, useStories } from "@/lib/adminStore";
import { LogoSVG } from "./LogoSVG";
import logoImg from "@/assets/logo-v2.png";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const active = useActiveSection();
  const [events] = useEvents();
  const [stories] = useStories();

  if (location === "/admin") {
    return null;
  }

  // Build nav links dynamically
  const links: { name: string; href: string; id: string }[] = [];
  
  // About Us (always present)
  links.push({ name: "About Us", href: "/#about", id: "about" });
  
  // Stories & Initiatives (shows only when stories length > 0)
  if (stories.length > 0) {
    links.push({ name: "Stories", href: "/#stories", id: "stories" });
    links.push({ name: "Initiatives", href: "/#initiatives", id: "initiatives" });
  }

  // Publications (shows only when there is at least one publication post)
  if (stories.some((s) => s.type === "publication")) {
    links.push({ name: "Publications", href: "/#publications", id: "publications" });
  }

  // Events (shows only when events length > 0)
  if (events.length > 0) {
    links.push({ name: "Events", href: "/#events", id: "events" });
  }

  // Contact (always present)
  links.push({ name: "Contact", href: "/#contact", id: "contact" });

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
          <nav aria-label="Main navigation" className="hidden lg:flex items-center justify-between w-full">
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

            <div className="flex items-center gap-8">
              <ul className="flex gap-8 font-display tracking-widest text-sm" role="list">
                {links.map((link) => {
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
              <button
                className="font-display tracking-widest text-sm min-h-[44px] px-6 bg-primary text-white btn-primary shrink-0 border border-primary"
                onClick={() => handleNavClick("contact")}
              >
                Join Us
              </button>
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

        {events.length > 0 && <EventTicker />}
      </header>

      {/* Mobile Menu Overlay */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-label="Navigation menu"
        aria-modal="true"
        className="mobile-nav-drawer px-8"
        data-state={isOpen ? "open" : "closed"}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-10 right-10 text-white hover:text-primary transition-colors p-2"
          aria-label="Close menu"
        >
          <X size={32} />
        </button>

        <nav aria-label="Mobile navigation" className="flex flex-col gap-6 w-full max-w-md">
          {links.map((link, i) => {
            const isActive = active === link.id;
            return (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.id)}
                className={`mobile-nav-item font-display text-2xl tracking-wider transition-colors text-left border-b border-white/10 pb-4
                  ${isActive ? "text-primary border-primary" : "text-white hover:text-primary"}
                `}
                style={{
                  transitionDelay: isOpen ? `${i * 80 + 100}ms` : "0ms",
                }}
                aria-current={isActive ? "location" : undefined}
              >
                {link.name}
              </button>
            );
          })}
          <div
            className="mobile-nav-item pt-2"
            style={{
              transitionDelay: isOpen ? `${links.length * 80 + 100}ms` : "0ms",
            }}
          >
            <button
              className="w-full font-display tracking-widest text-lg border-2 border-primary bg-primary text-white btn-primary rounded-none flex items-center justify-center"
              onClick={() => handleNavClick("contact")}
            >
              Join Us
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}
