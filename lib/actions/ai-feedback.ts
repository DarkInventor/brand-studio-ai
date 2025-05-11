// "use server"

// import OpenAI from "openai"
// import { createActionClient } from "@/lib/supabase/server"
// import { getCurrentUser } from "./auth"
// import type { Post, BrandKit } from "@/lib/supabase/database.types"

// // Initialize OpenAI client
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// })

// // Update the AIFeedbackResponse type to include brand kit optimization suggestions
// export type AIFeedbackResponse = {
//   contentSuggestions: string[]
//   brandConsistency: {
//     score: number
//     feedback: string
//   }
//   captionQuality: {
//     score: number
//     feedback: string
//   }
//   overallStrategy: string
//   brandKitOptimizations?: {
//     nameRecommendations?: string
//     descriptionRecommendations?: string
//     toneRecommendations?: string
//     colorRecommendations?: string
//   }
//   error?: string
// }

// export async function generateAIFeedback(timeRange = "all"): Promise<AIFeedbackResponse> {
//   try {
//     const user = await getCurrentUser()

//     if (!user) {
//       return {
//         contentSuggestions: [],
//         brandConsistency: { score: 0, feedback: "" },
//         captionQuality: { score: 0, feedback: "" },
//         overallStrategy: "",
//         error: "Not authenticated",
//       }
//     }

//     const supabase = createActionClient()

//     // Fetch posts and brand kits
//     const { data: posts, error: postsError } = await supabase
//       .from("posts")
//       .select("*")
//       .eq("user_id", user.id as any)
//       .order("created_at", { ascending: false })
//       .limit(30)

//     const { data: brandKits, error: brandKitsError } = await supabase
//       .from("brand_kits")
//       .select("*")
//       .eq("user_id", user.id as any)

//     // Filter out any error objects from posts and brandKits
//     const postsRows = ((posts ?? []) as unknown[]).filter((x: any): x is Post => x && typeof x === 'object' && 'id' in x && 'updated_at' in x) as Post[]
//     const brandKitsRows = ((brandKits ?? []) as unknown[]).filter((x: any): x is BrandKit => x && typeof x === 'object' && 'id' in x && 'name' in x) as BrandKit[]

//     if (postsError || brandKitsError || !postsRows.length || !brandKitsRows.length) {
//       return {
//         contentSuggestions: [],
//         brandConsistency: { score: 0, feedback: "" },
//         captionQuality: { score: 0, feedback: "" },
//         overallStrategy: "",
//         error: postsError?.message || brandKitsError?.message || "Error fetching data",
//       }
//     }

//     // Filter posts based on time range if needed
//     let filteredPosts = postsRows
//     if (timeRange !== "all") {
//       const now = new Date()
//       const cutoffDate = new Date()

//       switch (timeRange) {
//         case "7days":
//           cutoffDate.setDate(now.getDate() - 7)
//           break
//         case "30days":
//           cutoffDate.setDate(now.getDate() - 30)
//           break
//         case "90days":
//           cutoffDate.setDate(now.getDate() - 90)
//           break
//       }

//       filteredPosts = filteredPosts.filter((post) => {
//         const postDate = new Date(post.updated_at || post.created_at)
//         return postDate >= cutoffDate
//       })
//     }

//     // If no posts, return empty feedback
//     if (filteredPosts.length === 0) {
//       return {
//         contentSuggestions: [],
//         brandConsistency: { score: 0, feedback: "No posts available for analysis" },
//         captionQuality: { score: 0, feedback: "No posts available for analysis" },
//         overallStrategy: "Start creating content to receive AI feedback",
//         error: undefined,
//       }
//     }

//     // Prepare data for OpenAI
//     const brandKitDetails = brandKitsRows.map((kit) => ({
//       id: kit.id,
//       name: kit.name,
//       description: kit.description || "No description provided",
//       tone: kit.brand_tone || "Not specified",
//       primaryColor: kit.primary_color,
//       secondaryColor: kit.secondary_color,
//       postCount: filteredPosts.filter((p) => p.brand_kit_id === kit.id).length,
//     }))

