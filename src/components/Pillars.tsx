import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 768
  );
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isDesktop;
}

export function Pillars() {
  const isDesktop = useIsDesktop();

  const pillars = [
    {
      number: "01.",
      title: "Our Mission",
      desc: "We empower to grow, to create and to become.",
      color: "bg-black",
      textColor: "text-white",
      slideFrom: -120,
    },
    {
      number: "02.",
      title: "Our Events",
      desc: "Join us and make an impact.",
      color: "bg-primary",
      textColor: "text-white",
      slideFrom: 120,
    },
    {
      number: "03.",
      title: "Get Involved",
      desc: "Volunteer, participate or support.",
      color: "bg-accent",
      textColor: "text-white",
      slideFrom: -120,
    },
  ];

  return (
    <section id="about" className="scroll-mt-28 lg:scroll-mt-36 border-b border-foreground/15 relative bg-background">
      <div className="grid md:grid-cols-3">
        {pillars.map((pillar, i) => (
          <div
            key={i}
            className={`p-8 md:p-12 lg:p-16 border-b md:border-b-0 md:border-r border-foreground/15 last:border-b-0 last:r-0 ${pillar.color} ${pillar.textColor} h-full relative z-10 flex flex-col items-center justify-center text-center`}
          >
            <h3 className="font-display text-4xl md:text-5xl mb-6 tracking-wider">
              {pillar.title}
            </h3>
            <p className="text-lg md:text-xl font-medium leading-relaxed opacity-90">
              {pillar.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
