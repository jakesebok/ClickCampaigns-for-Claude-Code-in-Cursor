import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { emptyOnboardingState } from "@/lib/ai/onboarding-state";

/**
 * POST /api/onboarding/start
 *
 * Returns the user's active guided-onboarding conversation, creating one if
 * none exists. Used by the chat page when it loads with ?mode=onboarding so
 * the conversation persists across refreshes (resume where you left off).
 *
 * Response: {
 *   conversationId: string,
 *   messages: { role, content }[],
 *   state: OnboardingState
 * }
 */
export async function POST() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });

  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.clerkId, clerkId))
    .limit(1);

  if (!user) return new NextResponse("User not found", { status: 404 });

  // Find the most recent onboarding conversation for this user.
  const [existing] = await db
    .select()
    .from(schema.conversations)
    .where(
      and(
        eq(schema.conversations.userId, user.id),
        eq(schema.conversations.mode, "onboarding"),
      ),
    )
    .orderBy(desc(schema.conversations.createdAt))
    .limit(1);

  let conversationId: string;
  let state = existing?.onboardingState ?? null;
  if (existing) {
    conversationId = existing.id;
  } else {
    const initialState = emptyOnboardingState();
    const [created] = await db
      .insert(schema.conversations)
      .values({
        userId: user.id,
        mode: "onboarding",
        title: "Guided onboarding",
        onboardingState: initialState,
      })
      .returning({ id: schema.conversations.id });
    conversationId = created.id;
    state = initialState;
  }

  // Load messages for this conversation (oldest first) so the UI can replay them.
  const rows = await db
    .select({
      role: schema.messages.role,
      content: schema.messages.content,
    })
    .from(schema.messages)
    .where(eq(schema.messages.conversationId, conversationId))
    .orderBy(schema.messages.createdAt);

  return NextResponse.json({
    conversationId,
    messages: rows,
    state: state ?? emptyOnboardingState(),
  });
}
