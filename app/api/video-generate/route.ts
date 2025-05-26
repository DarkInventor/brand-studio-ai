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

    // --- CREDIT DEDUCTION LOGIC START ---
    const supabase = createActionClient()
    // Fetch user credits
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", String(user.id))
      .single()
    if (profileError || !profileData || typeof profileData.credits !== 'number') {
      return NextResponse.json({ error: "Failed to verify your credits. Please try again." }, { status: 500 })
    }
    const currentCredits: number = profileData.credits

    // Credit cost lookup
    function getVideoCreditCost({ quality, duration, motion_mode }: { quality: string, duration: number, motion_mode: string }) {
      quality = String(quality).toLowerCase();
      duration = Number(duration);
      motion_mode = String(motion_mode).toLowerCase();
      if (duration === 5) {
        if ((quality === "360p" || quality === "540p") && motion_mode === "normal") return 4;
        if (quality === "720p" && motion_mode === "normal") return 5;
        if (quality === "1080p" && motion_mode === "normal") return 11;
        if ((quality === "360p" || quality === "540p") && motion_mode === "smooth") return 8;
        if (quality === "720p" && motion_mode === "smooth") return 11;
      }
      if (duration === 8) {
        if ((quality === "360p" || quality === "540p") && motion_mode === "normal") return 8;
        if (quality === "720p" && motion_mode === "normal") return 11;
      }
      if (duration === 10) {
        if ((quality === "360p" || quality === "540p") && motion_mode === "normal") return 10;
        if (quality === "720p" && motion_mode === "normal") return 14;
        if (quality === "1080p" && motion_mode === "normal") return 22;
      }
      if (duration === 30) {
        if ((quality === "360p" || quality === "540p") && motion_mode === "normal") return 30;
        if (quality === "720p" && motion_mode === "normal") return 41;
        if (quality === "1080p" && motion_mode === "normal") return 65;
      }
      return null;
    }
    const requiredCredits = getVideoCreditCost({ quality, duration, motion_mode })
    if (!requiredCredits) {
      return NextResponse.json({ error: "Invalid video parameters for credit calculation." }, { status: 400 })
    }
    if (currentCredits < requiredCredits) {
      return NextResponse.json({ error: `Not enough credits. You need ${requiredCredits} credits but only have ${currentCredits}.`, requiredCredits, currentCredits }, { status: 402 })
    }
    // Atomically deduct credits
    const updateCreditsObj: { credits: number } = { credits: currentCredits - requiredCredits }
    const { error: updateError } = await supabase.from("profiles").update(updateCreditsObj).eq("id", String(user.id))
    if (updateError) {
      return NextResponse.json({ error: "Failed to update your credits. Please try again." }, { status: 500 })
    }
    // --- CREDIT DEDUCTION LOGIC END ---

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
    let videoUrl
    try {
      const output = await replicate.run("pixverse/pixverse-v4.5", { input })
      videoUrl = Array.isArray(output) ? output[0] : output
      if (!videoUrl) {
        // Refund credits if failed
        await supabase.from("profiles").update({ credits: currentCredits as number }).eq("id", String(user.id))
        return NextResponse.json({ error: "No video URL returned from Replicate" }, { status: 500 })
      }
    } catch (err) {
      // Refund credits if failed
      await supabase.from("profiles").update({ credits: currentCredits as number }).eq("id", String(user.id))
      return NextResponse.json({ error: "Video generation failed. Credits refunded." }, { status: 500 })
    }

    // Download the video and upload to R2
    const response = await fetch(videoUrl)
    if (!response.ok) {
      // Refund credits if failed
      await supabase.from("profiles").update({ credits: currentCredits as number }).eq("id", String(user.id))
      return NextResponse.json({ error: "Failed to download video from Replicate" }, { status: 500 })
    }
    const buffer = Buffer.from(await response.arrayBuffer())
    const r2Url = await uploadToR2(buffer, "video/mp4", `videos/${user.id}`)

    // Insert video post into Supabase
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
      // Refund credits if failed
      await supabase.from("profiles").update({ credits: currentCredits as number }).eq("id", String(user.id))
      return NextResponse.json({ error: error.message }, { status: 500 })
    } else if (error) {
      // Refund credits if failed
      await supabase.from("profiles").update({ credits: currentCredits as number }).eq("id", String(user.id))
      return NextResponse.json({ error: String(error) }, { status: 500 })
    }

    // Return new credit balance
    const { data: updatedProfile, error: updatedProfileError } = await supabase.from("profiles").select("credits").eq("id", String(user.id)).single()
    let creditsRemaining = currentCredits - requiredCredits
    if (!updatedProfileError && updatedProfile && typeof updatedProfile.credits === 'number') {
      creditsRemaining = updatedProfile.credits
    }
    return NextResponse.json({ post: data, creditsRemaining })
  } catch (error) {
    console.error("Video generation error:", error)
    return NextResponse.json({ error: error?.message || "Unknown error" }, { status: 500 })
  }
} 