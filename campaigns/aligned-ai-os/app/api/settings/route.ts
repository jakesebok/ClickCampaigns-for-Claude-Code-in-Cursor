import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";

export async function GET() {
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

  return NextResponse.json({
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    smsEnabled: user.smsEnabled,
    smsTime: user.smsTime,
    timezone: user.timezone,
    tier: user.tier,
    subscriptionStatus: user.subscriptionStatus,
    trialEndsAt: user.trialEndsAt?.toISOString() || null,
    onboardingComplete: user.onboardingComplete,
    contextualProfile: user.contextualProfile ?? null,
    isAdmin,
  });
}

export async function PATCH(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const updates = await req.json();

  const allowedFields = ["phone", "smsEnabled", "smsTime", "timezone", "name", "contextualProfile"];
  const filtered: Record<string, unknown> = {};
  for (const key of allowedFields) {
    if (key in updates) filtered[key] = updates[key];
  }

  await db
    .update(schema.users)
    .set({ ...filtered, updatedAt: new Date() })
    .where(eq(schema.users.clerkId, clerkId));

  return NextResponse.json({ success: true });
}
