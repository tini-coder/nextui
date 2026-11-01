"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { Check, Copy, RotateCcw, Square } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/** The fields this message reads from an AI SDK text part (`{ type: "text", text, state }`). */
export type TextPartLike = { type: string; text: string; state?: "streaming" | "done" };

export type StreamingMessageProps = {
  /** Markdown-ish text: paragraphs, **bold**, `code`, "- " lists and ``` fenced code. */
  text?: string;
  /** True while tokens are still arriving. */
  streaming?: boolean;
  /** An AI SDK text part; fills text and streaming. */
  part?: TextPartLike;
  /** Shows a Stop button while streaming. */
  onStop?: () => void;
  /** Shows a Regenerate button once done. */
  onRegenerate?: () => void;
  /** Play a scripted reply on a loop while on screen, for demos. */
  autoPlay?: boolean;
  className?: string;
};

const DEMO = `Here's a debounced value hook for your agent's search box. It waits **300 ms** after the last keystroke, so the model only sees finished queries.

\`\`\`tsx
export function useDebounce<T>(value: T, ms = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return debounced;
}
\`\`\`

- Send the debounced value to \`useChat\`, not the raw input
- Keep the input itself controlled so typing never lags`;

// Demo loop, in ms.
const START = 500;
const CHAR_MS = 7;
const HOLD = 3600;
const TICK = 40;

type Block =
  | { kind: "p"; text: string; at: number }
  | { kind: "ul"; items: { text: string; at: number }[] }
  | { kind: "code"; lang: string; code: string; at: number; open: boolean };

/** Split markdown-ish text into blocks. An unclosed fence stays a code block, so streaming code never jumps. */
export function parseBlocks(src: string): Block[] {
  const blocks: Block[] = [];
  const lines = src.split("\n");
  let offset = 0;
  let para: { text: string; at: number } | null = null;
  let list: { text: string; at: number }[] | null = null;
  const flush = () => {
    if (para) blocks.push({ kind: "p", ...para });
    if (list) blocks.push({ kind: "ul", items: list });
    para = null;
    list = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineAt = offset;
    offset += line.length + 1;

    const fence = line.match(/^```(\w*)/);
    if (fence) {
      flush();
      const lang = fence[1];
      const start = offset;
      let j = i + 1;
      const body: string[] = [];
      while (j < lines.length && !lines[j].startsWith("```")) {
        body.push(lines[j]);
        offset += lines[j].length + 1;
        j++;
      }
      const open = j >= lines.length;
      if (!open) offset += lines[j].length + 1;
      blocks.push({ kind: "code", lang, code: body.join("\n"), at: start, open });
      i = j;
      continue;
    }
    if (line.trim() === "") {
      flush();
      continue;
    }
    const item = line.match(/^\s*[-*] (.*)$/);
    if (item) {
      if (para) flush();
      list ??= [];
      list.push({ text: item[1], at: lineAt + line.indexOf(item[1]) });
      continue;
    }
    if (list) flush();
    if (para) para.text += " " + line;
    else para = { text: line, at: lineAt };
  }
  flush();
  return blocks;
}

type Seg = { text: string; at: number; style?: "bold" | "code" };

/** **bold** and `code`; an unclosed marker at the end styles the rest, so text doesn't flash raw asterisks. */
function inline(text: string, at: number): Seg[] {
  const segs: Seg[] = [];
  const re = /\*\*([^*]+)\*\*|`([^`]+)`/g;
  let last = 0;
  for (let m = re.exec(text); m; m = re.exec(text)) {
    if (m.index > last) segs.push({ text: text.slice(last, m.index), at: at + last });
    const inner = m[1] ?? m[2];
    segs.push({ text: inner, at: at + m.index + 2, style: m[1] ? "bold" : "code" });
    last = m.index + m[0].length;
  }
  let rest = text.slice(last);
  let restAt = at + last;
  const open = rest.match(/(\*\*|`)([^*`]*)$/);
  if (open && open.index !== undefined) {
    if (open.index > 0) segs.push({ text: rest.slice(0, open.index), at: restAt });
    if (open[2]) segs.push({ text: open[2], at: restAt + open.index + open[1].length, style: open[1] === "`" ? "code" : "bold" });
    rest = "";
    restAt = 0;
  }
  if (rest) segs.push({ text: rest, at: restAt });
  return segs;
}

/** Each word is keyed by its offset in the source, so only words that just arrived play the fade. */
function Words({ segs, animate }: { segs: Seg[]; animate: boolean }) {
  return (
    <>
      {segs.map((s) => {
        const parts = s.text.split(/(\s+)/);
        let local = 0;
        const words = parts.map((w) => {
          const key = s.at + local;
          local += w.length;
          if (!w.trim()) return <Fragment key={key}>{w}</Fragment>;
          return (
            <span key={key} className={animate ? "streaming-message-word" : undefined}>
              {w}
            </span>
          );
        });
        if (s.style === "bold") return <strong key={s.at} className="font-semibold">{words}</strong>;
        if (s.style === "code")
          return (
            <code key={s.at} className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em]">
              {words}
            </code>
          );
        return <Fragment key={s.at}>{words}</Fragment>;
      })}
    </>
  );
}

