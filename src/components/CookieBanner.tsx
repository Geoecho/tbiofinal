import { useState, useEffect } from "react";
import { Link } from "wouter";
import { X } from "lucide-react";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] border-t-4 border-foreground bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
        <div className="flex-1">
          <p className="font-display text-lg uppercase tracking-widest mb-1">
            We use cookies.
          </p>
          <p className="text-sm font-medium text-muted-foreground leading-relaxed">
            We use essential cookies to keep this site running. No tracking for ads — just the basics.{" "}
            <Link
              href="/privacy-policy"
              className="underline underline-offset-2 hover:text-primary transition-colors font-bold"
            >
              Learn more
            </Link>
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={decline}
            className="font-display uppercase tracking-widest text-sm px-5 py-3 border-2 border-foreground hover:bg-muted/30 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="font-display uppercase tracking-widest text-sm px-5 py-3 bg-foreground text-background border-2 border-foreground hover:bg-primary hover:border-primary transition-colors"
          >
            Accept All
          </button>
          <button
            onClick={decline}
            aria-label="Close"
            className="p-2 hover:text-primary transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
