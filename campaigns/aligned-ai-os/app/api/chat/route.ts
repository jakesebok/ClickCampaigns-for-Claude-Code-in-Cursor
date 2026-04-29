import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { streamCoachingResponse } from "@/lib/ai/coaching";
import { GUIDED_ONBOARDING_PROMPT } from "@/lib/ai/prompts";
import { formatScorecardCoachContext, formatVapiCoachContext } from "@/lib/ai/coach-context";
import { fetchPortalVapiByEmail, fetchPortalSixCByEmail } from "@/lib/portal-data";
import { hasBillingBypass } from "@/lib/internal-access";

const MAX_MESSAGES_IN_CONTEXT = 20; // Last N messages (10 turns) — keeps context focused and cost-controlled
const MAX_MESSAGE_LENGTH = 4000; // chars per message — prevents abuse and token bloat

// Internal-only kickoff message used when a guided flow needs Alfred to speak
// first. Persisted to the messages table so resumes work, but the chat UI
// filters it out by content match (see chat page).
const ONBOARDING_KICKOFF_USER_MESSAGE = "[Begin guided onboarding]";

export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const { conversationId } = body;
  let { messages } = body;
  const kickoff: boolean = body.kickoff === true;

  // Look up the conversation's mode (server-trusted) to decide whether to use
  // the guided onboarding prompt. Client-provided "mode" is ignored — DB wins.
  let conversationMode: string | null = null;
  if (conversationId) {
    const [convo] = await db
      .select({ mode: schema.conversations.mode })
      .from(schema.conversations)
      .where(eq(schema.conversations.id, conversationId))
      .limit(1);
    conversationMode = convo?.mode ?? null;
  }

  // Kickoff handling: when the chat page loads a guided onboarding conversation
  // for the first time, it sends an empty messages[] with kickoff=true so Alfred
  // can speak first. We synthesize the internal user message here.
  if (kickoff && conversationMode === "onboarding") {
    if (!Array.isArray(messages) || messages.length === 0) {
      messages = [{ role: "user", content: ONBOARDING_KICKOFF_USER_MESSAGE }];
    }
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(
      JSON.stringify({ error: "messages array is required and must not be empty" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const lastMessage = messages[messages.length - 1];
  if (lastMessage?.role !== "user" || typeof lastMessage?.content !== "string") {
    return new Response(
      JSON.stringify({ error: "Last message must be from user with string content" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (lastMessage.content.length > MAX_MESSAGE_LENGTH) {
    return new Response(
      JSON.stringify({
        error: `Message too long. Please keep messages under ${MAX_MESSAGE_LENGTH} characters.`,
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  type ChatMessage = { role: "user" | "assistant"; content: string };
  const trimmedMessages: ChatMessage[] = messages
    .slice(-MAX_MESSAGES_IN_CONTEXT)
    .filter((m: unknown): m is ChatMessage => {
      if (!m || typeof m !== "object") return false;
      const msg = m as { role?: unknown; content?: unknown };
      return (msg.role === "user" || msg.role === "assistant") && typeof msg.content === "string";
    })
    .map((m) => ({
      role: m.role,
      content:
        m.content.length > MAX_MESSAGE_LENGTH
          ? m.content.slice(0, MAX_MESSAGE_LENGTH) + "..."
          : m.content,
    }));

  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.clerkId, clerkId))
    .limit(1);

  if (!user) return new Response("User not found", { status: 404 });

  const bypassBilling = hasBillingBypass(user.email);

  if (
    !bypassBilling &&
    (user.subscriptionStatus === "expired" ||
      user.subscriptionStatus === "canceled")
  ) {
    return new Response(
      JSON.stringify({ error: "Subscription required. Please renew to continue." }),
      { status: 402, headers: { "Content-Type": "application/json" } }
    );
  }

  const [contextDoc] = await db
    .select()
    .from(schema.contextDocuments)
    .where(eq(schema.contextDocuments.userId, user.id))
    .limit(1);

  const [vapiRows, sixCRows] = await Promise.all([
    fetchPortalVapiByEmail(user.email),
    fetchPortalSixCByEmail(user.email),
  ]);

  let enrichedContext = contextDoc?.masterContext || null;
  if (vapiRows.length > 0) {
    enrichedContext = (enrichedContext || "") + formatVapiCoachContext(vapiRows[0]);
  }
  if (sixCRows.length > 0) {
    enrichedContext = (enrichedContext || "") + formatScorecardCoachContext(sixCRows);
  }

  const lastUserMessage = trimmedMessages[trimmedMessages.length - 1];
  if (conversationId && lastUserMessage) {
    await db.insert(schema.messages).values({
      conversationId,
      role: "user",
      content: lastUserMessage.content,
    });
  }

  const isOnboarding = conversationMode === "onboarding";
  const stream = await streamCoachingResponse({
    messages: trimmedMessages,
    // Onboarding intentionally ignores masterContext — the user is here to
    // build it. The guided prompt is self-contained.
    masterContext: isOnboarding ? null : enrichedContext,
    systemPromptOverride: isOnboarding ? GUIDED_ONBOARDING_PROMPT : undefined,
  });

  const encoder = new TextEncoder();
  let fullResponse = "";
  let usage: {
    input_tokens?: number;
    output_tokens?: number;
    cache_read_input_tokens?: number;
    cache_creation_input_tokens?: number;
  } | null = null;

  const readable = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          const text = event.delta.text;
          fullResponse += text;
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
          );
        }
        if (event.type === "message_start" && "message" in event && event.message?.usage) {
          const u = event.message.usage;
          usage = {
            input_tokens: u.input_tokens ?? 0,
            output_tokens: u.output_tokens ?? 0,
            cache_read_input_tokens: u.cache_read_input_tokens ?? 0,
            cache_creation_input_tokens: u.cache_creation_input_tokens ?? 0,
          };
        }
        if (event.type === "message_delta" && "usage" in event && event.usage) {
          const u = event.usage;
          usage = {
            input_tokens: u.input_tokens ?? 0,
            output_tokens: u.output_tokens ?? 0,
            cache_read_input_tokens: u.cache_read_input_tokens ?? 0,
            cache_creation_input_tokens: u.cache_creation_input_tokens ?? 0,
          };
        }
      }

      if (conversationId && fullResponse) {
        await db.insert(schema.messages).values({
          conversationId,
          role: "assistant",
          content: fullResponse,
        });
      }

      if (usage && user.id) {
        await db.insert(schema.apiUsageLogs).values({
          userId: user.id,
          endpoint: "chat",
          model: "claude-sonnet-4-20250514",
          inputTokens: usage.input_tokens ?? 0,
          outputTokens: usage.output_tokens ?? 0,
          cacheReadInputTokens: usage.cache_read_input_tokens ?? 0,
          cacheCreationInputTokens: usage.cache_creation_input_tokens ?? 0,
        });
      }

      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
