# Dashboard home (`dashboard-home`)

Dashboard start page with today's counts, an AI search bar, quick actions and revenue and target cards.

- Kind: block, category: Features & pricing
- Live preview: https://nextui.dev/blocks/dashboard-home
- Install: `npm create nextui add dashboard-home`
- npm dependencies: lucide-react

## Usage

```tsx
"use client";

import { ChartPie, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { DashboardHome } from "@/components/nextui/dashboard-home";

export function Home() {
  const router = useRouter();

  return (
    <DashboardHome
      eyebrow="Tuesday, October 14"
      title="Good morning, Ana"
      counts={[
        { count: 12, label: "new emails", tone: "blue", href: "/inbox" },
        { count: 4, label: "open invoices", tone: "amber", href: "/invoices" },
      ]}
      onSearch={(q) => router.push(`/search?q=${encodeURIComponent(q)}`)}
      onAskAI={(q) => router.push(`/assistant?q=${encodeURIComponent(q)}`)}
      actions={[
        { label: "Show expenses", icon: ChartPie, tone: "pink", onClick: () => router.push("/expenses") },
        { label: "Unpaid invoices", icon: FileText, tone: "amber", onClick: () => router.push("/invoices?status=unpaid") },
      ]}
      currency="USD"
      locale="en-US"
      revenue={[
        { label: "Aug", value: 18_200 },
        { label: "Sep", value: 19_450 },
        { label: "Oct", value: 21_030 },
      ]}
      targetValue={62}
      targetTotal={80}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `eyebrow` | `string` | `"Tuesday, September 30"` | Small line with a live dot above the heading, e.g. today's date |
| `title` | `string` | `"What will you get done today?"` | Heading |
| `counts` | `SummaryCount[]` | `emails, invoices, tasks` | Colored pills in the line under the heading: count, label, tone and an optional href |
| `searchPlaceholder` | `string` | `"Search for views and files..."` | Placeholder of the search bar |
| `onSearch` | `(query: string) => void` |  | Enter was pressed in the search bar |
| `onAskAI` | `(query: string) => void` |  | Tab was pressed in the search bar, or Ask AI was clicked |
| `actions` | `QuickAction[]` | `4 sample actions` | Chips under the search bar: label, icon, tone and onClick |
| `currency` | `string` | `"USD"` | ISO currency code for the revenue card |
| `locale` | `string` | `"en-US"` | Locale for numbers and money |
| `revenue` | `RevenueBar[]` | `Jun to Sep` | Monthly revenue, oldest first; the last bar is the current month and sets the headline and the change badge |
| `onRevenueClick` | `() => void` |  | The arrow on the revenue card was clicked |
| `targetValue` | `number` | `2760` | Targets reached so far |
| `targetTotal` | `number` | `3600` | Total targets; the ring shows targetValue / targetTotal |
| `onTargetsClick` | `() => void` |  | The arrow on the targets card was clicked |
| `className` | `string` |  | Extra classes on the section |

## When to use

- The start page of a dashboard, CRM or back-office app
- Tones are blue, amber, purple, pink, green and red; the revenue bar turns red or green with the month's change
- Tab in the search bar only hands off to onAskAI when that prop is set, so keyboard focus still moves otherwise
- Bars grow, the ring fills and the numbers count up from 0 the first time the cards scroll into view; with reduced motion they show final values at once

## Source

Prefer the install command; it also pulls the shadcn dependencies. The source is here for reading and for projects without network access.

`components/blocks/dashboard-home.tsx`

```tsx
"use client";

import { useEffect, useRef, useState, type ComponentType, type FormEvent, type ReactNode } from "react";
import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowUpRight, ChartPie, FileText, Newspaper, RefreshCw, Search, Sparkles, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export type Tone = "blue" | "amber" | "purple" | "pink" | "green" | "red";

export type SummaryCount = { count: number; label: string; tone?: Tone; href?: string };

