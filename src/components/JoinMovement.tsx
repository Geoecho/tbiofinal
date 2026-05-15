import { motion } from "framer-motion";
import { ArrowButton } from "./ui/arrow-button";
import { navigateToSection } from "@/lib/nav";
import { useLocation } from "wouter";
import joinImg from "@/assets/join-movement.png";

export function JoinMovement() {
  const [location, setLocation] = useLocation();

  return (
    <section className="grid lg:grid-cols-2 border-b border-foreground/15 items-stretch">
      <div className="bg-white px-6 py-16 sm:px-10 sm:py-20 md:p-16 lg:p-20 flex flex-col justify-center items-center text-center border-b lg:border-b-0 lg:border-r border-foreground/15 w-full h-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-lg"
        >
            <h2 className="font-sans text-5xl md:text-6xl font-bold text-black mb-10 leading-[1.1]">
              Join the Impact
            </h2>
            <p className="text-lg md:text-xl font-medium text-black">
              We're building this from the ground up. Whether you want to mentor,
              sponsor, share a story, or just hear what we're up to — there's a
              seat for you on day one.
            </p>
        </motion.div>
      </div>

      <div className="relative hidden lg:flex items-center justify-center overflow-hidden bg-foreground">
        <img
          src={joinImg}
          alt="Hands stacked in unity"
          className="w-full h-full object-cover filter grayscale contrast-125"
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJ0cmFuc3BhcmVudCIvPgo8Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0xIGZpbGw9IiMwMDAiIG9wYWNpdHk9IjAuNSIvPgo8L3N2Zz4=')] z-20 pointer-events-none"></div>
      </div>
    </section>
  );
}
