import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { patchMasterContext } from "@/lib/ai/coaching";

export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { updateNotes } = body as { updateNotes?: string };

  if (!updateNotes || typeof updateNotes !== "string" || updateNotes.trim().length === 0) {
    return NextResponse.json(
      { error: "updateNotes is required and must be a non-empty string" },
      { status: 400 }
    );
  }

  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.clerkId, clerkId))
    .limit(1);

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const [contextDoc] = await db
    .select()
    .from(schema.contextDocuments)
    .where(eq(schema.contextDocuments.userId, user.id))
    .limit(1);

  if (!contextDoc?.masterContext) {
    return NextResponse.json(
      { error: "No Alignment Blueprints found. Complete onboarding first." },
      { status: 400 }
    );
  }

  try {
    const { masterContext, blueprint } = await patchMasterContext(
      contextDoc.masterContext,
      updateNotes.trim()
    );

    await db
      .update(schema.contextDocuments)
      .set({
        masterContext,
        alignmentBlueprint: blueprint,
        version: (contextDoc.version || 1) + 1,
        updatedAt: new Date(),
      })
      .where(eq(schema.contextDocuments.userId, user.id));

    return NextResponse.json({ success: true, blueprint });
  } catch (err) {
    console.error("Context patch failed:", err);
    return NextResponse.json(
      { error: "Failed to update Alignment Blueprints. Please try again." },
      { status: 500 }
    );
  }
}
