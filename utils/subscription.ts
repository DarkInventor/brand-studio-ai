import { supabase } from "@/lib/supabase"
import { PLAN_FEATURES, PLAN_IMAGE_LIMITS } from "@/config/stripe"

/**
 * Check if a user is subscribed
 */
export async function isUserSubscribed(): Promise<boolean> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return false

    const { data } = await supabase.from("profiles").select("is_subscribed").eq("id", user.id).single()

    return !!data?.is_subscribed
  } catch (error) {
    console.error("Error checking subscription status:", error)
    return false
  }
}

/**
 * Check if a user has access to a specific feature based on their subscription plan
 */
export async function hasFeatureAccess(feature: string): Promise<boolean> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return false

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_subscribed, subscription_plan")
      .eq("id", user.id)
      .single()

    if (!profile?.is_subscribed) return false

    const plan = profile.subscription_plan || "Free"
    return PLAN_FEATURES[plan as keyof typeof PLAN_FEATURES]?.includes(feature) || false
  } catch (error) {
    console.error("Error checking feature access:", error)
    return false
  }
}

/**
 * Get the user's current subscription plan
 */
export async function getUserSubscriptionPlan(): Promise<string | null> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    const { data } = await supabase.from("profiles").select("subscription_plan").eq("id", user.id).single()

    return data?.subscription_plan || null
  } catch (error) {
    console.error("Error getting subscription plan:", error)
    return null
  }
}

/**
 * Get the user's image generation limit based on their plan
 */
export function getPlanImageLimit(plan: string | null): number {
  if (!plan || !PLAN_IMAGE_LIMITS[plan as keyof typeof PLAN_IMAGE_LIMITS]) {
    return PLAN_IMAGE_LIMITS.Free
  }
  return PLAN_IMAGE_LIMITS[plan as keyof typeof PLAN_IMAGE_LIMITS]
}

/**
 * Check if a user has reached their image generation limit
 */
export async function hasReachedImageLimit(): Promise<boolean> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return true

    // Get user's plan
    const plan = await getUserSubscriptionPlan()
    const limit = getPlanImageLimit(plan)

    // Count images generated this month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { count } = await supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", startOfMonth.toISOString())

    return (count || 0) >= limit
  } catch (error) {
    console.error("Error checking image limit:", error)
    return true
  }
}
