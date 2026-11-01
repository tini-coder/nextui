"use client";

import { useChat } from "@ai-sdk/react";
import { lastAssistantMessageIsCompleteWithApprovalResponses } from "ai";
import { ConversationShell, type ConversationMessage } from "@/components/nextui/conversation-shell";
import { AssistantParts } from "@/components/chat/message-parts";
import type { AgentMessage } from "@/lib/agent/types";

const SUGGESTIONS = [
  "What should an approval card show?",
  "How do I render tool calls with the AI SDK?",
  "Email team@example.com a 3-line launch update",
];

export function Chat() {
  const { messages, sendMessage, status, stop, regenerate, error, addToolApprovalResponse } = useChat<AgentMessage>({
    // After the user approves or denies, send the answer back so the agent can carry on.
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
  });

  const busy = status === "submitted" || status === "streaming";
  const last = messages.at(-1);

  const thread: ConversationMessage[] = messages.map((m) => ({
    id: m.id,
    role: m.role === "user" ? "user" : "assistant",
    content:
      m.role === "user" ? (
        m.parts.map((p) => (p.type === "text" ? p.text : "")).join("")
      ) : (
        <AssistantParts
          message={m}
          live={busy && m.id === last?.id}
          onStop={stop}
          onRegenerate={() => regenerate()}
          onApproval={(id, approved) => addToolApprovalResponse({ id, approved })}
        />
      ),
  }));

  // Between sending and the first token there is no assistant message yet: show a placeholder.
  if (status === "submitted" && last?.role === "user") {
    thread.push({
      id: "pending",
      role: "assistant",
      content: <span className="animate-pulse text-sm text-muted-foreground">Thinking…</span>,
    });
  }

  if (error) {
    thread.push({
      id: "error",
      role: "assistant",
      content: (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-3.5 py-2.5 text-sm">
          <p className="font-medium text-destructive">Something went wrong.</p>
          <p className="mt-0.5 text-muted-foreground">{error.message}</p>
          <button type="button" onClick={() => regenerate()} className="mt-2 text-xs font-medium underline underline-offset-2">
            Try again
          </button>
        </div>
      ),
    });
  }

  return (
    <ConversationShell
      title={messages.length ? "Agent chat" : "New chat"}
      brand="Agent starter"
      messages={thread}
      busy={busy}
      onStop={stop}
      onSend={(text) => sendMessage({ text })}
      suggestions={SUGGESTIONS}
      emptyTitle="What should the agent do?"
      className="h-full rounded-none border-0 sm:rounded-2xl sm:border"
    />
  );
}
