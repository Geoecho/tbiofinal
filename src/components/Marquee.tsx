import { motion } from "framer-motion";

export function Marquee() {
  const words = ["Youth", "•", "Growth", "•", "Impact", "•", "Stories", "•", "Community", "•"];
  const repeatedWords = [...words, ...words, ...words, ...words];

  return (
    <div
      id="marquee"
      className="scroll-mt-20 bg-primary text-primary-foreground border-b-2 border-foreground py-4 overflow-hidden flex whitespace-nowrap"
    >
      <motion.div
        className="flex space-x-8 font-display text-4xl md:text-5xl tracking-widest"
        animate={{ x: [-1000, 0] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 15,
            ease: "linear",
          },
        }}
      >
        {repeatedWords.map((word, i) => (
          <span key={i} className={word === "•" ? "text-background/50" : ""}>
            {word}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
