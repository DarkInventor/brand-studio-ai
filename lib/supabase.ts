import { createClient } from "@supabase/supabase-js"

// Make sure we're using the correct environment variables
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client (uses anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side admin client (uses service role key)
export const createServiceClient = () => {
  console.log("Creating service client with URL:", process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log("Service role key exists:", !!process.env.SUPABASE_SERVICE_ROLE_KEY)

  // Use the URL and service role key from environment variables
  return createClient(
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}
