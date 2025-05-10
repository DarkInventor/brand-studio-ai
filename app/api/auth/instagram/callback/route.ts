import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 })
  }
  const clientId = process.env.INSTAGRAM_CLIENT_ID!
  const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET!
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI!

  const tokenRes = await fetch('https://api.instagram.com/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      code,
    }),
  })
  const tokenData = await tokenRes.json()
  // In production, get the user ID from the session/auth
  const user_id = searchParams.get('user_id') || 'demo-user-id' // TODO: Replace with real user ID from session
  if (tokenData.access_token && user_id) {
    await supabase.from('profiles').update({ instagram_access_token: tokenData.access_token }).eq('id', user_id)
  }
  return NextResponse.json(tokenData)
} 