//     const postCaptions = filteredPosts.map((post) => post.caption).filter(Boolean)
//     const postsByBrand = brandKitsRows.map((kit) => ({
//       brandName: kit.name,
//       brandId: kit.id,
//       postCount: filteredPosts.filter((p) => p.brand_kit_id === kit.id).length,
//     }))

//     // --- Enhanced Prompt ---
//     const prompt = `
// You are an expert social media content strategist and brand consultant with deep expertise in AI-assisted content creation. Perform a comprehensive analysis of the following user data to provide highly specific, actionable feedback that will directly improve their content performance:

// ## BRAND KITS ANALYSIS (${brandKitDetails.length})
// ${brandKitDetails
//   .map(
//     (kit) => `
// ### BRAND: ${kit.name}
// - DESCRIPTION: ${kit.description}
// - TONE: ${kit.tone}
// - COLORS: Primary ${kit.primaryColor}, Secondary ${kit.secondaryColor}
// - CONTENT VOLUME: ${kit.postCount} posts
// `
//   )
//   .join("\n")}

// ## CONTENT DISTRIBUTION
// ${postsByBrand.map((b) => `- ${b.brandName}: ${b.postCount} posts (${Math.round((b.postCount / filteredPosts.length) * 100)}%)`).join("\n")}

// ## CAPTION SAMPLES (${postCaptions.length})
// ${postCaptions
//   .slice(0, 15)
//   .map((caption, i) => `[${i+1}] ${caption}`)
//   .join("\n")}

// Based on this data, provide a detailed content strategy assessment with the following:

// 1. CONTENT SUGGESTIONS:
//    - Provide 5 highly specific content ideas tailored to each brand's unique identity
//    - For each suggestion, explain exactly why it would work well for this specific brand
//    - Include a sample caption structure that aligns with the brand's tone

// 2. BRAND CONSISTENCY ANALYSIS:
//    - Score each brand kit on a scale of 1-10
//    - Identify specific inconsistencies between brand definitions and content execution
//    - Highlight patterns where content successfully reinforces brand identity
//    - Provide 3 tactical recommendations to improve consistency across platforms

// 3. CAPTION QUALITY ASSESSMENT:
//    - Score caption effectiveness on a scale of 1-10 based on engagement potential
//    - Analyze caption structure, call-to-action effectiveness, and emotional resonance
//    - Identify caption patterns that could be optimized for each brand voice
//    - Provide specific examples of how to transform weaker captions into stronger ones

// 4. STRATEGIC RECOMMENDATIONS:
//    - Identify content gaps or missed opportunities based on brand positioning
//    - Suggest optimal content mix across brand kits to maximize overall impact
//    - Recommend posting cadence adjustments based on content performance
//    - Outline a 30-day content strategy blueprint customized to their brand ecosystem

// 5. BRAND KIT OPTIMIZATION FOR AI-GENERATION:
//    - NAME OPTIMIZATION: Assess how each brand name functions as an AI prompt anchor
//    - DESCRIPTION ENHANCEMENT: Identify specific descriptive elements that would help AI better understand brand essence
//    - TONE REFINEMENT: Suggest precise tone markers that improve AI caption generation
//    - COLOR STRATEGY: Recommend color palette adjustments that would improve visual AI generation
//    - AI PROMPT PATTERNS: Provide 3 example prompt structures that would work best with each brand kit

