import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { createCheckoutSession, getTrialDays } from "@/lib/stripe";
import { stripe } from "@/lib/stripe";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.alfredai.coach";

export async function GET(req: NextRequest) {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    const plan = req.nextUrl.searchParams.get("plan") || "monthly";
    const redirectUrl = `${APP_URL}/api/checkout?plan=${plan}`;
    return NextResponse.redirect(
      `${APP_URL}/sign-up?redirect_url=${encodeURIComponent(redirectUrl)}`
    );
  }

  const plan = req.nextUrl.searchParams.get("plan") || "monthly";
  const priceId =
    plan === "annual"
      ? process.env.STRIPE_ANNUAL_PRICE_ID
      : process.env.STRIPE_MONTHLY_PRICE_ID;

  if (!priceId) {
    return NextResponse.redirect(`${APP_URL}/pricing?error=config`);
  }

  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.clerkId, clerkId))
    .limit(1);

  if (!user) {
    return NextResponse.redirect(`${APP_URL}/sign-up?redirect_url=${encodeURIComponent(`${APP_URL}/api/checkout?plan=${plan}`)}`);
  }

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { clerkId },
    });
    customerId = customer.id;
    await db
      .update(schema.users)
      .set({ stripeCustomerId: customerId, updatedAt: new Date() })
      .where(eq(schema.users.id, user.id));
  }

  const from = req.nextUrl.searchParams.get("from") || "pricing";
  const cancelUrl =
    from === "subscribe"
      ? `${APP_URL}/subscribe?checkout=canceled`
      : `${APP_URL}/pricing?checkout=canceled`;

  const trialEndsAt = user.trialEndsAt ? new Date(user.trialEndsAt) : null;
  const now = Date.now();
  const hasActiveTrial =
    trialEndsAt && trialEndsAt.getTime() > now && !user.stripeSubscriptionId;
  const trialExpired =
    trialEndsAt && trialEndsAt.getTime() <= now;
  const alreadyHasSub = !!user.stripeSubscriptionId;

  let trialDays: number | undefined;
  let trialEnd: number | undefined;

  if (hasActiveTrial) {
    trialEnd = Math.floor(trialEndsAt!.getTime() / 1000);
  } else if (trialExpired || alreadyHasSub) {
    trialDays = undefined;
    trialEnd = undefined;
  } else {
    trialDays = getTrialDays(user.tier);
  }

  const session = await createCheckoutSession({
    customerId,
    priceId,
    successUrl: `${APP_URL}/dashboard?checkout=success`,
    cancelUrl,
    trialDays,
    trialEnd,
  });

  if (!session.url) {
    return NextResponse.redirect(
      from === "subscribe" ? `${APP_URL}/subscribe?error=session` : `${APP_URL}/pricing?error=session`
    );
  }

  return NextResponse.redirect(session.url);
}
