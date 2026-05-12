import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { navigateToSection } from "@/lib/nav";
import { useLocation } from "wouter";

export function Partnerships() {
  const [location, setLocation] = useLocation();

  const slots = [
    { label: "Founding sponsor", status: "Open" },
    { label: "Founding sponsor", status: "Open" },
    { label: "Founding sponsor", status: "Open" },
    { label: "Founding sponsor", status: "Open" },
    { label: "Program partner", status: "Open" },
    { label: "Venue partner", status: "Open" },
  ];

  return (
    <section
      id="partnerships"
      className="scroll-mt-44 py-20 lg:py-32 border-b-2 border-foreground bg-foreground text-background"
    >
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block bg-background text-foreground font-display uppercase tracking-widest text-sm px-3 py-1 mb-6 border-2 border-background"
        >
          Partnerships
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-5xl md:text-7xl uppercase mb-6 leading-[1.05] border-b-4 border-background pb-4"
        >
          Be a <span className="text-secondary">founding</span> ally
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl font-medium max-w-3xl mx-auto mb-12 text-background/80"
        >
          We're a brand-new non-profit looking for a small group of founding
          partners to help launch our first programs. Your name will live in our
          first chapter — literally and forever.
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-12 text-left">
          {slots.map((slot, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="border-2 border-background/30 p-6 md:p-8 flex flex-col justify-between gap-4 hover:bg-background hover:text-foreground transition-colors duration-300 group min-h-[160px]"
            >
              <div className="font-display text-xs uppercase tracking-widest text-secondary group-hover:text-primary">
                Slot {String(i + 1).padStart(2, "0")} — {slot.status}
              </div>
              <div className="font-display text-xl md:text-2xl uppercase leading-tight">
                {slot.label}
              </div>
              <div className="font-bold text-xs uppercase tracking-widest opacity-50 border-t border-current pt-3">
                Awaiting partner
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Button
            className="w-full bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground font-display text-xl md:text-2xl py-7 transition-colors border-4 border-secondary hover:border-primary"
            onClick={() => navigateToSection("contact", location, setLocation)}
          >
            Become a partner
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
