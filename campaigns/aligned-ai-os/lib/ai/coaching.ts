import Anthropic from "@anthropic-ai/sdk";
import { COACHING_SYSTEM_PROMPT } from "./prompts";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

type Message = { role: "user" | "assistant"; content: string };

export async function streamCoachingResponse({
  messages,
  masterContext,
  model = "claude-sonnet-4-20250514",
}: {
  messages: Message[];
  masterContext: string | null;
  model?: string;
}) {
  const systemPrompt = masterContext
    ? `${COACHING_SYSTEM_PROMPT}\n\n---\nUSER'S MASTER CONTEXT:\n${masterContext}`
    : `${COACHING_SYSTEM_PROMPT}\n\n---\nNote: This user has not yet completed their context document. Be helpful but encourage them to complete onboarding for a fully personalized experience.`;

  const stream = anthropic.messages.stream({
    model,
    max_tokens: 4096,
    system: systemPrompt,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  return stream;
}

export async function generateContextFromWorksheets(
  worksheetContent: string
): Promise<{ masterContext: string; blueprint: string }> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8192,
    system: `You are an expert Aligned AI Business Agent. Generate TWO documents from the user's worksheets:

1) VAPOS UPGRADE — MASTER CONTEXT (v1) — the full operating system
2) ALIGNMENT BLUEPRINT SUMMARY SHEET — a one-page snapshot

Follow the standard template. Replace every bracketed field using the worksheets. If a field is missing, write [NEEDS INPUT]. Keep language strong, clear, high-stakes, emotionally resonant — never marketing fluff.

Resolve conflicts by priority: Values > Real Reasons Must-Be-True > Driving Fire > Cause Worth Playing For > Becoming > Revenue > Vital Action.

Output format:
===MASTER_CONTEXT===
[full master context here]
===BLUEPRINT===
[one-page blueprint here]`,
    messages: [
      {
        role: "user",
        content: `Here are my completed Strategic Clarity worksheets:\n\n${worksheetContent}`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  const parts = text.split("===BLUEPRINT===");
  const masterContext = parts[0]
    .replace("===MASTER_CONTEXT===", "")
    .trim();
  const blueprint = parts[1]?.trim() || "";

  return { masterContext, blueprint };
}

export async function generateGuidedContext(
  responses: Record<string, string>
): Promise<{ masterContext: string; blueprint: string }> {
  const worksheetContent = Object.entries(responses)
    .map(([key, value]) => `[${key}]\n${value}`)
    .join("\n\n");

  return generateContextFromWorksheets(worksheetContent);
}
