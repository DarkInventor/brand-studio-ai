import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createServiceClient } from "@/lib/supabase"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  try {
    // Get the user from Supabase auth
    const cookieStore = cookies()
    const supabaseClient = createServiceClient()

    const {
      data: { session },
    } = await supabaseClient.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Get the customer ID from the user's profile
    const { data: userProfile } = await supabaseClient
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", userId)
      .single()

    const customerId = userProfile?.stripe_customer_id

    if (!customerId) {
      return NextResponse.json({ error: "No subscription found" }, { status: 404 })
    }

    // Create a billing portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/account`,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (error: any) {
    console.error("Error creating portal session:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