function CopyButton({ text, label, className }: { text: string; label: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label={copied ? "Copied" : label}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          // Clipboard can be blocked; nothing to undo.
        }
      }}
      className={cn(
        "grid size-7 place-items-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
    </button>
  );
}

/** An assistant message that streams in word by word, with markdown, steady code blocks and actions when done. */
export function StreamingMessage({
  text: textProp,
  streaming: streamingProp,
  part,
  onStop,
  onRegenerate,
  autoPlay = false,
  className,
}: StreamingMessageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [tick, setTick] = useState(0);

  const STREAM_END = START + DEMO.length * CHAR_MS;
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

  let text = textProp ?? part?.text ?? DEMO;
  let streaming = streamingProp ?? (part ? part.state === "streaming" : false);
  if (autoPlay) {
    const t = reduce ? LOOP - 1 : tick;
    streaming = t < STREAM_END;
    if (streaming) {
      // Cut at a word boundary, the way tokens arrive.
      const chars = Math.max(0, Math.floor((t - START) / CHAR_MS));
      const cut = DEMO.slice(0, chars);
      const space = Math.max(cut.lastIndexOf(" "), cut.lastIndexOf("\n"));
      text = space > 0 ? cut.slice(0, space + 1) : "";
    } else {
      text = DEMO;
    }
  }

  const animate = !reduce;
  const blocks = parseBlocks(text);
  const caret = streaming && !reduce && (
    <span aria-hidden className="ml-0.5 inline-block h-[1em] w-1.5 translate-y-[0.15em] animate-pulse rounded-sm bg-foreground/70" />
  );
  const lastIndex = blocks.length - 1;
  const showStop = streaming && (onStop || autoPlay);
  const showActions = !streaming && text.length > 0;

  return (
    <div ref={ref} className={cn("w-full max-w-lg text-foreground", className)}>
      <div className="space-y-3 text-sm leading-relaxed" aria-busy={streaming}>
        {blocks.length === 0 && caret}
        {blocks.map((b, i) => {
          const end = i === lastIndex ? caret : null;
          if (b.kind === "p")
            return (
              <p key={b.at}>
                <Words segs={inline(b.text, b.at)} animate={animate} />
                {end}
              </p>
            );
          if (b.kind === "ul")
            return (
              <ul key={b.items[0].at} className="list-disc space-y-1 pl-5 marker:text-muted-foreground">
                {b.items.map((it, k) => (
                  <li key={it.at}>
                    <Words segs={inline(it.text, it.at)} animate={animate} />
                    {k === b.items.length - 1 && end}
                  </li>
                ))}
              </ul>
            );
          return (
            <div key={b.at} className="overflow-hidden rounded-lg border bg-muted/50">
              <div className="flex items-center justify-between border-b px-3 py-1">
                <span className="font-mono text-[11px] text-muted-foreground">{b.lang || "code"}</span>
                {!b.open && <CopyButton text={b.code} label="Copy code" className="size-6" />}
              </div>
              <pre className="overflow-x-auto px-3 py-2.5 font-mono text-[12px] leading-[1.6] [scrollbar-width:thin]">
                <code>
                  <Words segs={[{ text: b.code, at: b.at }]} animate={animate} />
                  {b.open && end}
                </code>
              </pre>
            </div>
          );
        })}
      </div>

      <div className="mt-2 h-7">
        <AnimatePresence mode="wait" initial={false}>
          {showStop ? (
            <motion.button
              key="stop"
              type="button"
              onClick={onStop}
              initial={reduce ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Square className="size-2.5 fill-current" aria-hidden />
              Stop
            </motion.button>
          ) : showActions ? (
            <motion.div
              key="actions"
              initial={reduce ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-0.5"
            >
              <CopyButton text={text} label="Copy message" />
              {(onRegenerate || autoPlay) && (
                <button
                  type="button"
                  onClick={onRegenerate}
                  aria-label="Regenerate"
                  className="grid size-7 place-items-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <RotateCcw className="size-3.5" aria-hidden />
                </button>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <style>{`
        .streaming-message-word { animation: streaming-message-in 0.45s ease-out both; }
        @keyframes streaming-message-in {
          from { opacity: 0; filter: blur(2px); }
          to { opacity: 1; filter: blur(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .streaming-message-word { animation: none; }
        }
      `}</style>
    </div>
  );
}

export default function StreamingMessageDemo() {
  return <StreamingMessage autoPlay />;
}
