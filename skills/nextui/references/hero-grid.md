# Grid hero (`hero-grid`)

Centered hero on a square grid where integration icons blink in and out, paused while off screen.

- Kind: block, category: Hero
- Live preview: https://nextui.dev/blocks/hero-grid
- Install: `npm create nextui add hero-grid`
- npm dependencies: lucide-react
- shadcn dependencies: button

## Usage

```tsx
import { Mail, Github, Slack } from "lucide-react";
import { IntegrationsGridHero } from "@/components/nextui/hero-grid";

export function Hero() {
  return (
    <IntegrationsGridHero
      title="Plug into everything"
      description="Sync the tools your team already lives in."
      primaryAction={{ label: "Start free", href: "/signup" }}
      secondaryAction={{ label: "Browse apps", href: "/integrations" }}
      slots={[
        { col: 1, row: 1, label: "Mail", icon: Mail },
        { col: 7, row: 1, label: "GitHub", icon: Github },
        { col: 2, row: 4, label: "Slack", icon: Slack, muted: true },
      ]}
      initial={[0, 1]}
      visible={2}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | `"Connect your whole stack"` | Headline in the centre panel |
| `description` | `string` | `"Pull in mail, docs, code and data…"` | Text under the headline |
| `primaryAction` | `HeroAction` | `{ label: "Get started" }` | Main button: label, optional href and onClick |
| `secondaryAction` | `HeroAction` | `{ label: "See integrations" }` | Outline button next to the main one |
| `slots` | `IntegrationSlot[]` | `20 sample integrations` | Icons pinned to cells of the 10 x 6 grid: col, row, label, icon, muted |
| `initial` | `number[]` | `[0, 3, 6, 8, 11, 14, 16, 19]` | Indexes into slots lit before animation starts |
| `visible` | `number` | `8` | How many integrations are lit at once |
| `interval` | `number` | `700` | Milliseconds between swaps |
| `className` | `string` |  | Extra classes on the section |

## When to use

- An integrations or marketplace page hero
- Keep cells off the centre panel, which covers the middle columns

## Source

Prefer the install command; it also pulls the shadcn dependencies. The source is here for reading and for projects without network access.

`components/blocks/hero-grid.tsx`

```tsx
"use client";

import { useEffect, useMemo, useRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import {
  ArrowRight,
  Bot,
  BookOpen,
  CalendarDays,
  ChartPie,
  Cloud,
  CodeXml,
  CreditCard,
  Database,
  FileText,
  FolderOpen,
  GitBranch,
  Headphones,
  Mail,
  MessagesSquare,
  PenTool,
  Sheet,
  SquareKanban,
  Users,
  Video,
  Webhook,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type IntegrationSlot = {
  /** Grid column, 0 to 9. */
  col: number;
  /** Grid row, 0 to 5. */
  row: number;
  label: string;
  icon: LucideIcon;
  /** Draws the icon in the foreground colour instead of the primary colour. */
  muted?: boolean;
};

export type HeroAction = { label: string; href?: string; onClick?: () => void };

const COLS = 10;
const ROWS = 6;

// Integrations that blink in and out of the grid, pinned to a cell (col, row).
const SLOTS: IntegrationSlot[] = [
  { col: 1, row: 1, label: "Mail", icon: Mail },
  { col: 2, row: 1, label: "Calendar", icon: CalendarDays, muted: true },
  { col: 4, row: 1, label: "Docs", icon: FileText },
  { col: 6, row: 1, label: "Tasks", icon: SquareKanban, muted: true },
  { col: 7, row: 1, label: "Code", icon: CodeXml },
  { col: 1, row: 2, label: "Drive", icon: FolderOpen, muted: true },
  { col: 3, row: 2, label: "Chat", icon: MessagesSquare },
  { col: 6, row: 2, label: "Database", icon: Database, muted: true },
  { col: 8, row: 2, label: "Design", icon: PenTool },
  { col: 2, row: 3, label: "Sheets", icon: Sheet },
  { col: 7, row: 3, label: "Analytics", icon: ChartPie, muted: true },
  { col: 1, row: 4, label: "CRM", icon: Users },
  { col: 3, row: 4, label: "Cloud", icon: Cloud, muted: true },
  { col: 5, row: 4, label: "Webhooks", icon: Webhook },
  { col: 6, row: 4, label: "Billing", icon: CreditCard, muted: true },
  { col: 8, row: 4, label: "Support", icon: Headphones },
  { col: 3, row: 0, label: "Meetings", icon: Video },
  { col: 5, row: 0, label: "Wiki", icon: BookOpen, muted: true },
  { col: 4, row: 5, label: "Branches", icon: GitBranch },
  { col: 6, row: 5, label: "Agents", icon: Bot, muted: true },
];

const INITIAL = [0, 3, 6, 8, 11, 14, 16, 19]; // shown before (and without) animation
const VISIBLE = 8; // how many integrations are lit at once
const TICK = 700; // ms between swaps

/**
 * Lights one cell and dims the oldest every tick by flipping a data attribute
 * straight on the DOM: no React renders, only opacity/transform transitions.
 * The timer runs only while the hero is on screen and the tab is visible.
 */
function useBlink(root: RefObject<HTMLElement | null>, initial: number[], visible: number, interval: number) {
  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cells = Array.from(el.querySelectorAll<HTMLElement>("[data-slot]"));
    const lit = [...initial];
    let last = -1;
    let timer = 0;
    let onScreen = false;

    const tick = () => {
      if (lit.length >= visible) {
        last = lit.shift()!;
        delete cells[last].dataset.on;
      }
      const free = cells.map((_, i) => i).filter((i) => i !== last && !lit.includes(i));
      if (free.length === 0) return;
      const next = free[Math.floor(Math.random() * free.length)];
      cells[next].dataset.on = "";
      lit.push(next);
    };

    const sync = () => {
      const run = onScreen && !document.hidden;
      if (run && !timer) timer = window.setInterval(tick, interval);
      if (!run && timer) {
        window.clearInterval(timer);
        timer = 0;
      }
    };

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.clearInterval(timer);
    };
  }, [root, initial, visible, interval]);
}

