import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  // TODO: Verify TikTok webhook signature (if required by TikTok)
  // See TikTok docs for signature verification

  // Log the incoming event for debugging
  console.log("[TikTok Webhook] Event received:", req.body)

  // TODO: Handle specific event types here

  // Respond with 200 OK to acknowledge receipt
  return res.status(200).json({ success: true })
} 