"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Copy, FileCode2 } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/** One saved version of the artifact. */
export type ArtifactVersion = {
  /** Shown in the switcher; defaults to "v1", "v2", ... */
  label?: string;
  /** Source shown on the Code tab. */
  code: string;
  /** What the Preview tab renders. Leave unset to show the code only. */
  preview?: React.ReactNode;
  /** One line on what changed in this version. */
  note?: string;
};

export type ArtifactTab = "preview" | "code";

export type ArtifactPanelProps = {
  /** File name or title in the header. */
  title?: string;
  /** Small chip next to the title, e.g. "Component", "Document". */
  kind?: string;
  versions?: ArtifactVersion[];
  /** Controlled version index. */
  version?: number;
  /** Starting version index; defaults to the newest. */
  defaultVersion?: number;
  onVersionChange?: (index: number) => void;
  tab?: ArtifactTab;
  defaultTab?: ArtifactTab;
  onTabChange?: (tab: ArtifactTab) => void;
  /** True while the newest version's code is still streaming in. */
  streaming?: boolean;
  /** Play a scripted edit on a loop while on screen, for demos. */
  autoPlay?: boolean;
  /** Fill the parent's height instead of a fixed 256px body, e.g. as a side panel. */
  fill?: boolean;
  className?: string;
};

const V1 = `export function PricingCard() {
  return (
    <div className="rounded-xl border p-5">
      <p className="text-sm text-muted-foreground">Pro</p>
      <p className="text-3xl font-semibold">$12</p>
      <button className="mt-4 w-full rounded-md bg-foreground py-2 text-background">
        Upgrade
      </button>
    </div>
  );
}`;

const V2 = `export function PricingCard() {
  return (
    <div className="rounded-xl border p-5">
      <p className="text-sm text-muted-foreground">Pro</p>
      <p className="text-3xl font-semibold">
        $12<span className="text-sm text-muted-foreground">/month</span>
      </p>
      <ul className="mt-3 space-y-1 text-sm">
        <li>Unlimited projects</li>
        <li>Priority support</li>
      </ul>
      <button className="mt-4 w-full rounded-md bg-foreground py-2 text-background">
        Upgrade
      </button>
    </div>
  );
}`;

function DemoCard({ v2 }: { v2?: boolean }) {
  return (
    <div className="w-48 rounded-xl border bg-card p-4 text-left shadow-sm">
      <p className="text-xs text-muted-foreground">Pro</p>
      <p className="text-2xl font-semibold tracking-tight">
        $12{v2 && <span className="text-xs font-normal text-muted-foreground">/month</span>}
      </p>
      {v2 && (
        <ul className="mt-2 space-y-1 text-xs">
          <li className="flex items-center gap-1.5">
            <Check className="size-3" aria-hidden /> Unlimited projects
          </li>
          <li className="flex items-center gap-1.5">
            <Check className="size-3" aria-hidden /> Priority support
          </li>
        </ul>
      )}
      <span className="mt-3 block rounded-md bg-foreground py-1.5 text-center text-xs font-medium text-background">Upgrade</span>
    </div>
  );
}

const DEMO: ArtifactVersion[] = [
  { code: V1, preview: <DemoCard />, note: "First draft" },
  { code: V2, preview: <DemoCard v2 />, note: "Added price period and features" },
];

// Demo loop, in ms: stream v2's code, switch to the preview, hold, start over.
const START = 600;
const CHAR_MS = 7;
const TICK = 50;

