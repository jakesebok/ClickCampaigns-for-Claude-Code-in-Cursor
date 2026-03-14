import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { streamCoachingResponse } from "@/lib/ai/coaching";
import { getTier } from "@/lib/vapi/scoring";
import { DOMAINS, ARENAS } from "@/lib/vapi/quiz-data";
import { SCORECARD_CATEGORIES, getOverallScore } from "@/lib/scorecard";
import { fetchPortalVapiByEmail, fetchPortalSixCByEmail, type PortalVapiRow, type PortalSixCRow } from "@/lib/portal-data";

function formatVapiContext(row: PortalVapiRow): string {
  const r = row.results as Record<string, unknown>;
  const ds = (r.domainScores as Record<string, number>) || {};
  const as2 = (r.arenaScores as Record<string, number>) || {};
  const overall = (r.overall as number) || 0;
  const tier = getTier(overall);

  let ctx = `\n\n---\nVAPI ASSESSMENT (${new Date(row.created_at).toLocaleDateString()})`;
  ctx += `\nOverall: ${overall.toFixed(1)}/10 — ${tier}`;
  ctx += `\nArchetype: ${(r.archetype as string) || ""}`;

  for (const arena of ARENAS) {
    const arenaKey = arena.label === "Personal" ? "personal" : arena.label === "Relationships" ? "relationships" : "business";
    const arenaScore = as2[arena.label] ?? as2[arenaKey] ?? 0;
    ctx += `\n\n${arena.label}: ${arenaScore.toFixed(1)}/10 — ${getTier(arenaScore)}`;
    for (const code of arena.domains) {
      const domain = DOMAINS.find((d) => d.code === code)!;
      ctx += `\n  ${domain.name}: ${(ds[code] || 0).toFixed(1)} — ${getTier(ds[code] as number || 0)}`;
    }
  }

  return ctx;
}

function formatScorecardContext(entries: PortalSixCRow[]): string {
  if (!entries.length) return "";
  let ctx = `\n\n---\nRECENT 6Cs SCORECARDS`;
  for (const entry of entries.slice(0, 4)) {
    const scores = entry.scores || {};
    const overall = getOverallScore(scores);
    ctx += `\n\nWeek of ${new Date(entry.created_at).toLocaleDateString()}: ${overall}%`;
    for (const c of SCORECARD_CATEGORIES) {
      ctx += `\n  ${c.label}: ${scores[c.key] || 0}%`;
    }
    if (entry.one_thing_to_improve) ctx += `\n  Vital Action: ${entry.one_thing_to_improve}`;
  }
  return ctx;
}

export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return new Response("Unauthorized", { status: 401 });

  const { messages, conversationId } = await req.json();

  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.clerkId, clerkId))
    .limit(1);

  if (!user) return new Response("User not found", { status: 404 });

  if (
    user.subscriptionStatus === "expired" ||
    user.subscriptionStatus === "canceled"
  ) {
    return new Response("Subscription required", { status: 402 });
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
    enrichedContext = (enrichedContext || "") + formatVapiContext(vapiRows[0]);
  }
  if (sixCRows.length > 0) {
    enrichedContext = (enrichedContext || "") + formatScorecardContext(sixCRows);
  }

  const lastUserMessage = messages[messages.length - 1];
  if (conversationId && lastUserMessage) {
    await db.insert(schema.messages).values({
      conversationId,
      role: "user",
      content: lastUserMessage.content,
    });
  }

  const stream = await streamCoachingResponse({
    messages,
    masterContext: enrichedContext,
  });

  const encoder = new TextEncoder();
  let fullResponse = "";

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
      }

      if (conversationId && fullResponse) {
        await db.insert(schema.messages).values({
          conversationId,
          role: "assistant",
          content: fullResponse,
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
