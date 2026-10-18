# Waitlist pass (`waitlist-pass`)

Ticket-style waitlist pass with notched edges, a QR code stub and a tilt-and-glare hover.

- Kind: component, category: Cards
- Live preview: https://nextui.dev/components/waitlist-pass
- Install: `npx shadcn@latest add https://nextui.dev/r/waitlist-pass.json`
- npm dependencies: motion

## Usage

```tsx
import { WaitlistPass } from "@/components/nextui/waitlist-pass";

export function Ticket() {
  return <WaitlistPass brand="Acme" label="Early access" title="you@acme.com" subtitle="Spot #128" />;
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `brand` | `string` | `"nextui"` | Name next to the logo |
| `logo` | `ReactNode` |  | Logo before the brand name; defaults to a four-square mark |
| `label` | `string` | `"Waitlist pass"` | Small caps line above the title |
| `title` | `string` | `"alex@example.com"` | The big line, usually the email or name |
| `subtitle` | `string` | `"@alexmorgan"` | Muted line under the title; leave empty to hide it |
| `code` | `ReactNode` |  | Replaces the sample QR code, e.g. an SVG QR generated for this person |
| `interactive` | `boolean` | `true` | Tilt and light follow the pointer |
| `className` | `string` |  | Extra class on the root |

## When to use

- A confirmation screen after someone joins a waitlist
- A shareable pass for early access or an event

## Source

Prefer the install command; it also pulls the shadcn dependencies. The source is here for reading and for projects without network access.

`components/nextui/waitlist-pass.tsx`

```tsx
"use client";

import type { CSSProperties, PointerEvent } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

export type WaitlistPassProps = {
  /** Name next to the logo. */
  brand?: string;
  /** Logo shown before the brand name. Defaults to a four-square mark. */
  logo?: React.ReactNode;
  /** Small caps line above the name, e.g. "Waitlist pass" or "Early access". */
  label?: string;
  /** The big line: usually the person's email or name. */
  title?: string;
  /** Muted line under it, e.g. a handle or a spot number. */
  subtitle?: string;
  /** Replaces the sample QR code on the stub, e.g. a QR generated for this person. */
  code?: React.ReactNode;
  /** Tilt and light follow the pointer. Off when the user prefers reduced motion. */
  interactive?: boolean;
  className?: string;
};

// Where the stub ends and the tear line sits, plus the notch sizes.
const CUT = "36%";
const CORNER = 20;
const NOTCH = 14;

const hole = (at: string, r: number) => `radial-gradient(circle at ${at}, transparent ${r}px, #000 ${r + 0.5}px)`;
const MASK = [
  hole("0 0", CORNER),
  hole("100% 0", CORNER),
  hole("0 100%", CORNER),
  hole("100% 100%", CORNER),
  hole(`${CUT} 0`, NOTCH),
  hole(`${CUT} 100%`, NOTCH),
].join(", ");

const TICKET_STYLE: CSSProperties = {
  maskImage: MASK,
  WebkitMaskImage: MASK,
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in",
  backgroundImage:
    "linear-gradient(105deg, color-mix(in oklab, var(--secondary) 95%, var(--foreground)), color-mix(in oklab, var(--secondary) 91%, var(--foreground)))",
};

// Sample QR code ("https://nextui.dev", version 2, 25x25), drawn as one path.
const QR = [
  "1111111010100101101111111",
  "1000001000110000101000001",
  "1011101000101001001011101",
  "1011101010100001101011101",
  "1011101011100011101011101",
  "1000001010101000001000001",
  "1111111010101010101111111",
  "0000000011101101000000000",
  "1000101111100100011111001",
  "1111110000000111100011010",
  "0001101111100001100011100",
  "1111010010111010000110110",
  "1110101000100111011101111",
  "1001000010001001010010010",
  "0000001110111111011111100",
  "0010010111110101110110110",
  "1111111111101101111111100",
  "0000000010000110100010000",
  "1111111010100000101010000",
  "1000001001001010100011111",
  "1011101010110110111111101",
  "1011101000101001011100111",
  "1011101001011110101001010",
  "1000001000010100000111110",
  "1111111010101101001000111",
];
const QR_PATH = QR.flatMap((row, y) =>
  [...row].map((bit, x) => (bit === "1" ? `M${x} ${y}h1v1h-1z` : "")),
).join("");

