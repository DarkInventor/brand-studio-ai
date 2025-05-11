import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { PLAN_CREDITS } from "@/config/stripe"

export async function POST(req: Request) {
  try {
    const { userId, plan, credits } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Calculate credits based on plan if not provided
    let creditAmount = credits
    if (!creditAmount && plan && PLAN_CREDITS[plan as keyof typeof PLAN_CREDITS]) {
      creditAmount = PLAN_CREDITS[plan as keyof typeof PLAN_CREDITS]
    }

    // Check if the profile exists
    const { data: existingProfile, error: profileCheckError } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single()

    if (profileCheckError && profileCheckError.code !== "PGRST116") {
      console.error("Error checking if profile exists:", profileCheckError)
      return NextResponse.json({ error: "Error checking if profile exists" }, { status: 500 })
    }

    if (!existingProfile) {
      // Profile doesn't exist, create it
      console.log(`Creating new profile for user ${userId}`)
      const { data: newProfile, error: createError } = await supabaseAdmin
        .from("profiles")
        .insert({
          id: userId,
          is_subscribed: true,
          subscription_status: "active",
          subscription_plan: plan,
          credits: creditAmount,
        })
        .select()

      if (createError) {
        console.error("Error creating profile:", createError)
        return NextResponse.json({ error: "Error creating profile" }, { status: 500 })
      }

      return NextResponse.json({ success: true, profile: newProfile })
    } else {
      // Profile exists, update it
      console.log(`Updating existing profile for user ${userId}`)
      const updateData: any = {
        is_subscribed: true,
        subscription_status: "active",
      }

      if (plan) {
        updateData.subscription_plan = plan
      }

      if (creditAmount !== undefined) {
        updateData.credits = creditAmount
      }

      const { data: updatedProfile, error: updateError } = await supabaseAdmin
        .from("profiles")
        .update(updateData)
        .eq("id", userId)
        .select()

      if (updateError) {
        console.error("Error updating profile:", updateError)
        return NextResponse.json({ error: "Error updating profile" }, { status: 500 })
      }

      return NextResponse.json({ success: true, profile: updatedProfile })
    }
  } catch (error: any) {
    console.error("Error updating subscription:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
