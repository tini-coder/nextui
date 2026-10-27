# Price badge (`price-badge`)

Pill badge that rolls between prices glyph by glyph, resizing smoothly as it goes.

- Kind: component, category: Buttons, badges & avatars
- Live preview: https://nextui.dev/components/price-badge
- Install: `npm create nextui add price-badge`
- npm dependencies: motion
- shadcn dependencies: badge

## Usage

```tsx
import { RollingPriceBadge } from "@/components/nextui/price-badge";

export function PlanPrice() {
  return <RollingPriceBadge values={["$9", "$19", "$49"]} interval={2400} />;
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `values` | `string[]` | `["$17.38", "$3.15", "$35.99", "Free"]` | Values the badge cycles through |
| `value` | `string` |  | Show this value instead of cycling, e.g. a live price |
| `interval` | `number` | `1800` | Milliseconds each value stays up |
| `className` | `string` |  | Extra classes on the wrapper |

## When to use

- Prices, totals or counters that change and should draw the eye.
- Prices are keyed around the decimal point, so cents roll into cents.
- Cycling runs only on screen and stops under reduced motion.

## Source

Prefer the install command; it also pulls the shadcn dependencies. The source is here for reading and for projects without network access.

`components/nextui/price-badge.tsx`

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion, useInView, useReducedMotion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// The badge steps through these, one every HOLD ms, while it is on screen.
const VALUES = ["$17.38", "$3.15", "$35.99", "Free"];
const HOLD = 1800;
const STAGGER = 0.035; // seconds between neighbouring glyphs, so a change ripples across

// Low damping lets each glyph overshoot as it rises, so the text dips and settles.
const spring = { type: "spring", stiffness: 520, damping: 24, mass: 0.7 } as const;

type Glyph = { key: string; char: string };

// Prices are keyed around the decimal point, so cents swap with cents and units with units,
// and a dropped digit leaves from the front. Words are keyed left to right.
function glyphs(value: string): Glyph[] {
  const m = /^(\D*)(\d+)(?:\.(\d+))?$/.exec(value);
  if (!m) return [...value].map((char, i) => ({ key: `t${i}`, char }));
  const [, prefix, int, frac] = m;
  return [
    ...[...prefix].map((char, i) => ({ key: `p${i}`, char })),
    ...[...int].map((char, i) => ({ key: `i${int.length - 1 - i}`, char })),
    ...(frac ? [{ key: "dot", char: "." }, ...[...frac].map((char, i) => ({ key: `f${i}`, char }))] : []),
  ];
}

export type RollingPriceBadgeProps = {
  /** Values the badge cycles through; prices roll digit by digit. */
  values?: string[];
  /** Show this value instead of cycling, e.g. a live price. */
  value?: string;
  /** Milliseconds each value stays up. */
  interval?: number;
  className?: string;
};

/** A pill badge whose price rolls glyph by glyph each time the value changes. */
export function RollingPriceBadge({ values = VALUES, value: controlled, interval = HOLD, className }: RollingPriceBadgeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const count = values.length;
  const value = controlled ?? values[index % count] ?? "";
  const cycling = controlled === undefined && count > 1;

  // Loops only run while the badge is on screen, and never under reduced motion.
  useEffect(() => {
    if (!inView || reduce || !cycling) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, interval);
    return () => window.clearInterval(id);
  }, [inView, reduce, cycling, count, interval]);

  const list = glyphs(value);

  return (
    <MotionConfig transition={spring} reducedMotion="user">
      <div ref={ref} className={cn("flex items-center justify-center p-4", className)}>
        <Badge asChild className="h-7 gap-0 rounded-full px-3 text-sm font-normal tabular-nums">
          {/* The pill only resizes, without overshoot; the bounce belongs to the text. */}
          <motion.span layout style={{ borderRadius: 999 }} transition={{ layout: { type: "spring", stiffness: 420, damping: 40 } }}>
            <span className="sr-only">{value}</span>
            <span aria-hidden className="flex">
              <AnimatePresence mode="popLayout" initial={false}>
                {list.map(({ key, char }, i) => (
                  <motion.span
                    key={key}
                    layout="position"
                    className="relative inline-flex"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                  >
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={char}
                        className="inline-block"
                        variants={{
                          enter: { y: "0.55em", scale: 0.5, opacity: 0 },
                          center: { y: 0, scale: 1, opacity: 1 },
                          exit: { y: "0.55em", scale: 0.5, opacity: 0 },
                        }}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ ...spring, delay: i * STAGGER }}
                      >
                        {char}
                      </motion.span>
                    </AnimatePresence>
                  </motion.span>
                ))}
              </AnimatePresence>
            </span>
          </motion.span>
        </Badge>
      </div>
    </MotionConfig>
  );
}

export default function Badge02() {
  return <RollingPriceBadge />;
}
```
