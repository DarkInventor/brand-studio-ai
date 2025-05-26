import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    // TODO: Verify TikTok webhook signature (if required by TikTok)
    // See TikTok docs for signature verification
    
    const body = await req.json()
    
    // Log the incoming event for debugging
    console.log("[TikTok Webhook] Event received:", body)
    
    // TODO: Handle specific event types here
    // Examples of TikTok webhook events:
    // - video.upload.complete
    // - video.upload.failed
    // - video.publish.complete
    // - video.publish.failed
    
    // Respond with 200 OK to acknowledge receipt
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[TikTok Webhook] Error processing webhook:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Handle GET requests for webhook verification (if TikTok requires it)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  
  // TikTok might send a verification challenge
  const challenge = searchParams.get('challenge')
  const verify_token = searchParams.get('verify_token')
  
  // TODO: Verify the token matches your expected verification token
  // const expectedToken = process.env.TIKTOK_WEBHOOK_VERIFY_TOKEN
  
  if (challenge) {
    console.log("[TikTok Webhook] Verification challenge received:", challenge)
    return new Response(challenge, { status: 200 })
  }
  
  return NextResponse.json({ error: "Invalid verification request" }, { status: 400 })
} 