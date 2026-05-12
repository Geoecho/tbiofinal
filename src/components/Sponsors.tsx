import { ArrowButton } from "./ui/arrow-button";
import { useLocation } from "wouter";
import { navigateToSection } from "@/lib/nav";
import { useSponsorWords } from "@/lib/adminStore";

function Strip({
  words,
  direction = "left",
}: {
  words: { text: string; cls: string }[];
  direction?: "left" | "right";
}) {
  const items = [...words, ...words];
  return (
    <div className="overflow-hidden border-y-2 border-foreground bg-background py-4">
      <div
        className="flex gap-6 whitespace-nowrap"
        style={{
          width: "max-content",
          animation: `marquee-${direction} 40s linear infinite`,
        }}
        aria-hidden="true"
      >
        {items.map((w, i) => (
          <div
            key={`${direction}-${i}`}
            className={`shrink-0 flex items-center justify-center border-2 border-foreground px-10 py-6 font-display text-2xl md:text-3xl uppercase tracking-[0.2em] min-w-[200px] ${w.cls}`}
          >
            {w.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Sponsors() {
  const [words] = useSponsorWords();
  const [location, setLocation] = useLocation();

  return (
    <section
      id="sponsors"
      aria-labelledby="sponsors-heading"
      className="scroll-mt-28 lg:scroll-mt-36 border-b-2 border-foreground bg-background py-20 lg:py-28"
    >
      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>

      <div className="relative my-6" style={{ transform: "rotate(-2deg)" }}>
        <div style={{ margin: "0 -6%" }}>
          <Strip words={words} direction="left" />
        </div>
      </div>

      <div className="relative mt-8" style={{ transform: "rotate(2deg)" }}>
        <div style={{ margin: "0 -6%" }}>
          <Strip words={words} direction="right" />
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 mt-16">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-display text-2xl md:text-3xl uppercase tracking-wide leading-tight mb-8">
            Whether you give your name, your time, or your resources —
            <span className="text-primary"> we'll build chapter one together.</span>
          </p>
          <ArrowButton
            size="lg"
            className="font-display text-lg px-10 py-5 uppercase tracking-widest border-2 border-foreground transition-colors"
            onClick={() => navigateToSection("contact", location, setLocation)}
          >
            Become a Partner
          </ArrowButton>
        </div>
      </div>
    </section>
  );
}
