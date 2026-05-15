import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowButton } from "./ui/arrow-button";
import { navigateToSection } from "@/lib/nav";
import { useLocation } from "wouter";
import heroVision from "@/assets/hero-vision.webp";

export function Hero() {
  const [location, setLocation] = useLocation();
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 800], [0, 240]);
  const contentY = useTransform(scrollY, [0, 800], [0, -100]);
  const overlayOpacity = useTransform(scrollY, [0, 600], [0.5, 0.85]);

  return (
    <section className="relative w-full h-screen min-h-[700px] overflow-hidden border-b-2 border-foreground">
      {/* Parallax Image Layer */}
      <motion.div
        style={{ y: imageY }}
        className="absolute inset-0 -top-24 -bottom-24"
      >
        <img
          src={heroVision}
          alt="The Big Impact Vision"
          className="w-full h-full object-cover"
          style={{ objectPosition: "center 20%" }}
        />
      </motion.div>

      {/* Dark Overlay */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-foreground"
      />

      {/* Content — pushed lower, right-aligned on desktop */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-10 h-full w-full flex items-end pb-24 lg:pb-32 px-4"
      >
        <div className="container mx-auto flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:max-w-3xl"
          >
            <h1
              className="font-display font-bold leading-[1.1] tracking-tight text-white uppercase drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
            >
              Giving Young People The<br />Right Platform
            </h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="shrink-0"
          >
            <button
              onClick={() => navigateToSection("contact", location, setLocation)}
              className="font-display uppercase tracking-widest text-sm lg:text-base px-8 py-4 bg-white text-black border-2 border-white hover:bg-transparent hover:text-white transition-colors"
            >
              Get Involved
            </button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
