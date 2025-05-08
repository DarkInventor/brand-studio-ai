import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Use environment variables with fallback to hardcoded values
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://iihvapwxfouqwffevnts.supabase.co"
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpaHZhcHd4Zm91cXdmZmV2bnRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MTU0NzAsImV4cCI6MjA2MjE5MTQ3MH0.1CpKLVRDOLo-tLV7W0n3MlTF9tTGwat8kyFiXHH5hwI"

  const supabase = createMiddlewareClient({
    req,
    res,
    supabaseUrl,
    supabaseKey,
  })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check if the user is authenticated
  const isAuthenticated = !!session

  // Protected routes that require authentication
  const protectedRoutes = ["/dashboard", "/brand-kit", "/scheduler", "/summary"]

  // Auth routes that should redirect to dashboard if already authenticated
  const authRoutes = ["/login", "/signup"]

  const path = req.nextUrl.pathname

  // If the user is trying to access a protected route without being authenticated
  if (protectedRoutes.some((route) => path.startsWith(route)) && !isAuthenticated) {
    const redirectUrl = new URL("/login", req.url)
    return NextResponse.redirect(redirectUrl)
  }

  // If the user is authenticated and trying to access an auth route
  if (authRoutes.some((route) => path.startsWith(route)) && isAuthenticated) {
    const redirectUrl = new URL("/dashboard", req.url)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: ["/dashboard/:path*", "/brand-kit/:path*", "/scheduler/:path*", "/summary/:path*", "/login", "/signup"],
}
