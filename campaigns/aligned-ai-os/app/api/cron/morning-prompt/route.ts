/**
 * Daily Spark — web push only (no SMS).
 * Runs once per day (see `vercel.json` schedule). No hourly cron: everyone opted in
 * gets the same send time (12:00 UTC ≈ 7am EST / 8am EDT). Requires push subscription + VAPID.
 */
import { NextRequest, NextResponse } from "next/server";
import webPush from "web-push";
import { and, eq, inArray } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { MORNING_PROMPTS } from "@/lib/ai/prompts";
import { pickPersonalizedMorningPrompt } from "@/lib/morning-prompt-personalized";

const DAILY_SPARK_TITLE = "Daily Spark";

/** Keep push body within typical OS limits (~120–180 chars). */
function shortenPushBody(text: string, max = 140): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

function authorizeCron(req: NextRequest): boolean {
  const cronSecret = (process.env.CRON_SECRET || "").trim();
  if (!cronSecret) return false;
  const secret =
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    req.nextUrl.searchParams.get("secret") ||
    "";
  return secret.trim() === cronSecret;
}

async function handleCron() {
  const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const vapidPrivate = process.env.VAPID_PRIVATE_KEY;
  if (!vapidPublic || !vapidPrivate) {
    return NextResponse.json(
      { error: "VAPID keys not configured" },
      { status: 500 }
    );
  }

  webPush.setVapidDetails(
    "mailto:support@vap.coach",
    vapidPublic,
    vapidPrivate
  );

  const now = new Date();

  const eligibleUsers = await db
    .select()
    .from(schema.users)
    .where(
      and(
        eq(schema.users.smsEnabled, true),
        inArray(schema.users.subscriptionStatus, ["active", "trialing"])
      )
    );

  const subs = await db
    .select({
      userId: schema.pushSubscriptions.userId,
      endpoint: schema.pushSubscriptions.endpoint,
      keys: schema.pushSubscriptions.keys,
    })
    .from(schema.pushSubscriptions);

  const subsByUser = new Map<string, typeof subs>();
  for (const s of subs) {
    const list = subsByUser.get(s.userId) || [];
    list.push(s);
    subsByUser.set(s.userId, list);
  }

  /** Only users with at least one push endpoint receive a Daily Spark. */
  const usersToNotify = eligibleUsers.filter((u) => (subsByUser.get(u.id)?.length ?? 0) > 0);

  if (usersToNotify.length === 0) {
    return NextResponse.json({
      ok: true,
      channel: "push",
      message:
        "No recipients (need Daily Spark on, active subscription, and browser push enabled)",
      sent: 0,
      failed: 0,
      total: 0,
      eligibleWithPrefsOnly: eligibleUsers.length,
    });
  }

  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const promptIndex = dayOfYear % MORNING_PROMPTS.length;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vap.coach";
  const sparkUrl = `${appUrl}/dashboard?dailySpark=1`;

  type SendTarget = {
    endpoint: string;
    keys: { p256dh: string; auth: string };
    body: string;
  };
  const toSend: SendTarget[] = [];

  for (const user of usersToNotify) {
    const userSubs = subsByUser.get(user.id)!;

    const longPrompt = user.email
      ? await pickPersonalizedMorningPrompt(user.email, promptIndex)
      : MORNING_PROMPTS[promptIndex];
    const body = shortenPushBody(longPrompt);

    for (const sub of userSubs) {
      toSend.push({
        endpoint: sub.endpoint,
        keys: sub.keys,
        body,
      });
    }
  }

  const results = await Promise.allSettled(
    toSend.map((s) =>
      webPush.sendNotification(
        {
          endpoint: s.endpoint,
          keys: { p256dh: s.keys.p256dh, auth: s.keys.auth },
        },
        JSON.stringify({
          title: DAILY_SPARK_TITLE,
          body: s.body,
          url: sparkUrl,
        }),
        { TTL: 86400 }
      )
    )
  );

  const sent = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  return NextResponse.json({
    ok: true,
    channel: "push",
    scheduleNote:
      "Single daily cron (no per-user local time). Default: 12:00 UTC — adjust in vercel.json if needed.",
    usersNotified: usersToNotify.length,
    sent,
    failed,
    total: toSend.length,
  });
}

export async function GET(req: NextRequest) {
  if (!authorizeCron(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return handleCron();
}

export async function POST(req: NextRequest) {
  if (!authorizeCron(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return handleCron();
}