export type QuickAction = {
  label: string;
  icon?: ComponentType<{ className?: string }>;
  tone?: Tone;
  onClick?: () => void;
};

export type RevenueBar = { label: string; value: number };

const PILL: Record<Tone, string> = {
  blue: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  amber: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  purple: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  pink: "bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300",
  green: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  red: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
};

const TILE: Record<Tone, string> = {
  blue: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  purple: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  pink: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  green: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  red: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

const COUNTS: SummaryCount[] = [
  { count: 12, label: "new emails", tone: "blue" },
  { count: 5, label: "open invoices", tone: "amber" },
  { count: 7, label: "open tasks", tone: "purple" },
];

const ACTIONS: QuickAction[] = [
  { label: "Show expenses", icon: ChartPie, tone: "pink" },
  { label: "Unpaid invoices", icon: FileText, tone: "amber" },
  { label: "Generate report", icon: RefreshCw, tone: "green" },
  { label: "Latest news", icon: Newspaper, tone: "blue" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

const BARS: RevenueBar[] = [
  { label: "Jun", value: 8_940 },
  { label: "Jul", value: 9_610 },
  { label: "Aug", value: 9_180 },
  { label: "Sep", value: 10_245 },
];

export type DashboardHomeProps = {
  /** Small line above the heading, e.g. today's date. */
  eyebrow?: string;
  title?: string;
  /** Colored counts in the line under the heading. */
  counts?: SummaryCount[];
  searchPlaceholder?: string;
  /** Enter was pressed in the search bar. */
  onSearch?: (query: string) => void;
  /** Tab was pressed (or "Ask AI" clicked) in the search bar. */
  onAskAI?: (query: string) => void;
  /** Chips under the search bar. */
  actions?: QuickAction[];
  /** ISO currency code for the revenue card. */
  currency?: string;
  /** Locale used to format numbers and money. */
  locale?: string;
  /** Monthly revenue, oldest first; the last bar is the current month. */
  revenue?: RevenueBar[];
  onRevenueClick?: () => void;
  /** Targets reached so far. */
  targetValue?: number;
  /** Total targets for the period. */
  targetTotal?: number;
  onTargetsClick?: () => void;
  className?: string;
};

function list(items: ReactNode[]) {
  if (items.length < 2) return items;
  return items.flatMap((item, i) => (i === 0 ? [item] : [i === items.length - 1 ? " and " : ", ", item]));
}

function CardHeader({ title, onClick }: { title: string; onClick?: () => void }) {
  return (
    <header className="flex items-center justify-between">
      <h3 className="text-[13px] font-medium text-muted-foreground">{title}</h3>
      <button
        type="button"
        onClick={onClick}
        aria-label={`Open ${title.toLowerCase()}`}
        className="grid size-7 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
      </button>
    </header>
  );
}

/** Dashboard home: a greeting, today's counts, an AI search bar, quick actions and two KPI cards. */
export function DashboardHome({
  eyebrow = "Tuesday, September 30",
  title = "What will you get done today?",
  counts = COUNTS,
  searchPlaceholder = "Search for views and files...",
  onSearch,
  onAskAI,
  actions = ACTIONS,
  currency = "USD",
  locale = "en-US",
  revenue = BARS,
  onRevenueClick,
  targetValue = 2_760,
  targetTotal = 3_600,
  onTargetsClick,
  className,
}: DashboardHomeProps) {
  const [query, setQuery] = useState("");
  const cardsRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardsRef, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  // 0 → 1 once the cards scroll into view; every number and chart reads from it.
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, 1, { duration: 1.4, ease: EASE, onUpdate: setT });
    return () => controls.stop();
  }, [inView, reduce]);
  const shown = inView && reduce ? 1 : t;

  const money = (n: number) =>
    new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
  const symbol = new Intl.NumberFormat(locale, { style: "currency", currency }).formatToParts(0).find((p) => p.type === "currency")?.value;
  const number = (n: number) => new Intl.NumberFormat(locale).format(n);

  const current = revenue.at(-1)?.value ?? 0;
  const previous = revenue.at(-2)?.value ?? current;
  const change = current - previous;
  const changePct = previous ? (change / previous) * 100 : 0;
  const down = change < 0;
  const values = revenue.map((b) => b.value);
  const low = Math.min(...values);
  const range = Math.max(...values) - low || 1;

  const pct = targetTotal > 0 ? Math.min(100, Math.round((targetValue / targetTotal) * 100)) : 0;
  const R = 34;
  const C = 2 * Math.PI * R;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  return (
    <section className={cn("relative isolate overflow-hidden bg-background px-4 py-16 sm:px-6 sm:py-24", className)}>
      {/* Soft glow and dot grid behind the heading. */}
      <div aria-hidden className="absolute top-0 left-1/2 -z-10 h-64 w-[36rem] -translate-x-1/2 -translate-y-1/3">
        <div className="absolute inset-y-0 left-0 w-2/3 rounded-full bg-sky-400/15 blur-3xl" />
        <div className="absolute inset-y-0 right-0 w-2/3 rounded-full bg-violet-400/15 blur-3xl" />
      </div>
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:18px_18px] [mask-image:radial-gradient(50%_80%_at_50%_0%,black,transparent)]"
      />

      <div className="mx-auto max-w-[38rem]">
        <p className="flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground">
          <span className="relative flex size-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/60 motion-reduce:hidden" />
            <span className="relative size-1.5 rounded-full bg-emerald-500" />
          </span>
          {eyebrow}
        </p>
        <h2 className="mt-3 text-balance text-center text-3xl font-semibold tracking-tight sm:text-[2.5rem] sm:leading-tight">
          {title}
        </h2>
        <p className="mt-4 text-center text-sm leading-7 text-muted-foreground">
          You have{" "}
          {list(
            counts.map((c) => {
              const cls = cn("whitespace-nowrap rounded-md px-1.5 py-0.5 font-medium", PILL[c.tone ?? "blue"]);
              const text = `${c.count} ${c.label}`;
              return c.href ? (
                <a key={c.label} href={c.href} className={cn(cls, "hover:underline")}>
                  {text}
                </a>
              ) : (
                <span key={c.label} className={cls}>
                  {text}
                </span>
              );
            })
          )}
          . Let&apos;s review them!
        </p>

        <form onSubmit={submit} className="group/search relative mt-9">
          {/* Gradient rim that lights up on focus. */}
          <div
            aria-hidden
            className="absolute -inset-px rounded-2xl bg-gradient-to-r from-primary/0 via-primary/40 to-primary/0 opacity-0 blur-[2px] transition-opacity duration-300 group-focus-within/search:opacity-100"
          />
          <label className="relative flex items-center gap-3 rounded-2xl border bg-card py-2 pr-2 pl-4 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.12)]">
            <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Tab" && !e.shiftKey && onAskAI) {
                  e.preventDefault();
                  onAskAI(query);
                }
              }}
              placeholder={searchPlaceholder}
              aria-label="Search"
              className="h-9 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              type="button"
              onClick={() => onAskAI?.(query)}
              className="flex shrink-0 items-center gap-1.5 rounded-xl bg-primary/10 py-1.5 pr-1.5 pl-2.5 text-xs font-medium text-primary transition-colors hover:bg-primary/15"
            >
              <Sparkles className="size-3.5" />
              Ask AI
              <kbd className="rounded-md bg-background/80 px-1.5 py-0.5 font-sans text-[10px] text-muted-foreground shadow-xs">Tab</kbd>
            </button>
          </label>
        </form>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:flex">
          {actions.map(({ label, icon: Icon, tone = "blue", onClick }) => (
            <button
              key={label}
              type="button"
              onClick={onClick}
              className="group flex min-w-0 items-center gap-2 rounded-xl border border-transparent bg-muted/50 py-1.5 pr-3 pl-1.5 text-[13px] font-medium whitespace-nowrap text-muted-foreground transition-all hover:border-border hover:bg-card hover:text-foreground hover:shadow-xs sm:flex-auto"
            >
              {Icon && (
                <span className={cn("grid size-6 shrink-0 place-items-center rounded-lg transition-transform group-hover:scale-110", TILE[tone])}>
                  <Icon className="size-3.5" />
                </span>
              )}
              <span className="truncate">{label}</span>
            </button>
          ))}
        </div>

        <div ref={cardsRef} className="mt-10 grid gap-3 sm:grid-cols-2">
          <article className="group rounded-2xl border bg-card p-4 shadow-xs transition-shadow hover:shadow-md">
            <CardHeader title="Sales Revenue" onClick={onRevenueClick} />
            <div className="mt-3 flex items-end justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-baseline gap-2">
                  <p className="text-[1.75rem] leading-none font-semibold tracking-tight tabular-nums">
                    <span className="mr-0.5 text-base font-medium text-muted-foreground">{symbol}</span>
                    {number(Math.round(current * shown))}
                  </p>
                  <span
                    className={cn(
                      "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums",
                      down ? "bg-rose-500/10 text-rose-600 dark:text-rose-400" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    )}
                  >
                    {down ? <TrendingDown className="size-3" /> : <TrendingUp className="size-3" />}
                    {Math.abs(changePct * shown).toFixed(1)}%
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {down ? "Down" : "Up"} <span className="font-medium text-foreground">{money(Math.round(Math.abs(change) * shown))}</span> vs last
                  month
                </p>
              </div>
              <div className="flex shrink-0 items-end gap-1.5" aria-hidden>
                {revenue.map((b, i) => {
                  const last = i === revenue.length - 1;
                  return (
                    <div key={b.label} className="flex flex-col items-center gap-1.5">
                      <div className="flex h-14 w-5 items-end">
                        <motion.div
                          className={cn("w-full origin-bottom rounded-md", last ? (down ? "bg-rose-500" : "bg-emerald-500") : "bg-muted")}
                          style={{ height: `${45 + ((b.value - low) / range) * 55}%` }}
                          initial={reduce ? false : { scaleY: 0 }}
                          animate={inView ? { scaleY: 1 } : undefined}
                          transition={{ duration: 0.7, ease: EASE, delay: i * 0.08 }}
                        />
                      </div>
                      <span className={cn("text-[10px]", last ? "font-semibold text-foreground" : "text-muted-foreground")}>{b.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </article>

          <article className="group rounded-2xl border bg-card p-4 shadow-xs transition-shadow hover:shadow-md">
            <CardHeader title="Sales Targets" onClick={onTargetsClick} />
            <div className="mt-3 flex items-center gap-4">
              <div className="relative size-[5.5rem] shrink-0">
                <svg viewBox="0 0 80 80" className="size-full -rotate-90" role="img" aria-label={`${pct}% of targets reached`}>
                  <circle cx="40" cy="40" r={R} fill="none" strokeWidth="7" className="stroke-muted" />
                  <circle
                    cx="40"
                    cy="40"
                    r={R}
                    fill="none"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray={C}
                    strokeDashoffset={C * (1 - (pct * shown) / 100)}
                    className={cn("stroke-amber-400", shown === 0 && "opacity-0")}
                  />
                </svg>
                <div className="absolute inset-0 grid place-content-center text-center leading-none">
                  <span className="text-lg font-semibold tracking-tight tabular-nums">{Math.round(pct * shown)}%</span>
                  <span className="mt-1 text-[10px] text-muted-foreground">reached</span>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[1.75rem] leading-none font-semibold tracking-tight tabular-nums">
                  {number(Math.round(targetValue * shown))}
                  <span className="text-sm font-medium text-muted-foreground"> / {number(targetTotal)}</span>
                </p>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{number(Math.round(Math.max(0, targetTotal - targetValue) * shown))}</span> left to
                  hit this quarter&apos;s goal
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export default function DashboardHomeDemo() {
  return <DashboardHome />;
}
```
