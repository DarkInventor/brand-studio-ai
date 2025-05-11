import { supabase } from "@/lib/supabase"
import type { Profile } from "@/types/database"

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function getCurrentUserProfile(): Promise<Profile | null> {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return data
}

export async function updateUserProfile(updates: Partial<Profile>) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const { data, error } = await supabase.from("profiles").update(updates).eq("id", user.id).select().single()

  if (error) {
    throw error
  }

  return data
}

export async function isUserSubscribed(): Promise<boolean> {
  const profile = await getCurrentUserProfile()
  return !!profile?.is_subscribed
}
