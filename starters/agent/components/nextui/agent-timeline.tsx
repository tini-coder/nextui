"use client";

import { useEffect, useRef, useState } from "react";
import {
  Brain,
  Check,
  FileText,
  Loader2,
  MessageSquare,
  PenLine,
  Search,
  TriangleAlert,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type TimelineEventKind = "think" | "search" | "read" | "tool" | "write" | "message" | "error";
export type TimelineEventStatus = "running" | "done" | "error";

/** One thing the agent did. */
export type TimelineEvent = {
  kind: TimelineEventKind;
  title: React.ReactNode;
  /** A short muted line under the title: the query, the file, the arguments. */
  detail?: React.ReactNode;
  /** Right-aligned note: a duration, a count. */
  meta?: string;
  status?: TimelineEventStatus;
};

export type AgentTimelineProps = {
  /** Header label. */
  title?: React.ReactNode;
  events?: TimelineEvent[];
  /** Footer line once every event is done, e.g. "Done in 7s". Leave unset to hide it. */
  summary?: React.ReactNode;
  /** Play a scripted run on a loop while on screen, for demos. */
  autoPlay?: boolean;
  className?: string;
};

const ICONS: Record<TimelineEventKind, LucideIcon> = {
  think: Brain,
  search: Search,
  read: FileText,
  tool: Wrench,
  write: PenLine,
  message: MessageSquare,
  error: TriangleAlert,
};

const DEMO: TimelineEvent[] = [
  { kind: "think", title: "Planned the reply", detail: "Find the thread, check the file, draft", meta: "2s" },
  { kind: "search", title: "Searched email", detail: "from:mara subject:launch", meta: "4 results" },
  { kind: "read", title: "Read launch-plan.pdf", detail: "12 pages · updated Tuesday", meta: "1.1s" },
  { kind: "tool", title: "Called calendar.find_slot", detail: "Thu or Fri, 30 min", meta: "0.6s" },
  { kind: "write", title: "Drafted the reply", detail: "Re: Q4 launch timeline", meta: "142 words" },
];

// Demo loop, in ms: each event arrives, runs, then settles.
const START = 400;
const STEP = 1300;
const RUN = 950;
const HOLD = 3200;
const TICK = 50;

/** A vertical log of what an agent did, one row per step, with live status. */
export function AgentTimeline({ title = "Agent activity", events, summary, autoPlay = false, className }: AgentTimelineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [tick, setTick] = useState(0);

  const source = events ?? DEMO;
  const END = START + source.length * STEP;
  const LOOP = END + HOLD;

  useEffect(() => {
    const el = ref.current;
    if (!el || !autoPlay) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [autoPlay]);

  useEffect(() => {
    if (!autoPlay || !visible || reduce) return;
    const id = setInterval(() => setTick((t) => (t + TICK) % LOOP), TICK);
    return () => clearInterval(id);
  }, [autoPlay, visible, reduce, LOOP]);

  let shown: TimelineEvent[] = source;
  let footer = summary;
  if (autoPlay) {
    const t = reduce ? LOOP - 1 : tick;
    shown = source
      .map((e, i) => {
        const local = t - START - i * STEP;
        if (local < 0) return null;
        return { ...e, status: local < RUN ? "running" : "done" } as TimelineEvent;
      })
      .filter((e): e is TimelineEvent => e !== null);
    footer = summary ?? (t >= END - STEP + RUN ? `Done in ${Math.round((END - STEP + RUN) / 1000)}s` : undefined);
  }

  const running = shown.some((e) => e.status === "running");
  const failed = shown.some((e) => e.status === "error" || e.kind === "error");

  return (
    <div ref={ref} className={cn("w-full max-w-md rounded-xl bg-muted p-1.5 text-foreground", className)}>
      <div className="rounded-lg border bg-card shadow-xs">
        <div className="flex items-center gap-2 border-b px-3.5 py-2.5 text-sm">
          <span className="font-medium">{title}</span>
          <span className="text-xs text-muted-foreground tabular-nums">
            {shown.length} {shown.length === 1 ? "step" : "steps"}
          </span>
          <span className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              className={cn(
                "size-1.5 rounded-full",
                running ? "bg-foreground" : failed ? "bg-destructive" : "bg-muted-foreground/40",
                running && !reduce && "animate-pulse",
              )}
              aria-hidden
            />
            {running ? "Working" : failed ? "Stopped" : shown.length ? "Done" : "Idle"}
          </span>
        </div>

        <ol className="px-3.5 pt-3 pb-1" aria-live="polite">
          <AnimatePresence initial={false}>
            {shown.map((e, i) => (
              <motion.li
                key={i}
                layout={reduce ? false : "position"}
                initial={reduce ? false : { opacity: 0, y: 8, filter: "blur(3px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex gap-3 pb-3"
              >
                {i < shown.length - 1 && <span className="absolute top-7 bottom-0 left-[13px] w-px bg-border" aria-hidden />}
                <EventIcon event={e} still={!!reduce} />
                <div className="min-w-0 flex-1 pt-1">
                  <div className="flex items-baseline gap-2">
                    <span className={cn("min-w-0 flex-1 truncate text-sm font-medium", e.status === "running" && "agent-timeline-shimmer")}>
                      {e.title}
                    </span>
                    {e.meta && e.status !== "running" && (
                      <span className="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">{e.meta}</span>
                    )}
                  </div>
                  {e.detail && <p className="mt-0.5 truncate text-xs text-muted-foreground">{e.detail}</p>}
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ol>

        <AnimatePresence initial={false}>
          {footer && (
            <motion.div
              initial={reduce ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={reduce ? undefined : { opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-2 border-t px-3.5 py-2.5 text-xs font-medium">
                <span className="grid size-4 place-items-center rounded-full bg-foreground text-background" aria-hidden>
                  <Check className="size-2.5" strokeWidth={3} />
                </span>
                {footer}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <style>{`
        .agent-timeline-shimmer {
          color: transparent;
          background: linear-gradient(90deg, var(--muted-foreground) 40%, var(--foreground) 50%, var(--muted-foreground) 60%) 0 0 / 250% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          animation: agent-timeline-shimmer 2s ease-in-out infinite;
        }
        @keyframes agent-timeline-shimmer {
          from { background-position: 100% 0; }
          to { background-position: 0% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .agent-timeline-shimmer { animation: none; color: var(--muted-foreground); }
        }
      `}</style>
    </div>
  );
}

function EventIcon({ event, still }: { event: TimelineEvent; still: boolean }) {
  const failed = event.status === "error" || event.kind === "error";
  const Icon = failed ? TriangleAlert : ICONS[event.kind];
  return (
    <span
      className={cn(
        "relative z-10 grid size-7 shrink-0 place-items-center rounded-full border bg-background",
        failed ? "border-destructive/40 text-destructive" : event.status === "running" ? "text-foreground" : "text-muted-foreground",
      )}
      aria-hidden
    >
      {event.status === "running" && !still ? <Loader2 className="size-3.5 animate-spin" /> : <Icon className="size-3.5" />}
    </span>
  );
}

export default function AgentTimelineDemo() {
  return <AgentTimeline autoPlay />;
}
