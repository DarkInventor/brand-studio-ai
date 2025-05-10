import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { user_id, image_url, caption } = await req.json();
    if (!user_id || !image_url || !caption) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    // Fetch the user's Instagram access token from Supabase
    const { data: profile, error } = await supabase.from('profiles').select('instagram_access_token').eq('id', user_id).single();
    if (error || !profile || !profile.instagram_access_token) {
      return NextResponse.json({ error: 'No Instagram access token found for user' }, { status: 400 })
    }
    const access_token = profile.instagram_access_token;
    // Step 1: Create media object
    const mediaRes = await fetch(
      `https://graph.facebook.com/v19.0/me/media?image_url=${encodeURIComponent(image_url)}&caption=${encodeURIComponent(caption)}&access_token=${access_token}`,
      { method: 'POST' }
    );
    const mediaData = await mediaRes.json();
    console.log('Media creation response:', mediaData);
    if (!mediaData.id) {
      return NextResponse.json({ error: 'Failed to create media', details: mediaData }, { status: 500 });
    }
    // Step 2: Publish media object
    const publishRes = await fetch(
      `https://graph.facebook.com/v19.0/me/media_publish?creation_id=${mediaData.id}&access_token=${access_token}`,
      { method: 'POST' }
    );
    const publishData = await publishRes.json();
    console.log('Publish response:', publishData);
    return NextResponse.json(publishData);
  } catch (e: any) {
    console.error('Publish Instagram error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
} 