// Format your response as a precise JSON object with the following structure:
// {
//   "contentSuggestions": [
//     "Detailed suggestion 1 with rationale and example implementation",
//     "Detailed suggestion 2 with rationale and example implementation",
//     "Detailed suggestion 3 with rationale and example implementation",
//     "Detailed suggestion 4 with rationale and example implementation",
//     "Detailed suggestion 5 with rationale and example implementation"
//   ],
//   "brandConsistency": {
//     "score": X,
//     "feedback": "Comprehensive analysis of brand consistency issues and opportunities, with specific examples from current content"
//   },
//   "captionQuality": {
//     "score": X,
//     "feedback": "Detailed assessment of caption strengths and weaknesses, with before/after examples showing improvement potential"
//   },
//   "overallStrategy": "Comprehensive strategy recommendation with specific action items for immediate implementation",
//   "brandKitOptimizations": {
//     "nameRecommendations": "Specific suggestions for each brand name to improve AI prompt effectiveness",
//     "descriptionRecommendations": "Detailed guidance on enhancing brand descriptions with specific examples",
//     "toneRecommendations": "Precise tone markers and vocabulary suggestions for each brand voice",
//     "colorRecommendations": "Strategic color palette adjustments to improve AI-generated visual consistency"
//   }
// }
// `
//     // --- Enhanced System Message ---
//     const systemMessage = `You are an elite-tier social media content strategist and AI prompt engineering specialist who helps brands optimize their digital presence.

// Your analysis combines:
// 1. Deep knowledge of how AI models interpret brand guidelines to generate content
// 2. Expert understanding of social media engagement patterns and content performance
// 3. Strategic insight into brand consistency across multi-channel campaigns
// 4. Practical experience optimizing brand assets for AI-powered content creation

// Your feedback must be exceptionally specific, immediately actionable, and directly tied to measurable outcomes. Never provide generic advice. Always include concrete examples showing how to implement your recommendations.

// Focus especially on how users can refine their brand kit specifications to dramatically improve AI-generated images and captions. Identify specific patterns in their existing content that could be strengthened through better AI prompt engineering.`

//     // Call OpenAI API
//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o",
//       messages: [
//         {
//           role: "system",
//           content: systemMessage,
//         },
//         { role: "user", content: prompt },
//       ],
//       response_format: { type: "json_object" },
//     })

//     // Parse the response
//     const responseText = completion.choices[0]?.message?.content || ""

//     try {
//       // Ensure proper JSON parsing
//       const parsedResponse = JSON.parse(responseText.trim()) as AIFeedbackResponse

//       // Validate and clean the parsed response
//       const validatedResponse: AIFeedbackResponse = {
//         contentSuggestions: Array.isArray(parsedResponse.contentSuggestions)
//           ? parsedResponse.contentSuggestions.slice(0, 5)
//           : [],
//         brandConsistency: {
//           score:
//             typeof parsedResponse.brandConsistency?.score === "number"
//               ? Math.min(10, Math.max(1, parsedResponse.brandConsistency.score))
//               : 0,
//           feedback: parsedResponse.brandConsistency?.feedback || "",
//         },
//         captionQuality: {
//           score:
//             typeof parsedResponse.captionQuality?.score === "number"
//               ? Math.min(10, Math.max(1, parsedResponse.captionQuality.score))
//               : 0,
//           feedback: parsedResponse.captionQuality?.feedback || "",
//         },
//         overallStrategy: parsedResponse.overallStrategy || "",
//         brandKitOptimizations: {
//           nameRecommendations: parsedResponse.brandKitOptimizations?.nameRecommendations || "",
//           descriptionRecommendations: parsedResponse.brandKitOptimizations?.descriptionRecommendations || "",
//           toneRecommendations: parsedResponse.brandKitOptimizations?.toneRecommendations || "",
//           colorRecommendations: parsedResponse.brandKitOptimizations?.colorRecommendations || "",
//         },
//       }

//       return validatedResponse
//     } catch (e) {
//       console.error("Failed to parse OpenAI response:", e)
//       return {
//         contentSuggestions: [],
//         brandConsistency: { score: 0, feedback: "Error analyzing content" },
//         captionQuality: { score: 0, feedback: "Error analyzing content" },
//         overallStrategy: "Error generating feedback",
//         error: "Failed to parse AI response",
//       }
//     }
//   } catch (error: any) {
//     console.error("Error generating AI feedback:", error)
//     return {
//       contentSuggestions: [],
//       brandConsistency: { score: 0, feedback: "" },
//       captionQuality: { score: 0, feedback: "" },
//       overallStrategy: "",
//       error: error.message || "Unknown error occurred",
//     }
//   }
// }
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
