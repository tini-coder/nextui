import { tool } from "ai";
import { z } from "zod";
import { searchDocs } from "./docs";

export const tools = {
  search_docs: tool({
    description: "Search the knowledge base. Returns up to 3 results, each with url, title and snippet.",
    inputSchema: z.object({ query: z.string().describe("What to look for, in a few words") }),
    execute: async ({ query }) => {
      // Simulated latency so the running state is visible. Remove in your app.
      await new Promise((r) => setTimeout(r, 600));
      return searchDocs(query);
    },
  }),

  send_email: tool({
    description: "Send an email on the user's behalf. Always requires the user's approval.",
    inputSchema: z.object({
      to: z.string().describe("Recipient address, or several separated by commas"),
      subject: z.string(),
      body: z.string(),
    }),
    execute: async ({ to, subject }) => {
      // Replace with a real provider (Resend, Postmark, SES). This only pretends to send.
      await new Promise((r) => setTimeout(r, 800));
      return { status: "sent", to, subject, id: crypto.randomUUID().slice(0, 8) };
    },
  }),
};

/** Tools that run only after the user presses Approve. */
export const toolApproval = { send_email: "user-approval" } as const;

export const instructions = `You are a helpful assistant inside an app built with nextui.dev agent components.
- Use search_docs before answering questions about agent UI, the components or the AI SDK.
- When you use search results, cite them inline as [1], [2], [3] in the order search_docs returned them. Cite only the latest search.
- Use send_email only when the user asks you to send something. Write the full email, then call the tool; the user will approve or deny it.
- Keep answers short: a few sentences or a short list. Use markdown code fences for code.`;
