import { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [points, setPoints] = useState<{ x: number; y: number; time: number }[]>([]);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for the lead "pen" tip
  const dotX = useSpring(mouseX, { damping: 20, stiffness: 350 });
  const dotY = useSpring(mouseY, { damping: 20, stiffness: 350 });

  useEffect(() => {
    // Check if it's a desktop device (width > 1024px)
    const checkDevice = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    checkDevice();
    window.addEventListener("resize", checkDevice);

    let animationFrame: number;
    
    const moveMouse = (e: MouseEvent) => {
      if (!isDesktop) return;

      const { clientX, clientY } = e;
      mouseX.set(clientX);
      mouseY.set(clientY);
      
      if (!isVisible) setIsVisible(true);

      const now = Date.now();
      setPoints(prev => {
        const filtered = prev.filter(p => now - p.time < 500);
        return [...filtered, { x: clientX, y: clientY, time: now }];
      });
    };

    const handleOver = (e: MouseEvent) => {
      if (!isDesktop) return;
      const target = e.target as HTMLElement;
      const isClickable = 
        target.closest('a') || 
        target.closest('button') || 
        target.closest('[role="button"]') ||
        window.getComputedStyle(target).cursor === 'pointer';
      
      setIsHovering(!!isClickable);
    };

    const tick = () => {
      if (isDesktop) {
        const now = Date.now();
        setPoints(prev => prev.filter(p => now - p.time < 500));
      }
      animationFrame = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", moveMouse, { passive: true });
    window.addEventListener("mouseover", handleOver);
    animationFrame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", checkDevice);
      window.removeEventListener("mousemove", moveMouse);
      window.removeEventListener("mouseover", handleOver);
      cancelAnimationFrame(animationFrame);
    };
  }, [mouseX, mouseY, isVisible, isDesktop]);

  // Generate SVG path string from points
  const generatePath = () => {
    if (points.length < 2) return "";
    
    // Simple line joining
    let d = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      // Use quadratic curves for smoothing
      const xc = (points[i].x + points[i - 1].x) / 2;
      const yc = (points[i].y + points[i - 1].y) / 2;
      d += ` Q ${points[i - 1].x} ${points[i - 1].y}, ${xc} ${yc}`;
    }
    
    // Add the final point
    const last = points[points.length - 1];
    d += ` L ${last.x} ${last.y}`;
    
    return d;
  };

  if (!isVisible || !isDesktop) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] hidden lg:block">
      {/* The Smooth Ink Stroke */}
      <svg className="absolute inset-0 w-full h-full overflow-visible">
        <path
          d={generatePath()}
          fill="none"
          stroke="white"
          strokeWidth={isHovering ? "6" : "3"}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-[stroke-width] duration-300 opacity-100 mix-blend-difference"
        />
      </svg>
    </div>
  );
}
