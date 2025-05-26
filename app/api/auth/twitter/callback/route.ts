import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  // Debug: log the user and user_metadata
  console.log('Supabase user:', user);
  if (user) {
    console.log('user.user_metadata:', user.user_metadata);
    console.log('user.app_metadata:', user.app_metadata);
  }

  if (!user || user.app_metadata.provider !== 'twitter') {
    // Not a Twitter login
    return NextResponse.redirect('/scheduler?twitter=error');
  }

  const meta = user.user_metadata || {};
  await supabase
    .from('profiles')
    .update({
      twitter_username: meta.user_name || null,
      twitter_display_name: meta.full_name || null,
      twitter_profile_image_url: meta.avatar_url || null,
      twitter_user_id: meta.provider_id || null,
      twitter_bio: meta.description || null,
      twitter_followers_count: meta.followers_count || 0,
      twitter_following_count: meta.friends_count || 0,
      twitter_verified: meta.verified || false,
      twitter_account_created_at: meta.created_at ? new Date(meta.created_at).toISOString() : null,
      twitter_last_updated: new Date().toISOString(),
    })
    .eq('id', user.id);

  // Redirect to scheduler (or wherever)
  return NextResponse.redirect('/scheduler?twitter=success');
} 