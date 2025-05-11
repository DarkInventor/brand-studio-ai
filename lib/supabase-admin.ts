import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

// Create a separate admin client with the service role key
export const supabaseAdmin = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
)

// Helper function to get a user by email
export async function getUserByEmail(email: string) {
  const { data, error } = await supabaseAdmin.from("profiles").select("id, email").eq("email", email).single()

  if (error && error.code !== "PGRST116") {
    console.error("Error getting user by email:", error)
  }

  return { data, error }
}

// Helper function to create a profile
export async function createProfile(profile: any) {
  const { data, error } = await supabaseAdmin.from("profiles").insert(profile).select()

  if (error) {
    console.error("Error creating profile:", error)
  }

  return { data, error }
}
