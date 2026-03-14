import { NextRequest, NextResponse } from "next/server";
import { and, eq, inArray } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { sendMorningPrompt } from "@/lib/twilio";
import { MORNING_PROMPTS } from "@/lib/ai/prompts";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const currentHour = now.getUTCHours().toString().padStart(2, "0");
  const currentMinute = "00";
  const targetTime = `${currentHour}:${currentMinute}`;

  const eligibleUsers = await db
    .select()
    .from(schema.users)
    .where(
      and(
        eq(schema.users.smsEnabled, true),
        inArray(schema.users.subscriptionStatus, ["active", "trialing"])
      )
    );

  const usersToNotify = eligibleUsers.filter((user) => {
    return convertToUTC(user.smsTime || "07:00", user.timezone || "America/New_York") === targetTime;
  });

  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const promptIndex = dayOfYear % MORNING_PROMPTS.length;
  const prompt = MORNING_PROMPTS[promptIndex];

  const results = await Promise.allSettled(
    usersToNotify.map((user) =>
      sendMorningPrompt({
        to: user.phone!,
        prompt,
        appUrl: process.env.NEXT_PUBLIC_APP_URL!,
      })
    )
  );

  const sent = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  return NextResponse.json({ sent, failed, total: usersToNotify.length });
}

function convertToUTC(localTime: string, timezone: string): string {
  const [hours, minutes] = localTime.split(":").map(Number);
  const now = new Date();
  const local = new Date(
    now.toLocaleString("en-US", { timeZone: timezone })
  );
  const utcOffset = now.getTime() - local.getTime();
  const targetLocal = new Date(now);
  targetLocal.setHours(hours, minutes, 0, 0);
  const targetUTC = new Date(targetLocal.getTime() + utcOffset);
  return `${targetUTC.getUTCHours().toString().padStart(2, "0")}:00`;
}
