import { NextRequest, NextResponse } from "next/server";
import { createActionClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/supabase/database.types";

// Type guard to ensure we only process valid posts
function isPost(obj: any): obj is Post {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.id === "string" &&
    // Ensure essential fields for posting are present
    (obj.caption !== undefined || obj.image_url !== undefined || obj.video_url !== undefined) && 
    typeof obj.status === "string"
  );
}

async function postToPlatform(post: Post): Promise<boolean> {
  // Mock posting functions (replace with real API calls)
  // These should ideally be moved to a shared lib/actions file if used elsewhere
  async function postToTwitter(post: Post) {
    console.log(`Mock posting to Twitter: ${post.id}`);
    // TODO: Integrate with Twitter API
    return true;
  }
  async function postToLinkedIn(post: Post) {
    console.log(`Mock posting to LinkedIn: ${post.id}`);
    // TODO: Integrate with LinkedIn API
    return true;
  }
  async function postToTikTok(post: Post) {
    console.log(`Mock posting to TikTok: ${post.id}`);
    // TODO: Integrate with TikTok API
    if (!post.video_url) {
      console.error("No video_url for TikTok post", post.id);
      return false;
    }
    // Actual TikTok integration logic would go here
    return true;
  }

  if (post.platform === "twitter") {
    return await postToTwitter(post);
  } else if (post.platform === "linkedin") {
    return await postToLinkedIn(post);
  } else if (post.platform === "tiktok") {
    return await postToTikTok(post);
  } else if (post.scheduled_platform === "twitter") { // Fallback to scheduled_platform if platform is not set
    return await postToTwitter(post);
  } else if (post.scheduled_platform === "linkedin") {
    return await postToLinkedIn(post);
  } else if (post.scheduled_platform === "tiktok") {
    return await postToTikTok(post);
  }
  console.error("Unsupported platform for post:", post.id, post.platform, post.scheduled_platform);
  return false;
}

export async function POST(req: NextRequest) {
  const supabase = createActionClient();
  try {
    const { postId, brandKitId } = await req.json();

    if (!postId || !brandKitId) {
      return NextResponse.json({ error: "Missing postId or brandKitId" }, { status: 400 });
    }

    // Fetch the post details
    const { data: postData, error: fetchError } = await supabase
      .from("posts")
      .select("*")
      .eq("id", postId)
      .eq("brand_kit_id", brandKitId)
      .single();

    if (fetchError || !postData) {
      return NextResponse.json({ error: `Post not found or error fetching: ${fetchError?.message}` }, { status: 404 });
    }

    if (!isPost(postData)) {
        return NextResponse.json({ error: "Invalid post data structure or missing essential fields." }, { status: 400 });
    }

    const post: Post = postData;

    // Determine the platform. Use `platform` if available, otherwise fallback to `scheduled_platform`.
    const platformToPost = post.platform || post.scheduled_platform;
    if (!platformToPost) {
        return NextResponse.json({ error: "No platform specified for posting." }, { status: 400 });
    }
    // Ensure the post object has the platform field set for the posting function
    const postForPlatform = { ...post, platform: platformToPost };

    let posted = false;
    try {
      posted = await postToPlatform(postForPlatform);
    } catch (err: any) {
      console.error(`Error during postToPlatform for ${platformToPost}:`, err);
      return NextResponse.json({ error: `Failed to post to ${platformToPost}: ${err?.message || String(err)}` }, { status: 500 });
    }

    if (posted) {
      const updatePayload = {
        status: "posted",
        posted_at: new Date().toISOString(),
        scheduled_for: null,
      };
      const postIdString = String(post.id);

      const { error: updateError } = await supabase
        .from("posts")
        .update(updatePayload as any)
        .eq("id" as any, postIdString);

      if (updateError) {
        console.error("Error updating post status:", updateError);
        // If updating Supabase fails, we should ideally have a retry mechanism or log for manual intervention
        return NextResponse.json({ success: true, message: "Posted successfully, but failed to update status in DB.", postId: post.id }, { status: 200 });
      }
      return NextResponse.json({ success: true, message: "Post published successfully!", postId: post.id }, { status: 200 });
    } else {
      return NextResponse.json({ error: `Failed to post to ${platformToPost}. The posting function returned false.` }, { status: 500 });
    }

  } catch (error: any) {
    console.error("General error in /api/scheduler/postnow:", error);
    return NextResponse.json({ error: `An unexpected error occurred: ${error.message}` }, { status: 500 });
  }
} 