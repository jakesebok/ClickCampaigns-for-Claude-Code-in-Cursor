/**
 * 6Cs Scorecard push reminders. Vercel Cron runs both 16:05 UTC and 17:05 UTC daily.
 * The handler selects the correct UTC hour for the current Eastern offset
 * (16 UTC during DST, 17 UTC during standard time), which keeps weekend
 * reminders working on Vercel Hobby even though cron timing is within the hour.
 * Sends web push to app users who have subscribed and (Sat/Sun) haven't submitted this week.
 *
 * Env: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, CRON_SECRET, NEXT_PUBLIC_APP_URL
 */
import { NextRequest, NextResponse } from "next/server";
import webPush from "web-push";
import { db, schema } from "@/lib/db";
import { fetchPortalSixCByEmail } from "@/lib/portal-data";
import {
  getScorecardWindow,
  getMostRecentScorecardWindow,
  isDateInScorecardWindow,
} from "@/lib/scorecard-window";

const TZ = "America/New_York";

function nowInEastern(date = new Date()) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });
  const parts = fmt.formatToParts(date);
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

function getEasternOffsetMinutes(date = new Date()): number {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    timeZoneName: "shortOffset",
  });
  const parts = fmt.formatToParts(date);
  const tzName = parts.find((p) => p.type === "timeZoneName")?.value || "";
  const match = tzName.match(/^GMT([+-])(\d{1,2})(?::?(\d{2}))?$/);
  if (!match) return -5 * 60;
  const sign = match[1] === "-" ? -1 : 1;
  const hours = parseInt(match[2] || "0", 10) || 0;
  const minutes = parseInt(match[3] || "0", 10) || 0;
  return sign * (hours * 60 + minutes);
}

function getExpectedCronUtcHour(date = new Date()): number {
  return getEasternOffsetMinutes(date) === -4 * 60 ? 16 : 17;
}

function getReminderType(date = new Date()): "available" | "saturday" | "one-hour-left" | null {
  if (date.getUTCHours() !== getExpectedCronUtcHour(date)) return null;
  const e = nowInEastern(date);
  if (e.dayOfWeek === 5) return "available";
  if (e.dayOfWeek === 6) return "saturday";
  if (e.dayOfWeek === 0) return "one-hour-left";
  return null;
}

function hasMeaningfulScores(
  row: { scores: Record<string, number> | null | undefined }
): boolean {
  if (!row?.scores || typeof row.scores !== "object") return false;
  return Object.values(row.scores).some(
    (value) => typeof value === "number" && Number.isFinite(value)
  );
}

async function hasSubmittedThisWeek(email: string): Promise<boolean> {
  const rows = await fetchPortalSixCByEmail(email);
  const currentWindow = getMostRecentScorecardWindow(getScorecardWindow());
  return rows.some(
    (r) => hasMeaningfulScores(r) && isDateInScorecardWindow(r.created_at, currentWindow)
  );
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
  const cronSecret = (process.env.CRON_SECRET || "").trim();
  if (!cronSecret) {
    return NextResponse.json(
      { error: "CRON_SECRET is not configured" },
      { status: 500 }
    );
  }
  const secret = (
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    req.nextUrl.searchParams.get("secret") ||
    ""
  ).trim();
  if (secret !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const type = getReminderType(new Date());
  if (!type) {
    return NextResponse.json({
      ok: true,
      message: "No reminder scheduled (Fri/Sat/Sun during the noon Eastern cron hour only)",
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
