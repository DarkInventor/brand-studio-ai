import { NextResponse } from "next/server"

export async function GET() {
  // Log environment variables (redacting sensitive parts)
  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "exists" : "missing",
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? "exists" : "missing",
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "exists" : "missing",
  }

  return NextResponse.json({
    message: "Environment variables (sensitive parts redacted)",
    env: envVars,
  })
}
