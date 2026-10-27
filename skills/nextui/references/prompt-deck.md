# Prompt deck (`prompt-deck`)

A stack of prompt cards that swipes the front card away and lifts the next one into place, on a loop while it is on screen.

- Kind: component, category: AI & agents
- Live preview: https://nextui.dev/components/prompt-deck
- Install: `npm create nextui add prompt-deck`
- npm dependencies: lucide-react
- shadcn dependencies: utils

## Usage

```tsx
import { BookOpen, Code, Globe, Mail, Search } from "lucide-react";
import { PromptDeck } from "@/components/nextui/prompt-deck";

export function Example() {
  return (
    <PromptDeck
      interval={3000}
      tools={[Search, Globe, Code]}
      prompts={[
        { icon: Mail, title: "draft replies", prompt: "reply to the three oldest emails in my inbox", sources: [Mail, Globe, Code] },
        { icon: BookOpen, title: "summarise docs", prompt: "what changed in the API docs this week?", sources: [BookOpen, Search, Globe] },
        { icon: Search, title: "research", prompt: "find five competitors and compare pricing", sources: [Search, Globe, Code] },
      ]}
      onActiveChange={(i) => console.log("front card", i)}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `prompts` | `PromptDeckItem[]` | `5 design prompts` | Cards in the deck: icon, title, prompt and up to three source icons; titles must be unique |
| `tools` | `LucideIcon[]` | `7 lucide icons` | Small icons along the bottom of each card |
| `interval` | `number` | `2200` | How long each prompt stays in front, in ms |
| `onActiveChange` | `(index: number) => void` |  | Called with the index of the prompt that moved to the front |
| `className` | `string` |  | Extra class on the root |

## When to use

- Showing example prompts or use cases for an AI product in a small space
- The deck only shuffles while on screen, pauses on hover and stays still with reduced motion

## Source

Prefer the install command; it also pulls the shadcn dependencies. The source is here for reading and for projects without network access.

`components/nextui/prompt-deck.tsx`

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Asterisk,
  Box,
  ChartLine,
  Code,
  CreditCard,
  Flag,
  Globe,
  ImageIcon,
  Layers,
  LayoutGrid,
  MousePointer2,
  Palette,
  Route,
  ScanSearch,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Source tiles stay inside the site palette: the red accent, its tint and the ink.
const TONES = ["bg-primary text-primary-foreground", "bg-foreground text-background", "bg-primary/15 text-primary"];

/** One card in the deck: header icon, title, prompt text and up to three source icons. */
export type PromptDeckItem = { icon: LucideIcon; title: string; prompt: string; sources: LucideIcon[] };

const PROMPTS: PromptDeckItem[] = [
  { icon: MousePointer2, title: "polish screens", prompt: "can you make this screen feel calmer?", sources: [Palette, Smartphone, Sparkles] },
  { icon: Layers, title: "compare onboarding", prompt: "how is my onboarding different from theirs?", sources: [Globe, LayoutGrid, Layers] },
  { icon: CreditCard, title: "compare paywalls", prompt: "why does their paywall convert better?", sources: [CreditCard, ChartLine, Sparkles] },
  { icon: ScanSearch, title: "find ui elements", prompt: "where do others put the progress chart?", sources: [ChartLine, Smartphone, Code] },
  { icon: Flag, title: "map user flows", prompt: "show the full flow from install to first run", sources: [Route, Globe, Palette] },
];

const TOOLS = [Asterisk, Box, Globe, ImageIcon, Code, LayoutGrid, Sparkles];

// Pose for each slot: 0 is the front card, 1-2 peek out behind it,
// 3 waits unseen at the back and 4 is the card that just swiped away.
const SLOTS = [
  { transform: "translate3d(0,0,0) rotate(0deg) scale(1)", opacity: 1 },
  { transform: "translate3d(4px,12px,0) rotate(1.5deg) scale(0.95)", opacity: 1 },
  { transform: "translate3d(-4px,22px,0) rotate(-1.5deg) scale(0.9)", opacity: 1 },
  { transform: "translate3d(0,30px,0) rotate(0deg) scale(0.86)", opacity: 0 },
  { transform: "translate3d(-70%,-6px,0) rotate(-9deg) scale(0.92)", opacity: 0 },
];
const Z = [5, 4, 3, 1, 2];
const HOLD = 2200; // ms each prompt stays in front

export type PromptDeckProps = {
  /** Cards in the deck; titles must be unique. */
  prompts?: PromptDeckItem[];
  /** Small tool icons along the bottom of each card. */
  tools?: LucideIcon[];
  /** How long each prompt stays in front, in ms. */
  interval?: number;
  /** Called with the index of the prompt that moved to the front. */
  onActiveChange?: (index: number) => void;
  className?: string;
};

/** Stack of prompt cards that shuffles on a timer and pauses on hover. */
export function PromptDeck({
  prompts = PROMPTS,
  tools = TOOLS,
  interval = HOLD,
  onActiveChange,
  className,
}: PromptDeckProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [reduce, setReduce] = useState(false);
  const play = visible && !hovered && !reduce;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // The deck only shuffles while it is on screen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!play) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % prompts.length), interval);
    return () => window.clearInterval(id);
  }, [play, prompts.length, interval]);

  const notify = useRef(onActiveChange);
  useEffect(() => {
    notify.current = onActiveChange;
  });
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    notify.current?.(active);
  }, [active]);

  return (
    <div
      ref={ref}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className={cn("relative mx-auto h-52 w-full max-w-xs", className)}
    >
      {prompts.map((p, i) => {
        const n = prompts.length;
        const order = (i - active + n) % n;
        // The last card in order is the one that just left; anything past the third waits at the back.
        const slot = n > 1 && order === n - 1 ? 4 : Math.min(order, 3);
        const front = slot === 0;
        return (
          <article
            key={p.title}
            aria-hidden={!front}
            className="absolute inset-x-0 top-0 flex h-44 flex-col rounded-2xl border bg-card p-4 text-card-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-12px_rgba(0,0,0,0.18)] transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform motion-reduce:transition-none"
            style={{ ...SLOTS[slot], zIndex: Z[slot] }}
          >
            {/* Cards behind the front one read as blank paper; the leaving card keeps its text. */}
            <div
              className={cn(
                "flex flex-1 flex-col transition-opacity duration-500 motion-reduce:transition-none",
                front || slot === 4 ? "opacity-100" : "opacity-0",
              )}
            >
              <div className="flex items-start gap-2.5">
                <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                  <p.icon className="size-4" />
                </span>
                <h3 className="flex-1 truncate pt-0.5 text-base leading-tight font-semibold tracking-tight">{p.title}</h3>
                <div className="flex shrink-0 -space-x-1.5" aria-label="Sources">
                  {p.sources.map((S, j) => (
                    <span key={j} className={cn("grid size-6 place-items-center rounded-md ring-2 ring-card", TONES[j])}>
                      <S className="size-3.5" strokeWidth={2.25} />
                    </span>
                  ))}
                </div>
              </div>
              <p className="mt-3 flex gap-2 pl-0.5 text-sm leading-snug text-pretty">
                <span className="text-muted-foreground">&gt;</span>
                <span>{p.prompt}</span>
              </p>
              <div className="mt-auto flex justify-end gap-1.5 text-muted-foreground">
                {tools.map((T, j) => (
                  <T key={j} className="size-3" aria-hidden />
                ))}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default function Card05() {
  return <PromptDeck />;
}
```
