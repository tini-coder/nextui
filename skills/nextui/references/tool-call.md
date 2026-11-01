# Tool call (`tool-call`)

Collapsible card for one AI agent tool call: the arguments stream in, a status pill shimmers while it runs, then the result slides in. Takes a Vercel AI SDK tool part as is.

- Kind: component, category: AI & agents
- Live preview: https://nextui.dev/components/tool-call
- Install: `npm create nextui add tool-call`
- npm dependencies: lucide-react, motion
- shadcn dependencies: utils

## Usage

```tsx
"use client";

import { useChat } from "@ai-sdk/react";
import { ToolCall } from "@/components/nextui/tool-call";

export function Messages() {
  const { messages } = useChat();

  return messages.map((message) =>
    message.parts.map((part, i) =>
      part.type.startsWith("tool-") ? (
        // Pass the AI SDK tool part as is: name, state, input and output come from it.
        <ToolCall key={i} part={part as never} />
      ) : part.type === "text" ? (
        <p key={i}>{part.text}</p>
      ) : null,
    ),
  );
}

// Or drive it yourself, without the AI SDK:
// <ToolCall name="get_weather" state="output-available" input={{ city: "Hanoi" }} output={{ tempC: 29 }} duration={840} />
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `part` | `ToolPartLike` |  | A Vercel AI SDK tool part (type, state, input, output, errorText); fills the props below |
| `name` | `string` | `"search_web"` | Tool name in the header; read from part.type when you pass part |
| `state` | `"input-streaming" \| "input-available" \| "output-available" \| "output-error"` | `"output-available"` | Where the call is: arguments streaming, running, done or failed |
| `input` | `unknown` |  | Arguments the model sent; objects show as formatted JSON |
| `output` | `unknown` |  | What the tool returned; objects show as JSON, elements render as they are |
| `errorText` | `string` |  | Message shown when state is output-error |
| `duration` | `number` |  | Time the call took in ms, shown as “Done · 1.2s” |
| `autoPlay` | `boolean` | `false` | Loop a scripted call while on screen, for demos |
| `open` | `boolean` |  | Controlled expanded state |
| `defaultOpen` | `boolean` | `true` | Starting expanded state when uncontrolled |
| `onOpenChange` | `(open: boolean) => void` |  | Called when the header is clicked |
| `className` | `string` |  | Extra classes on the wrapper |

## When to use

- Show what an agent is doing between messages: searches, API calls, file reads
- Works with the Vercel AI SDK: pass each tool part from message.parts as part
- Collapse finished calls (defaultOpen={false}) when a turn makes many of them

## Accessibility

- The header is a button with aria-expanded; the body is linked with aria-controls
- A visually hidden status line announces running, finished and failed
- With reduced motion the wrench stops, the shimmer stops and the result appears without sliding

## Source

Prefer the install command; it also pulls the shadcn dependencies. The source is here for reading and for projects without network access.

`components/nextui/tool-call.tsx`

```tsx
"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown, TriangleAlert, Wrench } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/** The states of a tool part in the Vercel AI SDK (`part.state`). */
export type ToolCallState = "input-streaming" | "input-available" | "output-available" | "output-error";

/** The fields this card reads from an AI SDK tool part (`message.parts` entries whose type starts with "tool-"). */
export type ToolPartLike = {
  type: string;
  state: ToolCallState;
  input?: unknown;
  output?: unknown;
  errorText?: string;
};

