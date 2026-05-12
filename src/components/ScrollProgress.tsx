import { motion } from "framer-motion";
import { useScrollProgress } from "@/hooks/useScrollProgress";

export function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[4px] pointer-events-none overflow-hidden bg-white/10 lg:hidden">
      <motion.div
        className="h-full origin-left bg-primary"
        style={{ 
          scaleX: progress,
        }}
      />
    </div>
  );
}
