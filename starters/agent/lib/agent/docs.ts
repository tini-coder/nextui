/**
 * A tiny in-memory knowledge base so the starter runs with no database.
 * Swap `searchDocs` for your own search (Postgres full text, a vector store, a web search API).
 */
export type Doc = { url: string; title: string; snippet: string; body: string };

export const DOCS: Doc[] = [
  {
    url: "https://nextui.dev/components/tool-call",
    title: "Tool call",
    snippet: "Show the tool name, the arguments as they stream in, a running state, then the result.",
    body: "tool call card arguments streaming running result agent transparency json input output error",
  },
  {
    url: "https://nextui.dev/components/tool-approval",
    title: "Tool approval",
    snippet: "Stop before anything hard to undo and show the exact arguments that will run.",
    body: "approval human in the loop confirm side effects send email payment delete approve deny",
  },
  {
    url: "https://nextui.dev/components/sources",
    title: "Sources",
    snippet: "Citation chips beside each claim, with a list of sources the reader can open.",
    body: "sources citations references grounding trust links answer chips rag search",
  },
  {
    url: "https://nextui.dev/components/reasoning",
    title: "Reasoning",
    snippet: "Open and live while the model thinks, folded into 'Thought for Ns' after.",
    body: "reasoning thinking tokens chain of thought collapse duration model thinking",
  },
  {
    url: "https://nextui.dev/components/streaming-message",
    title: "Streaming message",
    snippet: "Words fade in as they arrive; code fences render as blocks straight away.",
    body: "streaming message markdown tokens words fade code block copy regenerate stop",
  },
  {
    url: "https://nextui.dev/components/conversation-shell",
    title: "Conversation shell",
    snippet: "A chat frame that sticks to the newest message, with a jump-to-latest button and a growing composer.",
    body: "chat frame conversation shell scroll stick to bottom composer empty state suggestions layout",
  },
  {
    url: "https://ai-sdk.dev/docs/ai-sdk-ui/chatbot-tool-usage",
    title: "Chatbot tool usage (AI SDK)",
    snippet: "Tool parts carry their state, so the UI can render input while it streams and output when it lands.",
    body: "ai sdk usechat tool parts state input-streaming output-available approval-requested sendAutomaticallyWhen",
  },
  {
    url: "https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling",
    title: "Tools and tool calling (AI SDK)",
    snippet: "Define tools with a schema and an execute function; require approval for tools with side effects.",
    body: "tools tool calling zod schema execute toolApproval user-approval multi step stopWhen",
  },
];

/** Scores each doc by how many query words it contains and returns the best matches, in rank order. */
export function searchDocs(query: string, limit = 3) {
  const words = query.toLowerCase().split(/\W+/).filter((w) => w.length > 2);
  return DOCS.map((doc) => {
    const hay = `${doc.title} ${doc.snippet} ${doc.body}`.toLowerCase();
    return { doc, score: words.filter((w) => hay.includes(w)).length };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ doc }) => ({ url: doc.url, title: doc.title, snippet: doc.snippet }));
}
