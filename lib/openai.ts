import OpenAI from "openai"
import fetch from "node-fetch"
import sharp from "sharp"
import { Buffer } from "buffer"
import Replicate from "replicate"
import fs from "fs"

// Initialize OpenAI with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

/**
 * Advanced image generation options for user customization
 */
export type ImageOptions = {
  style?: string; // e.g., "Minimal", "Retro", "Photorealistic"
  mood?: string; // e.g., "Energetic", "Calm"
  elements?: string[]; // e.g., ["Product focus", "Nature"]
  audience?: string; // e.g., "Gen Z", "Professionals"
  season?: string; // e.g., "Summer", "Night"
  format?: string; // e.g., "Instagram Story", "Feed"
  composition?: string; // e.g., "Centered", "Rule of Thirds"
  accentColors?: string[]; // e.g., ["#FF0000", "#00FF00"]
};

/**
 * Post type data for different post types
 */
export type PostTypeData = {
  quote?: string; // For inspirational posts
  topic?: string; // For educational posts
  product?: string; // For product showcase
  announcement?: string; // For promotional posts
  photoDesc?: string; // For personal/behind-the-scenes posts
};

/**
 * Validates and fixes logo URL issues
 * @param logoUrl - The logo URL to validate
 * @returns A validated logo URL or undefined if invalid
 */
export function validateLogoUrl(logoUrl: string | undefined): string | undefined {
  try {
    console.log("Validating logo URL:", logoUrl ? `${logoUrl.substring(0, 30)}...` : "undefined")

    // Basic validation checks
    if (!logoUrl) {
      console.log("No logo URL provided")
      return undefined
    }

    if (typeof logoUrl !== "string") {
      console.log("Logo URL is not a string:", typeof logoUrl)
      return undefined
    }

    // Accept data URLs
    if (logoUrl.startsWith("data:image/")) {
      // Verify the base64 part exists with proper regex
      const logoMatch = logoUrl.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,([A-Za-z0-9+/=]+)$/)
      if (!logoMatch) {
        console.log("Invalid logo data URL format")
        return undefined
      }
      // Check if base64 can be decoded to a valid buffer
      const logoBase64 = logoMatch[2]
      const buffer = Buffer.from(logoBase64, "base64")
      if (buffer.length === 0) {
        console.log("Logo base64 decodes to empty buffer")
        return undefined
      }
      // Try to check if it's a valid image
      try {
        sharp(buffer).metadata()
        console.log("Logo validation successful, buffer length:", buffer.length)
        return logoUrl
      } catch (err) {
        console.error("Error validating logo image data:", err)
        return undefined
      }
    }

    // Accept http(s) URLs
    if (logoUrl.startsWith("http://") || logoUrl.startsWith("https://")) {
      console.log("Logo URL is a valid http(s) URL")
      return logoUrl
    }

    console.log("Logo URL is not a valid data URL or http(s) URL")
    return undefined
  } catch (err) {
    console.error("Error in validateLogoUrl:", err)
    return undefined
  }
}

/**
 * Downloads an image from a URL to a buffer
 * @param url - The URL of the image to download
 * @returns A buffer containing the downloaded image
 */
