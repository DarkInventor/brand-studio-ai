import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const clientId = process.env.INSTAGRAM_CLIENT_ID!
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI!
  const scope = 'user_profile,user_media'
  const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code`
  return NextResponse.redirect(authUrl)
} 