function ActionButton({ action, variant, children }: { action: HeroAction; variant?: "outline"; children?: ReactNode }) {
  if (action.href) {
    return (
      <Button size="sm" variant={variant} asChild>
        <a href={action.href} onClick={action.onClick}>
          {action.label}
          {children && <> {children}</>}
        </a>
      </Button>
    );
  }
  return (
    <Button size="sm" variant={variant} onClick={action.onClick}>
      {action.label}
      {children && <> {children}</>}
    </Button>
  );
}

export type IntegrationsGridHeroProps = {
  title?: string;
  description?: string;
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
  /** Integrations pinned to cells of the 10 x 6 grid. */
  slots?: IntegrationSlot[];
  /** Indexes into slots that are lit before (and without) animation. */
  initial?: number[];
  /** How many integrations are lit at once. */
  visible?: number;
  /** Milliseconds between swaps. */
  interval?: number;
  className?: string;
};

/** Hero centred over a grid where integration icons blink in and out. */
export function IntegrationsGridHero({
  title = "Connect your whole stack",
  description = "Pull in mail, docs, code and data from the tools your team already uses, all in one place.",
  primaryAction = { label: "Get started" },
  secondaryAction = { label: "See integrations" },
  slots = SLOTS,
  initial = INITIAL,
  visible = VISIBLE,
  interval = TICK,
  className,
}: IntegrationsGridHeroProps) {
  const ref = useRef<HTMLElement>(null);
  useBlink(ref, initial, visible, interval);
  const slotAt = useMemo(() => new Map(slots.map((s, i) => [s.row * COLS + s.col, i])), [slots]);

  return (
    <section
      ref={ref}
      className={cn(
        "relative h-[calc(var(--s)*6)] overflow-hidden bg-background [--pc:4] [--pr:4] [--s:88px] sm:h-[calc(var(--s)*4)] sm:[--pr:2] sm:[--s:128px] lg:[--pc:2] lg:[--s:164px]",
        className,
      )}
    >
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 grid -translate-x-1/2 -translate-y-1/2"
        style={
          {
            gridTemplateColumns: `repeat(${COLS}, var(--s))`,
            gridTemplateRows: `repeat(${ROWS}, var(--s))`,
          } as CSSProperties
        }
      >
        {Array.from({ length: COLS * ROWS }, (_, i) => {
          const slot = slotAt.get(i);
          const item = slot === undefined ? null : slots[slot];
          return (
            <div key={i} className="relative border-t border-l border-border/70">
              {item && (
                <div
                  data-slot
                  data-on={initial.includes(slot!) ? "" : undefined}
                  className="group absolute inset-0"
                >
                  <div className="absolute inset-0 bg-muted/40 opacity-0 transition-opacity duration-700 group-data-[on]:opacity-100" />
                  <item.icon
                    strokeWidth={1.6}
                    className={`absolute top-1/2 left-1/2 size-6 -translate-1/2 scale-75 opacity-0 transition-[opacity,scale] duration-700 ease-out group-data-[on]:scale-100 group-data-[on]:opacity-100 sm:size-7 ${
                      item.muted ? "text-foreground/70" : "text-primary"
                    }`}
                  />
                  <span className="absolute bottom-2 left-2.5 font-mono text-[9px] tracking-[0.18em] text-muted-foreground uppercase opacity-0 transition-opacity delay-150 duration-700 group-data-[on]:opacity-100 sm:text-[10px]">
                    {item.label}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="absolute top-1/2 left-1/2 z-10 flex h-[calc(var(--s)*var(--pr))] w-[calc(var(--s)*var(--pc))] -translate-1/2 flex-col items-center justify-center border-t border-l border-border/70 bg-background px-5 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-[2.6rem] lg:leading-[1.05]">
          {title}
        </h1>
        <p className="mt-4 max-w-md text-sm text-muted-foreground">
          {description}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <ActionButton action={primaryAction}>
            <ArrowRight />
          </ActionButton>
          {secondaryAction && <ActionButton action={secondaryAction} variant="outline" />}
        </div>
      </div>
    </section>
  );
}

export default function Hero02() {
  return <IntegrationsGridHero />;
}
```