function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden className={className}>
      <rect x="1" y="1" width="8" height="8" rx="2" fill="currentColor" />
      <rect x="11" y="1" width="8" height="8" rx="2" fill="currentColor" opacity="0.55" />
      <rect x="1" y="11" width="8" height="8" rx="2" fill="currentColor" opacity="0.55" />
      <rect x="11" y="11" width="8" height="8" rx="2" fill="currentColor" opacity="0.25" />
    </svg>
  );
}

/** A tear-off ticket for a waitlist or early-access spot, with a QR stub and a 3D tilt. */
export function WaitlistPass({
  brand = "nextui",
  logo,
  label = "Waitlist pass",
  title = "alex@example.com",
  subtitle = "@alexmorgan",
  code,
  interactive = true,
  className,
}: WaitlistPassProps) {
  const reduce = useReducedMotion() || !interactive;

  // Pointer position across the ticket, 0..1 on each axis.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 180, damping: 18, mass: 0.4 };
  const rotateX = useSpring(useTransform(py, [0, 1], [7, -7]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-10, 10]), spring);
  const glareX = useTransform(px, (v) => v * 100);
  const glareY = useTransform(py, (v) => v * 100);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgb(255 255 255 / 0.5), transparent 50%)`;
  const glareOpacity = useSpring(0, spring);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
    glareOpacity.set(1);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
    glareOpacity.set(0);
  };

  return (
    <div className={cn("w-full max-w-xl p-4 [perspective:1100px]", className)}>
      <motion.div
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="drop-shadow-[0_14px_24px_rgb(255_255_255/0.9)]"
      >
        <article
          aria-label={`${label} for ${title}`}
          style={TICKET_STYLE}
          className="@container relative grid aspect-[3/1] min-h-36 w-full grid-cols-[36%_1fr] overflow-hidden text-foreground"
        >
          {/* Stub: QR code */}
          <div className="flex items-center justify-center px-[calc(18px+12%)] py-[calc(16px+5%)]">
            {code ?? (
              <svg viewBox={`0 0 ${QR.length} ${QR.length}`} shapeRendering="crispEdges" aria-hidden className="h-full w-full">
                <path d={QR_PATH} fill="currentColor" />
              </svg>
            )}
          </div>

          {/* Tear line */}
          <span
            aria-hidden
            className="absolute inset-y-[calc(14px+8%)] w-0.5 -translate-x-1/2 bg-[repeating-linear-gradient(to_bottom,currentColor_0_10px,transparent_10px_18px)] opacity-30"
            style={{ left: CUT }}
          />

          {/* Details */}
          <div className="flex min-w-0 flex-col justify-center gap-0.5 py-3 pl-[9%] pr-[10%]">
            <div className="mb-1.5 flex items-center gap-2 text-sm font-semibold tracking-tight @md:text-base">
              {logo ?? <Mark className="size-4" />}
              {brand}
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
            <p className="truncate text-lg font-semibold tracking-tight @md:text-2xl">{title}</p>
            {subtitle && <p className="truncate text-sm text-muted-foreground">{subtitle}</p>}
          </div>

          {/* Light that follows the pointer */}
          {!reduce && (
            <motion.span
              aria-hidden
              style={{ backgroundImage: glare, opacity: glareOpacity }}
              className="pointer-events-none absolute inset-0 mix-blend-overlay"
            />
          )}
        </article>
      </motion.div>
    </div>
  );
}

/** Preview: the pass with sample details. */
export default function WaitlistPassDemo() {
  return <WaitlistPass />;
}
```
