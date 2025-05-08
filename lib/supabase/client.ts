import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/supabase/database.types"

export const createClient = () => {
  // Use environment variables with fallback to hardcoded values
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://iihvapwxfouqwffevnts.supabase.co"
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpaHZhcHd4Zm91cXdmZmV2bnRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MTU0NzAsImV4cCI6MjA2MjE5MTQ3MH0.1CpKLVRDOLo-tLV7W0n3MlTF9tTGwat8kyFiXHH5hwI"

  return createClientComponentClient<Database>({
    supabaseUrl,
    supabaseKey,
    options: {
      auth: {
        persistSession: true,
      },
    },
  })
}
