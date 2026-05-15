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
      sectionId: "about",
    },
    {
      title: "Our Events",
      desc: "Join us and make an impact.",
      color: "bg-[#e73e4c]",
      textColor: "text-white",
      sectionId: "events",
    },
    {
      title: "Get Involved",
      desc: "Volunteer, participate or support.",
      color: "bg-[#1783de]",
      textColor: "text-white",
      sectionId: "contact",
    },
  ];

  return (
    <section id="about" className="scroll-mt-28 lg:scroll-mt-36 border-b border-foreground/15 relative bg-background overflow-hidden">
      <div className="grid md:grid-cols-3">
        {pillars.map((pillar, i) => (
          <button
            key={i}
            onClick={() => navigateToSection(pillar.sectionId, location, setLocation)}
            className={`p-8 md:p-12 lg:p-16 border-b md:border-b-0 md:border-r border-foreground/15 last:border-b-0 last:border-r-0 ${pillar.color} ${pillar.textColor} h-full relative z-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-500 pillar-card group`}
          >
            <h3 className="font-display text-4xl md:text-5xl mb-6 tracking-wider transition-transform duration-500 group-hover:-translate-y-0">
              {pillar.title}
            </h3>
            <p className="text-lg md:text-xl font-medium leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity duration-500">
              {pillar.desc}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}
