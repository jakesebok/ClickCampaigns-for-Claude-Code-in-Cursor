import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { eq, and, gte, sum, count } from "drizzle-orm";
import { db, schema } from "@/lib/db";

/**
 * GET /api/usage
 * Returns token usage and cache savings for the authenticated user.
 * Query params: ?days=30 (default) to limit to last N days.
 */
export async function GET(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.clerkId, clerkId))
    .limit(1);

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const isAdmin = adminEmails.length > 0 && adminEmails.includes((user.email || "").toLowerCase());
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const url = new URL(req.url);
  const days = Math.min(365, Math.max(1, parseInt(url.searchParams.get("days") || "30", 10) || 30));
  const since = new Date();
  since.setDate(since.getDate() - days);

  const rows = await db
    .select({
      inputTokens: sum(schema.apiUsageLogs.inputTokens),
      outputTokens: sum(schema.apiUsageLogs.outputTokens),
      cacheReadInputTokens: sum(schema.apiUsageLogs.cacheReadInputTokens),
      cacheCreationInputTokens: sum(schema.apiUsageLogs.cacheCreationInputTokens),
      requestCount: count(),
    })
    .from(schema.apiUsageLogs)
    .where(
      and(
        eq(schema.apiUsageLogs.userId, user.id),
        gte(schema.apiUsageLogs.createdAt, since)
      )
    );

  const stats = rows[0];
  const inputTokens = Number(stats?.inputTokens ?? 0);
  const outputTokens = Number(stats?.outputTokens ?? 0);
  const cacheReadInputTokens = Number(stats?.cacheReadInputTokens ?? 0);
  const cacheCreationInputTokens = Number(stats?.cacheCreationInputTokens ?? 0);
  const requestCount = stats?.requestCount ?? 0;

  if (requestCount === 0) {
    return NextResponse.json({
      period: `Last ${days} days`,
      requestCount: 0,
      inputTokens: 0,
      outputTokens: 0,
      cacheReadInputTokens: 0,
      cacheCreationInputTokens: 0,
      cacheHitRate: null,
      estimatedSavingsNote: null,
    });
  }

  const totalInput = inputTokens + cacheReadInputTokens + cacheCreationInputTokens;
  const cacheHitRate = totalInput > 0
    ? Math.round((cacheReadInputTokens / totalInput) * 100)
    : null;

  return NextResponse.json({
    period: `Last ${days} days`,
    requestCount,
    inputTokens,
    outputTokens,
    cacheReadInputTokens,
    cacheCreationInputTokens,
    cacheHitRate: cacheHitRate !== null ? `${cacheHitRate}%` : null,
    estimatedSavingsNote:
      cacheReadInputTokens > 0
        ? `Cache reads cost ~10% of normal input. Without caching, ${cacheReadInputTokens.toLocaleString()} tokens would have cost ~10x more.`
        : null,
  });
}
