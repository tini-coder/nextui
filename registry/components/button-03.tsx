"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

// Brilliant-cut diamond: wide table on top, crown down to the girdle, pavilion down to the culet.
// Monochrome shades: the theme's ink mixed toward white, so the stone stays bright in light and dark.
const ink = (n: number) => `color-mix(in oklab, var(--foreground) ${n}%, white)`;
const FACETS = [
  // crown
  { points: "2,15 11,7 10,15", shade: ink(32) },
  { points: "11,7 29,7 30,15 10,15", shade: ink(10) },
  { points: "29,7 38,15 30,15", shade: ink(45) },
  // pavilion
  { points: "2,15 10,15 20,37", shade: ink(22) },
  { points: "10,15 30,15 20,37", shade: ink(38) },
  { points: "30,15 38,15 20,37", shade: ink(55) },
];
const SWEEP = 2.4; // seconds for the light to cross every facet once

function Diamond({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("shrink-0", className)} aria-hidden>
      {FACETS.map(({ points, shade }) => (
        <polygon key={points} points={points} style={{ fill: shade, stroke: shade }} strokeWidth={0.3} strokeLinejoin="round" />
      ))}
      {/* Light catches one facet after another, so the stone sparkles. */}
      {FACETS.map(({ points }, i) => (
        <polygon
          key={`hi-${points}`}
          points={points}
          fill="white"
          className="button-03-facet"
          style={{ animationDelay: `${(i * SWEEP) / FACETS.length}s` }}
        />
      ))}
    </svg>
  );
}

export default function Button03() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const play = visible && !reduce;

  // Loops only run while the indicator is on screen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      role="status"
      data-paused={play ? undefined : ""}
      className="button-03 flex items-center justify-center gap-2.5 text-sm font-medium"
    >
      <Diamond className="size-5" />
      {/* Same shimmer as card-02. */}
      <motion.span
        className="bg-[linear-gradient(90deg,var(--muted-foreground)_0%,var(--muted-foreground)_40%,var(--foreground)_50%,var(--muted-foreground)_60%,var(--muted-foreground)_100%)] bg-[length:250%_100%] bg-clip-text text-transparent"
        initial={{ backgroundPosition: "100% 0" }}
        animate={play ? { backgroundPosition: ["100% 0", "0% 0"] } : undefined}
        transition={{ duration: 2, ease: "linear", repeat: Infinity, repeatDelay: 0.3 }}
      >
        Thinking...
      </motion.span>

      <style>{`
        .button-03-facet {
          opacity: 0;
          animation: button-03-facet ${SWEEP}s ease-in-out infinite;
        }
        .button-03[data-paused] .button-03-facet { animation-play-state: paused; }
        @keyframes button-03-facet {
          0%, 35%, 100% { opacity: 0; }
          12% { opacity: 0.85; }
        }
        @media (prefers-reduced-motion: reduce) {
          .button-03-facet { animation: none; }
        }
      `}</style>
    </div>
  );
}
