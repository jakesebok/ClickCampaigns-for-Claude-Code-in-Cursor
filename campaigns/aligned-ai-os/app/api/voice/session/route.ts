import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { getTier } from "@/lib/vapi/scoring";
import { DOMAINS, ARENAS } from "@/lib/vapi/quiz-data";
import { SCORECARD_CATEGORIES, getOverallScore } from "@/lib/scorecard";
import { buildVoiceSystemPrompt } from "@/lib/voice/prompts";
import { fetchPortalVapiByEmail, fetchPortalSixCByEmail } from "@/lib/portal-data";

const OPENAI_REALTIME_URL = "https://api.openai.com/v1/realtime/sessions";

export async function POST() {
  const { userId: clerkId } = await auth();
  if (!clerkId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey)
    return NextResponse.json(
      { error: "Voice sessions not configured" },
      { status: 503 }
    );

  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.clerkId, clerkId))
    .limit(1);

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (
    user.subscriptionStatus === "expired" ||
    user.subscriptionStatus === "canceled"
  ) {
    return NextResponse.json(
      { error: "Active subscription required for voice sessions" },
      { status: 402 }
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

  let vapiSummary: string | null = null;
  if (vapiRows.length > 0) {
    const row = vapiRows[0];
    const r = row.results as Record<string, unknown>;
    const ds = (r.domainScores as Record<string, number>) || {};
    const as2 = (r.arenaScores as Record<string, number>) || {};
    const overall = (r.overall as number) || 0;

    let ctx = `VAPI ASSESSMENT (${new Date(row.created_at).toLocaleDateString()})`;
    ctx += `\nOverall: ${overall.toFixed(1)}/10 — ${getTier(overall)}`;
    ctx += `\nArchetype: ${(r.archetype as string) || ""}`;
    for (const arena of ARENAS) {
      const arenaScore = as2[arena.label] ?? as2[arena.key] ?? 0;
      ctx += `\n${arena.label}: ${arenaScore.toFixed(1)}`;
      for (const code of arena.domains) {
        const domain = DOMAINS.find((d) => d.code === code)!;
        ctx += ` | ${domain.name}: ${(ds[code] || 0).toFixed(1)}`;
      }
    }
    vapiSummary = ctx;
  }

  let scorecardSummary: string | null = null;
  if (sixCRows.length > 0) {
    let ctx = "RECENT 6Cs SCORECARDS";
    for (const entry of sixCRows.slice(0, 3)) {
      const scores = entry.scores || {};
      const overall = getOverallScore(scores);
      ctx += `\nWeek ${new Date(entry.created_at).toLocaleDateString()}: ${overall}%`;
      for (const c of SCORECARD_CATEGORIES) {
        ctx += ` | ${c.label}: ${scores[c.key] || 0}%`;
      }
      if (entry.one_thing_to_improve) ctx += ` | Vital Action: ${entry.one_thing_to_improve}`;
    }
    scorecardSummary = ctx;
  }

  const instructions = buildVoiceSystemPrompt({
    masterContext: contextDoc?.masterContext || null,
    vapiSummary,
    scorecardSummary,
  });

  const model = process.env.OPENAI_REALTIME_MODEL || "gpt-4o-mini-realtime-preview";

  try {
    const response = await fetch(OPENAI_REALTIME_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        voice: process.env.OPENAI_REALTIME_VOICE || "cedar",
        instructions,
        input_audio_transcription: { model: "whisper-1" },
        turn_detection: {
          type: "server_vad",
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 700,
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("OpenAI Realtime session error:", response.status, errorBody);
      return NextResponse.json(
        { error: "Failed to create voice session" },
        { status: 502 }
      );
    }

    const session = await response.json();

    return NextResponse.json({
      clientSecret: session.client_secret?.value,
      model,
      expiresAt: session.client_secret?.expires_at,
    });
  } catch (err) {
    console.error("Voice session creation error:", err);
    return NextResponse.json(
      { error: "Voice service unavailable" },
      { status: 503 }
    );
  }
}
