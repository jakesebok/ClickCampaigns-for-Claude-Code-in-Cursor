import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { createCustomerPortalSession } from "@/lib/stripe";

export async function GET() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.clerkId, clerkId))
    .limit(1);

  if (!user?.stripeCustomerId) {
    return NextResponse.redirect(new URL("/pricing", process.env.NEXT_PUBLIC_APP_URL!));
  }

  const session = await createCustomerPortalSession({
    customerId: user.stripeCustomerId,
    returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
  });

  return NextResponse.redirect(session.url);
}
