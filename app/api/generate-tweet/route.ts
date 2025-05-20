import { generateTweet } from "@/lib/openai-tweet"
import { NextResponse } from "next/server"


export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      context,
      user,
      tweetType = "standard",
      style = "Professional",
      mood = "Neutral",
      threadLength = 3,
      existingThread = [],
      brandKit = null,
    } = body

    // Generate tweet(s) using OpenAI
    const result = await generateTweet({
      context,
      user,
      tweetType,
      style,
      mood,
      threadLength,
      existingThread,
      brandKit,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error generating tweet:", error)
    return NextResponse.json({ error: "Failed to generate tweet" }, { status: 500 })
  }
}
