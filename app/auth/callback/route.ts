import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    // Use environment variables with fallback to hardcoded values
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://iihvapwxfouqwffevnts.supabase.co"
    const supabaseKey =
      process.env.SUPABASE_ANON_KEY ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpaHZhcHd4Zm91cXdmZmV2bnRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MTU0NzAsImV4cCI6MjA2MjE5MTQ3MH0.1CpKLVRDOLo-tLV7W0n3MlTF9tTGwat8kyFiXHH5hwI"

    const supabase = createRouteHandlerClient({
      cookies,
      supabaseUrl,
      supabaseKey,
    })
    await supabase.auth.exchangeCodeForSession(code)
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin + "/dashboard")
}
