import { supabase } from "@/lib/supabase"

/**
 * Ensure a user's profile exists in the profiles table
 * Call this after login or when accessing protected pages
 */
export async function ensureUserProfile() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    // Check if profile exists
    const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    // If profile doesn't exist, create it
    if (error && error.code === "PGRST116") {
      // PGRST116 is the error code for "no rows returned"
      const { data: newProfile, error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata.full_name,
          avatar_url: user.user_metadata.avatar_url,
          credits: 100, // Default credits for new users
        })
        .select("*")
        .single()

      if (insertError) {
        console.error("Error creating profile:", insertError)
        return null
      }

      return newProfile
    }

    return profile
  } catch (error) {
    console.error("Error ensuring user profile:", error)
    return null
  }
}

/**
 * Get the current user with their profile data
 */
export async function getCurrentUserWithProfile() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    // Ensure profile exists
    const profile = await ensureUserProfile()

    return {
      ...user,
      profile,
    }
  } catch (error) {
    console.error("Error getting current user with profile:", error)
    return null
  }
}
