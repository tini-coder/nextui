# Thinking ring (`thinking-ring`)

Thinking indicator: a wobbling dot ring and a shimmering label.

- Kind: component, category: AI & agents
- Live preview: https://nextui.dev/components/thinking-ring
- Install: `npm create nextui add thinking-ring`
- npm dependencies: motion

## Usage

```tsx
import { AgentThinking } from "@/components/nextui/thinking-ring";

export function Example() {
  return <AgentThinking label="Searching your docs..." className="justify-start" />;
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `"Agent thinking..."` | Status text with the shimmer sweep |
| `className` | `string` |  | Extra class on the root |

## When to use

- Loading state while an AI agent or long task is working
- The root has role="status", so screen readers announce the label

## Source

Prefer the install command; it also pulls the shadcn dependencies. The source is here for reading and for projects without network access.

`components/nextui/thinking-ring.tsx`

```tsx
"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

// A ring of dots that never turns: each dot only slides in and out along its own spoke.
// Standing waves (fixed lobes whose depth swells and fades) plus a little per-dot drift make
// the ring breathe between soft triangle and oval shapes without the shape travelling round.
const DOTS = 20;
const RADIUS = 8;
const SPEED = 2; // multiplier on the wobble rate

function radiusAt(angle: number, t: number) {
  const tri = 0.12 * Math.sin(3 * angle + 0.6) * Math.sin(t * 2.2);
  const oval = 0.08 * Math.sin(2 * angle) * Math.sin(t * 1.5 + 1.1);
  const drift = 0.04 * Math.sin(angle * 7) * Math.sin(t * 3.1);
  return RADIUS * (1 + tri + oval + drift);
}

function DotRing() {
  const reduce = useReducedMotion();
  const dots = useRef<(SVGCircleElement | null)[]>([]);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const draw = (now: number) => {
      const t = reduce ? 0 : ((now - start) / 1000) * SPEED;
      dots.current.forEach((dot, i) => {
        if (!dot) return;
        const angle = (i / DOTS) * Math.PI * 2;
        const r = radiusAt(angle, t);
        dot.setAttribute("cx", (Math.cos(angle) * r).toFixed(3));
        dot.setAttribute("cy", (Math.sin(angle) * r).toFixed(3));
      });
      if (!reduce) frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [reduce]);

  return (
    <svg viewBox="-12 -12 24 24" className="size-5 text-muted-foreground" aria-hidden>
      {Array.from({ length: DOTS }, (_, i) => (
        <circle
          key={i}
          ref={(el) => {
            dots.current[i] = el;
          }}
          r={0.85}
          fill="currentColor"
        />
      ))}
    </svg>
  );
}

export type AgentThinkingProps = {
  /** Status text with the shimmer sweep. */
  label?: string;
  className?: string;
};

/** Inline status: a breathing dot ring next to shimmering label text. */
export function AgentThinking({ label = "Agent thinking...", className }: AgentThinkingProps) {
  const reduce = useReducedMotion();

  return (
    <div
      role="status"
      className={cn("flex items-center justify-center gap-2.5 text-sm font-medium", className)}
    >
      <DotRing />
      <motion.span
        className="bg-[linear-gradient(90deg,var(--muted-foreground)_0%,var(--muted-foreground)_40%,var(--foreground)_50%,var(--muted-foreground)_60%,var(--muted-foreground)_100%)] bg-[length:250%_100%] bg-clip-text text-transparent"
        initial={{ backgroundPosition: "100% 0" }}
        animate={reduce ? undefined : { backgroundPosition: ["100% 0", "0% 0"] }}
        transition={{ duration: 2, ease: "linear", repeat: Infinity, repeatDelay: 0.3 }}
      >
        {label}
      </motion.span>
    </div>
  );
}

export default function Card02() {
  return <AgentThinking />;
}
```
