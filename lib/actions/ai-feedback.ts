"use server"

import OpenAI from "openai"
import { createActionClient } from "@/lib/supabase/server"
import { getCurrentUser } from "./auth"

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Update the AIFeedbackResponse type to include brand kit optimization suggestions
export type AIFeedbackResponse = {
  contentSuggestions: string[]
  brandConsistency: {
    score: number
    feedback: string
  }
  captionQuality: {
    score: number
    feedback: string
  }
  overallStrategy: string
  brandKitOptimizations?: {
    nameRecommendations?: string
    descriptionRecommendations?: string
    toneRecommendations?: string
    colorRecommendations?: string
  }
  id?: string
  created_at?: string
  error?: string
}

// Function to retrieve past analytics feedback
export async function getPastAnalytics(limit = 5): Promise<AIFeedbackResponse[]> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return []
    }

    const supabase = createActionClient()
    const { data, error } = await supabase
      .from("analytics_feedback")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching past analytics:", error)
      return []
    }

    // Transform database records to AIFeedbackResponse format
    return data.map((record) => ({
      id: record.id,
      created_at: record.created_at,
      contentSuggestions: record.content_suggestions || [],
      brandConsistency: {
        score: record.brand_consistency_score || 0,
        feedback: record.brand_consistency_feedback || "",
      },
      captionQuality: {
        score: record.caption_quality_score || 0,
        feedback: record.caption_quality_feedback || "",
      },
      overallStrategy: record.overall_strategy || "",
      brandKitOptimizations: record.brand_kit_optimizations || {},
    }))
  } catch (error) {
    console.error("Error in getPastAnalytics:", error)
    return []
  }
}

// Function to save analytics feedback to Supabase
async function saveAnalyticsFeedback(
  userId: string,
  timeRange: string,
  feedback: AIFeedbackResponse,
  postCount: number,
  brandKitCount: number,
): Promise<string | null> {
  try {
    const supabase = createActionClient()

    const { data, error } = await supabase
      .from("analytics_feedback")
      .insert({
        user_id: userId,
        time_range: timeRange,
        brand_consistency_score: feedback.brandConsistency.score,
        caption_quality_score: feedback.captionQuality.score,
        content_suggestions: feedback.contentSuggestions,
        brand_consistency_feedback: feedback.brandConsistency.feedback,
        caption_quality_feedback: feedback.captionQuality.feedback,
        overall_strategy: feedback.overallStrategy,
        brand_kit_optimizations: feedback.brandKitOptimizations || {},
        post_count: postCount,
        brand_kit_count: brandKitCount,
      })
      .select("id")
      .single()

    if (error) {
      console.error("Error saving analytics feedback:", error)
      return null
    }

    return data.id
  } catch (error) {
    console.error("Error in saveAnalyticsFeedback:", error)
    return null
  }
}