/** A side panel for what the agent made: preview and code tabs, version history, copy. */
export function ArtifactPanel({
  title = "pricing-card.tsx",
  kind = "Component",
  versions: versionsProp,
  version: versionProp,
  defaultVersion,
  onVersionChange,
  tab: tabProp,
  defaultTab = "preview",
  onTabChange,
  streaming: streamingProp = false,
  autoPlay = false,
  fill = false,
  className,
}: ArtifactPanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLPreElement>(null);
  const reduce = useReducedMotion();
  const versions = versionsProp ?? DEMO;
  const last = Math.max(0, versions.length - 1);

  const [visible, setVisible] = useState(false);
  const [tick, setTick] = useState(0);
  const [innerVersion, setInnerVersion] = useState<number | null>(defaultVersion ?? null);
  const [innerTab, setInnerTab] = useState<ArtifactTab | null>(autoPlay ? null : defaultTab);
  const [copied, setCopied] = useState(false);

  const STREAM_END = START + versions[last].code.length * CHAR_MS;
  const SWITCH = STREAM_END + 700;
  const LOOP = SWITCH + 3600;

  useEffect(() => {
    const el = ref.current;
    if (!el || !autoPlay) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [autoPlay]);

  useEffect(() => {
    if (!autoPlay || !visible || reduce) return;
    let t = 0;
    const id = setInterval(() => {
      t = (t + TICK) % LOOP;
      setTick(t);
      // A viewer's clicks hold until the loop starts over.
      if (t === 0) {
        setInnerTab(null);
        setInnerVersion(null);
      }
    }, TICK);
    return () => clearInterval(id);
  }, [autoPlay, visible, reduce, LOOP]);

  const playing = autoPlay && !reduce;
  const t = playing ? tick : LOOP - 1;

  const index = Math.min(last, versionProp ?? innerVersion ?? last);
  const current = versions[index];
  const streaming = autoPlay ? playing && index === last && t < STREAM_END : streamingProp && index === last;
  const scriptedTab: ArtifactTab = t < SWITCH ? "code" : "preview";
  const tab: ArtifactTab = tabProp ?? innerTab ?? (autoPlay ? scriptedTab : defaultTab);
  const code = autoPlay && streaming ? current.code.slice(0, Math.max(0, Math.floor((t - START) / CHAR_MS))) : current.code;
  const hasPreview = current.preview !== undefined;
  const shownTab: ArtifactTab = hasPreview ? tab : "code";

  // Follow the newest line while code streams in.
  useEffect(() => {
    const el = codeRef.current;
    if (el && streaming) el.scrollTop = el.scrollHeight;
  }, [code, streaming]);

  function pickVersion(next: number) {
    const clamped = Math.max(0, Math.min(last, next));
    if (versionProp === undefined) setInnerVersion(clamped);
    onVersionChange?.(clamped);
  }

  function pickTab(next: ArtifactTab) {
    if (tabProp === undefined) setInnerTab(next);
    onTabChange?.(next);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(current.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be blocked; nothing to undo.
    }
  }

  const lines = code.split("\n");

  return (
    <div ref={ref} className={cn("w-full max-w-lg rounded-xl bg-muted p-1.5 text-foreground", fill && "flex h-full max-w-none flex-col", className)}>
      <div className={cn("overflow-hidden rounded-lg border bg-card shadow-xs", fill && "flex min-h-0 flex-1 flex-col")}>
        <div className="flex items-center gap-2 border-b px-3 py-2">
          <FileCode2 className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <span className="min-w-0 truncate font-mono text-[13px] font-medium">{title}</span>
          {kind && <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">{kind}</span>}
          <span className="flex-1" />

          {versions.length > 1 && (
            <div className="flex items-center rounded-md border text-xs">
              <button
                type="button"
                onClick={() => pickVersion(index - 1)}
                disabled={index === 0}
                aria-label="Previous version"
                className="grid size-6 place-items-center rounded-l-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40 disabled:hover:bg-transparent"
              >
                <ChevronLeft className="size-3.5" aria-hidden />
              </button>
              <span className="min-w-12 px-1 text-center font-mono text-[11px] tabular-nums" aria-live="polite">
                {current.label ?? `v${index + 1}`}
                <span className="text-muted-foreground"> / {versions.length}</span>
              </span>
              <button
                type="button"
                onClick={() => pickVersion(index + 1)}
                disabled={index === last}
                aria-label="Next version"
                className="grid size-6 place-items-center rounded-r-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40 disabled:hover:bg-transparent"
              >
                <ChevronRight className="size-3.5" aria-hidden />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={copy}
            aria-label={copied ? "Copied" : "Copy code"}
            className="grid size-7 place-items-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
          </button>
        </div>

        {hasPreview && (
          <div role="tablist" aria-label="View" className="flex gap-1 border-b px-2 py-1.5">
            {(["preview", "code"] as const).map((name) => (
              <button
                key={name}
                type="button"
                role="tab"
                aria-selected={shownTab === name}
                onClick={() => pickTab(name)}
                className={cn(
                  "relative h-7 rounded-md px-2.5 text-xs font-medium capitalize outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                  shownTab === name ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {shownTab === name && (
                  <motion.span
                    layoutId={reduce ? undefined : `artifact-tab-${title}`}
                    className="absolute inset-0 rounded-md bg-muted"
                    transition={{ type: "spring", stiffness: 500, damping: 38 }}
                    aria-hidden
                  />
                )}
                <span className="relative">{name}</span>
              </button>
            ))}
            {streaming && (
              <span className="ml-auto flex items-center gap-1.5 pr-1 text-[11px] text-muted-foreground">
                <span className="size-1.5 animate-pulse rounded-full bg-foreground" aria-hidden />
                Writing {current.label ?? `v${index + 1}`}
              </span>
            )}
          </div>
        )}

        <div className={cn("relative", fill ? "min-h-0 flex-1" : "h-64")}>
          <AnimatePresence mode="wait" initial={false}>
            {shownTab === "preview" ? (
              <motion.div
                key={`preview-${index}`}
                initial={reduce ? false : { opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "absolute inset-0 overflow-auto bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:14px_14px] p-4",
                  // A tall preview scrolls from its top; centring it would cut off the top.
                  fill ? "grid justify-items-center" : "grid place-items-center",
                )}
              >
                {current.preview}
              </motion.div>
            ) : (
              <motion.pre
                key={`code-${index}`}
                ref={codeRef}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 overflow-auto py-3 font-mono text-[12px] leading-[1.6] [scrollbar-width:thin]"
              >
                <code className="grid grid-cols-[auto_1fr]">
                  {lines.map((line, i) => (
                    <span key={i} className="contents">
                      <span className="select-none pr-4 pl-3 text-right text-muted-foreground/60 tabular-nums">{i + 1}</span>
                      <span className="pr-4 whitespace-pre">
                        {line}
                        {streaming && i === lines.length - 1 && (
                          <span aria-hidden className="ml-px inline-block h-3.5 w-1.5 translate-y-0.5 animate-pulse bg-foreground/60" />
                        )}
                      </span>
                    </span>
                  ))}
                </code>
              </motion.pre>
            )}
          </AnimatePresence>
        </div>

        {current.note && (
          <div className="border-t px-3 py-2 text-xs text-muted-foreground">
            <span className="font-mono text-foreground">{current.label ?? `v${index + 1}`}</span> · {current.note}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ArtifactPanelDemo() {
  return <ArtifactPanel autoPlay />;
}
