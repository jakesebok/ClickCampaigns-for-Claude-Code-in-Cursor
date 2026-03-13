import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { getTrialDays } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const { type, data } = payload;

  if (type === "user.created") {
    const { id: clerkId, email_addresses, first_name, last_name } = data;
    const email = email_addresses?.[0]?.email_address;
    const name = [first_name, last_name].filter(Boolean).join(" ");

    const customer = await stripe.customers.create({
      email,
      metadata: { clerkId },
    });

    const tier = "general";
    const trialDays = getTrialDays(tier);
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + trialDays);

    await db.insert(schema.users).values({
      clerkId,
      email,
      name: name || null,
      tier,
      subscriptionStatus: "trialing",
      stripeCustomerId: customer.id,
      trialEndsAt,
    });
  }

  return NextResponse.json({ received: true });
}
