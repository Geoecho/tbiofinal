import { navigateToSection } from "@/lib/nav";
import { useLocation } from "wouter";

export function Pillars() {
  const [location, setLocation] = useLocation();

  const pillars = [
    {
      title: "Our Mission",
      desc: "We empower to grow, to create and to become.",
      color: "bg-black",
      textColor: "text-white",
      hoverColor: "hover:bg-[#1a1a1a]",
      sectionId: "about",
    },
    {
      title: "Our Events",
      desc: "Join us and make an impact.",
      color: "bg-primary",
      textColor: "text-white",
      hoverColor: "hover:bg-[#c0334d]",
      sectionId: "events",
    },
    {
      title: "Get Involved",
      desc: "Volunteer, participate or support.",
      color: "bg-accent",
      textColor: "text-white",
      hoverColor: "hover:bg-[#1a6fbf]",
      sectionId: "contact",
    },
  ];

  return (
    <section id="about" className="scroll-mt-28 lg:scroll-mt-36 border-b border-foreground/15 relative bg-background">
      <div className="grid md:grid-cols-3">
        {pillars.map((pillar, i) => (
          <button
            key={i}
            onClick={() => navigateToSection(pillar.sectionId, location, setLocation)}
            className={`p-8 md:p-12 lg:p-16 border-b md:border-b-0 md:border-r border-foreground/15 last:border-b-0 last:border-r-0 ${pillar.color} ${pillar.textColor} ${pillar.hoverColor} h-full relative z-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors duration-200`}
          >
            <h3 className="font-display text-4xl md:text-5xl mb-6 tracking-wider">
              {pillar.title}
            </h3>
            <p className="text-lg md:text-xl font-medium leading-relaxed opacity-90">
              {pillar.desc}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}
