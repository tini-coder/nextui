# Conversation shell (`conversation-shell`)

App frame for an AI agent chat: a top bar with breadcrumb, search and Ask AI over a chat panel, a message list that sticks to the newest message while it streams, a jump-to-latest button once you scroll up, an empty state with suggestions, and a growing composer with Send / Stop.

- Kind: component, category: AI & agents
- Live preview: https://nextui.dev/components/conversation-shell
- Install: `npm create nextui add conversation-shell`
- npm dependencies: lucide-react, motion
- shadcn dependencies: utils

## Usage

```tsx
"use client";

import { useChat } from "@ai-sdk/react";
import { ConversationShell } from "@/components/nextui/conversation-shell";
import { StreamingMessage } from "@/components/nextui/streaming-message";
import { ToolCall } from "@/components/nextui/tool-call";

export function Chat() {
  const { messages, sendMessage, status, stop } = useChat();

  return (
    <ConversationShell
      busy={status === "submitted" || status === "streaming"}
      onStop={stop}
      onSend={(text) => sendMessage({ text })}
      messages={messages.map((m) => ({
        id: m.id,
        role: m.role === "user" ? "user" : "assistant",
        content: m.parts.map((part, i) =>
          part.type === "text" ? (
            m.role === "user" ? part.text : <StreamingMessage key={i} part={part} />
          ) : part.type.startsWith("tool-") ? (
            <ToolCall key={i} part={part as never} />
          ) : null,
        ),
      }))}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `messages` | `{ id: string; role: "user" \| "assistant"; content: ReactNode }[]` |  | The thread, oldest first; content can be text or any primitive |
| `onSend` | `(text: string) => void` |  | Called with the composer text on Enter or Send; also called by suggestion chips |
| `busy` | `boolean` | `false` | The agent is answering: Send becomes Stop and sending is blocked |
| `onStop` | `() => void` |  | Called by the Stop button |
| `suggestions` | `string[]` |  | Prompts on the empty state |
| `emptyTitle` | `ReactNode` | `"What should the agent do?"` | Heading of the empty state |
| `placeholder` | `string` | `"Ask the agent…"` | Composer placeholder |
| `title` | `string` | `"Launch planning"` | Title of the open chat, shown in the top bar breadcrumb |
| `brand` | `string` | `"Agent"` | Product name next to the logo |
| `onAskAI` | `() => void` |  | Called by the Ask AI button in the top bar |
| `autoPlay` | `boolean` | `false` | Play a scripted two-turn chat on a loop while on screen, for demos |
| `className` | `string` |  | Extra classes on the frame; set the height here (default h-[600px]) |

## When to use

- An app frame: a top bar with brand, breadcrumb, search and Ask AI over a white chat panel; the search and buttons hide as the frame gets narrow
- The frame around every other agent primitive: put streaming messages, tool calls, approvals and sources inside messages
- It follows new content only while the reader is at the bottom; scrolling up to reread stops the jump and shows a jump-to-latest button
- Enter sends, Shift+Enter adds a line, and the composer grows with its text

## Accessibility

- Messages are an ordered list in a polite live region and are marked aria-busy while the agent answers
- Each message has a hidden "You:" or "Agent:" prefix for screen readers
- Send, Stop and jump-to-latest are labelled buttons; IME composition never sends early

## Source

Prefer the install command; it also pulls the shadcn dependencies. The source is here for reading and for projects without network access.

`components/nextui/conversation-shell.tsx`

```tsx
"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Bell, Search, Sparkles, Square, Wrench } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type ConversationMessage = {
  id: string;
  role: "user" | "assistant";
  /** Plain text, or any element: a streaming message, a tool call, an approval card. */
  content: React.ReactNode;
};

