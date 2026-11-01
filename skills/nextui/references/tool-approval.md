# Tool approval (`tool-approval`)

Inline card that asks the user before an AI agent runs a tool with side effects: the question, the tool name, its arguments as rows, and Approve / Deny buttons that settle into an approved or denied line.

- Kind: component, category: AI & agents
- Live preview: https://nextui.dev/components/tool-approval
- Install: `npm create nextui add tool-approval`
- npm dependencies: lucide-react, motion
- shadcn dependencies: utils

## Usage

```tsx
"use client";

import { useChat } from "@ai-sdk/react";
import { ToolApproval } from "@/components/nextui/tool-approval";

// AI SDK 6: give the tool needsApproval: true on the server, then answer the request here.
export function Messages() {
  const { messages, addToolApprovalResponse } = useChat();

  return messages.flatMap((message) =>
    message.parts.map((part, i) =>
      part.type === "tool-send_email" && part.state === "approval-requested" ? (
        <ToolApproval
          key={i}
          title="Send this email?"
          toolName="send_email"
          details={{ To: part.input.to, Subject: part.input.subject }}
          onApprove={() => addToolApprovalResponse({ id: part.approval.id, approved: true })}
          onDeny={() => addToolApprovalResponse({ id: part.approval.id, approved: false })}
        />
      ) : null,
    ),
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | `"Send this email to 3 people?"` | The question, in plain words |
| `description` | `ReactNode` |  | One line on what happens if the user approves |
| `toolName` | `string` | `"send_email"` | Tool name shown as a chip |
| `details` | `Record<string, ReactNode>` |  | Arguments the agent wants to use, shown as label and value rows |
| `status` | `"pending" \| "approved" \| "denied"` |  | Controlled status; leave unset to let the buttons drive it |
| `onApprove` | `() => void` |  | Called when the user approves |
| `onDeny` | `() => void` |  | Called when the user denies |
| `approveLabel` | `string` | `"Approve"` | Text of the approve button |
| `denyLabel` | `string` | `"Deny"` | Text of the deny button |
| `autoPlay` | `boolean` | `false` | Loop a scripted approval while on screen, for demos |
| `className` | `string` |  | Extra classes on the wrapper |

## When to use

- Before an agent does something that is hard to undo: sending, paying, deleting, publishing
- Show the exact arguments so the user approves what will run, not a summary of it
- Pair it with Tool call: approval first, then the tool-call card shows the run

## Accessibility

- Approve and Deny are real buttons with visible focus rings
- The approved or denied line is a status region, so screen readers announce the outcome
- With reduced motion the buttons and outcome swap without sliding

## Source

Prefer the install command; it also pulls the shadcn dependencies. The source is here for reading and for projects without network access.

`components/nextui/tool-approval.tsx`

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ShieldAlert, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type ToolApprovalStatus = "pending" | "approved" | "denied";

export type ToolApprovalProps = {
  /** The question in plain words, e.g. "Send this email to 3 people?" */
  title?: React.ReactNode;
  /** One line on what happens if the user approves. */
  description?: React.ReactNode;
  /** Tool name shown as a chip, e.g. "send_email". */
  toolName?: string;
  /** The arguments the agent wants to run with, shown as label/value rows. */
  details?: Record<string, React.ReactNode>;
  /** Controlled status. Leave unset to let the buttons drive it. */
  status?: ToolApprovalStatus;
  /** Called when the user approves. With the Vercel AI SDK, answer the approval here. */
  onApprove?: () => void;
  /** Called when the user denies. */
  onDeny?: () => void;
  approveLabel?: string;
  denyLabel?: string;
  /** Loop a scripted approval while on screen, for demos. */
  autoPlay?: boolean;
  className?: string;
};

const DEMO = {
  title: "Send this email to 3 people?",
  description: "The agent drafted a reply and wants to send it from your account.",
  toolName: "send_email",
  details: {
    To: "mara@studio.co, +2",
    Subject: "Re: Q4 launch timeline",
    Attachment: "launch-plan.pdf",
  },
};

// Demo loop, in ms: wait, press Approve, hold the approved state, reset.
const PRESS = 2600;
const SETTLE = 3000;
const LOOP = PRESS + SETTLE + 1600;
const TICK = 100;

/** An inline card that asks the user before an agent runs a tool with side effects. */
export function ToolApproval({
  title,
  description,
  toolName,
  details,
  status: statusProp,
  onApprove,
  onDeny,
  approveLabel = "Approve",
  denyLabel = "Deny",
  autoPlay = false,
  className,
}: ToolApprovalProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [inner, setInner] = useState<ToolApprovalStatus>("pending");
  const [visible, setVisible] = useState(false);
  const [tick, setTick] = useState(0);

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
      // A click by the viewer holds until the loop starts over.
      if (t === 0) setInner("pending");
    }, TICK);
    return () => clearInterval(id);
  }, [autoPlay, visible, reduce]);

  const demo = autoPlay;
  const t = reduce ? 0 : tick;
  const scripted: ToolApprovalStatus = t >= PRESS ? "approved" : "pending";
  const status = statusProp ?? (demo && inner === "pending" ? scripted : inner);
  const pressing = demo && !reduce && inner === "pending" && t >= PRESS - 450 && t < PRESS;

  const shownTitle = title ?? DEMO.title;
  const shownDescription = description ?? DEMO.description;
  const shownTool = toolName ?? DEMO.toolName;
  const shownDetails = details ?? DEMO.details;

  function decide(next: ToolApprovalStatus) {
    if (statusProp === undefined) setInner(next);
    if (next === "approved") onApprove?.();
    else onDeny?.();
  }

  return (
    <div ref={ref} className={cn("w-full max-w-md rounded-xl bg-muted p-1.5 text-foreground", className)}>
      <div className="rounded-lg border bg-card p-3.5 shadow-xs">
        <div className="flex items-start gap-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg border bg-background text-foreground" aria-hidden>
            <ShieldAlert className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">{shownTitle}</p>
            {shownDescription && <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{shownDescription}</p>}
          </div>
          {shownTool && (
            <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">{shownTool}</span>
          )}
        </div>

        {Object.keys(shownDetails).length > 0 && (
          <dl className="mt-3 divide-y rounded-md border text-xs">
            {Object.entries(shownDetails).map(([label, value]) => (
              <div key={label} className="flex gap-3 px-3 py-2">
                <dt className="w-20 shrink-0 text-muted-foreground">{label}</dt>
                <dd className="min-w-0 flex-1 truncate font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-3 h-8">
          <AnimatePresence mode="wait" initial={false}>
            {status === "pending" ? (
              <motion.div
                key="ask"
                initial={reduce ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -4, filter: "blur(3px)" }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="flex justify-end gap-2"
              >
                <button
                  type="button"
                  onClick={() => decide("denied")}
                  className="h-8 rounded-md border bg-background px-3 text-xs font-medium text-foreground transition-colors outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {denyLabel}
                </button>
                <motion.button
                  type="button"
                  onClick={() => decide("approved")}
                  animate={pressing ? { scale: [1, 0.94, 1] } : { scale: 1 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="h-8 rounded-md bg-foreground px-3 text-xs font-medium text-background transition-opacity outline-none hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {approveLabel}
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key={status}
                initial={reduce ? false : { opacity: 0, y: 6, filter: "blur(3px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="flex h-8 items-center gap-2 text-xs"
                role="status"
              >
                <motion.span
                  initial={reduce ? false : { scale: 0.4 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 520, damping: 20 }}
                  className={cn(
                    "grid size-5 place-items-center rounded-full",
                    status === "approved" ? "bg-foreground text-background" : "bg-muted text-muted-foreground",
                  )}
                  aria-hidden
                >
                  {status === "approved" ? <Check className="size-3" strokeWidth={3} /> : <X className="size-3" strokeWidth={3} />}
                </motion.span>
                <span className={cn("font-medium", status === "denied" && "text-muted-foreground")}>
                  {status === "approved" ? "Approved. The agent is continuing." : "Denied. The agent won't run this."}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function ToolApprovalDemo() {
  return <ToolApproval autoPlay />;
}
```
