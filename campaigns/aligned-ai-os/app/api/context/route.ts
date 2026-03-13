import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
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

  const [doc] = await db
    .select()
    .from(schema.contextDocuments)
    .where(eq(schema.contextDocuments.userId, user.id))
    .limit(1);

  if (!doc) return NextResponse.json({ alignmentBlueprint: null, contextDepth: 0, version: 0, updatedAt: null });

  return NextResponse.json({
    alignmentBlueprint: doc.alignmentBlueprint,
    contextDepth: doc.contextDepth,
    version: doc.version,
    updatedAt: doc.updatedAt?.toISOString(),
  });
}
