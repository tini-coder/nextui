"use client";

import type * as React from "react";
import { useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

// A sleek android helmet: a rounded shell with side pods and a dark visor. Inside the visor a
// row of light bars bounces like a voice meter while a glint scans across the glass.
const BARS = [8.2, 10.1, 12, 13.9, 15.8]; // x of each visor bar
const PEAKS = [0.55, 0.85, 1, 0.75, 0.6]; // tallest each bar gets, so the middle leads
const TALK = 0.9; // seconds for one bounce of a bar

function Bot({ className }: { className?: string }) {
  const clip = `thinking-bot-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <svg viewBox="0 0 24 24" className={cn("shrink-0", className)} aria-hidden>
      {/* side pods */}
      <rect x={1.4} y={9.6} width={2.6} height={6.4} rx={1.3} fill="currentColor" />
      <rect x={20} y={9.6} width={2.6} height={6.4} rx={1.3} fill="currentColor" />
      {/* helmet shell, with a ridge on the brow and a vent on the chin */}
      <path
        d="M12 3.4c5.2 0 7.9 3.3 7.9 8v3c0 4-2.9 6.4-7.9 6.4s-7.9-2.4-7.9-6.4v-3c0-4.7 2.7-8 7.9-8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
      />
      <path d="M10 6.3h4M10.8 18h2.4" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" />
      {/* visor */}
      <clipPath id={clip}>
        <rect x={5.6} y={8.7} width={12.8} height={7.2} rx={3.6} />
      </clipPath>
      <rect x={5.6} y={8.7} width={12.8} height={7.2} rx={3.6} fill="currentColor" />
      <g clipPath={`url(#${clip})`} style={{ fill: "var(--background)" }}>
        {BARS.map((x, i) => (
          <rect
            key={x}
            x={x - 0.5}
            y={12.3 - 2.2 * PEAKS[i]}
            width={1}
            height={4.4 * PEAKS[i]}
            rx={0.5}
            className="thinking-bot-bar"
            style={{ animationDelay: `${-((i * 2) % BARS.length) * (TALK / BARS.length)}s` }}
          />
        ))}
        {/* glint that scans across the glass */}
        <rect x={3} y={8} width={1.6} height={9} opacity={0.35} transform="skewX(-20)" className="thinking-bot-glint" />
      </g>
    </svg>
  );
}

export type ThinkingBotProps = {
  /** Text that shimmers next to the bot. */
  label?: React.ReactNode;
  className?: string;
};

/** An android whose visor bars bounce while its label shimmers, for showing that an AI reply is on its way. */
export function ThinkingBot({ label = "Thinking...", className }: ThinkingBotProps) {
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
      className={cn("thinking-bot flex items-center justify-center gap-2.5 text-sm font-medium", className)}
    >
      <Bot className="size-6 text-muted-foreground" />
      {/* Same shimmer as thinking-ring and thinking-sparkle. */}
      <motion.span
        className="bg-[linear-gradient(90deg,var(--muted-foreground)_0%,var(--muted-foreground)_40%,var(--foreground)_50%,var(--muted-foreground)_60%,var(--muted-foreground)_100%)] bg-[length:250%_100%] bg-clip-text text-transparent"
        initial={{ backgroundPosition: "100% 0" }}
        animate={play ? { backgroundPosition: ["100% 0", "0% 0"] } : undefined}
        transition={{ duration: 2, ease: "linear", repeat: Infinity, repeatDelay: 0.3 }}
      >
        {label}
      </motion.span>

      <style>{`
        .thinking-bot-bar,
        .thinking-bot-glint {
          transform-box: fill-box;
          transform-origin: center;
        }
        .thinking-bot-bar { animation: thinking-bot-bar ${TALK}s ease-in-out infinite; }
        .thinking-bot-glint { animation: thinking-bot-glint 2.4s ease-in-out infinite; }
        .thinking-bot[data-paused] :is(.thinking-bot-bar, .thinking-bot-glint) {
          animation-play-state: paused;
        }
        @keyframes thinking-bot-bar {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
        @keyframes thinking-bot-glint {
          0% { transform: skewX(-20deg) translateX(0); }
          60%, 100% { transform: skewX(-20deg) translateX(18px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .thinking-bot-bar,
          .thinking-bot-glint { animation: none; }
        }
      `}</style>
    </div>
  );
}

export default function ThinkingBotDemo() {
  return <ThinkingBot />;
}
