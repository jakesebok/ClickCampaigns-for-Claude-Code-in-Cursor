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
    : `${COACHING_SYSTEM_PROMPT}\n\n---\nNote: This user has not yet completed their Alignment Blueprints. Be helpful but encourage them to complete onboarding for a fully personalized experience.`;

  const stream = anthropic.messages.stream({
    model,
    max_tokens: 4096,
    cache_control: { type: "ephemeral" },
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

1) VAP Coach — MASTER CONTEXT (v1) — the full operating system
2) ALIGNMENT BLUEPRINT SUMMARY SHEET — a one-page snapshot

Follow the standard template. Replace every bracketed field using the worksheets. If a field is missing, write [NEEDS INPUT]. Keep language strong, clear, high-stakes, emotionally resonant — never marketing fluff.

BLUEPRINT FORMATTING (so it renders well):
- Output the blueprint in clean Markdown. Use ## for section headers (NORTH STAR STACK, TOP 5 VALUES, etc.).
- Use bullet points (-) for list items. Bold key labels (**Driving Fire:**, **Vital Action:**).
- One blank line between sections. No extra prose. Target one page — prioritize clarity and scannability.

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

const PATCH_SYSTEM_PROMPT = `You are Alfred, the Values-Aligned Performance Coach. Your job is to PATCH the user's existing "VAP Coach — MASTER CONTEXT (v1)" without changing its structure.

TASK
Update the Master Context Doc using the update notes the user provides. They may write in natural language (e.g., "My Vital Action is now X", "Target revenue is $Y", "I refined my Driving Fire to...") — map their updates to the correct fields.
You must output TWO things:
1) The updated VAP Coach — MASTER CONTEXT (v1) (same exact headings/order/structure)
2) The updated ALIGNMENT BLUEPRINT SUMMARY SHEET (ONE PAGE)

BLUEPRINT FORMATTING: Use clean Markdown (## for headers, - for bullets, **bold** for key labels). One blank line between sections. No extra prose. Target one page.

RULES
- Preserve the exact structure, headings, and order. Do NOT add or remove sections.
- Only change fields the user explicitly updates.
- If they give natural language updates, infer the correct field (Vital Action, Target Revenue, Driving Fire, etc.).
- Resolve conflicts by priority: Values > Real Reasons Must-Be-True > Driving Fire > Cause Worth Playing For > Becoming > Revenue > Vital Action.
- Keep language strong, clear, high-stakes, emotionally resonant — never marketing fluff.
- If revenue numbers change, recompute dependent math (monthly, weekly, QCs) if needed.
- Do NOT include a PATCH LOG in the output — just the two documents.

Output format (use these exact delimiters):
===MASTER_CONTEXT===
[full updated master context here]
===BLUEPRINT===
[one-page blueprint here]`;

export async function patchMasterContext(
  currentContext: string,
  updateNotes: string
): Promise<{ masterContext: string; blueprint: string }> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8192,
    system: PATCH_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `A) CURRENT MASTER CONTEXT DOC:\n\n${currentContext}\n\n---\n\nB) MY UPDATE NOTES (what I want to change):\n\n${updateNotes}`,
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
