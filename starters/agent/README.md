# nextui agent starter

An AI agent chat you can run in one minute and ship in a day. Built with Next.js, the [AI SDK](https://ai-sdk.dev) and the agent components from [nextui.dev](https://nextui.dev).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftini-coder%2Fnextui&root-directory=starters%2Fagent&project-name=agent-starter&repository-name=agent-starter)

What you get out of the box:

- **Tool calls** stream their arguments, show a running state, then the result ([tool-call](https://nextui.dev/components/tool-call))
- **Approvals** stop the agent before anything with side effects, with the exact arguments on screen ([tool-approval](https://nextui.dev/components/tool-approval))
- **Citations** turn `[1]` markers into chips that point at the search results ([sources](https://nextui.dev/components/sources))
- **Reasoning** is live while the model thinks, then folds into "Thought for Ns" ([reasoning](https://nextui.dev/components/reasoning))
- **Streaming** answers fade in word by word, with steady code blocks, Copy, Stop and Regenerate ([streaming-message](https://nextui.dev/components/streaming-message))
- **A chat frame** that sticks to the newest message and lets you scroll up in peace ([conversation-shell](https://nextui.dev/components/conversation-shell))
- [agent-timeline](https://nextui.dev/components/agent-timeline) and [artifact-panel](https://nextui.dev/components/artifact-panel) are included for when your agent runs longer jobs or writes files.

## Run it

```bash
npx degit tini-coder/nextui/starters/agent my-agent
cd my-agent
npm install
npm run dev
```

Open http://localhost:3000. With no API key the chat answers with a scripted **demo model**, so you can click through every state: ask a question to see search + citations, or ask it to email someone to see an approval.

## Use a real model

1. Create an [AI Gateway](https://vercel.com/ai-gateway) key and put it in `.env.local`:

   ```bash
   cp .env.example .env.local
   # AI_GATEWAY_API_KEY=...
   ```

2. Restart `npm run dev`. The default model is `anthropic/claude-sonnet-5.5`. Set `MODEL` to any gateway model id to switch.

Deployed on Vercel, the gateway authenticates on its own, so you don't need the key there.

## Make it yours

| File | What to change |
| --- | --- |
| `lib/agent/tools.ts` | The agent's tools and instructions. `send_email` only pretends to send: wire it to Resend, Postmark or SES. |
| `lib/agent/docs.ts` | The tiny in-memory knowledge base behind `search_docs`. Swap in your own search. |
| `components/chat/message-parts.tsx` | How each AI SDK message part maps to a component. Add a case per new tool. |
| `app/api/chat/route.ts` | Model, step limit, reasoning effort, approval secret. |
| `lib/agent/demo-model.ts` | Delete it once you have a key (and the fallback in the route). |
| `app/globals.css` | Colors. Generate a palette at [nextui.dev/themes](https://nextui.dev/themes). |

Tools listed in `toolApproval` run only after the user presses Approve. For anything sensitive, set `TOOL_APPROVAL_SECRET` so the server can verify that approvals really came from it.

## More components

The components in `components/nextui` are plain React + Tailwind files, copied from [`registry/components`](../../registry/components) in this repo (MIT): edit them freely. More agent UI (voice orb, thinking states, task checklist, chat input, full templates) is at [nextui.dev](https://nextui.dev), installable with the shadcn CLI:

```bash
npx shadcn add @nextui/<name>
```
