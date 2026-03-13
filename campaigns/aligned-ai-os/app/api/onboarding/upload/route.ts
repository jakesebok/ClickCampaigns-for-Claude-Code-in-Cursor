import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import mammoth from "mammoth";
import { db, schema } from "@/lib/db";
import { generateContextFromWorksheets } from "@/lib/ai/coaching";

export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.clerkId, clerkId))
    .limit(1);

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  let textContent: string;

  if (
    file.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({
      buffer: Buffer.from(arrayBuffer),
    });
    textContent = result.value;
  } else if (file.type === "text/plain" || file.name.endsWith(".md")) {
    textContent = await file.text();
  } else {
    return NextResponse.json(
      { error: "Unsupported file type. Please upload .docx, .txt, or .md" },
      { status: 400 }
    );
  }

  const { masterContext, blueprint } =
    await generateContextFromWorksheets(textContent);

  const existing = await db
    .select()
    .from(schema.contextDocuments)
    .where(eq(schema.contextDocuments.userId, user.id))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(schema.contextDocuments)
      .set({
        masterContext,
        alignmentBlueprint: blueprint,
        rawWorksheets: textContent,
        contextDepth: 100,
        version: (existing[0].version || 1) + 1,
        updatedAt: new Date(),
      })
      .where(eq(schema.contextDocuments.userId, user.id));
  } else {
    await db.insert(schema.contextDocuments).values({
      userId: user.id,
      masterContext,
      alignmentBlueprint: blueprint,
      rawWorksheets: textContent,
      contextDepth: 100,
    });
  }

  await db
    .update(schema.users)
    .set({ onboardingComplete: true, updatedAt: new Date() })
    .where(eq(schema.users.id, user.id));

  return NextResponse.json({ success: true, blueprint });
}
