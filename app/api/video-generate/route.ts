import { NextRequest, NextResponse } from "next/server"
import Replicate from "replicate"
import { uploadToR2 } from "@/lib/r2"
import { createActionClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/actions/auth"

export const runtime = "nodejs" // Ensure this runs on the server

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      style = "None",
      effect = "None",
      prompt = "",
      quality = "1080p",
      duration = 5,
      motion_mode = "normal",
      aspect_ratio = "16:9",
      negative_prompt = "",
      brand_kit_id = null,
      image = null,
    } = body

    if (!brand_kit_id) {
      return NextResponse.json({ error: "brand_kit_id is required" }, { status: 400 })
    }

    const user = await getCurrentUser()
    if (!user || !user.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    let inputImageUrl = null
    if (image && typeof image === "string" && image.startsWith("data:image/")) {
      // Store the image in R2 and get the URL
      const base64Data = image.split(",")[1]
      const buffer = Buffer.from(base64Data, "base64")
      inputImageUrl = await uploadToR2(buffer, "image/png", `video-input-images/${user.id}`)
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    })

    const input: Record<string, any> = {
      style,
      effect,
      prompt,
      quality,
      duration,
      motion_mode,
      aspect_ratio,
      negative_prompt,
    }
    if (inputImageUrl) {
      input.image = inputImageUrl // Only if the model supports it
    }

    // Run the Pixverse model
    const output = await replicate.run("pixverse/pixverse-v4", { input })
    const videoUrl = Array.isArray(output) ? output[0] : output
    if (!videoUrl) {
      return NextResponse.json({ error: "No video URL returned from Replicate" }, { status: 500 })
    }

    // Download the video and upload to R2
    const response = await fetch(videoUrl)
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to download video from Replicate" }, { status: 500 })
    }
    const buffer = Buffer.from(await response.arrayBuffer())
    const r2Url = await uploadToR2(buffer, "video/mp4", `videos/${user.id}`)

    // Insert video post into Supabase
    const supabase = createActionClient()
    const { data, error } = await supabase.from("posts").insert({
      user_id: user.id,
      brand_kit_id: String(brand_kit_id),
      caption: prompt,
      image_url: inputImageUrl || "", // Store the input image URL if present
      status: "draft",
      type: "video",
      video_url: r2Url,
      video_duration: Number(duration),
      aspect_ratio: String(aspect_ratio),
      quality: String(quality),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as any).select().single()

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    } else if (error) {
      return NextResponse.json({ error: String(error) }, { status: 500 })
    }

    return NextResponse.json({ post: data })
  } catch (error) {
    console.error("Video generation error:", error)
    return NextResponse.json({ error: error?.message || "Unknown error" }, { status: 500 })
  }
} 