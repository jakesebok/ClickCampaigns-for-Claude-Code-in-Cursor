import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-02-24.acacia",
    });
  }
  return _stripe;
}

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export async function createCheckoutSession({
  customerId,
  priceId,
  successUrl,
  cancelUrl,
  trialDays,
  trialEnd,
  couponId,
}: {
  customerId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  trialDays?: number;
  trialEnd?: number;
  couponId?: string;
}) {
  const subscriptionData: { trial_period_days?: number; trial_end?: number } = {};
  if (trialEnd) {
    subscriptionData.trial_end = trialEnd;
  } else if (trialDays) {
    subscriptionData.trial_period_days = trialDays;
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    ...(Object.keys(subscriptionData).length > 0 && {
      subscription_data: subscriptionData,
    }),
    ...(couponId && { discounts: [{ coupon: couponId }] }),
  });

  return session;
}

export async function createCustomerPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}

export function getTrialDays(tier: string): number {
  switch (tier) {
    case "coaching_client":
      return 365;
    case "webinar_attendee":
      return 30;
    default:
      return 7;
  }
}
