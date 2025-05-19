// import { NextRequest, NextResponse } from "next/server";
// import { generateTweet } from "@/lib/openai-tweet";

// export async function POST(req: NextRequest) {
//   try {
//     const { context, user } = await req.json();
//     const tweet = await generateTweet(context, user);
//     return NextResponse.json({ tweet });
//   } catch (error) {
//     console.error("/api/generate-tweet error:", error);
//     return NextResponse.json({ tweet: "", error: "Failed to generate tweet." }, { status: 500 });
//   }
// } 

import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { context, tweetType, style, mood, threadLength = 3 } = body

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate a single tweet
    if (tweetType === "standard") {
      const generatedTweet = generateSampleTweet(context, style, mood)
      return NextResponse.json({ tweet: generatedTweet })
    }
    // Generate a thread
    else if (tweetType === "thread") {
      const tweets = generateSampleThread(context, style, mood, threadLength)
      return NextResponse.json({ tweets })
    }

    return NextResponse.json({ tweet: "Failed to generate tweet" }, { status: 400 })
  } catch (error) {
    console.error("Error generating tweet:", error)
    return NextResponse.json({ error: "Failed to generate tweet" }, { status: 500 })
  }
}

// Sample tweet generator (replace with actual AI implementation)
function generateSampleTweet(context: string, style: string, mood: string): string {
  // This is a placeholder. In a real implementation, you would call an AI service.
  const styles: Record<string, string[]> = {
    Professional: ["Just published", "Excited to announce", "New research shows"],
    Casual: ["Check this out!", "Can't believe", "So happy to share"],
    Humorous: ["LOL at", "You won't believe", "This made my day:"],
    Informative: ["Did you know", "Here's an interesting fact:", "Research indicates"],
    Persuasive: ["Here's why you should", "The best reason to", "Don't miss out on"],
  }

  const moods: Record<string, string[]> = {
    Neutral: ["", "Today", "Just now"],
    Excited: ["🚀", "Wow!", "Amazing!"],
    Curious: ["Hmm...", "I wonder", "Interesting question:"],
    Thoughtful: ["Been thinking about", "On reflection", "Consider this:"],
    Urgent: ["Breaking:", "Urgent update:", "Don't wait:"],
  }

  const stylePrefix = styles[style]?.[Math.floor(Math.random() * 3)] || ""
  const moodPrefix = moods[mood]?.[Math.floor(Math.random() * 3)] || ""

  // Create a more sophisticated tweet based on the input
  let tweet = ""

  if (context.length < 20) {
    // For short inputs, expand them
    tweet = `${moodPrefix} ${stylePrefix} ${context}. This is something I've been working on and wanted to share with all of you. What do you think? #sharing #feedback`
  } else if (context.includes("?")) {
    // For questions
    tweet = `${moodPrefix} ${stylePrefix} "${context}" - This is a great question that many people are asking. My thoughts: we need to consider multiple perspectives here.`
  } else {
    // For statements
    const words = context.split(" ")
    const firstPart = words.slice(0, words.length / 2).join(" ")
    tweet = `${moodPrefix} ${stylePrefix} ${firstPart}... and that's just the beginning! ${context} #thoughtleadership`
  }

  // Ensure the tweet is within limits
  return tweet.slice(0, 280)
}

// Sample thread generator
function generateSampleThread(context: string, style: string, mood: string, count: number): string[] {
  const thread: string[] = []

  // First tweet is based on the context
  thread.push(generateSampleTweet(context, style, mood))

  // Generate subsequent tweets
  for (let i = 1; i < count; i++) {
    const tweetNumber = i + 1
    let nextTweet = ""

    switch (i % 5) {
      case 0:
        nextTweet = `${tweetNumber}/ To continue this thread, let's dive deeper into the implications. When we consider ${context.split(" ").slice(-3).join(" ")}, we need to think about the broader context.`
        break
      case 1:
        nextTweet = `${tweetNumber}/ Building on my previous point, here's something many people miss: the connection between ${context.split(" ").slice(0, 3).join(" ")} and future opportunities.`
        break
      case 2:
        nextTweet = `${tweetNumber}/ Let me share a quick example that illustrates this perfectly. Recently, I encountered a situation where this exact approach made all the difference.`
        break
      case 3:
        nextTweet = `${tweetNumber}/ A common question I get is "How do I apply this to my own situation?" Here's my advice based on years of experience in this area.`
        break
      case 4:
        nextTweet = `${tweetNumber}/ To wrap up this thread: remember that ${context.split(" ").slice(-4).join(" ")} is just the beginning. The real magic happens when you take consistent action.`
        break
    }

    thread.push(nextTweet)
  }

  return thread
}