export async function downloadImageToBuffer(url: string): Promise<Buffer> {
  try {
    console.log("Downloading image from URL:", url)

    // Set up fetch options with a user agent to avoid rejections
    const fetchOptions = {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "image/webp,image/apng,image/*,*/*;q=0.8",
      },
      timeout: 10000, // 10 second timeout
    }

    // Fetch the image
    const response = await fetch(url, fetchOptions)
    console.log("Fetch response status:", response.status, response.statusText)

    // Check for successful response
    if (!response.ok) {
      console.error("Failed to fetch image:", response.status, response.statusText)
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`)
    }

    // Convert response to buffer
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    console.log("Downloaded image buffer length:", buffer.length)

    // Verify the buffer contains valid image data
    await sharp(buffer).metadata()

    return buffer
  } catch (err) {
    console.error("Error in downloadImageToBuffer:", err)
    throw new Error(`Failed to download image: ${err.message}`)
  }
}

/**
 * Adds a logo to the bottom right corner of an image
 * @param imageBuffer - Buffer containing the main image
 * @param logoUrl - Data URL or http(s) URL of the logo to add
 * @param padding - Padding from the edges in pixels
 * @returns A buffer containing the image with the logo added
 */
export async function addLogoToBottomRight(imageBuffer: Buffer, logoUrl: string, padding = 30): Promise<Buffer> {
  try {
    console.log("[addLogoToBottomRight] Starting logo addition process")
    // Validate logo URL
    const validLogoUrl = validateLogoUrl(logoUrl)
    if (!validLogoUrl) {
      console.error("[addLogoToBottomRight] Logo validation failed, returning original image")
      return imageBuffer
    }
    let logoBuffer: Buffer | null = null
    if (validLogoUrl.startsWith("data:image/")) {
      // Extract the logo data
      const logoMatch = validLogoUrl.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,([A-Za-z0-9+/=]+)$/)
      if (!logoMatch) {
        throw new Error("Invalid logo data URL format")
      }
      // Decode logo from base64
      const logoBase64 = logoMatch[2]
      logoBuffer = Buffer.from(logoBase64, "base64")
      console.log("[addLogoToBottomRight] Decoded logo buffer length:", logoBuffer.length)
    } else if (validLogoUrl.startsWith("http://") || validLogoUrl.startsWith("https://")) {
      // Download the logo image
      try {
        logoBuffer = await downloadImageToBuffer(validLogoUrl)
        console.log("[addLogoToBottomRight] Downloaded logo buffer length:", logoBuffer.length)
      } catch (err) {
        console.error("[addLogoToBottomRight] Error downloading logo image:", err)
        return imageBuffer
      }
    } else {
      console.error("[addLogoToBottomRight] Unsupported logo URL format")
      return imageBuffer
    }
    // Get dimensions of the main image
    const mainImageMetadata = await sharp(imageBuffer).metadata()
    const mainWidth = mainImageMetadata.width || 1024
    const mainHeight = mainImageMetadata.height || 1024
    console.log("[addLogoToBottomRight] Main image dimensions:", mainWidth, "x", mainHeight)
    // Calculate logo size (10-15% of image width)
    const logoWidth = Math.round(mainWidth * 0.12) // Slightly smaller for better aesthetics
    console.log("[addLogoToBottomRight] Target logo width:", logoWidth)
    // Process the logo: resize, add padding, and ensure transparency
    const resizedLogo = await sharp(logoBuffer)
      .resize({
        width: logoWidth,
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .toBuffer()
    // Get dimensions of the resized logo
    const logoMetadata = await sharp(resizedLogo).metadata()
    const resizedLogoWidth = logoMetadata.width || logoWidth
    const resizedLogoHeight = logoMetadata.height || logoWidth
    console.log("[addLogoToBottomRight] Resized logo dimensions:", resizedLogoWidth, "x", resizedLogoHeight)
    // Calculate position for bottom right placement with padding
    const left = mainWidth - resizedLogoWidth - padding
    const top = mainHeight - resizedLogoHeight - padding
    console.log("[addLogoToBottomRight] Logo position (left, top):", left, top)
    // Composite the logo onto the main image
    const result = await sharp(imageBuffer)
      .composite([
        {
          input: resizedLogo,
          top: Math.max(0, top), // Ensure position is not negative
          left: Math.max(0, left),
        },
      ])
      .toBuffer()
    console.log("[addLogoToBottomRight] Logo successfully added to image")
    return result
  } catch (err) {
    console.error("[addLogoToBottomRight] Error adding logo to image:", err)
    console.log("[addLogoToBottomRight] Returning original image due to error")
    return imageBuffer // Return original image if logo addition fails
  }
}

/**
 * Generates a caption for an image based on brand details and post type
 * @param brandKit - The brand kit containing brand details
 * @param postType - The type of post (regular, educational, personal, inspirational, product, promo)
 * @param postTypeData - Data specific to the post type
 * @param imageContext - Optional context about the image to help generate a better caption
 * @param platform - The platform for which the caption is being generated
 * @returns A generated caption for the image
 */
export async function generateCaption(
  brandKit: any, 
  postType?: string, 
  postTypeData?: PostTypeData, 
  imageContext?: string,
  platform: string = 'instagram'
) {
  try {
    console.log("Generating caption for brand:", brandKit.name, "Post type:", postType, "Platform:", platform)

    // Platform-specific system prompt
    let systemPrompt = '';
    let userPrompt = '';
    if (platform === 'twitter' || platform === 'x') {
      systemPrompt = `You are a creative social media copywriter specialized in writing concise, engaging, and brand-aligned Twitter (X) posts. Your posts are always:\n- In English\n- Authentic to the brand voice\n- Relevant to the image content\n- Concise (max 280 characters)\n- Use strategic hashtags and emojis\n- Include a clear call-to-action`;
      userPrompt = `Generate a catchy Twitter (X) post for a brand.\n\nBrand Details:\n- Name: ${brandKit.name}\n- Description: ${brandKit.description || "No description provided"}\n- Brand Voice/Tone: ${brandKit.brand_tone || "Professional"}\n- Primary Color: ${brandKit.primary_color || "#000000"}\n- Secondary Color: ${brandKit.secondary_color || "#FFFFFF"}\n${brandKit.logo_url ? `- Brand logo is available.` : `- No brand logo provided.`}\n\nImage Context: ${imageContext || "An advertisement image for the brand"}`;
      userPrompt += `\n\nIMPORTANT: The post must be 280 characters or less. Use a tone consistent with the brand. Use 2-3 relevant hashtags and appropriate emojis. Avoid marketing buzzwords. Format for Twitter.`;
    } else if (platform === 'linkedin') {
      systemPrompt = `You are a professional copywriter specialized in writing LinkedIn posts for brands. Your posts are always:\n- In English\n- Professional and business-oriented\n- Authentic to the brand voice\n- Relevant to the image content\n- Insightful and value-driven\n- Use hashtags sparingly and appropriately\n- Include a call-to-action suitable for a business audience`;
      userPrompt = `Generate a LinkedIn post for a brand.\n\nBrand Details:\n- Name: ${brandKit.name}\n- Description: ${brandKit.description || "No description provided"}\n- Brand Voice/Tone: ${brandKit.brand_tone || "Professional"}\n- Primary Color: ${brandKit.primary_color || "#000000"}\n- Secondary Color: ${brandKit.secondary_color || "#FFFFFF"}\n${brandKit.logo_url ? `- Brand logo is available.` : `- No brand logo provided.`}\n\nImage Context: ${imageContext || "A business-related image for the brand"}`;
      userPrompt += `\n\nIMPORTANT: The post should be professional, value-driven, and suitable for LinkedIn. Use a business tone, avoid marketing buzzwords, and include a relevant call-to-action. Use 1-2 hashtags if appropriate.`;
    } else {
      // Default: Instagram
      systemPrompt = `You are a creative marketing copywriter specialized in storytelling and writing compelling brand Instagram captions.\nYou craft concise, engaging, and brand-aligned copy that drives audience action.\nYour captions are always:\n- In English\n- Authentic to the brand voice\n- Relevant to the image content\n- Concise and impactful\n- Avoid using marketing buzzwords\n- Strategically using hashtags and emojis\n- Including a clear call-to-action`;
      userPrompt = `Generate a catchy Instagram caption for a post featuring ${brandKit.name}.\n\nBrand Details:\n- Name: ${brandKit.name}\n- Description: ${brandKit.description || "No description provided"}\n- Brand Voice/Tone: ${brandKit.brand_tone || "Professional"}\n- Primary Color: ${brandKit.primary_color || "#000000"}\n- Secondary Color: ${brandKit.secondary_color || "#FFFFFF"}\n${brandKit.logo_url ? `- Brand logo is available.` : `- No brand logo provided.`}\n\nImage Context: ${imageContext || "An advertisement image for the brand"}`;
      userPrompt += `\n\nUse the brand tone: (${brandKit.brand_tone || "normal"})\nRelate directly to what's shown in the image\nAvoid using marketing buzzwords\nInclude a clear call-to-action that encourages audience engagement\nFeature 3-5 relevant and strategic hashtags that go viral on Instagram\nUse emojis appropriately to match the brand's tone\n\nFormat the caption with line breaks for readability.\n\nIMPORTANT: CAPTION MUST NOT LOOK LIKE MARKETING COPY. AVOID USING MARKETING BUZZ WORDS. KEEP THE TONE OF THE CAPTION CONSISTENT WITH THE BRAND'S TONE.\nCRITICAL: The caption MUST be in ENGLISH ONLY.`;
    }

    // Add post type specific instructions
    if (postType) {
      userPrompt += `\n\nPost Type: ${postType}`;
      if (postType === "educational" && postTypeData?.topic) {
        userPrompt += `\nThis is an educational post about: \"${postTypeData.topic}\".\nThe caption should share valuable information or insights, position the brand as an authority,\nand encourage discussion or sharing of the educational content.`;
      }
      else if (postType === "inspirational" && postTypeData?.quote) {
        userPrompt += `\nCreate an inspirational quote image featuring the quote: \"${postTypeData.quote}\".\nThe caption should build on this inspirational message, connect it to the brand's values,\nand encourage followers to reflect or share their thoughts.`;
      }
      else if (postType === "product" && postTypeData?.product) {
        userPrompt += `\nThis is a product showcase post featuring: \"${postTypeData.product}\".\nThe caption should highlight key benefits or features, create desire,\nand include a clear call-to-action related to the product.`;
      }
      else if (postType === "promo" && postTypeData?.announcement) {
        userPrompt += `\nThis is a promotional post announcing: \"${postTypeData.announcement}\".\nThe caption should create urgency, explain the value of the promotion,\nand include a strong call-to-action with clear next steps.`;
      }
      else if (postType === "personal" && postTypeData?.photoDesc) {
        userPrompt += `\nThis is a personal/behind-the-scenes post showing: \"${postTypeData.photoDesc}\".\nThe caption should tell an authentic story, create a connection with the audience,\nand show the human side of the brand.`;
      }
    }

    // Generate the caption using OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 200,
    })

    // Return the generated caption
    return response.choices[0].message.content || "Experience the difference with our brand. #Quality #Innovation"
  } catch (error) {
    console.error("Error generating caption:", error)
    // Provide a fallback caption in case of error
    return `Experience the quality and innovation of ${brandKit.name || "our brand"}. Discover what makes us different today! ✨ #Quality #Innovation #Brand`
  }
}