export async function generateAIFeedback(timeRange = "all"): Promise<AIFeedbackResponse> {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return {
        contentSuggestions: [],
        brandConsistency: { score: 0, feedback: "" },
        captionQuality: { score: 0, feedback: "" },
        overallStrategy: "",
        error: "Not authenticated",
      }
    }

    const supabase = createActionClient()

    // Fetch posts and brand kits
    const { data: posts, error: postsError } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(30)

    const { data: brandKits, error: brandKitsError } = await supabase
      .from("brand_kits")
      .select("*")
      .eq("user_id", user.id)

    if (postsError || brandKitsError || !posts || !brandKits) {
      return {
        contentSuggestions: [],
        brandConsistency: { score: 0, feedback: "" },
        captionQuality: { score: 0, feedback: "" },
        overallStrategy: "",
        error: postsError?.message || brandKitsError?.message || "Error fetching data",
      }
    }

    // Filter posts based on time range if needed
    let filteredPosts = [...posts]
    if (timeRange !== "all") {
      const now = new Date()
      const cutoffDate = new Date()

      switch (timeRange) {
        case "7days":
          cutoffDate.setDate(now.getDate() - 7)
          break
        case "30days":
          cutoffDate.setDate(now.getDate() - 30)
          break
        case "90days":
          cutoffDate.setDate(now.getDate() - 90)
          break
      }

      filteredPosts = posts.filter((post) => {
        const postDate = new Date(post.updated_at || post.created_at)
        return postDate >= cutoffDate
      })
    }

    // If no posts, return empty feedback
    if (filteredPosts.length === 0) {
      return {
        contentSuggestions: [],
        brandConsistency: { score: 0, feedback: "No posts available for analysis" },
        captionQuality: { score: 0, feedback: "No posts available for analysis" },
        overallStrategy: "Start creating content to receive AI feedback",
        error: undefined,
      }
    }

    // Prepare data for OpenAI
    const brandKitDetails = brandKits.map((kit) => ({
      id: kit.id,
      name: kit.name,
      description: kit.description || "No description provided",
      tone: kit.brand_tone || "Not specified",
      primaryColor: kit.primary_color,
      secondaryColor: kit.secondary_color,
      postCount: filteredPosts.filter((p) => p.brand_kit_id === kit.id).length,
    }))

    const postCaptions = filteredPosts.map((post) => post.caption).filter(Boolean)
    const postsByBrand = brandKits.map((kit) => ({
      brandName: kit.name,
      brandId: kit.id,
      postCount: filteredPosts.filter((p) => p.brand_kit_id === kit.id).length,
    }))

    // Update the prompt to include analysis of brand kit details for better content generation
    const prompt = `
  You are an expert social media content strategist and brand consultant. Analyze the following data about a user's content and brand kits to provide specific, actionable feedback:
  
  Brand Kits (${brandKitDetails.length}):
  ${brandKitDetails
    .map(
      (kit) => `
    - Name: ${kit.name}
    - Description: ${kit.description}
    - Tone: ${kit.tone}
    - Colors: Primary ${kit.primaryColor}, Secondary ${kit.secondaryColor}
    - Post Count: ${kit.postCount}
  `,
    )
    .join("\n")}
  
  Post Distribution by Brand:
  ${postsByBrand.map((b) => `${b.brandName}: ${b.postCount} posts`).join("\n")}
  
  Recent Post Captions (${postCaptions.length}):
  ${postCaptions
    .slice(0, 15)
    .map((caption) => `- ${caption}`)
    .join("\n")}
  
  Based on this data, provide:
  1. 3-5 specific content suggestions for improvement
  2. Brand consistency analysis (score 1-10 and specific feedback)
  3. Caption quality analysis (score 1-10 and specific feedback)
  4. Overall content strategy recommendation
  5. Brand kit optimization suggestions to improve image and caption generation results:
     - Analyze if brand names are distinctive and memorable
     - Evaluate if brand descriptions are detailed enough for AI to understand the brand identity
     - Assess if brand tones are specific and clear for content generation
     - Suggest color palette improvements if needed
  
  Format your response as JSON with the following structure:
  {
    "contentSuggestions": ["suggestion1", "suggestion2", "suggestion3"],
    "brandConsistency": {
      "score": 7,
      "feedback": "Your brand consistency feedback here"
    },
    "captionQuality": {
      "score": 8,
      "feedback": "Your caption quality feedback here"
    },
    "overallStrategy": "Your overall strategy recommendation here",
    "brandKitOptimizations": {
      "nameRecommendations": "Suggestions to improve brand names for better AI generation",
      "descriptionRecommendations": "How to enhance brand descriptions for better AI results",
      "toneRecommendations": "How to specify brand tone more effectively",
      "colorRecommendations": "Suggestions for color palette improvements if applicable"
    }
  }
`

    // Update the OpenAI API call to use the enhanced system message
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an expert social media content strategist and brand consultant providing actionable feedback. Focus on how users can optimize their brand kit details to get better AI-generated images and captions.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    })

    // Parse the response
    const responseText = completion.choices[0]?.message?.content || ""

    try {
      const parsedResponse = JSON.parse(responseText) as AIFeedbackResponse

      // Save the feedback to Supabase
      const feedbackId = await saveAnalyticsFeedback(
        user.id,
        timeRange,
        parsedResponse,
        filteredPosts.length,
        brandKits.length,
      )

      // Add the ID to the response
      if (feedbackId) {
        parsedResponse.id = feedbackId
        parsedResponse.created_at = new Date().toISOString()
      }

      return parsedResponse
    } catch (e) {
      console.error("Failed to parse OpenAI response:", e)
      return {
        contentSuggestions: [],
        brandConsistency: { score: 0, feedback: "Error analyzing content" },
        captionQuality: { score: 0, feedback: "Error analyzing content" },
        overallStrategy: "Error generating feedback",
        error: "Failed to parse AI response",
      }
    }
  } catch (error: any) {
    console.error("Error generating AI feedback:", error)
    return {
      contentSuggestions: [],
      brandConsistency: { score: 0, feedback: "" },
      captionQuality: { score: 0, feedback: "" },
      overallStrategy: "",
      error: error.message || "Unknown error occurred",
    }
  }
}
