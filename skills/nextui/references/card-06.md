# Smart PDF stack (`card-06`)

A file card with paper sheets and tilted profile cards behind it that rise in on enter and fan out on hover.

- Kind: component, category: Cards
- Live preview: https://nextui.dev/components/card-06
- Install: `npx shadcn@latest add https://nextui.dev/r/card-06.json`
- npm dependencies: motion, lucide-react
- shadcn dependencies: utils

## Source

Prefer the install command; it also pulls the shadcn dependencies. The source is here for reading and for projects without network access.

`components/nextui/card-06.tsx`

```tsx
"use client";

import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "motion/react";
import { AtSign, FileText, Globe, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

const PROFILES = [
  {
    name: "Kenzo Ito",
    role: "Creative Director",
    bio: "Founder of a small studio. Shares files with the team and lets the doc answer the questions.",
    initials: "KI",
    tone: "from-neutral-500 to-neutral-900",
    links: [
      { icon: Globe, label: "kenzo.studio" },
      { icon: AtSign, label: "@kenzo.ito" },
    ],
  },
  {
    name: "Alex McDonald",
    role: "Product Designer",
    bio: "Self-taught designer. Drops in a brief, gets the summary and the open questions back.",
    initials: "AM",
    tone: "from-neutral-300 to-neutral-600",
    links: [
      { icon: Globe, label: "alexmcd.design" },
      { icon: AtSign, label: "@alex.mcd" },
      { icon: Link2, label: "read.cv/alex" },
    ],
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = { type: "spring", stiffness: 260, damping: 22 } as const;

// Paper sheets behind the card. They rise out from under it on enter and fan apart on hover.
const sheet = (depth: 1 | 2): Variants => ({
  hidden: { y: 0, scale: 1 - depth * 0.04, rotate: 0, opacity: 0 },
  show: {
    y: -8 * depth,
    scale: 1 - depth * 0.04,
    rotate: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: EASE, delay: 0.25 + (2 - depth) * 0.08 },
  },
  hover: { y: -14 * depth - 2, scale: 1 - depth * 0.035, rotate: depth === 1 ? 1.8 : -2.4, opacity: 1, transition: SPRING },
});

const front: Variants = {
  hidden: { y: 16, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: EASE } },
  hover: { y: 2, opacity: 1, transition: SPRING },
};

const glow: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  show: { opacity: 0.6, scale: 1, transition: { duration: 1, ease: EASE, delay: 0.3 } },
  hover: { opacity: 1, scale: 1.15, transition: { duration: 0.6, ease: EASE } },
};

const icon: Variants = {
  hidden: { scale: 0.4, rotate: -20, opacity: 0 },
  show: { scale: 1, rotate: 0, opacity: 1, transition: { ...SPRING, delay: 0.35 } },
  hover: { scale: 1.06, rotate: [0, -10, 8, 0], opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } },
};

const text = (i: number): Variants => ({
  hidden: { y: 10, opacity: 0, filter: "blur(4px)" },
  show: { y: 0, opacity: 1, filter: "blur(0px)", transition: { duration: 0.5, ease: EASE, delay: 0.45 + i * 0.08 } },
  hover: { y: 0, opacity: 1, filter: "blur(0px)" },
});

// Profile cards fly in from the right edge, tilted, and stay put on hover.
const POSES = [
  { x: 0, y: 14, rotate: -9 },
  { x: 0, y: -6, rotate: -9 },
];
const profile = (i: number): Variants => ({
  hidden: { x: 120, y: POSES[i].y + 30, rotate: 6, opacity: 0 },
  show: { ...POSES[i], opacity: 1, transition: { ...SPRING, delay: 0.55 + i * 0.12 } },
  hover: { ...POSES[i], opacity: 1 },
});

const STILL: Variants = { hidden: {}, show: {}, hover: {} };

function Profile({ p }: { p: (typeof PROFILES)[number] }) {
  return (
    <div className="w-44 rounded-xl border bg-card p-3 text-card-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_32px_-16px_rgba(0,0,0,0.25)]">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br text-[10px] font-semibold text-white",
            p.tone,
          )}
        >
          {p.initials}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[11px] leading-tight font-semibold">{p.name}</p>
          <span className="mt-0.5 inline-block rounded-full bg-muted px-1.5 py-px text-[8px] text-muted-foreground">
            {p.role}
          </span>
        </div>
      </div>
      <p className="mt-2 line-clamp-3 text-[8.5px] leading-snug text-muted-foreground">{p.bio}</p>
      <ul className="mt-2 space-y-1">
        {p.links.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-1.5 rounded-md border px-1.5 py-1 text-[8.5px]">
            <Icon className="size-2.5 text-muted-foreground" aria-hidden />
            <span className="truncate">{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Card06() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const state = !inView ? "hidden" : hovered ? "hover" : "show";
  const v = (variants: Variants) => (reduce ? STILL : variants);

  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : "hidden"}
      animate={state}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
      className="relative mx-auto w-full max-w-sm pt-5 outline-none"
    >
      {([2, 1] as const).map((d) => (
        <motion.div
          key={d}
          variants={v(sheet(d))}
          aria-hidden
          className="absolute inset-x-0 top-5 h-48 origin-top rounded-2xl border bg-card/70 shadow-[0_8px_24px_-16px_rgba(0,0,0,0.2)] backdrop-blur-sm"
        />
      ))}

      <motion.article
        variants={v(front)}
        className="relative h-48 overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04),0_18px_40px_-18px_rgba(0,0,0,0.25)]"
      >
        <motion.div
          variants={v(glow)}
          aria-hidden
          className="pointer-events-none absolute top-6 right-6 size-56 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--foreground)_12%,transparent),transparent_65%)] blur-xl"
        />

        <div className="relative flex h-full flex-col justify-between p-5">
          <motion.span
            variants={v(icon)}
            className="grid size-11 place-items-center rounded-full bg-foreground text-background shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_6px_14px_-4px_rgba(0,0,0,0.45)]"
          >
            <FileText className="size-5" strokeWidth={2.25} aria-hidden />
          </motion.span>
          <div className="max-w-[55%]">
            <motion.h3 variants={v(text(0))} className="text-lg leading-tight font-semibold tracking-tight">
              New Smart PDF
            </motion.h3>
            <motion.p variants={v(text(1))} className="mt-1 text-sm text-muted-foreground">
              Share your files and analyze
            </motion.p>
          </div>
        </div>

        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-1/2">
          <motion.div variants={v(profile(0))} className="absolute top-12 -left-2">
            <Profile p={PROFILES[0]} />
          </motion.div>
          <motion.div variants={v(profile(1))} className="absolute top-4 left-14">
            <Profile p={PROFILES[1]} />
          </motion.div>
        </div>
      </motion.article>
    </motion.div>
  );
}
```
