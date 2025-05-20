import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

interface TweetGenerationOptions {
  context: string
  user: { full_name?: string }
  tweetType?: string
  threadLength?: number
  style?: string
  mood?: string
  existingThread?: string[]
  brandKit?: any
}

export async function generateTweet(options: TweetGenerationOptions) {
  const {
    context,
    user,
    tweetType = "standard",
    threadLength = 3,
    style = "Professional",
    mood = "Neutral",
    existingThread = [],
    brandKit = null,
  } = options

  // Compose brand kit info for the prompt
  const brandKitInfo = brandKit
    ? `\nBrand Name: ${brandKit.name}\nBrand Tone: ${brandKit.brand_tone || "N/A"}\nPrimary Color: ${brandKit.primary_color}\nSecondary Color: ${brandKit.secondary_color}\nBrand Description: ${brandKit.description || ""}`
    : ""

  // For a single tweet
  if (tweetType === "standard") {
    const prompt = `
      Write a concise, engaging viral tweet (max 280 characters) for the following context: "${context}".
      Style: ${style}
      Mood: ${mood}
      Personalize it for the user: ${user?.full_name || "User"}.
      ${brandKitInfo}
    `

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a witty, concise Twitter viral content creator." },
        { role: "user", content: prompt },
      ],
      max_tokens: 100,
      temperature: 0.8,
    })

    let tweet = completion.choices[0].message.content || ""
    if (tweet.length > 280) tweet = tweet.slice(0, 280)

    return { tweet }
  }
  // For a thread
  else if (tweetType === "thread") {
    // Create a prompt for thread generation
    let threadPrompt = `
      Create a viral Twitter thread with ${threadLength} tweets about: "${context}".
      Style: ${style}
      Mood: ${mood}
      ${brandKitInfo}
      Each tweet must be under 280 characters.
      Format your response as a numbered list, with each tweet on a new line starting with "Tweet 1:", "Tweet 2:", etc.
      Make the thread flow naturally from one tweet to the next.
      Personalize it for the user: ${user?.full_name || "User"}.
    `

    // If there are existing tweets in the thread, include them
    if (existingThread.length > 0) {
      threadPrompt += `\n\nHere are the existing tweets in the thread that you should continue from or improve:`
      existingThread.forEach((tweetContent, index) => {
        if (tweetContent) {
          threadPrompt += `\nTweet ${index + 1}: ${tweetContent}`
        }
      })
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an expert at creating engaging Twitter threads that captivate readers and drive engagement.",
        },
        { role: "user", content: threadPrompt },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    })

    const response = completion.choices[0].message.content || ""

    // Parse the response to extract individual tweets
    const tweetRegex = /Tweet \d+: (.*?)(?=Tweet \d+:|$)/gs
    const matches = [...response.matchAll(tweetRegex)]

    let tweets: string[] = []

    if (matches.length > 0) {
      // Extract tweets from regex matches
      tweets = matches.map((match) => {
        let tweet = match[1].trim()
        if (tweet.length > 280) tweet = tweet.slice(0, 280)
        return tweet
      })
    } else {
      // Fallback: split by newlines and clean up
      tweets = response
        .split("\n")
        .filter((line) => line.trim().length > 0)
        .map((line) => {
          // Remove any numbering or prefixes
          let tweet = line.replace(/^\d+[.)]\s*|^Tweet \d+:\s*/i, "").trim()
          if (tweet.length > 280) tweet = tweet.slice(0, 280)
          return tweet
        })
    }

    // Ensure we have the requested number of tweets
    while (tweets.length < threadLength) {
      tweets.push(`Continue the thread about ${context}...`)
    }

    // Trim to requested length
    tweets = tweets.slice(0, threadLength)

    return { tweets }
  }

  // Default fallback
  return { tweet: `Thinking about ${context}...` }
}