export type ConversationShellProps = {
  messages?: ConversationMessage[];
  /** Called with the composer text when the user sends. */
  onSend?: (text: string) => void;
  /** True while the agent is answering: the send button becomes Stop. */
  busy?: boolean;
  onStop?: () => void;
  /** Prompts shown on the empty state; clicking one sends it. */
  suggestions?: string[];
  /** Heading of the empty state. */
  emptyTitle?: React.ReactNode;
  placeholder?: string;
  /** Title of the open chat, shown in the top bar. */
  title?: string;
  /** Product name next to the logo. */
  brand?: string;
  /** Called by the Ask AI button in the top bar. */
  onAskAI?: () => void;
  /** Play a scripted two-turn chat on a loop while on screen, for demos. */
  autoPlay?: boolean;
  className?: string;
};

const SUGGESTIONS = ["Summarize this week's launch tasks", "Draft a Product Hunt tagline", "What changed in v2?"];

const DEMO_REPLY_1 =
  "Three things are left before launch: record the demo clips, finish the starter repo, and schedule the Product Hunt post for Tuesday. The clips are the long pole, so start there.";
const DEMO_ASK_2 = "Draft a Product Hunt tagline";
const DEMO_REPLY_2 =
  "Agent UI components for React & Tailwind: tool calls, approvals, sources and streaming, ready to copy into your app.";

// Demo loop, in ms.
const PICK = 1600;
const R1 = PICK + 500;
const WORD_MS = 75;
const R1_END = R1 + DEMO_REPLY_1.split(" ").length * WORD_MS;
const TYPE2 = R1_END + 700;
const CHAR_MS = 32;
const SEND2 = TYPE2 + DEMO_ASK_2.length * CHAR_MS + 300;
const R2 = SEND2 + 500;
const R2_END = R2 + DEMO_REPLY_2.split(" ").length * WORD_MS;
const LOOP = R2_END + 3600;
const TICK = 50;

function words(text: string, n: number) {
  return text.split(" ").slice(0, Math.max(0, n)).join(" ");
}

function demoState(t: number): { messages: ConversationMessage[]; draft: string; busy: boolean; picking: boolean } {
  const messages: ConversationMessage[] = [];
  if (t >= PICK) messages.push({ id: "u1", role: "user", content: SUGGESTIONS[0] });
  if (t >= R1) messages.push({ id: "a1", role: "assistant", content: words(DEMO_REPLY_1, Math.floor((t - R1) / WORD_MS) + 1) });
  if (t >= SEND2) messages.push({ id: "u2", role: "user", content: DEMO_ASK_2 });
  if (t >= R2) messages.push({ id: "a2", role: "assistant", content: words(DEMO_REPLY_2, Math.floor((t - R2) / WORD_MS) + 1) });
  const draft = t >= TYPE2 && t < SEND2 ? DEMO_ASK_2.slice(0, Math.floor((t - TYPE2) / CHAR_MS)) : "";
  const busy = (t >= PICK && t < R1_END) || (t >= SEND2 && t < R2_END);
  return { messages, draft, busy, picking: t >= PICK - 450 && t < PICK };
}

function Logo() {
  return (
    <span className="grid size-6 place-items-center rounded-md bg-foreground text-background" aria-hidden>
      <Sparkles className="size-3.5" />
    </span>
  );
}

/**
 * An app frame for an agent chat: a top bar with breadcrumb and search over a chat panel,
 * with a message list that sticks to the newest message, with a jump-to-latest button,
 * an empty state and a composer.
 */
