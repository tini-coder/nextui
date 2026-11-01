"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Brain, ChevronDown } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/** The fields this block reads from an AI SDK reasoning part (`{ type: "reasoning", text, state }`). */
export type ReasoningPartLike = {
  type: string;
  text: string;
  state?: "streaming" | "done";
};

export type ReasoningProps = {
  /** The model's reasoning text. */
  text?: string;
  /** True while reasoning tokens are still arriving. */
  streaming?: boolean;
  /** How long the model thought, in seconds. Counted live while streaming when left unset. */
  duration?: number;
  /** An AI SDK reasoning part; fills text and streaming. */
  part?: ReasoningPartLike;
  /** Controlled open state. Left unset, the block opens while streaming and folds away when done. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Loop a scripted think while on screen, for demos. */
  autoPlay?: boolean;
  className?: string;
};

const DEMO_TEXT =
  "The user wants the launch email sent to the three leads. Before sending, I should check the attachment is the latest plan. The file in the thread is launch-plan.pdf from Tuesday, which matches the timeline we agreed on. Sending is hard to undo, so I'll ask for approval first and show the exact recipients.";

// Demo loop, in ms.
const START = 500;
const CHAR_MS = 11;
const HOLD = 3400;
const TICK = 50;

/** A collapsible block for model reasoning: open and live while the model thinks, folded into "Thought for Ns" after. */
export function Reasoning({
  text: textProp,
  streaming: streamingProp,
  duration,
  part,
  open: openProp,
  onOpenChange,
  autoPlay = false,
  className,
}: ReasoningProps) {
  const ref = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const bodyId = useId();
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [tick, setTick] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  const STREAM_END = START + DEMO_TEXT.length * CHAR_MS;
  const LOOP = STREAM_END + HOLD;

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

  let text = textProp ?? part?.text ?? DEMO_TEXT;
  let streaming = streamingProp ?? (part ? part.state === "streaming" : false);
  let seconds = duration;

  if (autoPlay) {
    const t = reduce ? LOOP - 1 : tick;
    text = DEMO_TEXT.slice(0, Math.max(0, Math.floor((t - START) / CHAR_MS)));
    streaming = t < STREAM_END;
    seconds = Math.max(1, Math.round(Math.min(t, STREAM_END) / 1000));
  }

  // Count seconds while streaming when the caller gives no duration.
  const counting = !autoPlay && streaming && duration === undefined;
  useEffect(() => {
    if (!counting) return;
    const started = Date.now();
    const id = setInterval(() => setElapsed(Math.max(1, Math.round((Date.now() - started) / 1000))), 250);
    return () => clearInterval(id);
  }, [counting]);
  if (seconds === undefined && elapsed > 0) seconds = elapsed;

  // Open while streaming, fold when done. A click overrides that until the next stream starts.
  const [userOpen, setUserOpen] = useState<boolean | null>(null);
  const [wasStreaming, setWasStreaming] = useState(streaming);
  if (wasStreaming !== streaming) {
    setWasStreaming(streaming);
    if (streaming) setUserOpen(null);
  }
  const open = openProp ?? userOpen ?? streaming;

  // Keep the newest line in view while text streams in.
  useEffect(() => {
    const el = bodyRef.current;
    if (el && streaming) el.scrollTop = el.scrollHeight;
  }, [text, streaming]);

  const label = streaming ? "Thinking" : seconds ? `Thought for ${seconds}s` : "Thought";

  return (
    <div ref={ref} className={cn("w-full max-w-md text-foreground", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={() => {
          if (openProp === undefined) setUserOpen(!open);
          onOpenChange?.(!open);
        }}
        className="group flex items-center gap-2 rounded-md py-1 text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Brain className={cn("size-4 shrink-0", streaming && !reduce && "animate-pulse")} aria-hidden />
        <span className={cn("font-medium", streaming && "reasoning-shimmer")}>{label}</span>
        {streaming && seconds ? <span className="font-mono text-xs tabular-nums">{seconds}s</span> : null}
        <ChevronDown
          className={cn("size-3.5 shrink-0 transition-transform duration-300", !open && "-rotate-90")}
          aria-hidden
        />
      </button>

      <div
        id={bodyId}
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div
            ref={bodyRef}
            className="mt-1.5 ml-2 max-h-48 overflow-y-auto border-l-2 pl-4 text-[13px] leading-relaxed whitespace-pre-wrap text-muted-foreground [scrollbar-width:thin]"
          >
            {text}
            {streaming && !reduce && (
              <span aria-hidden className="ml-px inline-block h-3 w-1.5 translate-y-0.5 animate-pulse rounded-sm bg-muted-foreground/60" />
            )}
          </div>
        </div>
      </div>

      <p className="sr-only" role="status">
        {streaming ? "Thinking" : label}
      </p>
      <style>{`
        .reasoning-shimmer {
          color: transparent;
          background: linear-gradient(90deg, var(--muted-foreground) 40%, var(--foreground) 50%, var(--muted-foreground) 60%) 0 0 / 250% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          animation: reasoning-shimmer 2s ease-in-out infinite;
        }
        @keyframes reasoning-shimmer {
          from { background-position: 100% 0; }
          to { background-position: 0% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .reasoning-shimmer { animation: none; color: var(--muted-foreground); }
        }
      `}</style>
    </div>
  );
}

export default function ReasoningDemo() {
  return <Reasoning autoPlay />;
}
