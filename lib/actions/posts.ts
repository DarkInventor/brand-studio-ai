"use server"

import { createActionClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "./auth"
import { getBrandKit } from "./brand-kits"
import { generateCaption, generateImageWithGPTImage1, generateImageWithLogoEdit, downloadImageToBuffer } from "@/lib/openai"
import type { Database, BrandKit } from "@/lib/supabase/database.types"
import type { Post } from "@/lib/supabase/database.types"

export async function generatePosts(brandKitId: string, count = 100) {
  const user = await getCurrentUser()

  if (!user || !user.id) {
    return { error: "You must be logged in to generate posts" }
  }

  const brandKit = await getBrandKit(brandKitId)
  if (!brandKit || typeof brandKit !== 'object' || !('id' in brandKit) || typeof brandKit.id !== 'string') {
    return { error: "Brand kit not found" }
  }
  const safeBrandKit = brandKit as BrandKit;

  const supabase = createActionClient()

  // Create posts in batches to avoid hitting limits
  const batchSize = 20
  const batches = Math.ceil(count / batchSize)
  const posts = []

  for (let i = 0; i < batches; i++) {
    const batchPosts = []
    const currentBatchSize = Math.min(batchSize, count - i * batchSize)

    for (let j = 0; j < currentBatchSize; j++) {
      const postNumber = i * batchSize + j + 1

      // Generate caption using OpenAI
      const captionRaw = await generateCaption(brandKit, "")
      const caption = typeof captionRaw === 'string' ? captionRaw : ''
      console.log('Generated caption:', caption)

      // Generate image using edits endpoint if logo is present, else use generations endpoint
      let generatedImageResponse = null;
      const kitAny = brandKit as any;
      if (kitAny.logo_url && typeof kitAny.logo_url === 'string' && kitAny.logo_url.startsWith('data:image/')) {
        try {
          generatedImageResponse = await generateImageWithLogoEdit(caption, kitAny)
        } catch (e) {
          console.error('Error using edits endpoint, falling back to generations:', e)
          generatedImageResponse = await generateImageWithGPTImage1(caption, kitAny)
        }
      } else {
        generatedImageResponse = await generateImageWithGPTImage1(caption, kitAny)
      }
      let imageUrl = ''
      if (
        generatedImageResponse &&
        generatedImageResponse.data &&
        Array.isArray(generatedImageResponse.data) &&
        generatedImageResponse.data[0]
      ) {
        const imgData = generatedImageResponse.data[0];
        if (imgData.url) {
          imageUrl = imgData.url;
          console.log('Using OpenAI image URL:', imageUrl);
        } else if (imgData.b64_json) {
          imageUrl = `data:image/png;base64,${imgData.b64_json}`;
          console.log('Using OpenAI b64_json as data URL');
        } else {
          console.error('No usable image data returned from OpenAI');
        }
      } else {
        console.error('No image data returned from OpenAI');
      }

      const post: Database["public"]["Tables"]["posts"]["Insert"] = {
        user_id: user.id,
        brand_kit_id: safeBrandKit.id,
        caption: caption || "",
        image_url: imageUrl || '',
        status: "draft"
      };
      batchPosts.push(post)
    }

    const { data, error } = await supabase.from("posts").insert(
      batchPosts.map(({ user_id, brand_kit_id, caption, image_url, status }) => ({
        user_id, brand_kit_id, caption, image_url, status: status || "draft"
      })) as Database["public"]["Tables"]["posts"]["Insert"][]
    ).select()

    if (error) {
      return { error: error.message }
    }

    posts.push(...(data || []))
  }

  revalidatePath("/dashboard")

  return { success: `Generated ${posts.length} posts successfully!`, data: posts }
}

export async function getPosts(brandKitId?: string): Promise<Post[]> {
  const user = await getCurrentUser()

  if (!user) {
    return []
  }

  const supabase = createActionClient()

  let query = supabase
    .from("posts")
    .select("id, caption, image_url, created_at, user_id, brand_kit_id, status, scheduled_for, updated_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(0, 23)

  if (brandKitId) {
    query = query.eq("brand_kit_id", brandKitId)
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

  const { data, error } = await supabase.from("posts").select("*, brand_kits(name)").eq("id", id).single()

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
    .update(updateData)
    .eq("id", id)
    .eq("user_id", user.id)
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

  const { error } = await supabase.from("posts").delete().eq("id", id).eq("user_id", user.id)

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
    })
    .in("id", postIds)
    .eq("user_id", user.id)
    .select()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/scheduler")
  revalidatePath("/summary")

  return { success: `Scheduled ${data.length} posts successfully!`, data }
}
