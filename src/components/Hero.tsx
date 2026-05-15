import { motion, useScroll, useTransform } from "framer-motion";
import heroVision from "@/assets/hero-vision.webp";

export function Hero() {
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

      {/* Content — centered on mobile, pushed lower on desktop */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-10 h-full w-full flex items-center lg:items-end justify-center pt-34 lg:pt-0 lg:pb-32 px-4"
      >
        <div className="container mx-auto text-center">
          <div>
            <h1
              className="font-display font-bold leading-[1.1] tracking-tight text-white uppercase drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
            >
              Giving Young People The<br />Right Platform
            </h1>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
