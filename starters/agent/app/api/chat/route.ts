import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  isStepCount,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { demoModel } from "@/lib/agent/demo-model";
import { instructions, toolApproval, tools } from "@/lib/agent/tools";

export const maxDuration = 60;

// The real model runs once you opt in: set AI_GATEWAY_API_KEY, or set MODEL on Vercel, where the
// gateway signs in with the deployment's OIDC token. Until then the scripted demo model answers,
// so a fresh clone or a one-click deploy works with no setup.
const useGateway = Boolean(process.env.AI_GATEWAY_API_KEY || process.env.MODEL);

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    // Any Vercel AI Gateway model id. Set MODEL to switch without touching code.
    model: useGateway ? process.env.MODEL || "anthropic/claude-sonnet-5.5" : demoModel,
    instructions,
    messages: await convertToModelMessages(messages),
    tools,
    toolApproval,
    experimental_toolApprovalSecret: process.env.TOOL_APPROVAL_SECRET || undefined,
    reasoning: "low",
    stopWhen: isStepCount(6),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      sendReasoning: true,
      originalMessages: messages,
      // Show the real reason (bad key, no gateway credits, unknown model) instead of "An error occurred".
      onError: (error) => (error instanceof Error ? error.message : String(error)),
    }),
  });
}
