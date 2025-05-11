import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const userId = url.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Get the user's credit information
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, credits, is_subscribed, subscription_plan, subscription_status, subscription_period_end")
      .eq("id", userId)
      .single()

    if (error) {
      console.error("Error fetching credits:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error("Error in get-credits API:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
