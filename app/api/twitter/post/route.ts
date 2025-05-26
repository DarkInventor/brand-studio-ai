import { NextRequest, NextResponse } from "next/server";

// Twitter API v2 endpoints
const TWITTER_API_BASE = "https://api.twitter.com/2";
const TWITTER_UPLOAD_BASE = "https://upload.twitter.com/1.1";

interface TwitterCredentials {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessTokenSecret: string;
}

// Helper function to create OAuth 1.0a signature for Twitter API
async function createTwitterAuthHeader(
  method: string,
  url: string,
  params: Record<string, string>,
  credentials: TwitterCredentials
): Promise<string> {
  // This is a simplified version - in production, use a proper OAuth library
  // For now, we'll use Bearer token authentication which is simpler
  return `Bearer ${credentials.accessToken}`;
}

// Upload image to Twitter
async function uploadImageToTwitter(
  imageUrl: string,
  credentials: TwitterCredentials
): Promise<string | null> {
  try {
    // First, fetch the image
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    
    // Convert to base64
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    
    // Upload to Twitter using media upload endpoint
    const uploadResponse = await fetch(`${TWITTER_UPLOAD_BASE}/media/upload.json`, {
      method: 'POST',
      headers: {
        'Authorization': await createTwitterAuthHeader('POST', `${TWITTER_UPLOAD_BASE}/media/upload.json`, {}, credentials),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        media_data: base64Image,
        media_category: 'tweet_image'
      })
    });
    
    const uploadData = await uploadResponse.json();
    
    if (uploadData.media_id_string) {
      return uploadData.media_id_string;
    }
    
    return null;
  } catch (error) {
    console.error('Error uploading image to Twitter:', error);
    return null;
  }
}

// Post a single tweet
async function postTweet(
  text: string,
  mediaId: string | null,
  replyToTweetId: string | null,
  credentials: TwitterCredentials
): Promise<{ id: string } | null> {
  try {
    const tweetData: any = {
      text: text
    };
    
    if (mediaId) {
      tweetData.media = {
        media_ids: [mediaId]
      };
    }
    
    if (replyToTweetId) {
      tweetData.reply = {
        in_reply_to_tweet_id: replyToTweetId
      };
    }
    
    const response = await fetch(`${TWITTER_API_BASE}/tweets`, {
      method: 'POST',
      headers: {
        'Authorization': await createTwitterAuthHeader('POST', `${TWITTER_API_BASE}/tweets`, {}, credentials),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tweetData)
    });
    
    const data = await response.json();
    
    if (data.data && data.data.id) {
      return { id: data.data.id };
    }
    
    console.error('Twitter API error:', data);
    return null;
  } catch (error) {
    console.error('Error posting tweet:', error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { 
      tweets, 
      images, 
      brandKitId,
      isThread = false 
    } = await req.json();
    
    if (!tweets || !Array.isArray(tweets) || tweets.length === 0) {
      return NextResponse.json({ error: "No tweets provided" }, { status: 400 });
    }
    
    if (!brandKitId) {
      return NextResponse.json({ error: "Brand kit ID required" }, { status: 400 });
    }
    
    // TODO: Get Twitter credentials from brand kit
    // For now, return a mock response since we don't have Twitter API setup
    const mockCredentials: TwitterCredentials = {
      apiKey: process.env.TWITTER_API_KEY || '',
      apiSecret: process.env.TWITTER_API_SECRET || '',
      accessToken: process.env.TWITTER_ACCESS_TOKEN || '',
      accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET || ''
    };
    
    // Check if credentials are available
    if (!mockCredentials.apiKey || !mockCredentials.accessToken) {
      return NextResponse.json({ 
        error: "Twitter API credentials not configured",
        message: "Please set up Twitter API credentials in environment variables"
      }, { status: 400 });
    }
    
    const results = [];
    let previousTweetId: string | null = null;
    
    for (let i = 0; i < tweets.length; i++) {
      const tweetText = tweets[i];
      const imageUrl = images && images[i] ? images[i] : null;
      
      // Upload image if provided
      let mediaId: string | null = null;
      if (imageUrl) {
        mediaId = await uploadImageToTwitter(imageUrl, mockCredentials);
      }
      
      // Post the tweet
      const result = await postTweet(
        tweetText,
        mediaId,
        isThread ? previousTweetId : null,
        mockCredentials
      );
      
      if (result) {
        results.push(result);
        previousTweetId = result.id;
      } else {
        return NextResponse.json({ 
          error: `Failed to post tweet ${i + 1}`,
          partialResults: results
        }, { status: 500 });
      }
    }
    
    return NextResponse.json({ 
      success: true,
      tweets: results,
      message: isThread ? "Thread posted successfully!" : "Tweet posted successfully!"
    });
    
  } catch (error) {
    console.error("Error in Twitter post API:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
} 