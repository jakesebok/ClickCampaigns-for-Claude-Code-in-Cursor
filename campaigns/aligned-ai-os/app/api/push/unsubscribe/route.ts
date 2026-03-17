import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { getOrCreateUser } from "@/lib/get-or-create-user";
import { db, schema } from "@/lib/db";

export async function POST(req: NextRequest) {
  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({})) as { endpoint?: string };
  const { endpoint } = body;

  if (endpoint) {
    await db
      .delete(schema.pushSubscriptions)
      .where(
        and(
          eq(schema.pushSubscriptions.userId, user.id),
          eq(schema.pushSubscriptions.endpoint, endpoint)
        )
      );
  } else {
    await db
      .delete(schema.pushSubscriptions)
      .where(eq(schema.pushSubscriptions.userId, user.id));
  }

  return NextResponse.json({ ok: true });
}
