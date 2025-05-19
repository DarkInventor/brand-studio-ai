import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const brandKitId = req.nextUrl.searchParams.get("brandKitId");

  if (!code || !brandKitId) {
    return NextResponse.json({ error: "Missing code or brandKitId" }, { status: 400 });
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL}/scheduler`;
  const clientId = process.env.FACEBOOK_CLIENT_ID!;
  const clientSecret = process.env.FACEBOOK_CLIENT_SECRET!;

  // Step 1: Get short-lived access token
  const tokenRes = await fetch(
    `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&client_secret=${clientSecret}&code=${code}`,
    { method: "GET" }
  );
  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    return NextResponse.json({ error: "Failed to get access token", details: tokenData }, { status: 400 });
  }

  // Step 2: Get long-lived access token
  const longTokenRes = await fetch(
    `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${clientId}&client_secret=${clientSecret}&fb_exchange_token=${tokenData.access_token}`,
    { method: "GET" }
  );
  const longTokenData = await longTokenRes.json();
  const accessToken = longTokenData.access_token || tokenData.access_token;

  // Step 3: Get user pages
  const pagesRes = await fetch(
    `https://graph.facebook.com/v19.0/me/accounts?access_token=${accessToken}`,
    { method: "GET" }
  );
  const pagesData = await pagesRes.json();
  if (!pagesData.data || !pagesData.data.length) {
    return NextResponse.json({ error: "No Facebook pages found" }, { status: 400 });
  }
  const page = pagesData.data[0];

  // Step 4: Get Instagram business account ID
  const igRes = await fetch(
    `https://graph.facebook.com/v19.0/${page.id}?fields=instagram_business_account&access_token=${accessToken}`,
    { method: "GET" }
  );
  const igData = await igRes.json();
  const instagramId = igData.instagram_business_account?.id;
  if (!instagramId) {
    return NextResponse.json({ error: "No Instagram business account linked to this page" }, { status: 400 });
  }

  // Step 5: Get Instagram profile info
  const profileRes = await fetch(
    `https://graph.facebook.com/v19.0/${instagramId}?fields=username,name,profile_picture_url&access_token=${accessToken}`,
    { method: "GET" }
  );
  const profileData = await profileRes.json();

  // Step 6: Store in brand_kits
  const supabase = createServerClient();
  await supabase
    .from("brand_kits")
    .update({
      instagram_access_token: accessToken,
      instagram_id: instagramId,
      instagram_username: profileData.username,
      instagram_name: profileData.name,
      instagram_profile_picture_url: profileData.profile_picture_url,
    })
    .eq("id", brandKitId);

  return NextResponse.json({ success: true });
} 