export function ConversationShell({
  messages: messagesProp,
  onSend,
  busy: busyProp = false,
  onStop,
  suggestions = SUGGESTIONS,
  emptyTitle = "What should the agent do?",
  placeholder = "Ask the agent…",
  title = "Launch planning",
  brand = "Agent",
  onAskAI,
  autoPlay = false,
  className,
}: ConversationShellProps) {
  const ref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [tick, setTick] = useState(0);
  const [draft, setDraft] = useState("");
  const [atBottom, setAtBottom] = useState(true);
  const stick = useRef(true);

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
  }, [autoPlay, visible, reduce]);

  const demo = autoPlay ? demoState(reduce ? LOOP - 1 : tick) : null;
  const messages = demo?.messages ?? messagesProp ?? [];
  const busy = demo?.busy ?? busyProp;
  const shownDraft = demo && demo.draft ? demo.draft : draft;

  const scrollToBottom = useCallback(
    (smooth: boolean) => {
      const el = scrollRef.current;
      if (!el) return;
      el.scrollTo({ top: el.scrollHeight, behavior: smooth && !reduce ? "smooth" : "auto" });
    },
    [reduce],
  );

  // Follow new content while the reader is at the bottom; leave them alone once they scroll up.
  useLayoutEffect(() => {
    const inner = contentRef.current;
    if (!inner) return;
    const ro = new ResizeObserver(() => {
      if (stick.current) scrollToBottom(false);
    });
    ro.observe(inner);
    return () => ro.disconnect();
  }, [scrollToBottom]);

  function onScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const near = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
    stick.current = near;
    setAtBottom(near);
  }

  function send(text: string) {
    const value = text.trim();
    if (!value || busy) return;
    onSend?.(value);
    setDraft("");
    stick.current = true;
    setAtBottom(true);
  }

  // Grow the composer with its text, up to a cap.
  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [shownDraft]);

  const empty = messages.length === 0;

  return (
    <div
      ref={ref}
      className={cn(
        "@container flex h-[600px] w-full flex-col overflow-hidden rounded-2xl border bg-muted/50 text-foreground shadow-xs",
        className,
      )}
    >
      <header className="flex h-14 shrink-0 items-center gap-2.5 px-3 @[560px]:px-4">
        <Logo />
        <span className="hidden text-sm font-semibold tracking-tight @[480px]:inline">{brand}</span>
        <span className="hidden h-4 w-px bg-border @[480px]:block" aria-hidden />
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
          <span className="hidden text-muted-foreground @[640px]:inline">Chats</span>
          <span className="hidden text-muted-foreground/50 @[640px]:inline" aria-hidden>
            /
          </span>
          <span className="truncate font-medium" aria-current="page">
            {title}
          </span>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <label className="hidden h-8 w-56 items-center gap-2 rounded-full border bg-background px-3 text-xs text-muted-foreground shadow-xs focus-within:ring-2 focus-within:ring-ring @[820px]:flex">
            <Search className="size-3.5 shrink-0" aria-hidden />
            <input placeholder="Search for something…" aria-label="Search chats" className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground" />
          </label>
          <button
            type="button"
            onClick={onAskAI}
            className="hidden h-8 items-center gap-1.5 rounded-full bg-foreground px-3 text-xs font-medium text-background outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 @[560px]:flex"
          >
            <Sparkles className="size-3.5" aria-hidden />
            Ask AI
          </button>
          <button
            type="button"
            aria-label="Notifications"
            className="relative grid size-8 place-items-center rounded-full border bg-background text-muted-foreground shadow-xs outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Bell className="size-3.5" aria-hidden />
            <span className="absolute top-1.5 right-2 size-1.5 rounded-full bg-red-500" aria-hidden />
          </button>
        </div>
      </header>

      <section className="mx-2 mb-2 flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border bg-background shadow-xs @[560px]:mx-3 @[560px]:mb-3">
        <div className="relative min-h-0 flex-1">
          <div ref={scrollRef} onScroll={onScroll} className="h-full overflow-y-auto [scrollbar-width:thin]">
            <div ref={contentRef} className="mx-auto flex min-h-full w-full max-w-2xl flex-col px-4 py-5 @[720px]:px-6">
              {empty ? (
                <div className="m-auto flex flex-col items-center gap-4 text-center">
                  <span className="grid size-11 place-items-center rounded-xl border bg-card shadow-xs" aria-hidden>
                    <Sparkles className="size-5" />
                  </span>
                  <div>
                    <p className="text-base font-semibold tracking-tight">{emptyTitle}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Pick a prompt or write your own.</p>
                  </div>
                  <div className="flex max-w-md flex-wrap justify-center gap-2">
                    {suggestions.map((s, i) => (
                      <motion.button
                        key={s}
                        type="button"
                        onClick={() => send(s)}
                        animate={demo?.picking && i === 0 ? { scale: [1, 0.95, 1] } : { scale: 1 }}
                        transition={{ duration: 0.45 }}
                        className={cn(
                          "rounded-full border bg-card px-3 py-1.5 text-xs text-muted-foreground shadow-xs outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
                          demo?.picking && i === 0 && "bg-muted text-foreground",
                        )}
                      >
                        {s}
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : (
                <ol className="flex flex-col gap-5" aria-live="polite" aria-busy={busy}>
                  <AnimatePresence initial={false}>
                    {messages.map((m) => (
                      <motion.li
                        key={m.id}
                        initial={reduce ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className={cn("flex gap-3", m.role === "user" && "justify-end")}
                      >
                        {m.role === "assistant" && (
                          <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-foreground text-background" aria-hidden>
                            <Sparkles className="size-3.5" />
                          </span>
                        )}
                        <div
                          className={cn(
                            "min-w-0 text-sm leading-relaxed",
                            m.role === "user" ? "max-w-[80%] rounded-2xl rounded-br-md bg-muted px-3.5 py-2" : "flex-1 pt-1",
                          )}
                        >
                          <span className="sr-only">{m.role === "user" ? "You: " : "Agent: "}</span>
                          {m.content}
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ol>
              )}
            </div>
          </div>

          <AnimatePresence>
            {!atBottom && !empty && (
              <motion.button
                type="button"
                onClick={() => {
                  stick.current = true;
                  setAtBottom(true);
                  scrollToBottom(true);
                }}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: 6 }}
                transition={{ duration: 0.2 }}
                aria-label="Jump to latest message"
                className="absolute bottom-3 left-1/2 grid size-8 -translate-x-1/2 place-items-center rounded-full border bg-background shadow-md outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ArrowDown className="size-4" aria-hidden />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(draft);
          }}
          className="mx-auto w-full max-w-2xl px-4 pb-4 @[720px]:px-6"
        >
          <div className="rounded-2xl border bg-card p-2 shadow-sm focus-within:ring-2 focus-within:ring-ring">
            <textarea
              ref={inputRef}
              rows={1}
              value={shownDraft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  send(draft);
                }
              }}
              placeholder={placeholder}
              aria-label="Message"
              className="block min-h-9 w-full resize-none bg-transparent px-2 py-1.5 text-sm leading-relaxed outline-none placeholder:text-muted-foreground"
            />
            <div className="flex items-center gap-1.5 px-1">
              <span className="flex h-7 items-center gap-1.5 rounded-md border px-2 text-[11px] text-muted-foreground">
                <Wrench className="size-3" aria-hidden />3 tools
              </span>
              <span className="ml-auto hidden text-[11px] text-muted-foreground @[560px]:inline">Enter to send · Shift+Enter for a new line</span>
              {busy ? (
                <button
                  type="button"
                  onClick={onStop}
                  aria-label="Stop"
                  className="ml-auto grid size-8 shrink-0 place-items-center rounded-lg bg-foreground text-background outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 @[560px]:ml-2"
                >
                  <Square className="size-3 fill-current" aria-hidden />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!shownDraft.trim()}
                  aria-label="Send"
                  className="ml-auto grid size-8 shrink-0 place-items-center rounded-lg bg-foreground text-background outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-30 @[560px]:ml-2"
                >
                  <ArrowUp className="size-4" aria-hidden />
                </button>
              )}
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}

export default function ConversationShellDemo() {
  return <ConversationShell autoPlay />;
}
```
