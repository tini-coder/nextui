"use client";

import type { ToolCallState } from "@/components/nextui/tool-call";
import { ToolCall } from "@/components/nextui/tool-call";
import { ToolApproval } from "@/components/nextui/tool-approval";
import { Reasoning } from "@/components/nextui/reasoning";
import { Sources, type Source } from "@/components/nextui/sources";
import { StreamingMessage } from "@/components/nextui/streaming-message";
import type { AgentMessage } from "@/lib/agent/types";

type Part = AgentMessage["parts"][number];

type Props = {
  message: AgentMessage;
  /** True for the newest assistant message while the agent is still answering. */
  live: boolean;
  onStop?: () => void;
  onRegenerate?: () => void;
  onApproval: (id: string, approved: boolean) => void;
};

/** The AI SDK has more tool states than the card shows; fold the approval ones into "running". */
function cardState(state: string): ToolCallState {
  if (state === "input-streaming" || state === "output-available" || state === "output-error") return state;
  return "input-available";
}

/** Results of the newest search in this message, used to turn [n] markers into citations. */
function latestSources(parts: Part[]): Source[] | null {
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i];
    if (p.type === "tool-search_docs" && p.state === "output-available") return p.output;
  }
  return null;
}

/** Renders one assistant message: reasoning, tool calls, approvals, then the streamed answer with citations. */
export function AssistantParts({ message, live, onStop, onRegenerate, onApproval }: Props) {
  const sources = latestSources(message.parts);
  const lastText = message.parts.findLastIndex((p) => p.type === "text");

  return (
    <div className="flex flex-col gap-3">
      {message.parts.map((part, i) => {
        const key = `${message.id}-${i}`;
        switch (part.type) {
          case "reasoning":
            if (!part.text.trim()) return null;
            return <Reasoning key={key} part={part} />;

          case "tool-search_docs":
            return <ToolCall key={key} defaultOpen={false} name="search_docs" state={cardState(part.state)} input={part.input} output={part.output} errorText={part.errorText} />;

          case "tool-send_email": {
            const details = part.input ? { To: part.input.to, Subject: part.input.subject, Body: part.input.body } : undefined;
            if (part.state === "approval-requested" && !part.approval.isAutomatic)
              return (
                <ToolApproval
                  key={key}
                  title="Send this email?"
                  description="The agent wrote it for you. Nothing is sent until you approve."
                  toolName="send_email"
                  details={details}
                  status="pending"
                  onApprove={() => onApproval(part.approval.id, true)}
                  onDeny={() => onApproval(part.approval.id, false)}
                />
              );
            if (part.state === "output-denied" || (part.state === "approval-responded" && !part.approval.approved))
              return <ToolApproval key={key} title="Send this email?" toolName="send_email" details={details} status="denied" />;
            if (part.state === "approval-responded")
              return <ToolApproval key={key} title="Send this email?" toolName="send_email" details={details} status="approved" />;
            return <ToolCall key={key} defaultOpen={false} name="send_email" state={cardState(part.state)} input={part.input} output={part.output} errorText={part.errorText} />;
          }

          case "text": {
            const streaming = live && part.state === "streaming";
            // Once the answer is complete and cites the search, show it with citation chips.
            if (!streaming && sources?.length && /\[\d+\]/.test(part.text)) return <Sources key={key} answer={part.text} sources={sources} />;
            return (
              <StreamingMessage
                key={key}
                text={part.text}
                streaming={streaming}
                onStop={streaming ? onStop : undefined}
                onRegenerate={!live && i === lastText ? onRegenerate : undefined}
              />
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
}
