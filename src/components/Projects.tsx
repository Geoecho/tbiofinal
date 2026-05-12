import { motion } from "framer-motion";
import { ArrowButton } from "./ui/arrow-button";
import { Badge } from "./ui/badge";
import { Link } from "wouter";

export function Projects() {
  const txt = "Coming soon  ◆  Projects & Initiatives  ◆  ";
  const items = Array(20).fill(null);

  return (
    <section
      id="projects"
      className="scroll-mt-28 lg:scroll-mt-36 py-20 lg:py-28 border-b-2 border-foreground overflow-hidden"
    >
      <style>{`
        @keyframes cs-left  { 0%{transform:translateX(0)}   100%{transform:translateX(-50%)} }
        @keyframes cs-right { 0%{transform:translateX(-50%)} 100%{transform:translateX(0)} }
      `}</style>

      <div className="container mx-auto px-4 lg:px-8 mb-14">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <h2 className="font-display text-5xl md:text-7xl uppercase leading-[1.05]">
            <span className="block">Projects</span>
            <span className="inline-block bg-accent text-white px-2 pb-1 mt-1">
              & Initiatives
            </span>
          </h2>
        </div>
      </div>

      <div style={{ transform: "rotate(-2deg)", margin: "0 -8%" }}>
        <div className="overflow-hidden border-y-2 border-foreground bg-primary py-4">
          <div className="flex whitespace-nowrap text-white font-display text-2xl md:text-3xl uppercase tracking-widest" style={{ width: "max-content", animation: "cs-left 80s linear infinite" }}>
            {items.map((_, i) => (
              <span key={i} className="flex items-center">
                Coming soon <span className="text-white mx-4">◆</span> Projects & Initiatives <span className="text-white mx-4">◆</span>&nbsp;
              </span>
            ))}
            {items.map((_, i) => (
              <span key={`clone-${i}`} className="flex items-center">
                Coming soon <span className="text-white mx-4">◆</span> Projects & Initiatives <span className="text-white mx-4">◆</span>&nbsp;
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Strip 2 */}
      <div style={{ transform: "rotate(2deg)", margin: "28px -8% 0" }}>
        <div className="overflow-hidden border-y-2 border-foreground bg-foreground py-4">
          <div className="flex whitespace-nowrap text-background font-display text-2xl md:text-3xl uppercase tracking-widest" style={{ width: "max-content", animation: "cs-right 100s linear infinite" }}>
            {items.map((_, i) => (
              <span key={i} className="flex items-center">
                Coming soon <span className="text-white mx-4">◆</span> Projects & Initiatives <span className="text-white mx-4">◆</span>&nbsp;
              </span>
            ))}
            {items.map((_, i) => (
              <span key={`clone-${i}`} className="flex items-center">
                Coming soon <span className="text-white mx-4">◆</span> Projects & Initiatives <span className="text-white mx-4">◆</span>&nbsp;
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
