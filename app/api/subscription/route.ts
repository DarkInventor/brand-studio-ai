import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    // Get the user session
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get userId from query params
    const url = new URL(req.url)
    const userId = url.searchParams.get("userId")

    // Verify the requested userId matches the authenticated user
    if (userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the customer ID from your database
    // This is a placeholder - you need to implement this function
    const customerId = await getCustomerIdForUser(userId)

    if (!customerId) {
      return NextResponse.json({ subscription: null })
    }

    // Get the customer's subscriptions from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
      expand: ["data.default_payment_method", "data.plan.product"],
    })

    const subscription = subscriptions.data[0]

    if (!subscription) {
      return NextResponse.json({ subscription: null })
    }

    // Format the subscription data
    const plan = subscription.items.data[0].plan
    const product = plan.product as any

    return NextResponse.json({
      subscription: {
        id: subscription.id,
        status: subscription.status,
        interval: plan.interval,
        currentPeriodEnd: subscription.current_period_end,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        plan: {
          id: plan.id,
          name: product.name,
          amount: plan.amount,
          currency: plan.currency,
        },
      },
    })
  } catch (error: any) {
    console.error("Error fetching subscription:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Placeholder function - implement this to fetch the customer ID from your database
async function getCustomerIdForUser(userId: string): Promise<string | null> {
  // Query your database to get the Stripe customer ID for this user
  // Example:
  // const user = await prisma.user.findUnique({
  //   where: { id: userId },
  //   select: { stripeCustomerId: true }
  // });
  // return user?.stripeCustomerId || null;

  // For now, return a placeholder
  return "cus_placeholder"
}
