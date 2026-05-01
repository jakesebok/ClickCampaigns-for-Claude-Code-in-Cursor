import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { getSectionById } from "@/lib/ai/onboarding-sections";

/**
 * POST /api/onboarding/revise-section
 *
 * Triggered when the user picks a specific onboarding section to revise.
 * Crafts an internal user message that prompts Alfred to re-walk that section
 * (using the [REVISE_SECTION: ...] convention defined in GUIDED_ONBOARDING_PROMPT)
 * and returns it for the client to send through the regular /api/chat flow.
 *
 * The client follows up by POSTing to /api/chat with this message appended.
 * That keeps the streaming + state-marker handling all in one place.
 *
 * Body: { sectionId: string }
 * Response: { triggerMessage: string }
 */
export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const sectionId = typeof body.sectionId === "string" ? body.sectionId : "";

  const section = getSectionById(sectionId);
  if (!section) {
    return NextResponse.json({ error: "Unknown section" }, { status: 400 });
  }

  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.clerkId, clerkId))
    .limit(1);

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Pull the user's most recent onboarding conversation so we can include the
  // current captured summary (if any) in the trigger message. Alfred uses it
  // to acknowledge what's there before walking through the revision.
  const [convo] = await db
    .select({
      id: schema.conversations.id,
      onboardingState: schema.conversations.onboardingState,
    })
    .from(schema.conversations)
    .where(
      and(
        eq(schema.conversations.userId, user.id),
        eq(schema.conversations.mode, "onboarding"),
      ),
    )
    .orderBy(desc(schema.conversations.createdAt))
    .limit(1);

  const currentSummary = convo?.onboardingState?.sections?.[section.id]?.summary ?? "";

  const triggerMessage =
    `[REVISE_SECTION: ${section.id}] Their current answer was: ` +
    (currentSummary || "(no previous answer captured)");

  return NextResponse.json({ triggerMessage });
}
