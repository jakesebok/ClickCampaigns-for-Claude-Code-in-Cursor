/**
 * 6Cs Scorecard push reminders. Runs at 12:05pm Eastern (Fri/Sat/Sun).
 * Sends web push to app users who have subscribed and (Sat/Sun) haven't submitted this week.
 *
 * Env: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, CRON_SECRET, NEXT_PUBLIC_APP_URL
 */
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import webPush from "web-push";
import { db, schema } from "@/lib/db";
import { fetchPortalSixCByEmail } from "@/lib/portal-data";

const TZ = "America/New_York";

function nowInEastern() {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });
  const parts = fmt.formatToParts(new Date());
  const o: Record<string, string> = {};
  parts.forEach((p) => {
    o[p.type] = p.value;
  });
  const dayNames: Record<string, number> = {
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
    Sun: 0,
  };
  return {
    dayOfWeek: dayNames[o.weekday] ?? 0,
    hour: parseInt(o.hour ?? "0", 10) || 0,
    minute: parseInt(o.minute ?? "0", 10) || 0,
  };
}

function getReminderType(): "available" | "saturday" | "one-hour-left" | null {
  const e = nowInEastern();
  const isReminderHour = e.hour >= 11 && e.hour <= 14;
  if (e.dayOfWeek === 5 && isReminderHour) return "available";
  if (e.dayOfWeek === 6 && isReminderHour) return "saturday";
  if (e.dayOfWeek === 0 && isReminderHour) return "one-hour-left";
  return null;
}

/** Friday 12pm Eastern of the current scorecard week (used to check if user submitted) */
function getCurrentWindowStart(): Date {
  const e = nowInEastern();
  const now = new Date();
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  const parts = fmt.formatToParts(now);
  const o: Record<string, string> = {};
  parts.forEach((p) => {
    o[p.type] = p.value;
  });
  const day = parseInt(o.day ?? "1", 10);
  const month = parseInt(o.month ?? "1", 10);
  const year = parseInt(o.year ?? "2025", 10);
  let daysBack = 0;
  if (e.dayOfWeek === 5) daysBack = 0;
  else if (e.dayOfWeek === 6) daysBack = 1;
  else if (e.dayOfWeek === 0) daysBack = 2;
  else return new Date(0);
  const fridayDay = day - daysBack;
  const m = month - 1;
  const isEDT = m >= 2 && m <= 9;
  const hourUTC = isEDT ? 16 : 17;
  return new Date(Date.UTC(year, m, fridayDay, hourUTC, 0, 0));
}

async function hasSubmittedThisWeek(email: string): Promise<boolean> {
  const rows = await fetchPortalSixCByEmail(email);
  const windowStart = getCurrentWindowStart();
  return rows.some((r) => new Date(r.created_at) >= windowStart);
}

const MESSAGES: Record<
  "available" | "saturday" | "one-hour-left",
  { title: string; body: string }
> = {
  available: {
    title: "ALFRED",
    body: "Your 6Cs scorecard is open this weekend.",
  },
  saturday: {
    title: "ALFRED",
    body: "Don't lose the week without reviewing it. Your 6Cs scorecard is waiting.",
  },
  "one-hour-left": {
    title: "ALFRED",
    body: "Just a few hours left to submit your 6Cs scorecard. Closes at 6pm Eastern.",
  },
};

export async function GET(req: NextRequest) {
  const secret =
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const type = getReminderType();
  if (!type) {
    return NextResponse.json({
      ok: true,
      message: "No reminder scheduled (Fri/Sat/Sun 12:05pm Eastern only)",
      type: null,
    });
  }

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

  const subs = await db
    .select({
      id: schema.pushSubscriptions.id,
      userId: schema.pushSubscriptions.userId,
      endpoint: schema.pushSubscriptions.endpoint,
      keys: schema.pushSubscriptions.keys,
    })
    .from(schema.pushSubscriptions);

  const userIds = [...new Set(subs.map((s) => s.userId))];
  const allUsers = await db.select().from(schema.users);
  const userMap = new Map(allUsers.map((u) => [u.id, u]));

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vap.coach";
  const scorecardUrl = `${appUrl}/scorecard`;
  const msg = MESSAGES[type]!;

  const toSend: { endpoint: string; keys: { p256dh: string; auth: string } }[] = [];

  for (const sub of subs) {
    const user = userMap.get(sub.userId);
    if (!user?.email) continue;

    if (type === "available") {
      toSend.push({ endpoint: sub.endpoint, keys: sub.keys });
    } else {
      const submitted = await hasSubmittedThisWeek(user.email);
      if (!submitted) {
        toSend.push({ endpoint: sub.endpoint, keys: sub.keys });
      }
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
          title: msg.title,
          body: msg.body,
          url: scorecardUrl,
        }),
        { TTL: 86400 }
      )
    )
  );

  const sent = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  return NextResponse.json({
    ok: true,
    type,
    sent,
    failed,
    total: toSend.length,
  });
}
