"use server"

import OpenAI from "openai"
import { createActionClient } from "@/lib/supabase/server"
import { getCurrentUser } from "./auth"
import type { Post, BrandKit } from "@/lib/supabase/database.types"

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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
  error?: string
}

export async function generateAIFeedback(timeRange: string = "all"): Promise<AIFeedbackResponse> {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return {
        contentSuggestions: [],
        brandConsistency: { score: 0, feedback: "" },
        captionQuality: { score: 0, feedback: "" },
        overallStrategy: "",
        error: "Not authenticated"
      }
    }
    
    const supabase = createActionClient()
    
    // Fetch posts and brand kits
    const { data: posts, error: postsError } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", user.id as any)
      .order("created_at", { ascending: false })
      .limit(30)
    
    const { data: brandKits, error: brandKitsError } = await supabase
      .from("brand_kits")
      .select("*")
      .eq("user_id", user.id as any)
    
    // Filter out any error objects from posts and brandKits
    const postsRows = (posts ?? []).filter(x => x && typeof x === 'object' && 'id' in x && 'updated_at' in x) as Post[]
    const brandKitsRows = (brandKits ?? []).filter(x => x && typeof x === 'object' && 'id' in x && 'name' in x) as BrandKit[]

    if (postsError || brandKitsError || !postsRows.length || !brandKitsRows.length) {
      return {
        contentSuggestions: [],
        brandConsistency: { score: 0, feedback: "" },
        captionQuality: { score: 0, feedback: "" },
        overallStrategy: "",
        error: postsError?.message || brandKitsError?.message || "Error fetching data"
      }
    }
    
    // Filter posts based on time range if needed
    let filteredPosts = postsRows
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
      
      filteredPosts = filteredPosts.filter(post => {
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
        error: undefined
      }
    }
    
    // Prepare data for OpenAI
    const brandKitNames = brandKitsRows.map(kit => kit.name)
    const postCaptions = filteredPosts.map(post => post.caption).filter(Boolean)
    const postsByBrand = brandKitsRows.map(kit => ({
      brandName: kit.name,
      postCount: filteredPosts.filter(p => p.brand_kit_id === kit.id).length
    }))
    
    // Create a prompt for OpenAI
    const prompt = `
      You are an expert social media content strategist. Analyze the following data about a user's content and provide specific, actionable feedback:
      
      Brand Kits (${brandKitNames.length}): ${brandKitNames.join(", ")}
      
      Post Distribution by Brand:
      ${postsByBrand.map(b => `${b.brandName}: ${b.postCount} posts`).join("\n")}
      
      Recent Post Captions (${postCaptions.length}):
      ${postCaptions.slice(0, 15).map(caption => `- ${caption}`).join("\n")}
      
      Based on this data, provide:
      1. 3-5 specific content suggestions for improvement
      2. Brand consistency analysis (score 1-10 and specific feedback)
      3. Caption quality analysis (score 1-10 and specific feedback)
      4. Overall content strategy recommendation
      
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
        "overallStrategy": "Your overall strategy recommendation here"
      }
    `

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert social media content strategist providing actionable feedback." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    })

    // Parse the response
    const responseText = completion.choices[0]?.message?.content || ""

    try {
      const parsedResponse = JSON.parse(responseText) as AIFeedbackResponse
      return parsedResponse
    } catch (e) {
      console.error("Failed to parse OpenAI response:", e)
      return {
        contentSuggestions: [],
        brandConsistency: { score: 0, feedback: "Error analyzing content" },
        captionQuality: { score: 0, feedback: "Error analyzing content" },
        overallStrategy: "Error generating feedback",
        error: "Failed to parse AI response"
      }
    }
  } catch (error: any) {
    console.error("Error generating AI feedback:", error)
    return {
      contentSuggestions: [],
      brandConsistency: { score: 0, feedback: "" },
      captionQuality: { score: 0, feedback: "" },
      overallStrategy: "",
      error: error.message || "Unknown error occurred"
    }
  }
}