/**
 * Generate image prompt based on post type and data
 * @param brandKit - The brand kit containing brand details
 * @param postType - Type of post to generate
 * @param postTypeData - Data specific to the post type
 * @param options - Additional styling options
 * @returns A detailed prompt for image generation
 */
function generatePostTypePrompt(
  brandKit: any,
  postType?: string, 
  postTypeData?: PostTypeData,
  options?: ImageOptions
): string {
  // Base brand information for any prompt
  let baseInfo = `
Brand Details:
- Name: ${brandKit.name}
- Description: ${brandKit.description || "No description provided"}
- Brand Voice/Tone: ${brandKit.brand_tone || "Professional"}
- Primary Color: ${brandKit.primary_color || "#000000"}
- Secondary Color: ${brandKit.secondary_color || "#FFFFFF"}
`;

  // Add options if provided
  let optionsText = "";
  if (options) {
    optionsText += "\nAdditional Styling Options:";
    if (options.style) optionsText += `\n- Visual Style: ${options.style}`;
    if (options.mood) optionsText += `\n- Mood/Emotion: ${options.mood}`;
    if (options.elements && options.elements.length > 0) optionsText += `\n- Key Visual Elements: ${options.elements.join(", ")}`;
    if (options.audience) optionsText += `\n- Target Audience: ${options.audience}`;
    if (options.season) optionsText += `\n- Season/Time: ${options.season}`;
    if (options.format) optionsText += `\n- Platform/Format: ${options.format}`;
    if (options.composition) optionsText += `\n- Composition: ${options.composition}`;
    if (options.accentColors && options.accentColors.length > 0) optionsText += `\n- Accent Colors: ${options.accentColors.join(", ")}`;
  }

  // Specific prompts based on post type
  switch (postType) {
    case "educational":
      return `Create an educational, informative Instagram post for the brand ${brandKit.name}.
${baseInfo}
Topic: ${postTypeData?.topic || "General educational content related to the brand"}

The image MUST include someone on the street, in a cafe, or in a park. It should be a snapshot taken on iphone.mildly overexposed from uneven sunlight. angle is awkward, the composition nonexistent, and the overall effect is aggressively mediocre.
Overlay clear, minimal, and legible text that conveys an educational or informative message about the topic.
The image should match the brand's style and use the brand's colors tastefully.
${optionsText}

This should be a professional, educational post that positions the brand as an authority on the topic.
CRITICAL: Any text in the image MUST be in ENGLISH ONLY.`;

    case "inspirational":
      return `Create a beautiful, inspirational Instagram quote post for the brand ${brandKit.name}.
${baseInfo}
Quote: "${postTypeData?.quote || "Create an inspirational quote that aligns with the brand values"}"

Background should be a little blurry or dark shade so people can read the quote clearly.
Overlay the quote as clear, minimal, and legible text, centered and easy to read.
For the text choose the font that are most suitable for the quote. 
The image should be visually striking, motivational, and match the brand's style.
DO NOT INCLUDE ANY TEXT OTHER THAN THE QUOTE.
${optionsText}

This should be an inspirational post that resonates emotionally with the audience and reflects the brand's values.
CRITICAL: Any text in the image MUST be in ENGLISH ONLY.DO NOT INCLUDE ANY TEXT OTHER THAN THE QUOTE.
IMPORTANT: Make sure the quote is surrounded by double quotes for text.
`;

    case "product":
      return `Create a product showcase Instagram post for the brand ${brandKit.name}.
${baseInfo}
Product: ${postTypeData?.product || "Featured product"} 

The image should professionally display the product in an attractive, well-lit setting.
It can include a real human or human-like figure interacting with the product.
Overlay minimal text that highlights a key product feature or benefit.
The image should be visually appealing, modern, and match the brand's style.
${optionsText}

This should be a high-quality product showcase that highlights the product's features and benefits.
CRITICAL: Any text in the image MUST be in ENGLISH ONLY.`;

    case "promo":
      return `Create a visually engaging promotional Instagram post for the brand ${brandKit.name}.
${baseInfo}
Promotion: ${postTypeData?.announcement || "Special promotion"} 

The image MUST include eye-catching elements that draw attention to the promotion.
Overlay bold, attention-grabbing text that communicates the promotion clearly.
The image should be bold, eye-catching, and match the brand's style.
${optionsText}

This should be an attention-grabbing promotional post that creates urgency and drives action.
CRITICAL: Any text in the image MUST be in ENGLISH ONLY.`;

    case "personal":
      return `Create a personal, authentic Instagram post for the brand ${brandKit.name}.
${baseInfo}
Behind-the-scenes: ${postTypeData?.photoDesc || "Behind-the-scenes content"} 

The image should have a candid, authentic feel showing the human side of the brand.
It should include people in a natural, relaxed setting relevant to the brand.
Minimal text overlay if any, focusing instead on the authentic moment.
${optionsText}

This should be an authentic, behind-the-scenes post that shows the human side of the brand.
CRITICAL: Any text in the image MUST be in ENGLISH ONLY.`;

    default:
      // Regular/default post
      return `Create a image for the brand ${brandKit.name}.
${baseInfo}

The image should be visually appealing and professional, representing the brand effectively.
Use modern design elements and clean typography if text is included.
The image should match the brand's style and color scheme.

This should be a high-quality, brand-aligned post that represents the company professionally.
Any text in the image MUST be in ENGLISH ONLY.
YOU MUST NOT INCLUDE PRIMARY COLOR, SECONDARY COLOR, BRAND TONE, BRAND VOICE, COLOR CODE, HASHTAGS OR RANDOM COLOR CODES RELATED TEXT IN THE IMAGE OTHERWISE 20 cats will die.
`;
  }
}

