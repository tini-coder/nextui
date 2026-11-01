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

// On Vercel the gateway authenticates with OIDC; locally it needs AI_GATEWAY_API_KEY.
// Without either, the scripted demo model answers so the UI still works.
const hasGateway = Boolean(process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN || process.env.VERCEL);

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    // Any Vercel AI Gateway model id. Set MODEL to switch without touching code.
    model: hasGateway ? process.env.MODEL || "anthropic/claude-sonnet-5.5" : demoModel,
    instructions,
    messages: await convertToModelMessages(messages),
    tools,
    toolApproval,
    experimental_toolApprovalSecret: process.env.TOOL_APPROVAL_SECRET || undefined,
    reasoning: "low",
    stopWhen: isStepCount(6),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream, sendReasoning: true, originalMessages: messages }),
  });
}
