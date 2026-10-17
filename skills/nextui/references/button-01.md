# Buttons with icons (`button-01`)

Secondary, outline and destructive buttons with soft status buttons and animated icons, popping in as one group.

- Kind: component, category: Buttons, badges & avatars
- Live preview: https://nextui.dev/components/button-01
- Install: `npx shadcn@latest add https://nextui.dev/r/button-01.json`
- npm dependencies: lucide-react, motion
- shadcn dependencies: button

## Source

Prefer the install command; it also pulls the shadcn dependencies. The source is here for reading and for projects without network access.

`components/nextui/button-01.tsx`

```tsx
"use client";

import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Download,
  FileSearch,
  Flame,
  OctagonPause,
  Trash2,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Soft status buttons: a tinted fill with text and icon in the same hue. A few icons tick on their own.
const STATUSES: { label: string; tone: string; icon: LucideIcon | "clock" | "progress" | "timer" }[] = [
  { label: "Queued", tone: "bg-violet-500/10 text-violet-600 hover:bg-violet-500/15 dark:text-violet-400", icon: "clock" },
  { label: "Scheduled", tone: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/15 dark:text-blue-400", icon: CalendarDays },
  { label: "In progress", tone: "bg-orange-500/10 text-orange-600 hover:bg-orange-500/15 dark:text-orange-400", icon: "progress" },
  { label: "High priority", tone: "bg-rose-500/10 text-rose-600 hover:bg-rose-500/15 dark:text-rose-400", icon: Flame },
  { label: "Ready", tone: "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/15 dark:text-emerald-400", icon: BadgeCheck },
  { label: "Waiting", tone: "bg-fuchsia-500/10 text-fuchsia-600 hover:bg-fuchsia-500/15 dark:text-fuchsia-400", icon: "timer" },
  { label: "Paused", tone: "bg-amber-500/10 text-amber-700 hover:bg-amber-500/15 dark:text-amber-400", icon: OctagonPause },
  { label: "Reviewing", tone: "bg-cyan-500/10 text-cyan-700 hover:bg-cyan-500/15 dark:text-cyan-400", icon: FileSearch },
];

// The plain variants, animated in with the status buttons as one group.
const MotionButton = motion.create(Button);

// Pops in once the group scrolls into view, so it still plays (and never sticks hidden)
// when the buttons mount off screen, as they do in a long grid of previews.
const pop = (i: number, reduce: boolean | null) => ({
  initial: reduce ? false : { opacity: 0, y: 10, scale: 0.9 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true },
  whileTap: { scale: 0.96 },
  transition: {
    default: { type: "spring" as const, stiffness: 380, damping: 24, delay: reduce ? 0 : 0.05 * i },
    opacity: { duration: 0.2, delay: reduce ? 0 : 0.05 * i },
  },
});

export default function Button01() {
  const reduce = useReducedMotion();

  return (
    <div className="flex max-w-xl flex-wrap items-center justify-center gap-2.5">
      <MotionButton variant="secondary" className="rounded-lg" {...pop(0, reduce)}>
        <Download /> Export
      </MotionButton>
      <MotionButton variant="outline" className="rounded-lg" {...pop(1, reduce)}>
        Continue <ArrowRight />
      </MotionButton>
      <MotionButton variant="destructive" className="rounded-lg" {...pop(2, reduce)}>
        <Trash2 /> Delete
      </MotionButton>
      {STATUSES.map(({ label, tone, icon: Icon }, i) => (
        <motion.button
          key={label}
          type="button"
          className={cn(
            "inline-flex h-9 items-center gap-2 rounded-lg px-3.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none [&_svg]:size-4.5",
            tone,
          )}
          {...pop(i + 3, reduce)}
        >
          {Icon === "clock" ? <ClockIcon /> : Icon === "progress" ? <ProgressIcon /> : Icon === "timer" ? <TimerIcon /> : <Icon />}
          {label}
        </motion.button>
      ))}
    </div>
  );
}

// Hands spin around the centre of a 24px view box; motion-reduce stops them.
const HAND = "origin-[12px_12px] animate-spin motion-reduce:animate-none";

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <circle cx={12} cy={12} r={10} fill="currentColor" />
      <g className={HAND} style={{ animationDuration: "3s" }}>
        <line x1={12} y1={12} x2={12} y2={6.5} stroke="white" strokeWidth={2.2} strokeLinecap="round" />
      </g>
    </svg>
  );
}

function TimerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <rect x={9.5} y={1} width={5} height={2.2} rx={1} fill="currentColor" />
      <circle cx={12} cy={13.5} r={9} fill="currentColor" />
      <g className="origin-[12px_13.5px] animate-spin motion-reduce:animate-none" style={{ animationDuration: "2s" }}>
        <line x1={12} y1={13.5} x2={12} y2={8.5} stroke="white" strokeWidth={2.2} strokeLinecap="round" />
      </g>
    </svg>
  );
}

// A pie that fills, then starts over: a thick stroke on a half-radius circle draws the wedge.
function ProgressIcon() {
  const reduce = useReducedMotion();
  const C = 2 * Math.PI * 4.5;
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <circle cx={12} cy={12} r={9.5} stroke="currentColor" strokeWidth={2.2} />
      <motion.circle
        cx={12}
        cy={12}
        r={4.5}
        stroke="currentColor"
        strokeWidth={9}
        strokeDasharray={C}
        transform="rotate(-90 12 12)"
        initial={{ strokeDashoffset: reduce ? C * 0.35 : C }}
        animate={reduce ? undefined : { strokeDashoffset: [C, 0] }}
        transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.4 }}
      />
    </svg>
  );
}
```
