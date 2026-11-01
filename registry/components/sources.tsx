"use client";

import { Fragment, useEffect, useId, useRef, useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/** One source the agent read. Matches the AI SDK `source-url` part: `{ url, title }`. */
export type Source = {
  url: string;
  title?: string;
  /** A line from the page that backs the claim. */
  snippet?: string;
};

export type SourcesProps = {
  /** Answer text. Markers like [1] or [2][3] become citation chips that point into `sources`. */
  answer?: string;
  /** The sources, in citation order: [1] is sources[0]. */
  sources?: Source[];
  /** Label of the list toggle. Defaults to "N sources". */
  label?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Stream the answer, pop in the citations and open the list, on a loop while on screen. */
  autoPlay?: boolean;
  className?: string;
};

const DEMO_ANSWER =
  "Agent interfaces earn trust by showing their work [1]. Streaming each tool call with its arguments lets people follow along while the agent runs [2], and asking before side effects keeps them in control [3]. A citation beside each claim makes the answer easy to check [1][3].";

const DEMO_SOURCES: Source[] = [
  {
    url: "https://nextui.dev/components/tool-call",
    title: "Tool call",
    snippet: "Show the tool name, the arguments as they stream in, a running state, then the result.",
  },
  {
    url: "https://ai-sdk.dev/docs/ai-sdk-ui/chatbot-tool-usage",
    title: "Chatbot tool usage",
    snippet: "Tool parts carry their state, so the UI can render input while it streams and output when it lands.",
  },
  {
    url: "https://nextui.dev/components/tool-approval",
    title: "Tool approval",
    snippet: "Stop before anything hard to undo and show the exact arguments that will run.",
  },
];

// Demo loop, in ms.
const WORD_MS = 70;
const START = 400;
const TICK = 50;

/** "https://www.example.com/a/b" → "example.com" */
export function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function Favicon({ url, className }: { url: string; className?: string }) {
  const domain = domainOf(url);
  return (
    <span
      className={cn(
        "grid size-4 shrink-0 place-items-center rounded-[5px] bg-foreground text-[9px] font-semibold uppercase leading-none text-background",
        className,
      )}
      aria-hidden
    >
      {domain.charAt(0)}
    </span>
  );
}

export type CitationProps = {
  /** 1-based number shown in the chip. */
  n: number;
  source?: Source;
  /** Highlight the chip, e.g. while its row in the list is hovered. */
  active?: boolean;
  onHoverChange?: (hovered: boolean) => void;
  className?: string;
};

/** An inline citation chip. Hover or focus it to see the source. */
export function Citation({ n, source, active, onHoverChange, className }: CitationProps) {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState(false);
  const [below, setBelow] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const tipId = useId();
  const show = (v: boolean) => {
    // Open below the chip when there is no room above it.
    if (v) setBelow((wrapRef.current?.getBoundingClientRect().top ?? 999) < 150);
    setHover(v);
    onHoverChange?.(v);
  };

  const chip = cn(
    "relative ml-1 inline-grid h-[1.15rem] min-w-[1.15rem] -translate-y-px place-items-center rounded-full px-1 align-middle font-mono text-[10px] font-medium leading-none tabular-nums transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
    active || hover ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-foreground hover:text-background",
    className,
  );

  if (!source) return <span className={chip}>{n}</span>;

  return (
    <span ref={wrapRef} className="relative inline-block" onMouseEnter={() => show(true)} onMouseLeave={() => show(false)}>
      <a
        href={source.url}
        target="_blank"
        rel="noreferrer"
        aria-describedby={hover ? tipId : undefined}
        aria-label={`Source ${n}: ${source.title ?? domainOf(source.url)}`}
        onFocus={() => show(true)}
        onBlur={() => show(false)}
        className={chip}
      >
        {n}
      </a>
      <AnimatePresence>
        {hover && (
          <motion.span
            id={tipId}
            role="tooltip"
            initial={reduce ? false : { opacity: 0, y: below ? -4 : 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: below ? -2 : 2 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "pointer-events-none absolute left-1/2 z-20 block w-64 -translate-x-1/2 rounded-lg border bg-popover p-3 text-left text-popover-foreground shadow-lg",
              below ? "top-full mt-2" : "bottom-full mb-2",
            )}
          >
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Favicon url={source.url} />
              {domainOf(source.url)}
            </span>
            {source.title && <span className="mt-1.5 block text-xs font-medium leading-snug">{source.title}</span>}
            {source.snippet && (
              <span className="mt-1 line-clamp-3 block text-xs leading-relaxed text-muted-foreground">{source.snippet}</span>
            )}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

type Piece = { kind: "text"; text: string } | { kind: "cite"; n: number };

/** Split "text [1][2] more" into text and citation pieces. */
export function parseCitations(text: string): Piece[] {
  const out: Piece[] = [];
  const re = /\s?\[(\d+)\]/g;
  let last = 0;
  for (let m = re.exec(text); m; m = re.exec(text)) {
    if (m.index > last) out.push({ kind: "text", text: text.slice(last, m.index) });
    out.push({ kind: "cite", n: Number(m[1]) });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ kind: "text", text: text.slice(last) });
  return out;
}

/** An answer with inline citation chips, and a collapsible list of the sources behind it. */
export function Sources({
  answer,
  sources,
  label,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  autoPlay = false,
  className,
}: SourcesProps) {
  const ref = useRef<HTMLDivElement>(null);
  const listId = useId();
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [tick, setTick] = useState(0);
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const [active, setActive] = useState<number | null>(null);

  const text = answer ?? DEMO_ANSWER;
  const list = sources ?? DEMO_SOURCES;
  const pieces = parseCitations(text);

  // Word count drives the demo timing.
  const words = text.replace(/\s?\[\d+\]/g, "").split(/\s+/).filter(Boolean).length;
  const STREAMED = START + words * WORD_MS;
  const OPEN_AT = STREAMED + 700;
  const LOOP = OPEN_AT + 4200;

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

  const playing = autoPlay && !reduce;
  const shownWords = playing ? Math.max(0, Math.floor((tick - START) / WORD_MS)) : Infinity;
  const open = openProp ?? (playing ? innerOpen || tick >= OPEN_AT : innerOpen);
  const streaming = playing && shownWords < words;

  function toggle() {
    const next = !open;
    if (openProp === undefined) setInnerOpen(next);
    onOpenChange?.(next);
  }

  // Render the answer, cutting it off at the streamed word count.
  let budget = shownWords;
  const body: React.ReactNode[] = [];
  for (let i = 0; i < pieces.length; i++) {
    const p = pieces[i];
    if (p.kind === "text") {
      if (budget <= 0) break;
      const parts = p.text.split(/(\s+)/);
      let acc = "";
      let cut = false;
      for (const part of parts) {
        if (part.trim() === "") {
          acc += part;
          continue;
        }
        if (budget <= 0) {
          cut = true;
          break;
        }
        acc += part;
        budget--;
      }
      body.push(<Fragment key={i}>{acc}</Fragment>);
      if (cut) break;
    } else {
      const src = list[p.n - 1];
      body.push(
        <motion.span
          key={i}
          initial={playing ? { scale: 0.4, opacity: 0 } : false}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 520, damping: 22 }}
          className="inline-block"
        >
          <Citation
            n={p.n}
            source={src}
            active={active === p.n - 1}
            onHoverChange={(h) => setActive(h ? p.n - 1 : null)}
          />
        </motion.span>,
      );
    }
  }

  return (
    <div ref={ref} className={cn("w-full max-w-md text-foreground", className)}>
      <p className="text-sm leading-relaxed">
        {body}
        {streaming && <span className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 animate-pulse rounded-sm bg-foreground/70" aria-hidden />}
      </p>

      {list.length > 0 && (
        <div className="mt-3 rounded-xl bg-muted p-1">
          <button
            type="button"
            onClick={toggle}
            aria-expanded={open}
            aria-controls={listId}
            className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium outline-none transition-colors hover:bg-background/60 focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="flex -space-x-1">
              {list.slice(0, 4).map((s, i) => (
                <Favicon key={i} url={s.url} className="ring-2 ring-muted" />
              ))}
            </span>
            <span>{label ?? `${list.length} ${list.length === 1 ? "source" : "sources"}`}</span>
            <ChevronDown
              className={cn("ml-auto size-3.5 text-muted-foreground transition-transform duration-200", open && "rotate-180")}
              aria-hidden
            />
          </button>
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                id={listId}
                initial={reduce ? false : { height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={reduce ? undefined : { height: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <ol className="mt-1 divide-y rounded-lg border bg-card">
                  {list.map((s, i) => (
                    <li key={i}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        onMouseEnter={() => setActive(i)}
                        onMouseLeave={() => setActive(null)}
                        onFocus={() => setActive(i)}
                        onBlur={() => setActive(null)}
                        className={cn(
                          "group flex items-center gap-2.5 px-3 py-2 text-xs outline-none transition-colors focus-visible:bg-muted",
                          active === i && "bg-muted",
                        )}
                      >
                        <span className="w-3 shrink-0 font-mono text-[10px] tabular-nums text-muted-foreground">{i + 1}</span>
                        <Favicon url={s.url} />
                        <span className="min-w-0 flex-1 truncate font-medium">{s.title ?? domainOf(s.url)}</span>
                        <span className="shrink-0 text-muted-foreground">{domainOf(s.url)}</span>
                        <ExternalLink className="size-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                      </a>
                    </li>
                  ))}
                </ol>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default function SourcesDemo() {
  return <Sources autoPlay />;
}
