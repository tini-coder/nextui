# Icon buttons (`icon-buttons`)

Secondary, outline and destructive buttons with soft status buttons and animated icons, popping in as one group.

- Kind: component, category: Buttons, badges & avatars
- Live preview: https://nextui.dev/components/icon-buttons
- Install: `npx shadcn@latest add https://nextui.dev/r/icon-buttons.json`
- npm dependencies: lucide-react, motion
- shadcn dependencies: button

## Usage

```tsx
"use client";

import { Plus, Send, Rocket } from "lucide-react";
import { IconButtons } from "@/components/nextui/icon-buttons";

export function Toolbar() {
  return (
    <IconButtons
      actions={[
        { label: "New task", icon: Plus, variant: "secondary", onClick: () => console.log("new") },
        { label: "Send", icon: Send, iconPosition: "end", variant: "outline" },
      ]}
      statuses={[
        { label: "Queued", icon: "clock", tone: "bg-violet-500/10 text-violet-600 hover:bg-violet-500/15 dark:text-violet-400" },
        { label: "Shipping", icon: Rocket, tone: "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/15 dark:text-emerald-400" },
      ]}
      onStatusClick={(status) => console.log(status.label)}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `actions` | `ActionButtonItem[]` | `Export, Continue, Delete` | Plain buttons shown first: label, icon, iconPosition, variant, onClick |
| `statuses` | `StatusButtonItem[]` | `8 sample statuses` | Tinted buttons: label, tone classes and a Lucide icon or "clock" | "progress" | "timer" |
| `onStatusClick` | `(status: StatusButtonItem) => void` |  | Called with the status button that was clicked |
| `className` | `string` |  | Extra classes on the wrapper |

## When to use

- Toolbars and action rows that mix primary actions with status chips.
- The "clock", "progress" and "timer" icons animate on their own and stop under reduced motion.

## Source

Prefer the install command; it also pulls the shadcn dependencies. The source is here for reading and for projects without network access.

`components/nextui/icon-buttons.tsx`

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
import type * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** A tinted status button; `icon` takes a Lucide icon or one of the built-in animated ones. */
export type StatusButtonItem = {
  label: string;
  /** Tailwind classes for the tinted fill and text colour. */
  tone: string;
  icon: LucideIcon | "clock" | "progress" | "timer";
};

/** A plain shadcn button shown before the status buttons. */
export type ActionButtonItem = {
  label: string;
  icon?: LucideIcon;
  /** Which side of the label the icon sits on. */
  iconPosition?: "start" | "end";
  variant?: React.ComponentProps<typeof Button>["variant"];
  onClick?: () => void;
};

// Soft status buttons: a tinted fill with text and icon in the same hue. A few icons tick on their own.
const STATUSES: StatusButtonItem[] = [
  { label: "Queued", tone: "bg-violet-500/10 text-violet-600 hover:bg-violet-500/15 dark:text-violet-400", icon: "clock" },
  { label: "Scheduled", tone: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/15 dark:text-blue-400", icon: CalendarDays },
  { label: "In progress", tone: "bg-orange-500/10 text-orange-600 hover:bg-orange-500/15 dark:text-orange-400", icon: "progress" },
  { label: "High priority", tone: "bg-rose-500/10 text-rose-600 hover:bg-rose-500/15 dark:text-rose-400", icon: Flame },
  { label: "Ready", tone: "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/15 dark:text-emerald-400", icon: BadgeCheck },
  { label: "Waiting", tone: "bg-fuchsia-500/10 text-fuchsia-600 hover:bg-fuchsia-500/15 dark:text-fuchsia-400", icon: "timer" },
  { label: "Paused", tone: "bg-amber-500/10 text-amber-700 hover:bg-amber-500/15 dark:text-amber-400", icon: OctagonPause },
  { label: "Reviewing", tone: "bg-cyan-500/10 text-cyan-700 hover:bg-cyan-500/15 dark:text-cyan-400", icon: FileSearch },
];

const ACTIONS: ActionButtonItem[] = [
  { label: "Export", icon: Download, variant: "secondary" },
  { label: "Continue", icon: ArrowRight, iconPosition: "end", variant: "outline" },
  { label: "Delete", icon: Trash2, variant: "destructive" },
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

export type IconButtonsProps = {
  /** Plain buttons shown first. */
  actions?: ActionButtonItem[];
  /** Tinted status buttons shown after the actions. */
  statuses?: StatusButtonItem[];
  /** Called with the status that was clicked. */
  onStatusClick?: (status: StatusButtonItem) => void;
  className?: string;
};

/** A wrapping group of buttons with icons that pop in as they scroll into view. */
export function IconButtons({ actions = ACTIONS, statuses = STATUSES, onStatusClick, className }: IconButtonsProps) {
  const reduce = useReducedMotion();

  return (
    <div className={cn("flex max-w-xl flex-wrap items-center justify-center gap-2.5", className)}>
      {actions.map(({ label, icon: Icon, iconPosition = "start", variant, onClick }, i) => (
        <MotionButton key={label} variant={variant} className="rounded-lg" onClick={onClick} {...pop(i, reduce)}>
          {Icon && iconPosition === "end" ? (
            <>
              {label} <Icon />
            </>
          ) : (
            <>
              {Icon && <Icon />} {label}
            </>
          )}
        </MotionButton>
      ))}
      {statuses.map((status, i) => {
        const { label, tone, icon: Icon } = status;
        return (
          <motion.button
            key={label}
            type="button"
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded-lg px-3.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none [&_svg]:size-4.5",
              tone,
            )}
            onClick={onStatusClick ? () => onStatusClick(status) : undefined}
            {...pop(i + actions.length, reduce)}
          >
            {Icon === "clock" ? <ClockIcon /> : Icon === "progress" ? <ProgressIcon /> : Icon === "timer" ? <TimerIcon /> : <Icon />}
            {label}
          </motion.button>
        );
      })}
    </div>
  );
}

export default function Button01() {
  return <IconButtons />;
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
