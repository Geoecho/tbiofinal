import { useEffect, useState } from "react";
import { NAV_LINKS, NavId } from "@/lib/nav";

const SECTION_IDS: NavId[] = ["about", "initiatives", "events", "contact"];

export function useActiveSection(): NavId | null {
  const [active, setActive] = useState<NavId | null>(null);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    const visibilityMap = new Map<string, number>();

    const pickMostVisible = () => {
      let best: NavId | null = null;
      let bestRatio = 0;
      for (const id of SECTION_IDS) {
        const ratio = visibilityMap.get(id) ?? 0;
        if (ratio > bestRatio) {
          bestRatio = ratio;
          best = id as NavId;
        }
      }
      setActive(best);
    };

    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (!el) continue;

      const obs = new IntersectionObserver(
        ([entry]) => {
          visibilityMap.set(id, entry.intersectionRatio);
          pickMostVisible();
        },
        { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] }
      );

      obs.observe(el);
      observers.push(obs);
    }

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return active;
}
