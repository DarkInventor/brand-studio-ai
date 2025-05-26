import type { NextApiRequest, NextApiResponse } from "next"
import { createActionClient } from "@/lib/supabase/server"
import type { Post } from "@/lib/supabase/database.types"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createActionClient()
  const now = new Date().toISOString().slice(0, 16) // 'YYYY-MM-DDTHH:MM'

  // Query for scheduled posts that are due and not yet posted
  // Use 'as any' for key types to avoid Supabase type errors
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status" as any, "scheduled")
    .lte("scheduled_for", now)
    .not("scheduled_platform", "is", null)
    .is("posted_at", null)

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  // Type guard to ensure we only process valid posts
  function isPost(obj: any): obj is Post {
    return (
      obj &&
      typeof obj === "object" &&
      typeof obj.id === "string" &&
      typeof obj.caption === "string" &&
      typeof obj.image_url === "string" &&
      typeof obj.status === "string"
    )
  }

  const posts: Post[] = Array.isArray(data) ? data.filter(isPost) : []

  let processed = 0
  let failed: { id: string; platform: string | null | undefined; error: string }[] = []

  for (const post of posts) {
    let posted = false
    try {
      if (post.scheduled_platform === "twitter") {
        posted = await postToTwitter(post)
      } else if (post.scheduled_platform === "linkedin") {
        posted = await postToLinkedIn(post)
      } else if (post.scheduled_platform === "tiktok") {
        posted = await postToTikTok(post)
      }
      if (posted) {
        await supabase
          .from("posts")
          .update({
            status: "posted",
            posted_at: new Date().toISOString(),
          } as any)
          .eq("id" as any, post.id)
        processed++
      } else {
        failed.push({ id: post.id, platform: post.scheduled_platform, error: "Post function returned false" })
      }
    } catch (err: any) {
      failed.push({ id: post.id, platform: post.scheduled_platform, error: err?.message || String(err) })
      console.error(`Failed to post to ${post.scheduled_platform}:`, err)
    }
  }

  return res.status(200).json({ success: true, processed, failed })
}

// --- Mock posting functions (replace with real API calls) ---
async function postToTwitter(post: Post) {
  // TODO: Integrate with Twitter API
  return true
}
async function postToLinkedIn(post: Post) {
  // TODO: Integrate with LinkedIn API
  return true
}
async function postToTikTok(post: Post) {
  // Post video to TikTok using their API and save tiktok_video_id
  if (!post.video_url) {
    console.error("No video_url for TikTok post", post.id)
    return false
  }
  try {
    const tiktokResponse = await fetch("https://open-api.tiktok.com/share/video/upload/", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.TIKTOK_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        video_url: post.video_url,
        // ...other TikTok params as needed
      }),
    })
    const tiktokData = await tiktokResponse.json()
    if (tiktokData && tiktokData.data && tiktokData.data.video_id) {
      const supabase = createActionClient()
      await supabase
        .from("posts")
        .update({ tiktok_video_id: tiktokData.data.video_id } as unknown as any)
        .eq("id" as unknown as any, post.id)
      return true
    } else {
      console.error("TikTok API did not return a video_id", tiktokData)
      return false
    }
  } catch (err) {
    console.error("Error posting to TikTok:", err)
    return false
  }
} 