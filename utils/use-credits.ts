import { supabase } from "@/lib/supabase"

/**
 * Use credits for an action (e.g., generating an image)
 * @param amount Number of credits to use
 * @returns Object with success status and remaining credits
 */
export async function useCredits(amount = 1) {
  try {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Not authenticated", remainingCredits: 0 }
    }

    // Get current credits
    const { data: profile, error: fetchError } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", user.id)
      .single()

    if (fetchError) {
      console.error("Error fetching credits:", fetchError)
      return { success: false, error: "Failed to fetch credits", remainingCredits: 0 }
    }

    const currentCredits = profile?.credits || 0

    // Check if user has enough credits
    if (currentCredits < amount) {
      return {
        success: false,
        error: "Not enough credits",
        remainingCredits: currentCredits,
        needsUpgrade: true,
      }
    }

    // Deduct credits
    const newCredits = currentCredits - amount
    const { error: updateError } = await supabase.from("profiles").update({ credits: newCredits }).eq("id", user.id)

    if (updateError) {
      console.error("Error updating credits:", updateError)
      return { success: false, error: "Failed to update credits", remainingCredits: currentCredits }
    }

    return { success: true, remainingCredits: newCredits }
  } catch (error) {
    console.error("Error using credits:", error)
    return { success: false, error: "An unexpected error occurred", remainingCredits: 0 }
  }
}

/**
 * Add credits to a user's account
 * @param userId User ID
 * @param amount Number of credits to add
 * @returns Object with success status and new credit balance
 */
export async function addCredits(userId: string, amount: number) {
  try {
    // Get current credits
    const { data: profile, error: fetchError } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", userId)
      .single()

    if (fetchError) {
      console.error("Error fetching credits:", fetchError)
      return { success: false, error: "Failed to fetch credits" }
    }

    const currentCredits = profile?.credits || 0
    const newCredits = currentCredits + amount

    // Update credits
    const { error: updateError } = await supabase.from("profiles").update({ credits: newCredits }).eq("id", userId)

    if (updateError) {
      console.error("Error updating credits:", updateError)
      return { success: false, error: "Failed to update credits" }
    }

    return { success: true, credits: newCredits }
  } catch (error) {
    console.error("Error adding credits:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Check if a user has enough credits
 * @param amount Number of credits needed
 * @returns Object with hasEnough status and current credit balance
 */
export async function checkCredits(amount = 1) {
  try {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { hasEnough: false, credits: 0, error: "Not authenticated" }
    }

    // Get current credits
    const { data: profile, error: fetchError } = await supabase
      .from("profiles")
      .select("credits, is_subscribed, subscription_plan")
      .eq("id", user.id)
      .single()

    if (fetchError) {
      console.error("Error fetching credits:", fetchError)
      return { hasEnough: false, credits: 0, error: "Failed to fetch credits" }
    }

    const currentCredits = profile?.credits || 0

    return {
      hasEnough: currentCredits >= amount,
      credits: currentCredits,
      isSubscribed: profile?.is_subscribed || false,
      plan: profile?.subscription_plan || null,
    }
  } catch (error) {
    console.error("Error checking credits:", error)
    return { hasEnough: false, credits: 0, error: "An unexpected error occurred" }
  }
}
