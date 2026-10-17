# Rolling price badge (`badge-02`)

Pill badge that rolls between prices glyph by glyph, resizing smoothly as it goes.

- Kind: component, category: Buttons, badges & avatars
- Live preview: https://nextui.dev/components/badge-02
- Install: `npx shadcn@latest add https://nextui.dev/r/badge-02.json`
- npm dependencies: motion
- shadcn dependencies: badge

## Source

Prefer the install command; it also pulls the shadcn dependencies. The source is here for reading and for projects without network access.

`components/nextui/badge-02.tsx`

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion, useInView, useReducedMotion } from "motion/react";
import { Badge } from "@/components/ui/badge";

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

export default function Badge02() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const value = VALUES[index];

  // Loops only run while the badge is on screen, and never under reduced motion.
  useEffect(() => {
    if (!inView || reduce) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % VALUES.length);
    }, HOLD);
    return () => window.clearInterval(id);
  }, [inView, reduce]);

  const list = glyphs(value);

  return (
    <MotionConfig transition={spring} reducedMotion="user">
      <div ref={ref} className="flex items-center justify-center p-4">
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
```
