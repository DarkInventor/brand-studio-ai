import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      topic,
      title,
      postType = "standard",
      tone = "Professional",
      industry = "",
      formalityLevel = 70,
      includeHashtags = true,
      hasImage = false,
      selectedHashtags = [],
      brandKit = null,
    } = body

    // Compose brand kit info for the prompt
    let brandKitInfo = ""
    if (brandKit) {
      brandKitInfo = `\nBrand Name: ${brandKit.name || ""}`
      if (brandKit.brand_tone) brandKitInfo += `\nBrand Tone: ${brandKit.brand_tone}`
      if (brandKit.primary_color) brandKitInfo += `\nPrimary Color: ${brandKit.primary_color}`
      if (brandKit.secondary_color) brandKitInfo += `\nSecondary Color: ${brandKit.secondary_color}`
      if (brandKit.logo_url) brandKitInfo += `\nBrand Logo URL: ${brandKit.logo_url}`
      if (brandKit.description) brandKitInfo += `\nBrand Description: ${brandKit.description}`
    }

    // Convert formality level to temperature (0.1-1.0)
    const temperature = 0.1 + (formalityLevel / 100) * 0.9

    // Create prompt based on post type and parameters
    let prompt = ""

    if (postType === "article") {
      prompt = `
        ${brandKitInfo}
        Write a professional LinkedIn article post about: "${topic}".
        ${title ? `The article title is: "${title}"` : ""}
        Tone: ${tone}
        ${industry ? `Target industry: ${industry}` : ""}
        Formality level: ${formalityLevel}% (higher means more formal)
        ${hasImage ? "The post includes an image, so reference it naturally." : ""}
        
        The post should be engaging, insightful, and formatted appropriately for LinkedIn.
        Include line breaks for readability.
        Maximum length: 1300 characters.
      `
    } else {
      prompt = `
        ${brandKitInfo}
        Write an engaging LinkedIn post about: "${topic}".
        Tone: ${tone}
        ${industry ? `Target industry: ${industry}` : ""}
        Formality level: ${formalityLevel}% (higher means more formal)
        ${hasImage ? "The post includes an image, so reference it naturally." : ""}
        
        The post should be conversational yet professional, with a clear message.
        Include line breaks for readability.
        Maximum length: 1300 characters.
      `
    }

    // Add hashtag instructions if needed
    if (includeHashtags && selectedHashtags.length > 0) {
      prompt += `\nIncorporate these hashtags naturally: ${selectedHashtags.join(", ")}`
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an expert LinkedIn content creator who specializes in writing engaging, professional posts that drive engagement and build personal brands.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 600,
      temperature,
    })

    let suggestion = completion.choices[0].message.content || ""

    // Trim if too long
    if (suggestion.length > 1300) {
      suggestion = suggestion.slice(0, 1300)
    }

    // Generate hashtags if requested and not already provided
    let hashtags: string[] = []
    if (includeHashtags && selectedHashtags.length === 0) {
      const hashtagPrompt = `
        Generate 5 relevant LinkedIn hashtags for this post about: "${topic}"
        Make them specific, trending, and relevant to the content.
        Format as a comma-separated list without explanations.
        Each hashtag should start with # and have no spaces.
      `

      const hashtagCompletion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You generate relevant, trending hashtags for LinkedIn posts." },
          { role: "user", content: hashtagPrompt },
        ],
        max_tokens: 100,
        temperature: 0.7,
      })

      const hashtagResponse = hashtagCompletion.choices[0].message.content || ""
      hashtags = hashtagResponse
        .split(/,|\n/)
        .map((tag) => tag.trim())
        .filter((tag) => tag.startsWith("#"))
        .slice(0, 5)
    }

    return NextResponse.json({
      suggestion,
      hashtags: hashtags.length > 0 ? hashtags : selectedHashtags,
    })
  } catch (error) {
    console.error("Error generating LinkedIn post:", error)
    return NextResponse.json({ error: "Failed to generate LinkedIn post" }, { status: 500 })
  }
}
