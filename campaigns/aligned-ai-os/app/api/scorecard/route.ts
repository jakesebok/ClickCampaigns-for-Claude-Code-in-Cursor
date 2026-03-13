import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { getWeekStart } from "@/lib/utils";
import { fetchPortalSixCByEmail, insertPortalSixC } from "@/lib/portal-data";

function portalRowToEntry(row: {
  id: string;
  created_at: string;
  scores: Record<string, number>;
  one_thing_to_improve: string | null;
  weekly_review: Record<string, unknown> | null;
}) {
  const weekStart = getWeekStart(new Date(row.created_at));
  const reflections =
    (row.weekly_review?.reflections as Record<string, string>) || {};
  const notes = JSON.stringify({
    reflections,
    oneThing: row.one_thing_to_improve || "",
  });
  return {
    id: row.id,
    weekStart: weekStart.toISOString(),
    scores: row.scores || {},
    notes,
  };
}

export async function GET() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.clerkId, clerkId))
    .limit(1);

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const rows = await fetchPortalSixCByEmail(user.email);
  const thisWeekStart = getWeekStart();

  const allEntries = rows.map(portalRowToEntry);
  const currentWeekEntry = allEntries.find((e) => {
    const ws = new Date(e.weekStart).getTime();
    return ws === thisWeekStart.getTime();
  });
  const pastEntries = allEntries.filter((e) => {
    const ws = new Date(e.weekStart).getTime();
    return ws !== thisWeekStart.getTime();
  });

  return NextResponse.json({
    currentWeek: currentWeekEntry || null,
    entries: pastEntries,
  });
}

export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { scores, notes } = await req.json();

  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.clerkId, clerkId))
    .limit(1);

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  let oneThing = "";
  let reflections: Record<string, string> = {};
  if (notes && typeof notes === "string") {
    try {
      const parsed = JSON.parse(notes) as { oneThing?: string; reflections?: Record<string, string> };
      oneThing = parsed.oneThing || "";
      reflections = parsed.reflections || {};
    } catch {
      // ignore
    }
  }

  const row = await insertPortalSixC({
    email: user.email,
    scores: scores || {},
    oneThing: oneThing || undefined,
    weeklyReview: Object.keys(reflections).length > 0 ? { reflections } : undefined,
  });

  if (!row) {
    return NextResponse.json({ error: "Failed to save scorecard" }, { status: 500 });
  }

  const weekStart = getWeekStart(new Date(row.created_at));
  return NextResponse.json({
    id: row.id,
    weekStart: weekStart.toISOString(),
    scores: row.scores || {},
    notes: JSON.stringify({ reflections, oneThing }),
  });
}
