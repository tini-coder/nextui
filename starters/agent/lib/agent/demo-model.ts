import type { LanguageModelV4, LanguageModelV4CallOptions, LanguageModelV4StreamPart } from "@ai-sdk/provider";

/**
 * A scripted model so the starter runs before you add an API key.
 * It searches for questions, drafts an email when asked to send one, and answers with citations.
 * The route uses it only when no AI Gateway key is configured. Delete this file once you have a key.
 */

type Prompt = LanguageModelV4CallOptions["prompt"];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function lastUserText(prompt: Prompt): string {
  for (let i = prompt.length - 1; i >= 0; i--) {
    const m = prompt[i];
    if (m.role === "user") return m.content.map((c) => (c.type === "text" ? c.text : "")).join(" ");
  }
  return "";
}

/** The tool result the model is answering, if the last message is one. */
function lastToolResult(prompt: Prompt) {
  const m = prompt.at(-1);
  if (m?.role !== "tool") return null;
  const r = m.content.find((c) => c.type === "tool-result");
  return r && r.type === "tool-result" ? r : null;
}

function words(text: string) {
  return text.match(/\S+\s*/g) ?? [];
}

function script(prompt: Prompt): LanguageModelV4StreamPart[] {
  const parts: LanguageModelV4StreamPart[] = [];
  const think = (text: string) => {
    parts.push({ type: "reasoning-start", id: "r" });
    for (const w of words(text)) parts.push({ type: "reasoning-delta", id: "r", delta: w });
    parts.push({ type: "reasoning-end", id: "r" });
  };
  const say = (text: string) => {
    parts.push({ type: "text-start", id: "t" });
    for (const w of words(text)) parts.push({ type: "text-delta", id: "t", delta: w });
    parts.push({ type: "text-end", id: "t" });
  };
  const call = (toolName: string, input: object) =>
    parts.push({ type: "tool-call", toolCallId: `call_${Math.random().toString(36).slice(2, 10)}`, toolName, input: JSON.stringify(input) });
  const finish = (unified: "stop" | "tool-calls") =>
    parts.push({
      type: "finish",
      finishReason: { unified, raw: undefined },
      usage: {
        inputTokens: { total: 0, noCache: 0, cacheRead: undefined, cacheWrite: undefined },
        outputTokens: { total: 0, text: 0, reasoning: undefined },
      },
    });

  const result = lastToolResult(prompt);
  if (result?.toolName === "search_docs") {
    const out = result.output.type === "json" && Array.isArray(result.output.value) ? result.output.value : [];
    if (out.length === 0) say("I couldn't find anything on that in the docs. Try asking about tool calls, approvals, sources or streaming.");
    else
      say(
        `Show people what the agent is doing while it does it [1]. ${out.length > 1 ? "Stream each step as it happens, so nobody stares at a spinner [2]." : ""} ${out.length > 2 ? "And ask before anything hard to undo [3]." : ""}\n\nThis is the demo model. Add an AI Gateway key to get real answers.`.replace(/\s+\n/g, "\n"),
      );
    finish("stop");
    return parts;
  }
  if (result?.toolName === "send_email") {
    const denied = result.output.type === "execution-denied";
    say(denied ? "Okay, I didn't send it. Want me to change anything in the draft?" : "Done, the email is sent. (In this starter, sending is simulated: wire `send_email` to Resend or Postmark to make it real.)");
    finish("stop");
    return parts;
  }

  const ask = lastUserText(prompt);
  const email = ask.match(/[\w.+-]+@[\w-]+\.[\w.]+/)?.[0];
  if (/\b(email|mail|send)\b/i.test(ask)) {
    think("The user wants an email sent. Sending can't be undone, so I'll draft it and ask for approval before the tool runs.");
    call("send_email", {
      to: email ?? "team@example.com",
      subject: "Launch update",
      body: "Hi team, the agent UI is in: tool calls, approvals and citations all work. Demo is up on staging today. Feedback welcome before Friday.",
    });
    finish("tool-calls");
    return parts;
  }

  think("This is a question about agent UI. I'll search the docs first so I can cite where the answer comes from.");
  call("search_docs", { query: ask.slice(0, 80) || "agent ui" });
  finish("tool-calls");
  return parts;
}

export const demoModel: LanguageModelV4 = {
  specificationVersion: "v4",
  provider: "demo",
  modelId: "scripted",
  supportedUrls: {},
  async doGenerate() {
    throw new Error("The demo model only streams.");
  },
  async doStream(options) {
    const chunks = script(options.prompt);
    const stream = new ReadableStream<LanguageModelV4StreamPart>({
      async start(controller) {
        controller.enqueue({ type: "stream-start", warnings: [] });
        for (const c of chunks) {
          if (c.type === "reasoning-delta" || c.type === "text-delta") await sleep(35);
          else if (c.type === "tool-call") await sleep(300);
          controller.enqueue(c);
        }
        controller.close();
      },
    });
    return { stream };
  },
};
