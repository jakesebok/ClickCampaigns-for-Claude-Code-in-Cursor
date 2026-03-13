import { NextRequest, NextResponse } from "next/server";
import { and, eq, desc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { getOrCreateUser } from "@/lib/get-or-create-user";
import { getWeekStart } from "@/lib/utils";

export async function GET() {
  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { oneThing, lane } = await req.json();

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
