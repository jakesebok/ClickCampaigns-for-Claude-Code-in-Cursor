import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { and, eq, desc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { getWeekStart } from "@/lib/utils";

export async function GET() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.clerkId, clerkId))
    .limit(1);

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const weekStart = getWeekStart();

  const [current] = await db
    .select()
    .from(schema.weeklyOneThings)
    .where(
      and(
        eq(schema.weeklyOneThings.userId, user.id),
        eq(schema.weeklyOneThings.weekStart, weekStart)
      )
    )
    .limit(1);

  const history = await db
    .select()
    .from(schema.weeklyOneThings)
    .where(eq(schema.weeklyOneThings.userId, user.id))
    .orderBy(desc(schema.weeklyOneThings.weekStart))
    .limit(10);

  return NextResponse.json({
    current: current || null,
    history: history.filter(
      (h) => h.weekStart.getTime() !== weekStart.getTime()
    ),
  });
}

export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { oneThing, lane } = await req.json();

  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.clerkId, clerkId))
    .limit(1);

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const weekStart = getWeekStart();

  const [entry] = await db
    .insert(schema.weeklyOneThings)
    .values({
      userId: user.id,
      weekStart,
      oneThing,
      lane,
    })
    .returning();

  return NextResponse.json(entry);
}