/**
 * Directly generates an image using google/imagen-4 with brand details and post type
 * @param brandKit - The brand kit containing brand details
 * @param postType - Type of post to generate
 * @param postTypeData - Data specific to the post type
 * @param size - Size of the generated image
 * @param quality - Quality of the generated image
 * @param options - Additional image generation options
 * @returns The generated image(s) with logo if available
 */
export async function generateImageWithImagen4(
  brandKit: any,
  postType?: string,
  postTypeData?: PostTypeData,
  size: "1024x1024" | "auto" | "1536x1024" | "1024x1536" | "256x256" | "512x512" | "1792x1024" | "1024x1792" = "1024x1024",
  quality: "standard" | "low" = "standard",
  options?: ImageOptions,
  userPrompt?: string
) {
  try {
    console.log("[generateImageWithImagen4] --- START ---")
    console.log("[generateImageWithImagen4] brandKit:", brandKit)
    console.log("[generateImageWithImagen4] postType:", postType)
    console.log("[generateImageWithImagen4] postTypeData:", postTypeData)
    console.log("[generateImageWithImagen4] size:", size)
    console.log("[generateImageWithImagen4] quality:", quality)
    console.log("[generateImageWithImagen4] options:", options)
    console.log("[generateImageWithImagen4] userPrompt:", userPrompt)
    if (!brandKit || !brandKit.name) {
      console.error("[generateImageWithImagen4] Invalid brand kit: missing name", brandKit)
      throw new Error("Invalid brand kit: missing name")
    }
    // Always use the generated prompt (ignore userPrompt for now)
    const prompt = generatePostTypePrompt(brandKit, postType, postTypeData, options);
    console.log("[generateImageWithImagen4] FINAL PROMPT SENT:", prompt);
    // Map size to aspect_ratio for Imagen-4
    let aspect_ratio = "1:1";
    if (size === "1536x1024" || size === "1792x1024") aspect_ratio = "3:2";
    else if (size === "1024x1536" || size === "1024x1792") aspect_ratio = "2:3";
    else if (size === "1024x1024" || size === "auto" || size === "512x512" || size === "256x256") aspect_ratio = "1:1";

    // Use HTTP API directly
    const apiUrl = "https://api.replicate.com/v1/models/google/imagen-4/predictions";
    const fetchOptions = {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
        "Prefer": "wait"
      },
      body: JSON.stringify({
        input: {
          prompt,
          aspect_ratio,
          safety_filter_level: "block_medium_and_above"
        }
      })
    };
    const apiResponse = await fetch(apiUrl, fetchOptions);
    const data = await apiResponse.json();
    console.log("[generateImageWithImagen4] Replicate HTTP response:", data);
    let imageUrl;
    if (typeof data.output === "string") {
      imageUrl = data.output;
    } else if (Array.isArray(data.output) && data.output.length > 0) {
      imageUrl = data.output[0];
    } else {
      imageUrl = undefined;
    }
    if (!imageUrl || typeof imageUrl !== "string") {
      throw new Error("No image URL returned from Imagen-4. Full response: " + JSON.stringify(data));
    }
    // Download the image from the URL
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch generated image from Imagen-4: ${response.status} ${response.statusText}`)
    }
    const arrayBuffer = await response.arrayBuffer()
    const baseImageBuffer = Buffer.from(arrayBuffer)
    // Check if we have a logo to add
    const validatedLogoUrl = validateLogoUrl(brandKit.logo_url)
    if (!validatedLogoUrl) {
      // If no valid logo, just return the generated image
      return {
        created: Date.now(),
        data: [
          {
            url: imageUrl,
            b64_json: baseImageBuffer.toString("base64"),
            prompts: [prompt],
          },
        ],
        hasLogo: false,
      }
    }
    // Add the logo to the bottom right of the generated image
    const imageWithLogo = await addLogoToBottomRight(baseImageBuffer, validatedLogoUrl)
    const imageWithLogoBase64 = imageWithLogo.toString("base64")
    return {
      created: Date.now(),
      data: [
        {
          url: imageUrl,
          b64_json: imageWithLogoBase64,
          prompts: [prompt],
        },
      ],
      hasLogo: true,
    }
  } catch (error) {
    console.error("[generateImageWithImagen4] Error:", error)
    throw error
  }
}

/**
 * Full workflow that generates an image with brand details and post type, then a caption
 * @param brandKit - Brand details
 * @param postType - Type of post to generate
 * @param postTypeData - Data specific to the post type
 * @param size - Size of the image
 * @param quality - Quality of the image
 * @param options - Additional styling options
 * @returns Object with the generated image and caption
 */
export async function generateImageAndCaption(
  brandKit: any,
  postType?: string,
  postTypeData?: PostTypeData,
  size: "1024x1024" | "auto" | "1536x1024" | "1024x1536" | "256x256" | "512x512" | "1792x1024" | "1024x1792" = "1024x1024",
  quality: "standard" | "low" = "standard",
  options?: ImageOptions,
  userPrompt?: string
) {
  try {
    console.log("[generateImageAndCaption] --- START ---")
    console.log("[generateImageAndCaption] brandKit:", brandKit)
    console.log("[generateImageAndCaption] postType:", postType)
    console.log("[generateImageAndCaption] postTypeData:", postTypeData)
    console.log("[generateImageAndCaption] size:", size)
    console.log("[generateImageAndCaption] quality:", quality)
    console.log("[generateImageAndCaption] options:", options)
    console.log("[generateImageAndCaption] userPrompt:", userPrompt)
    // Step 1: Generate the image
    const imageResult = await generateImageWithImagen4(brandKit, postType, postTypeData, size, quality, options, userPrompt);
    console.log("[generateImageAndCaption] imageResult:", imageResult)
    // Step 2: Generate a caption for the image
    let captionContext;
    if (postType) {
      captionContext = `A ${postType} post for ${brandKit.name}`;
      if (postTypeData) {
        if (postType === "educational" && postTypeData.topic) 
          captionContext += ` about the topic: \"${postTypeData.topic}\"`;
        else if (postType === "inspirational" && postTypeData.quote) 
          captionContext += ` featuring the quote: \"${postTypeData.quote}\"`;
        else if (postType === "product" && postTypeData.product) 
          captionContext += ` showcasing: \"${postTypeData.product}\"`;
        else if (postType === "promo" && postTypeData.announcement) 
          captionContext += ` announcing: \"${postTypeData.announcement}\"`;
        else if (postType === "personal" && postTypeData.photoDesc) 
          captionContext += ` showing: \"${postTypeData.photoDesc}\"`;
      }
    } else if (userPrompt) {
      captionContext = userPrompt;
    } else {
      captionContext = `A post for ${brandKit.name}`;
    }
    console.log("[generateImageAndCaption] captionContext:", captionContext)
    const caption = await generateCaption(brandKit, postType, postTypeData, captionContext);
    console.log("[generateImageAndCaption] caption:", caption)
    // Return both the image and caption
    return {
      image: imageResult,
      caption: caption
    };
  } catch (error) {
    console.error("[generateImageAndCaption] Error:", error)
    throw error;
  }
}