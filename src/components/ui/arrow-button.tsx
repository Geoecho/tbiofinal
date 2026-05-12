import * as React from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";
import type { VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";

const ARROW_ICON = (
  <div className="relative w-[1.5em] h-[1.2em] flex items-center justify-center overflow-hidden">
    <motion.svg 
      width="32" 
      height="32" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3.5" 
      strokeLinecap="square" 
      strokeLinejoin="miter"
      initial={{ rotate: -45 }}
      variants={{
        hover: { rotate: 0 }
      }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className="w-full h-full"
    >
      <line x1="4" y1="12" x2="20" y2="12" />
      <polyline points="13 5 20 12 13 19" />
    </motion.svg>
  </div>
);

interface ArrowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const ArrowButton = React.forwardRef<HTMLButtonElement, ArrowButtonProps>(
  ({ className = "", variant, size, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        initial="initial"
        whileHover="hover"
        whileTap={{ scale: 0.98 }}
        className={cn(
          buttonVariants({ variant, size }),
          "group flex items-center justify-center gap-4 font-display uppercase tracking-widest transition-all duration-300 border-2 border-foreground",
          // Default style if not specified
          !variant && !className.includes("bg-") && "bg-foreground text-background hover:bg-foreground",
          className
        )}
        {...(props as any)}
      >
        <span className="font-display">{children}</span>
        {ARROW_ICON}
      </motion.button>
    );
  }
);

ArrowButton.displayName = "ArrowButton";

export { ArrowButton };
