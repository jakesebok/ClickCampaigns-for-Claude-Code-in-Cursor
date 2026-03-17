/**
 * Gets the Aligned Freedom Coach user for the current Clerk session.
 * If the user doesn't exist (e.g. webhook didn't run in local dev), creates them.
 */
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { stripe, getTrialDays } from "@/lib/stripe";

export async function getOrCreateUser() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const [existing] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.clerkId, clerkId))
    .limit(1);

  if (existing) return existing;

  // User not in DB — create from Clerk (webhook may have missed, e.g. local dev)
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.emailAddresses?.[0]?.emailAddress;
  if (!email) return null;

  const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null;

  let stripeCustomerId: string | null = null;
  try {
    const customer = await stripe.customers.create({
      email,
      metadata: { clerkId },
    });
    stripeCustomerId = customer.id;
  } catch {
    // Stripe may not be configured; continue without customer
  }

  const tier = "general";
  const trialDays = getTrialDays(tier);
  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + trialDays);

  const [inserted] = await db
    .insert(schema.users)
    .values({
      clerkId,
      email,
      name,
      tier,
      subscriptionStatus: "trialing",
      stripeCustomerId,
      trialEndsAt,
    })
    .returning();

  return inserted ?? null;
}
