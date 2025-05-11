import { supabase } from "@/lib/supabase"

/**
 * Get the current user's credit balance
 */
export async function getUserCredits(): Promise<number> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return 0

    const { data } = await supabase.from("profiles").select("credits").eq("id", user.id).single()

    return data?.credits || 0
  } catch (error) {
    console.error("Error getting user credits:", error)
    return 0
  }
}

/**
 * Use credits for an action (e.g., generating an image)
 * Returns true if successful, false if not enough credits
 */
export async function useCredits(amount = 1): Promise<boolean> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return false

    // Get current credits
    const { data: profile } = await supabase.from("profiles").select("credits").eq("id", user.id).single()

    const currentCredits = profile?.credits || 0

    // Check if user has enough credits
    if (currentCredits < amount) {
      return false
    }

    // Deduct credits
    const { error } = await supabase
      .from("profiles")
      .update({ credits: currentCredits - amount })
      .eq("id", user.id)

    if (error) {
      console.error("Error updating credits:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error using credits:", error)
    return false
  }
}

/**
 * Add credits to a user's account
 */
export async function addCredits(userId: string, amount: number): Promise<boolean> {
  try {
    // Get current credits
    const { data: profile } = await supabase.from("profiles").select("credits").eq("id", userId).single()

    const currentCredits = profile?.credits || 0

    // Add credits
    const { error } = await supabase
      .from("profiles")
      .update({ credits: currentCredits + amount })
      .eq("id", userId)

    if (error) {
      console.error("Error adding credits:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error adding credits:", error)
    return false
  }
}

/**
 * Check if user has enough credits for an action
 */
export async function hasEnoughCredits(amount = 1): Promise<boolean> {
  const credits = await getUserCredits()
  return credits >= amount
}
