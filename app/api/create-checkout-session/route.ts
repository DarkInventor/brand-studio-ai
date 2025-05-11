import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  try {
    const { price, planName, planInterval, credits, successUrl, cancelUrl } = await req.json()

    // Get the logged-in user from cookies/session
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }

    // Make sure we have the app URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    // Create a checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price, // Price ID from Stripe
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: successUrl || `${appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${appUrl}/payment/canceled`,
      metadata: {
        userId: user.id,
        planName: planName || "",
        planInterval: planInterval || "",
        productId: "prod_SIAzrgXJe7WltQ",
        credits: credits ? credits.toString() : "0",
      },
      allow_promotion_codes: true,
      billing_address_collection: "auto",
    })

    return NextResponse.json({ sessionId: checkoutSession.id, url: checkoutSession.url })
  } catch (error: any) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
