import { motion } from "framer-motion";

export function Quote() {
  return (
    <section className="bg-foreground text-background py-20 lg:py-32 border-b-2 border-background/10 overflow-hidden relative">
      {/* Decorative large quotes */}
      <div className="absolute top-0 left-0 text-[20rem] font-display text-background/5 leading-none -translate-x-1/4 -translate-y-1/4 select-none">
        &ldquo;
      </div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <blockquote className="space-y-8">
            <p className="font-display text-2xl md:text-3xl lg:text-4xl leading-snug font-medium">
              &ldquo;The future belongs to those who believe in the beauty of their dreams.&rdquo;
            </p>
            <footer className="flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-white/30"></div>
              <cite className="font-display text-base md:text-lg tracking-widest text-white not-italic">
                Eleanor Roosevelt
              </cite>
              <div className="h-px w-12 bg-white/30"></div>
            </footer>
          </blockquote>
        </motion.div>
      </div>

      {/* Another decorative quote */}
      <div className="absolute bottom-0 right-0 text-[20rem] font-display text-background/5 leading-none translate-x-1/4 translate-y-1/4 select-none">
        &rdquo;
      </div>
    </section>
  );
}
