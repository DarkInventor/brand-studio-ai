import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { postId, brandKitId } = await req.json();
  if (!postId || !brandKitId) {
    return NextResponse.json({ error: "Missing postId or brandKitId" }, { status: 400 });
  }

  const supabase = createServerClient();

  // Get brand kit Instagram info
  const { data: kit } = await supabase
    .from("brand_kits")
    .select("instagram_access_token, instagram_id")
    .eq("id", brandKitId)
    .single();

  if (!kit?.instagram_access_token || !kit?.instagram_id) {
    return NextResponse.json({ error: "Instagram not connected for this brand kit" }, { status: 400 });
  }

  // Get post info
  const { data: post } = await supabase.from("posts").select("*").eq("id", postId).single();
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  // Step 1: Create media container
  const mediaRes = await fetch(
    `https://graph.facebook.com/v19.0/${kit.instagram_id}/media`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url: post.image_url,
        caption: post.caption,
        access_token: kit.instagram_access_token,
      }),
    }
  );
  const mediaData = await mediaRes.json();
  if (!mediaData.id) {
    return NextResponse.json({ error: "Failed to create media container", details: mediaData }, { status: 400 });
  }

  // Step 2: Publish media
  const publishRes = await fetch(
    `https://graph.facebook.com/v19.0/${kit.instagram_id}/media_publish`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creation_id: mediaData.id,
        access_token: kit.instagram_access_token,
      }),
    }
  );
  const publishData = await publishRes.json();
  if (!publishData.id) {
    return NextResponse.json({ error: "Failed to publish media", details: publishData }, { status: 400 });
  }

  // Step 3: Update post status in Supabase
  await supabase.from("posts").update({ status: "posted" }).eq("id", postId);

  return NextResponse.json({ success: true });
} 