export type ToolCallProps = {
  /** Tool name shown in the header. Taken from `part.type` ("tool-search_web" → "search_web") when you pass `part`. */
  name?: string;
  state?: ToolCallState;
  /** Arguments the model sent. Objects are shown as formatted JSON. */
  input?: unknown;
  /** What the tool returned. Objects are shown as formatted JSON; strings and elements as they are. */
  output?: unknown;
  errorText?: string;
  /** An AI SDK tool part; fills name, state, input, output and errorText. */
  part?: ToolPartLike;
  /** Time the call took, in ms, shown beside "Done". */
  duration?: number;
  /** Loop a scripted call while on screen. Turn off to drive the props yourself. */
  autoPlay?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

const DEMO_NAME = "search_web";
const DEMO_INPUT = { query: "agent UI patterns 2026", maxResults: 3 };
const DEMO_OUTPUT = [
  { title: "Tool calls the user can read", url: "nextui.dev/components" },
  { title: "Streaming without layout shift", url: "nextui.dev/docs" },
  { title: "Approvals before side effects", url: "nextui.dev/blocks" },
];

// One pass of the demo, in ms.
const TYPE_START = 600;
const CHAR_MS = 28;
const TICK = 50;

function format(value: unknown): string {
  if (value === undefined) return "";
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

/** A collapsible card for one agent tool call: arguments stream in, a status pill runs, then the result lands. */
export function ToolCall({
  name: nameProp,
  state: stateProp,
  input: inputProp,
  output: outputProp,
  errorText: errorProp,
  part,
  duration,
  autoPlay = false,
  open: openProp,
  defaultOpen = true,
  onOpenChange,
  className,
}: ToolCallProps) {
  const ref = useRef<HTMLDivElement>(null);
  const bodyId = useId();
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const open = openProp ?? innerOpen;
  const [tick, setTick] = useState(0);

  const demoInput = format(DEMO_INPUT);
  const typed = TYPE_START + demoInput.length * CHAR_MS;
  const RUN = typed + 1400;
  const LOOP = RUN + 3600;

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

  let name = nameProp ?? (part ? part.type.replace(/^tool-/, "") : DEMO_NAME);
  let state: ToolCallState = stateProp ?? part?.state ?? "output-available";
  let inputText = format(inputProp ?? part?.input);
  let output: unknown = outputProp ?? part?.output;
  const errorText = errorProp ?? part?.errorText;
  let ms = duration;

  if (autoPlay) {
    const t = reduce ? LOOP - 1 : tick;
    name = nameProp ?? DEMO_NAME;
    const chars = Math.max(0, Math.floor((t - TYPE_START) / CHAR_MS));
    inputText = demoInput.slice(0, chars);
    output = <DemoResults />;
    ms = 1240;
    state = t < typed ? "input-streaming" : t < RUN ? "input-available" : "output-available";
  }

  const running = state === "input-streaming" || state === "input-available";
  const failed = state === "output-error";
  const hasOutput = state === "output-available" && output !== undefined;
  const summary = summarize(autoPlay ? DEMO_INPUT : (inputProp ?? part?.input));

  return (
    <div ref={ref} className={cn("w-full max-w-md rounded-xl bg-muted p-1.5 text-foreground", className)}>
      <div className="rounded-lg border bg-card shadow-xs">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={bodyId}
          onClick={() => {
            if (openProp === undefined) setInnerOpen(!open);
            onOpenChange?.(!open);
          }}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <StateIcon state={state} still={!!reduce} />
          <span className="font-mono text-[13px] font-medium">{name}</span>
          {summary && <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">{summary}</span>}
          {!summary && <span className="flex-1" />}
          <StatusPill state={state} ms={ms} still={!!reduce} />
          <ChevronDown
            className={cn("size-3.5 shrink-0 text-muted-foreground transition-transform duration-300", !open && "-rotate-90")}
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
            <div className="space-y-3 border-t px-3 pt-3 pb-3">
              <Section label="Input">
                <pre className="max-h-48 overflow-auto rounded-md bg-muted px-3 py-2 font-mono text-xs leading-relaxed whitespace-pre-wrap text-foreground/90">
                  {inputText}
                  {state === "input-streaming" && !reduce && (
                    <span aria-hidden className="ml-px inline-block h-3.5 w-1.5 translate-y-0.5 animate-pulse bg-foreground/60" />
                  )}
                </pre>
              </Section>

              <AnimatePresence initial={false}>
                {(hasOutput || failed) && (
                  <motion.div
                    key={failed ? "error" : "output"}
                    initial={reduce ? false : { opacity: 0, y: 6, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={reduce ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {failed ? (
                      <Section label="Error">
                        <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">{errorText ?? "The tool call failed."}</p>
                      </Section>
                    ) : (
                      <Section label="Output">
                        {isElement(output) ? (
                          output
                        ) : (
                          <pre className="max-h-56 overflow-auto rounded-md bg-muted px-3 py-2 font-mono text-xs leading-relaxed whitespace-pre-wrap text-foreground/90">
                            {format(output)}
                          </pre>
                        )}
                      </Section>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      <p className="sr-only" role="status">
        {running ? `Running ${name}` : failed ? `${name} failed` : `${name} finished`}
      </p>
      <style>{`
        .tool-call-shimmer {
          color: transparent;
          background: linear-gradient(90deg, var(--muted-foreground) 40%, var(--foreground) 50%, var(--muted-foreground) 60%) 0 0 / 250% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          animation: tool-call-shimmer 2s ease-in-out infinite;
        }
        @keyframes tool-call-shimmer {
          from { background-position: 100% 0; }
          to { background-position: 0% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .tool-call-shimmer { animation: none; color: var(--muted-foreground); }
        }
      `}</style>
    </div>
  );
}

export default function ToolCallDemo() {
  return <ToolCall autoPlay />;
}

/** The demo's result, rendered as a list to show that output can be any element. */
function DemoResults() {
  return (
    <ul className="divide-y rounded-md border text-xs">
      {DEMO_OUTPUT.map((r, i) => (
        <li key={r.title} className="flex items-center gap-2.5 px-3 py-2">
          <span className="grid size-4 shrink-0 place-items-center rounded bg-muted font-mono text-[10px] text-muted-foreground">{i + 1}</span>
          <span className="min-w-0 flex-1 truncate font-medium">{r.title}</span>
          <span className="shrink-0 text-muted-foreground">{r.url}</span>
        </li>
      ))}
    </ul>
  );
}

function isElement(value: unknown): value is React.ReactElement {
  return typeof value === "object" && value !== null && "$$typeof" in value;
}

/** The first short string or number in the input, as a hint next to the tool name. */
function summarize(input: unknown): string {
  if (typeof input === "string") return input;
  if (!input || typeof input !== "object") return "";
  for (const value of Object.values(input)) {
    if (typeof value === "string" || typeof value === "number") return String(value);
  }
  return "";
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
      {children}
    </div>
  );
}

function StatusPill({ state, ms, still }: { state: ToolCallState; ms?: number; still: boolean }) {
  const label =
    state === "input-streaming"
      ? "Preparing"
      : state === "input-available"
        ? "Running"
        : state === "output-error"
          ? "Failed"
          : ms !== undefined
            ? `Done · ${(ms / 1000).toFixed(1)}s`
            : "Done";
  const running = state === "input-streaming" || state === "input-available";

  return (
    <span
      className={cn(
        "relative inline-flex h-5 shrink-0 items-center overflow-hidden rounded-md px-1.5 text-[11px] font-medium tabular-nums",
        state === "output-error" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground",
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={label}
          initial={still ? false : { y: "70%", opacity: 0, filter: "blur(3px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={still ? undefined : { y: "-70%", opacity: 0, filter: "blur(3px)" }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className={cn("inline-block", running && "tool-call-shimmer")}
        >
          {label}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** A wrench that spins gently while running, a filled check when done, a warning when it failed. */
function StateIcon({ state, still }: { state: ToolCallState; still: boolean }) {
  const running = state === "input-streaming" || state === "input-available";
  return (
    <span className="relative grid size-5 shrink-0 place-items-center" aria-hidden>
      <motion.span
        animate={running && !still ? { rotate: [0, -18, 14, 0] } : { rotate: 0 }}
        transition={running && !still ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
        className={cn(
          "absolute grid size-5 place-items-center rounded-md border bg-background text-muted-foreground transition-opacity duration-300",
          running ? "opacity-100" : "opacity-0",
        )}
      >
        <Wrench className="size-3" />
      </motion.span>
      <motion.span
        initial={false}
        animate={state === "output-available" ? { scale: 1, opacity: 1 } : { scale: 0.4, opacity: 0 }}
        transition={still ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 22 }}
        className="absolute grid size-5 place-items-center rounded-md bg-foreground text-background"
      >
        <Check className="size-3" strokeWidth={3} />
      </motion.span>
      <motion.span
        initial={false}
        animate={state === "output-error" ? { scale: 1, opacity: 1 } : { scale: 0.4, opacity: 0 }}
        transition={still ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 22 }}
        className="absolute grid size-5 place-items-center rounded-md bg-destructive text-white"
      >
        <TriangleAlert className="size-3" strokeWidth={2.5} />
      </motion.span>
    </span>
  );
}
```
