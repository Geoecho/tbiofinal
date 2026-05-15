import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import logoImg from "@/assets/logo.png";

export function SplashScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Lock scroll while splash is visible
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => setShow(false), 1600);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!show) {
      document.body.style.overflow = "";
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[200] bg-black flex items-center justify-center pointer-events-none"
        >
          <motion.img
            src={logoImg}
            alt="The Big Impact Organization"
            initial={{ scale: 0.92, opacity: 0, filter: "blur(8px)" }}
            animate={{
              scale: [0.92, 1, 1],
              opacity: [0, 1, 1],
              filter: ["blur(8px)", "blur(0px)", "blur(0px)"],
            }}
            transition={{
              duration: 1.4,
              times: [0, 0.5, 1],
              ease: [0.16, 1, 0.3, 1],
            }}
            className="h-20 md:h-28 w-auto object-contain"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
