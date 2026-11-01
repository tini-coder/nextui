import type { InferUITools, UIMessage } from "ai";
import type { tools } from "./tools";

export type AgentTools = InferUITools<typeof tools>;
export type AgentMessage = UIMessage<unknown, never, AgentTools>;
