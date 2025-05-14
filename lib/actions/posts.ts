"use server"

import { createActionClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "./auth"
import { getBrandKit } from "./brand-kits"
import {
  generateCaption,
  generateImageWithGPTImage1,
  downloadImageToBuffer,
  type ImageOptions,
} from "@/lib/openai"
import type { Database, BrandKit } from "@/lib/supabase/database.types"
import type { Post } from "@/lib/supabase/database.types"
import { uploadToR2, getR2Url } from "@/lib/r2"
import { R2_BUCKET, R2_PUBLIC_URL, R2_PUBLIC_DOMAIN } from "@/lib/r2"

/**
 * Generate posts for a brand kit with advanced image options and post type.
 * @param brandKitId - The brand kit ID
 * @param count - Number of posts to generate
 * @param imageOptions - Advanced image options
 * @param postType - The type of post (regular, educational, personal, inspirational, product, promo)
 * @param postTypeData - Data specific to the post type (e.g. quote, topic, product, announcement, photoDesc)
 */
export async function generatePosts(brandKitId: string, count = 1, imageOptions?: ImageOptions, postType?: string, postTypeData?: any) {
  console.log(`Server: Starting generatePosts with brandKitId=${brandKitId}, count=${count}, postType=${postType}`)

  const user = await getCurrentUser()

  if (!user || !user.id) {
    console.log("Server: No authenticated user found")
    return { error: "You must be logged in to generate posts" }
  }

  // Check user credits before proceeding
  const supabase = createActionClient()
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", user.id)
    .single()

  if (profileError) {
    console.error("Server: Error fetching user credits:", profileError)
    return { error: "Failed to verify your credits. Please try again." }
  }

  const currentCredits = profileData?.credits || 0
  console.log(`Server: User has ${currentCredits} credits, needs ${count}`)

  // Check if user has enough credits
  if (currentCredits < count) {
    console.log(`Server: Not enough credits. User has ${currentCredits}, needs ${count}`)
    return { error: `Not enough credits. You need ${count} credits but only have ${currentCredits}.` }
  }

  // Deduct credits from user's profile
  const newCreditBalance = currentCredits - count
  console.log(`Server: Deducting credits. ${currentCredits} -> ${newCreditBalance}`)

  const { error: updateError } = await supabase.from("profiles").update({ credits: newCreditBalance }).eq("id", user.id)

  if (updateError) {
    console.error("Server: Error updating credits:", updateError)
    return { error: "Failed to update your credits. Please try again." }
  }

  console.log(`Server: Credits updated successfully. New balance: ${newCreditBalance}`)

  const brandKit = await getBrandKit(brandKitId)
  if (
    !brandKit ||
    typeof brandKit !== "object" ||
    !("id" in (brandKit as any)) ||
    typeof (brandKit as any).id !== "string"
  ) {
    // Refund credits if brand kit not found
    await supabase.from("profiles").update({ credits: currentCredits }).eq("id", user.id)
    console.log("Server: Brand kit not found, credits refunded")
    return { error: "Brand kit not found" }
  }
  const safeBrandKit = brandKit as BrandKit

  // Create posts in batches to avoid hitting limits
  const batchSize = 20
  const batches = Math.ceil(count / batchSize)
  const posts = []

  try {
    for (let i = 0; i < batches; i++) {
      const batchPosts: Database["public"]["Tables"]["posts"]["Insert"][] = []
      const currentBatchSize = Math.min(batchSize, count - i * batchSize)

      for (let j = 0; j < currentBatchSize; j++) {
        const postNumber = i * batchSize + j + 1
        console.log(`Server: Generating post ${postNumber}/${count}`)

        // Generate image using advanced options and post type
        let generatedImageResponse = null
        const kitAny = brandKit as any
        try {
          console.log("[generatePosts] Calling generateImageWithGPTImage1 with:", {
            brandKit: kitAny,
            postType,
            postTypeData,
            size: "1024x1024",
            quality: "low",
            imageOptions
          })
          generatedImageResponse = await generateImageWithGPTImage1(
            kitAny,
            postType,
            postTypeData,
            "1024x1024",
            "low",
            imageOptions
          )
          console.log("[generatePosts] generateImageWithGPTImage1 result:", generatedImageResponse)
        } catch (e) {
          console.error("[generatePosts] Error in generateImageWithGPTImage1:", e)
          if (kitAny.logo_url && typeof kitAny.logo_url === "string" && kitAny.logo_url.startsWith("data:image/")) {
            console.error("[generatePosts] Would fallback to generateImageWithLogoEdit, but it is not available.")
          } else {
            console.error("[generatePosts] No fallback available for image generation error.")
          }
        }
        let imageUrl = ""
        if (
          generatedImageResponse &&
          generatedImageResponse.data &&
          Array.isArray(generatedImageResponse.data) &&
          generatedImageResponse.data[0]
        ) {
          const imgData = generatedImageResponse.data[0]
          if (imgData.url) {
            // Download the image from OpenAI, upload to R2, and store the R2 URL
            try {
              const buffer = await downloadImageToBuffer(imgData.url)
              imageUrl = await uploadToR2(buffer, "image/png", `posts/${user.id}`)
              console.log("Downloaded OpenAI image and uploaded to R2:", imageUrl)
            } catch (err) {
              console.error("Failed to download/upload OpenAI image:", err)
              imageUrl = ""
            }
          } else if (imgData.b64_json) {
            // Upload base64 image to R2
            const buffer = Buffer.from(imgData.b64_json, "base64")
            imageUrl = await uploadToR2(buffer, "image/png", `posts/${user.id}`)
            console.log("Uploaded image to R2:", imageUrl)
          } else {
            console.error("No usable image data returned from OpenAI")
          }
        } else {
          console.error("No image data returned from OpenAI")
        }

        const post: Database["public"]["Tables"]["posts"]["Insert"] = {
          user_id: user.id,
          brand_kit_id: safeBrandKit.id,
          caption: "",
          image_url: imageUrl || "",
          status: "draft",
        }
        batchPosts.push(post)
      }

      const { data, error } = await supabase
        .from("posts")
        .insert(batchPosts as any)
        .select()

      if (error) {
        throw new Error(error.message)
      }

      posts.push(...(data || []))
    }

    revalidatePath("/dashboard")
    console.log(`Server: Successfully generated ${posts.length} posts`)
    return {
      success: `Generated ${posts.length} posts successfully! Used ${count} credits.`,
      data: posts,
      creditsRemaining: newCreditBalance,
    }
  } catch (error) {
    console.error("Server: Error during post generation:", error)

    // Attempt to refund credits if generation fails
    try {
      await supabase.from("profiles").update({ credits: currentCredits }).eq("id", user.id)
      console.log("Server: Credits refunded due to error")
    } catch (refundError) {
      console.error("Server: Failed to refund credits:", refundError)
    }

    return {
      error: `Failed to generate posts: ${error instanceof Error ? error.message : "Unknown error"}`,
      creditsRefunded: true,
    }
  }
}

export async function getPosts(
  brandKitId?: string,
  sortBy?: string,
  statusFilter?: string,
  captionSearch?: string,
): Promise<Post[]> {
  const user = await getCurrentUser()

  if (!user) {
    return []
  }

  const supabase = createActionClient()

  let query = supabase
    .from("posts")
    .select("id, caption, image_url, created_at, user_id, brand_kit_id, status, scheduled_for, updated_at")
    .eq("user_id", user.id as any)
    .order("created_at", { ascending: sortBy === "oldest" })
    .range(0, 99)

  if (brandKitId) {
    query = query.eq("brand_kit_id", brandKitId as any)
  }
  if (statusFilter && statusFilter !== "all") {
    query = query.eq("status", statusFilter as any)
  }
  if (captionSearch && captionSearch.trim() !== "") {
    query = query.ilike("caption", `%${captionSearch}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching posts:", error)
    return []
  }

  return (data || []) as Post[]
}

export async function getPost(id: string) {
  const supabase = createActionClient()

  const { data, error } = await supabase
    .from("posts")
    .select("*, brand_kits(name)")
    .eq("id", id as any)
    .single()

  if (error) {
    console.error("Error fetching post:", error)
    return null
  }

  return data
}

export async function updatePost(id: string, formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return { error: "You must be logged in to update a post" }
  }

  const supabase = createActionClient()

  const caption = formData.get("caption") as string
  const status = formData.get("status") as string
  const scheduledFor = formData.get("scheduledFor") as string

  const updateData: any = {
    caption,
    status,
  }

  if (scheduledFor) {
    updateData.scheduled_for = scheduledFor
  }

  const { data, error } = await supabase
    .from("posts")
    .update(updateData as any)
    .eq("id", id as any)
    .eq("user_id", user.id as any)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/scheduler")
  revalidatePath("/summary")

  return { success: "Post updated successfully!", data }
}

export async function deletePost(id: string) {
  const user = await getCurrentUser()

  if (!user) {
    return { error: "You must be logged in to delete a post" }
  }

  const supabase = createActionClient()

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", id as any)
    .eq("user_id", user.id as any)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/scheduler")
  revalidatePath("/summary")

  return { success: "Post deleted successfully!" }
}

export async function schedulePosts(postIds: string[], date: string, time: string) {
  const user = await getCurrentUser()

  if (!user) {
    return { error: "You must be logged in to schedule posts" }
  }

  const supabase = createActionClient()

  const scheduledFor = new Date(`${date}T${time}`).toISOString()

  const { data, error } = await supabase
    .from("posts")
    .update({
      status: "scheduled",
      scheduled_for: scheduledFor,
    } as any)
    .in("id", postIds as any)
    .eq("user_id", user.id as any)
    .select()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/scheduler")
  revalidatePath("/summary")

  return { success: `Scheduled ${data.length} posts successfully!`, data }
}

// Migration: Update all image_url values in posts to include the bucket name if missing
export async function migratePostImageUrls() {
  const supabase = createActionClient()
  const { data: posts, error } = await supabase.from("posts").select("id, image_url")
  if (error || !Array.isArray(posts)) {
    console.error("Error fetching posts for migration:", error)
    return { error: error?.message || "Failed to fetch posts" }
  }
  let updated = 0
  for (const post of posts as any[]) {
    if (typeof post.image_url === "string") {
      // If the URL starts with the old public URL or S3 endpoint, or contains the bucket, fix it
      let key = ""
      if (post.image_url.startsWith(R2_PUBLIC_URL)) {
        key = post.image_url.replace(`${R2_PUBLIC_URL}/`, "")
        if (key.startsWith(`${R2_BUCKET}/`)) key = key.replace(`${R2_BUCKET}/`, "")
      } else if (post.image_url.startsWith(R2_PUBLIC_DOMAIN)) {
        key = post.image_url.replace(`${R2_PUBLIC_DOMAIN}/`, "")
        if (key.startsWith(`${R2_BUCKET}/`)) key = key.replace(`${R2_BUCKET}/`, "")
      } else if (post.image_url.includes(R2_BUCKET)) {
        // e.g. ...r2.cloudflarestorage.com/bucket/key
        const idx = post.image_url.indexOf(`${R2_BUCKET}/`)
        if (idx !== -1) key = post.image_url.substring(idx + R2_BUCKET.length + 1)
      }
      if (key) {
        const newUrl = getR2Url(key)
        const { error: updateError } = await supabase
          .from("posts")
          .update({ image_url: newUrl } as any)
          .eq("id", (post as any).id as any)
        if (!updateError) updated++
      }
    }
  }
  return { success: `Migrated ${updated} post image URLs to new format.` }
}
