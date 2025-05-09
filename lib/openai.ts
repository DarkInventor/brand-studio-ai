// import OpenAI from 'openai';
// import https from 'https'
// // @ts-expect-error: no types for node-fetch
// import fetch from 'node-fetch'
// import FormData from 'form-data';
// import path from 'path';
// import os from 'os';
// import fs from 'fs';
// import sharp from 'sharp'; // Add sharp for image processing

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// // Generate image with brand data using GPT-4 vision for better caption generation
// export async function generatePromptForImage(brandKit: any) {
//   try {
//     console.log('Generating image prompt for brand:', brandKit.name);
//     const prompt = `
//       Create a detailed, creative prompt for generating a brand advertisement image for ${brandKit.name}.
      
//       Brand Details:
//       - Name: ${brandKit.name}
//       - Description: ${brandKit.description}
//       - Brand Voice/Tone: ${brandKit.brand_tone}
//       - Primary Color: ${brandKit.primary_color}
//       - Secondary Color: ${brandKit.secondary_color}
      
//       The prompt should:
//       1. Describe a visually striking, professional advertisement image
//       2. Incorporate the brand's color scheme and personality
//       3. Suggest specific visual elements that would represent the brand well
//       4. Include guidance on composition, lighting, and mood
//       5. Be detailed enough for an AI image generator to create a high-quality brand advertisement
//       6. Leave space in the bottom right corner for a logo to be added later
//       7. CRITICAL: Absolutely NO text, typography, letters, numbers, or written elements of any kind should be included in the image
      
//       Write a detailed 3-4 sentence prompt that would help generate an excellent advertisement image with NO TEXT whatsoever.
//     `;

//     const response = await openai.chat.completions.create({
//       model: "gpt-4.1-nano",
//       messages: [
//         {
//           role: "system",
//           content: "You are a professional art director and marketing and branding expert who creates detailed prompts for generating brand advertisement images. You understand visual design principles and brand identity. You NEVER include text in images as you know AI models struggle with text rendering."
//         },
//         {
//           role: "user",
//           content: prompt
//         }
//       ],
//       temperature: 0.8,
//       max_tokens: 300
//     });

//     console.log('Generated image prompt:', response.choices[0].message.content);
//     return response.choices[0].message.content + "\n\nCRITICAL: The image MUST NOT contain ANY text, typography, letters, numbers, or written elements whatsoever.";
//   } catch (error) {
//     console.error('Error generating image prompt:', error);
//     throw error;
//   }
// }

// export async function generateCaption(brandKit: any, imageUrl: string) {
//   try {
//     console.log('Generating caption with brandKit:', brandKit, 'and imageUrl:', imageUrl);
//     const logoInfo = brandKit.logo_url ? `Brand logo is available as a data URL.` : `No brand logo provided.`;
//     const prompt = `
//       Generate a compelling advertisement caption for an image featuring ${brandKit.name}.
      
//       Brand Details:
//       - Name: ${brandKit.name}
//       - Description: ${brandKit.description}
//       - Brand Voice/Tone: ${brandKit.brand_tone}
//       - Primary Color: ${brandKit.primary_color}
//       - Secondary Color: ${brandKit.secondary_color}
//       ${logoInfo}
      
//       Image Context: ${imageUrl}
      
//       Create a captivating brand advertisement caption that:
//       1. Captures the brand's unique voice and personality (${brandKit.brand_tone})
//       2. Relates directly to what's shown in the image
//       3. Includes a clear call-to-action that encourages audience engagement
//       4. Features 3-5 relevant and strategic hashtags if appropriate for the platform
//       5. Uses emojis appropriately to match the brand's tone
//       6. Is between 100-200 characters for maximum impact
      
//       Format the caption with line breaks for readability.
//     `;
//     console.log('Generated prompt:', prompt);

//     const response = await openai.chat.completions.create({
//       model: "gpt-4.1-nano",
//       messages: [
//         {
//           role: "system",
//           content: "You are a creative marketing copywriter specialized in writing compelling brand advertisement captions. You craft concise, engaging, and brand-aligned copy that drives audience action."
//         },
//         {
//           role: "user",
//           content: prompt
//         }
//       ],
//       temperature: 0.7,
//       max_tokens: 200
//     });

//     console.log('OpenAI response:', response);
//     return response.choices[0].message.content;
//   } catch (error) {
//     console.error('Error generating caption:', error);
//     throw error;
//   }
// }

// // Function to validate and fix logo URL issues
// export function validateLogoUrl(logoUrl: string | undefined): string | undefined {
//   console.log('Validating logo URL:', logoUrl?.substring(0, 30) + '...');
  
//   if (!logoUrl) {
//     console.log('No logo URL provided');
//     return undefined;
//   }
  
//   if (typeof logoUrl !== 'string') {
//     console.log('Logo URL is not a string:', typeof logoUrl);
//     return undefined;
//   }
  
//   // Check if it's a valid data URL
//   if (!logoUrl.startsWith('data:image/')) {
//     console.log('Logo URL is not a valid data URL');
//     return undefined;
//   }
  
//   // Verify the base64 part exists
//   const logoMatch = logoUrl.match(/^data:(image\/\w+);base64,([A-Za-z0-9+/=]+)/);
//   if (!logoMatch) {
//     console.log('Invalid logo data URL format');
//     return undefined;
//   }
  
//   try {
//     // Check if base64 can be decoded
//     const logoBase64 = logoMatch[2];
//     const buffer = Buffer.from(logoBase64, 'base64');
//     if (buffer.length === 0) {
//       console.log('Logo base64 decodes to empty buffer');
//       return undefined;
//     }
//     console.log('Logo validation successful, buffer length:', buffer.length);
//     return logoUrl;
//   } catch (err) {
//     console.error('Error validating logo:', err);
//     return undefined;
//   }
// }

// export async function downloadImageToBuffer(url: string): Promise<Buffer> {
//   try {
//     console.log('Downloading image from URL:', url);
//     const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
//     console.log('Fetch response status:', response.status, response.statusText);

//     if (!response.ok) {
//       console.error('Failed to fetch image:', response.status, response.statusText);
//       throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
//     }
//     const buffer = Buffer.from(await response.arrayBuffer());
//     console.log('Downloaded image buffer length:', buffer.length);
//     return buffer;
//   } catch (err) {
//     console.error('Error in downloadImageToBuffer:', err);
//     throw err;
//   }
// }

// // Enhanced version with better debugging to add logo to the bottom right corner
// export async function addLogoToBottomRight(imageBuffer: Buffer, logoDataUrl: string, padding = 30): Promise<Buffer> {
//   try {
//     console.log('Starting logo addition process');
    
//     // Validate logo URL
//     const validLogoUrl = validateLogoUrl(logoDataUrl);
//     if (!validLogoUrl) {
//       console.error('Logo validation failed, returning original image');
//       return imageBuffer;
//     }
    
//     // Extract the logo data
//     const logoMatch = validLogoUrl.match(/^data:(image\/\w+);base64,([A-Za-z0-9+/=]+)/);
//     if (!logoMatch) {
//       throw new Error('Invalid logo data URL format');
//     }
    
//     const logoBase64 = logoMatch[2];
//     const logoBuffer = Buffer.from(logoBase64, 'base64');
//     console.log('Decoded logo buffer length:', logoBuffer.length);
    
//     // Get dimensions of the main image
//     const mainImageMetadata = await sharp(imageBuffer).metadata();
//     const mainWidth = mainImageMetadata.width || 1024;
//     const mainHeight = mainImageMetadata.height || 1024;
//     console.log('Main image dimensions:', mainWidth, 'x', mainHeight);
    
//     // Resize logo to be proportional to the main image (about 10-15% of width)
//     const logoWidth = Math.round(mainWidth * 0.15);
//     console.log('Target logo width:', logoWidth);
    
//     // Resize the logo while maintaining aspect ratio
//     const resizedLogo = await sharp(logoBuffer)
//       .resize({ width: logoWidth, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
//       .toBuffer();
    
//     // Get dimensions of the resized logo
//     const logoMetadata = await sharp(resizedLogo).metadata();
//     const resizedLogoWidth = logoMetadata.width || logoWidth;
//     const resizedLogoHeight = logoMetadata.height || logoWidth;
//     console.log('Resized logo dimensions:', resizedLogoWidth, 'x', resizedLogoHeight);
    
//     // Calculate position for bottom right placement with padding
//     const left = mainWidth - resizedLogoWidth - padding;
//     const top = mainHeight - resizedLogoHeight - padding;
//     console.log('Logo position (left, top):', left, top);
    
//     // Composite the logo onto the main image
//     const result = await sharp(imageBuffer)
//       .composite([
//         {
//           input: resizedLogo,
//           top: top,
//           left: left
//         }
//       ])
//       .toBuffer();
    
//     console.log('Logo successfully added to image');
//     return result;
//   } catch (err) {
//     console.error('Error adding logo to image:', err);
//     console.log('Returning original image due to error');
//     return imageBuffer; // Return original image if logo addition fails
//   }
// }

// export async function generateImageWithGPTImage1(
//   caption: string,
//   brandKit?: any,
//   n = 1,
//   size: "1024x1024" | "auto" | "1536x1024" | "1024x1536" | "256x256" | "512x512" | "1792x1024" | "1024x1792" = "1024x1024",
//   quality: "standard" | "low" = "low"
// ) {
//   try {
//     let prompt = caption;
//     if (brandKit) {
//       // We'll always leave space for the logo in the bottom right
//       const logoInstruction = '\nIMPORTANT: Leave space in the bottom right corner for the brand logo to be added later.';
//       const textProhibition = '\nCRITICAL INSTRUCTION: The image MUST NOT contain ANY text, typography, letters, numbers, or written elements whatsoever. DO NOT attempt to include any words, phrases, slogans, or text of any kind in the image.';
      
//       prompt = `Generate a high-quality brand advertisement image explaining ${brandKit.name}.

// Brand Identity:
// - Name: ${brandKit.name} 
// - Brand Description: ${brandKit.description}
// - Brand Tone/Style: ${brandKit.brand_tone}
// - Primary Brand Color: ${brandKit.primary_color}
// - Secondary Brand Color: ${brandKit.secondary_color}

// Advertisement Context:
// - Advertisement Focus: ${caption}
// - Create a visually striking promotional image that represents the brand's values and aesthetic
// - Incorporate the brand's color scheme (${brandKit.primary_color} and ${brandKit.secondary_color}) tastefully
// - Design should reflect the brand's personality (${brandKit.brand_tone})
// - Make sure advertisement explains what brand does and follows modern trends and it should not be traditional and same boring common post we are used to see. 
// - Make advertisement fun and engaging and interesting.
// - Image should be well-composed with professional-quality lighting and composition
// - Should look like a polished advertisement created by a professional designer, not AI-generated
// - Create a clean, impactful visual that effectively communicates the brand message
// - The image should be a high-quality advertisement that will be used on social media platforms
// ${logoInstruction}
// ${textProhibition}

// The final image should feel like premium content from a leading Instagram creator rather than traditional advertising.
// CRITICAL: DO NOT include ANY text, typography, letters, numbers, or written elements whatsoever in the image. NO WORDS, NO TEXT, NO LETTERS AT ALL - not even the brand name.
// `;
//     } else {
//       // Add text prohibition to any caption
//       prompt = `${caption}\n\nCRITICAL INSTRUCTION: The image MUST NOT contain ANY text, typography, letters, numbers, or written elements whatsoever. DO NOT attempt to include any words, phrases, slogans, or text of any kind in the image.`;
//     }
//     console.log('Generating image with prompt:', prompt, 'n:', n, 'size:', size, 'quality:', quality);
    
//     const response = await openai.images.generate({
//       model: "gpt-image-1",
//       prompt,
//       n,
//       size,
//       quality: 'low'
//     });
    
//     console.log('OpenAI image generation response:', response);
//     if (!response.data || response.data.length === 0) {
//       console.log('No image data returned');
//       return null;
//     }
    
//     // Check if brandKit has a logo to add
//     if (brandKit && brandKit.logo_url && typeof brandKit.logo_url === 'string' && 
//         brandKit.logo_url.startsWith('data:image/')) {
//       console.log('Brand has logo, attempting to add to image');
      
//       if (response.data[0].b64_json) {
//         // Convert base64 to buffer for processing
//         const imageBuffer = Buffer.from(response.data[0].b64_json, 'base64');
        
//         // Add logo to bottom right
//         const imageWithLogo = await addLogoToBottomRight(imageBuffer, brandKit.logo_url);
        
//         // Convert back to base64
//         const imageWithLogoBase64 = imageWithLogo.toString('base64');
        
//         // Return modified response with logo
//         return {
//           ...response,
//           data: [
//             {
//               ...response.data[0],
//               b64_json: imageWithLogoBase64
//             }
//           ],
//           hasLogo: true
//         };
//       } else {
//         console.log('No b64_json in response, cannot add logo');
//       }
//     }
    
//     return response;
//   } catch (error) {
//     console.error('Error generating image with gpt-image-1:', error);
//     throw error;
//   }
// }

// // New function to handle the edit endpoint workflow (which may be used in server code)
// export async function generateImageWithLogoEdit(
//   caption: string,
//   brandKit: any,
//   size: "1024x1024" | "auto" | "1536x1024" | "1024x1536" | "256x256" | "512x512" = "1024x1024",
//   quality: "standard" | "low" = "low"
// ) {
//   try {
//     console.log('Generating image with logo edit workflow for brand:', brandKit.name);
    
//     // Add text prohibition to caption
//     const textProhibition = '\nCRITICAL INSTRUCTION: The image MUST NOT contain ANY text, typography, letters, numbers, or written elements whatsoever.';
//     const captionWithProhibition = `${caption}${textProhibition}`;
    
//     // First generate base image
//     const baseImageResponse = await generateImageWithGPTImage1(
//       captionWithProhibition, 
//       brandKit, 
//       1, 
//       size,
//       quality
//     );
    
//     // Check if base generation was successful and already has logo
//     if (baseImageResponse && 'hasLogo' in baseImageResponse && baseImageResponse.hasLogo) {
//       console.log('Base image already has logo applied');
//       return baseImageResponse;
//     }
    
//     // If we have a response but no logo was added yet
//     if (baseImageResponse && baseImageResponse.data && baseImageResponse.data[0]) {
//       const imageData = baseImageResponse.data[0];
      
//       // Check if we have a valid logo
//       if (!brandKit.logo_url || typeof brandKit.logo_url !== 'string' || 
//           !brandKit.logo_url.startsWith('data:image/')) {
//         console.log('No valid logo URL in brand kit, returning base image');
//         return baseImageResponse;
//       }
      
//       // If we have base64 data, add logo directly
//       if (imageData.b64_json) {
//         console.log('Adding logo to base64 image');
//         const imageBuffer = Buffer.from(imageData.b64_json, 'base64');
//         const imageWithLogo = await addLogoToBottomRight(imageBuffer, brandKit.logo_url);
        
//         // Return modified response
//         return {
//           ...baseImageResponse,
//           data: [
//             {
//               ...imageData,
//               b64_json: imageWithLogo.toString('base64')
//             }
//           ],
//           hasLogo: true
//         };
//       }
      
//       // If we have a URL but no base64, download the image first
//       if (imageData.url) {
//         console.log('Downloading image from URL to add logo');
//         try {
//           const imageBuffer = await downloadImageToBuffer(imageData.url);
//           const imageWithLogo = await addLogoToBottomRight(imageBuffer, brandKit.logo_url);
          
//           // Return modified response
//           return {
//             ...baseImageResponse,
//             data: [
//               {
//                 ...imageData,
//                 b64_json: imageWithLogo.toString('base64'),
//                 url: null // Remove URL as we're now using base64
//               }
//             ],
//             hasLogo: true
//           };
//         } catch (downloadErr) {
//           console.error('Error downloading image:', downloadErr);
//           return baseImageResponse; // Return original response if download fails
//         }
//       }
//     }
    
//     // Fallback: return whatever we got from the base generation
//     return baseImageResponse;
//   } catch (error) {
//     console.error('Error in generateImageWithLogoEdit:', error);
//     throw error;
//   }
// }

// // Main workflow function to generate brand advertisement image with logo on the bottom right
// export async function generateBrandAdvertisement(
//   brandKit: any,
//   userPrompt?: string,
//   size: "1024x1024" | "auto" | "1536x1024" | "1024x1536" | "256x256" | "512x512" | "1792x1024" | "1024x1792" = "1024x1024",
//   quality: "standard" | "low" = "low"
// ) {
//   try {
//     console.log('Starting brand advertisement generation for:', brandKit.name);
//     console.log('Quality setting:', quality);
    
//     // Validate brand kit has required fields
//     if (!brandKit || !brandKit.name) {
//       throw new Error('Invalid brand kit: missing name');
//     }
    
//     // Log if logo URL exists
//     if (brandKit.logo_url) {
//       console.log('Logo URL provided of type:', typeof brandKit.logo_url);
//       if (typeof brandKit.logo_url === 'string') {
//         console.log('Logo URL prefix:', brandKit.logo_url.substring(0, 30) + '...');
//       }
//     } else {
//       console.log('No logo URL provided in brand kit');
//     }
    
//     // Step 1: Generate a detailed image prompt based on brand identity
//     let imagePrompt;
//     if (userPrompt) {
//       // If user provided a prompt, use it with brand context
//       const textProhibition = '\nCRITICAL INSTRUCTION: The image MUST NOT contain ANY text, typography, letters, numbers, or written elements whatsoever. DO NOT attempt to include any words, phrases, slogans, or text of any kind in the image.';
      
//       imagePrompt = `Create a highly engaging Instagram post for ${brandKit.name} that will attract new followers and increase engagement. The image should feature: ${userPrompt}.

//       Brand Elements:
//       - Incorporate the brand's signature colors (${brandKit.primary_color} and ${brandKit.secondary_color}) in a way that feels native to Instagram
//       - Refer to this for Description: ${brandKit.description}
//       - Match the brand's tone (${brandKit.brand_tone}) while ensuring the content feels authentic and relatable
//       - Design with Instagram's visual language in mind (high contrast, vibrant yet cohesive colors, eye-catching composition)
      
//       Instagram Optimization:
//       - Create a scroll-stopping visual that stands out in a crowded feed
//       - Design with mobile-first viewing in mind (clear focal point that works in small formats)
//       - Include subtle visual elements that encourage engagement (details that prompt questions or invite closer inspection)
//       - Create a scene that feels aspirational yet attainable to inspire sharing and saving
//       - Balance professional quality with authentic storytelling that builds community connection
      
//       Technical Requirements:
//       - Optimize composition for Instagram's square or 4:5 vertical format
//       - Ensure the visual remains impactful when viewed as a thumbnail
//       - Leave space in the bottom right corner for the brand logo
//       - Create depth and dimension that works well with Instagram's visual environment
//       ${textProhibition}
      
//       The final image should feel like premium content from a leading Instagram creator rather than traditional advertising. 
//       CRITICAL: DO NOT include ANY text, typography, letters, numbers, or written elements whatsoever in the image. NO WORDS, NO TEXT, NO LETTERS AT ALL - not even the brand name.
//       Leave space in the bottom right corner for a logo.`;
//     } else {
//       // Generate AI-crafted prompt based on brand details
//       imagePrompt = await generatePromptForImage(brandKit);
      
//       // Ensure instruction is for bottom right logo placement and no text
//       if (imagePrompt) {
//         if (!imagePrompt.toLowerCase().includes('bottom right')) {
//           imagePrompt += '\nLeave space in the bottom right corner for a logo.';
//         }
        
//         if (!imagePrompt.toLowerCase().includes('no text')) {
//           imagePrompt += '\nCRITICAL: The image MUST NOT contain ANY text, typography, letters, numbers, or written elements whatsoever.';
//         }
//       }
//     }
    
//     console.log('Using image prompt:', imagePrompt);
    
//     // Step 2: Generate the base image
//     console.log('Generating image with quality:', 'low');
//     const imageResponse = await openai.images.generate({
//       model: "gpt-image-1",
//       prompt: (imagePrompt || '') + '\n\nCRITICAL: DO NOT include ANY text, typography, letters, numbers, or written elements whatsoever in the image.',
//       n: 1,
//       size,
//       quality: 'low'
//     });
    
//     // Verify we received a valid response
//     if (!imageResponse.data || imageResponse.data.length === 0 || !imageResponse.data[0].b64_json) {
//       console.log('No valid image data returned from generation');
//       throw new Error('Failed to generate base image');
//     }
    
//     console.log('Image generated successfully');
    
//     // Step 3: Check if we have a logo to add
//     const validatedLogoUrl = validateLogoUrl(brandKit.logo_url);
//     if (!validatedLogoUrl) {
//       // If no valid logo, just return the generated image
//       console.log('No valid logo URL provided, returning base image only');
//       return {
//         ...imageResponse,
//         hasLogo: false
//       };
//     }
    
//     // Step 4: Add the logo to the bottom right of the generated image
//     console.log('Adding logo to image');
//     const baseImageBuffer = Buffer.from(imageResponse.data[0].b64_json, 'base64');
//     const imageWithLogo = await addLogoToBottomRight(baseImageBuffer, validatedLogoUrl);
    
//     // Convert the modified image back to base64
//     const imageWithLogoBase64 = imageWithLogo.toString('base64');
//     console.log('Image with logo created successfully');
    
//     // Step 5: Return the result in the same format as the original response
//     return {
//       created: imageResponse.created,
//       data: [
//         {
//           ...imageResponse.data[0],
//           b64_json: imageWithLogoBase64,
//           revised_prompt: imageResponse.data[0].revised_prompt
//         }
//       ],
//       hasLogo: true
//     };
//   } catch (error) {
//     console.error('Error in generateBrandAdvertisement:', error);
//     throw error;
//   }
// }



import OpenAI from "openai"
import fetch from "node-fetch"
import sharp from "sharp"
import { Buffer } from "buffer"

// Initialize OpenAI with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * Generates a detailed prompt for creating brand advertisement images
 * @param brandKit - The brand kit containing brand details
 * @returns A detailed prompt for image generation
 */
export async function generatePromptForImage(brandKit: any) {
  try {
    console.log("Generating image prompt for brand:", brandKit.name)

    // Create a detailed system prompt for better results
    const systemPrompt = `You are a professional art director and marketing expert who creates detailed prompts for 
    generating brand advertisement images. You understand visual design principles and brand identity. 
    You NEVER include text in images as you know AI models struggle with text rendering.
    
    Your prompts should:
    1. Be visually descriptive and specific
    2. Incorporate brand colors and personality
    3. Focus on composition, lighting, and mood
    4. NEVER suggest including any text, typography, or written elements
    5. Always leave space for logo placement in the bottom right`

    // Create a detailed user prompt with brand information
    const userPrompt = `
      Create a detailed, creative prompt for generating a brand advertisement image for ${brandKit.name}.
      
      Brand Details:
      - Name: ${brandKit.name}
      - Description: ${brandKit.description || "No description provided"}
      - Brand Voice/Tone: ${brandKit.brand_tone || "Professional"}
      - Primary Color: ${brandKit.primary_color || "#000000"}
      - Secondary Color: ${brandKit.secondary_color || "#FFFFFF"}
      
      The prompt should:
      1. Describe a visually striking, professional advertisement image
      2. Incorporate the brand's color scheme (${brandKit.primary_color || "#000000"} and ${brandKit.secondary_color || "#FFFFFF"})
      3. Suggest specific visual elements that would represent the brand well
      4. Include guidance on composition, lighting, and mood
      5. Be detailed enough for an AI image generator to create a high-quality brand advertisement
      6. Leave space in the bottom right corner for a logo to be added later
      7. CRITICAL: Absolutely NO text, typography, letters, numbers, or written elements of any kind should be included in the image
      
      Write a detailed 3-4 sentence prompt that would help generate an excellent advertisement image with NO TEXT whatsoever.
    `

    // Generate the prompt using OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 300,
    })

    // Extract and enhance the generated prompt
    const generatedPrompt = response.choices[0].message.content || ""
    console.log("Generated image prompt:", generatedPrompt)

    // Add critical instructions to ensure no text in the image
    return `${generatedPrompt}

CRITICAL INSTRUCTIONS:
- The image MUST NOT contain ANY text, typography, letters, numbers, or written elements whatsoever.
- Leave adequate space in the bottom right corner for a logo to be added later.
- Create a professional, high-quality advertisement suitable for social media.`
  } catch (error) {
    console.error("Error generating image prompt:", error)
    // Provide a fallback prompt in case of error
    return `Create a professional advertisement image using the brand colors ${brandKit.primary_color || "#000000"} and ${brandKit.secondary_color || "#FFFFFF"} that represents ${brandKit.name || "the brand"}. The image should be visually striking with good composition and lighting. CRITICAL: NO text, typography, or written elements of any kind. Leave space in the bottom right corner for a logo.`
  }
}

/**
 * Generates a caption for an image based on brand details
 * @param brandKit - The brand kit containing brand details
 * @param imageUrl - URL of the image to generate a caption for
 * @returns A generated caption for the image
 */
export async function generateCaption(brandKit: any, imageUrl: string) {
  try {
    console.log("Generating caption for brand:", brandKit.name)

    // Create a detailed system prompt for better caption generation
    const systemPrompt = `You are a creative marketing copywriter specialized in writing compelling brand advertisement captions.
    You craft concise, engaging, and brand-aligned copy that drives audience action.
    Your captions are always:
    - Authentic to the brand voice
    - Relevant to the image content
    - Concise and impactful
    - Strategically using hashtags and emojis
    - Including a clear call-to-action`

    // Create a detailed user prompt with brand and image information
    const userPrompt = `
      Generate a compelling advertisement caption for an image featuring ${brandKit.name}.
      
      Brand Details:
      - Name: ${brandKit.name}
      - Description: ${brandKit.description || "No description provided"}
      - Brand Voice/Tone: ${brandKit.brand_tone || "Professional"}
      - Primary Color: ${brandKit.primary_color || "#000000"}
      - Secondary Color: ${brandKit.secondary_color || "#FFFFFF"}
      ${brandKit.logo_url ? `- Brand logo is available.` : `- No brand logo provided.`}
      
      Image Context: ${imageUrl}
      
      Create a captivating brand advertisement caption that:
      1. Captures the brand's unique voice and personality (${brandKit.brand_tone || "Professional"})
      2. Relates directly to what's shown in the image
      3. Includes a clear call-to-action that encourages audience engagement
      4. Features 3-5 relevant and strategic hashtags
      5. Uses emojis appropriately to match the brand's tone
      6. Is between 100-200 characters for maximum impact
      
      Format the caption with line breaks for readability.
    `

    // Generate the caption using OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
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

    // Check if it's a valid data URL
    if (!logoUrl.startsWith("data:image/")) {
      console.log("Logo URL is not a valid data URL")
      return undefined
    }

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

    // Verify the buffer contains valid image data
    try {
      // Peek at the buffer to check if it's a valid image
      // This doesn't process the entire image, just checks the header
      const metadata = sharp(buffer).metadata()
      console.log("Logo validation successful, buffer length:", buffer.length)
      return logoUrl
    } catch (err) {
      console.error("Error validating logo image data:", err)
      return undefined
    }
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
 * @param logoDataUrl - Data URL of the logo to add
 * @param padding - Padding from the edges in pixels
 * @returns A buffer containing the image with the logo added
 */
export async function addLogoToBottomRight(imageBuffer: Buffer, logoDataUrl: string, padding = 30): Promise<Buffer> {
  try {
    console.log("Starting logo addition process")

    // Validate logo URL
    const validLogoUrl = validateLogoUrl(logoDataUrl)
    if (!validLogoUrl) {
      console.error("Logo validation failed, returning original image")
      return imageBuffer
    }

    // Extract the logo data
    const logoMatch = validLogoUrl.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,([A-Za-z0-9+/=]+)$/)
    if (!logoMatch) {
      throw new Error("Invalid logo data URL format")
    }

    // Decode logo from base64
    const logoBase64 = logoMatch[2]
    const logoBuffer = Buffer.from(logoBase64, "base64")
    console.log("Decoded logo buffer length:", logoBuffer.length)

    // Get dimensions of the main image
    const mainImageMetadata = await sharp(imageBuffer).metadata()
    const mainWidth = mainImageMetadata.width || 1024
    const mainHeight = mainImageMetadata.height || 1024
    console.log("Main image dimensions:", mainWidth, "x", mainHeight)

    // Calculate logo size (10-15% of image width)
    const logoWidth = Math.round(mainWidth * 0.12) // Slightly smaller for better aesthetics
    console.log("Target logo width:", logoWidth)

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
    console.log("Resized logo dimensions:", resizedLogoWidth, "x", resizedLogoHeight)

    // Calculate position for bottom right placement with padding
    const left = mainWidth - resizedLogoWidth - padding
    const top = mainHeight - resizedLogoHeight - padding
    console.log("Logo position (left, top):", left, top)

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

    console.log("Logo successfully added to image")
    return result
  } catch (err) {
    console.error("Error adding logo to image:", err)
    console.log("Returning original image due to error")
    return imageBuffer // Return original image if logo addition fails
  }
}

/**
 * Generates an image using OpenAI's GPT-4 Vision model
 * @param caption - The caption or prompt for the image
 * @param brandKit - Optional brand kit for brand-specific images
 * @param n - Number of images to generate
 * @param size - Size of the generated image
 * @param quality - Quality of the generated image
 * @returns The generated image(s)
 */
export async function generateImageWithGPTImage1(
  caption: string,
  brandKit?: any,
  n = 1,
  size:
    | "1024x1024"
    | "auto"
    | "1536x1024"
    | "1024x1536"
    | "256x256"
    | "512x512"
    | "1792x1024"
    | "1024x1792" = "1024x1024",
  quality: "standard" | "low" = "low",
) {
  try {
    // Build the prompt based on whether brand kit is provided
    let prompt = caption

    if (brandKit) {
      // Enhanced prompt with brand details and critical instructions
      prompt = `Generate a high-quality brand advertisement image for ${brandKit.name}.

Brand Identity:
- Name: ${brandKit.name} 
- Brand Description: ${brandKit.description || "No description provided"}
- Brand Tone/Style: ${brandKit.brand_tone || "Professional"}
- Primary Brand Color: ${brandKit.primary_color || "#000000"}
- Secondary Brand Color: ${brandKit.secondary_color || "#FFFFFF"}

Advertisement Context:
- Advertisement Focus: ${caption}
- Create a visually striking promotional image that represents the brand's values and aesthetic
- Incorporate the brand's color scheme tastefully
- Design should reflect the brand's personality
- Make the advertisement engaging, modern, and visually appealing
- Image should have professional-quality lighting and composition
- Should look like a polished advertisement created by a professional designer

IMPORTANT: Leave space in the bottom right corner for the brand logo to be added later.
CRITICAL INSTRUCTION: The image MUST NOT contain ANY text, typography, letters, numbers, or written elements whatsoever. DO NOT attempt to include any words, phrases, slogans, or text of any kind in the image.

The final image should feel like premium content from a leading social media creator rather than traditional advertising.`
    } else {
      // Add text prohibition to any caption
      prompt = `${caption}

CRITICAL INSTRUCTION: The image MUST NOT contain ANY text, typography, letters, numbers, or written elements whatsoever. DO NOT attempt to include any words, phrases, slogans, or text of any kind in the image.`
    }

    console.log("Generating image with prompt length:", prompt.length)
    console.log("Generation parameters - n:", n, "size:", size, "quality:", quality)

    // Generate the image using OpenAI
    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      n,
      size,
      quality,
    })

    console.log("Image generation successful, received data for", response.data.length, "images")

    // Check if we have valid response data
    if (!response.data || response.data.length === 0) {
      console.log("No image data returned")
      return null
    }

    // Check if brandKit has a logo to add
    if (
      brandKit &&
      brandKit.logo_url &&
      typeof brandKit.logo_url === "string" &&
      brandKit.logo_url.startsWith("data:image/")
    ) {
      console.log("Brand has logo, attempting to add to image")

      // Process each generated image if we have base64 data
      if (response.data[0].b64_json) {
        // Convert base64 to buffer for processing
        const imageBuffer = Buffer.from(response.data[0].b64_json, "base64")

        // Add logo to bottom right
        const imageWithLogo = await addLogoToBottomRight(imageBuffer, brandKit.logo_url)

        // Convert back to base64
        const imageWithLogoBase64 = imageWithLogo.toString("base64")

        // Return modified response with logo
        return {
          ...response,
          data: [
            {
              ...response.data[0],
              b64_json: imageWithLogoBase64,
            },
          ],
          hasLogo: true,
        }
      } else {
        console.log("No b64_json in response, cannot add logo")
      }
    }

    return response
  } catch (error) {
    console.error("Error generating image with gpt-image-1:", error)
    throw error
  }
}

/**
 * Main workflow function to generate brand advertisement image with logo
 * @param brandKit - The brand kit containing brand details
 * @param userPrompt - Optional user-provided prompt
 * @param size - Size of the generated image
 * @param quality - Quality of the generated image
 * @returns The generated advertisement image with logo
 */
export async function generateBrandAdvertisement(
  brandKit: any,
  userPrompt?: string,
  size:
    | "1024x1024"
    | "auto"
    | "1536x1024"
    | "1024x1536"
    | "256x256"
    | "512x512"
    | "1792x1024"
    | "1024x1792" = "1024x1024",
  quality: "standard" | "low" = "low",
) {
  try {
    console.log("Starting brand advertisement generation for:", brandKit.name)
    console.log("Quality setting:", quality)

    // Validate brand kit has required fields
    if (!brandKit || !brandKit.name) {
      throw new Error("Invalid brand kit: missing name")
    }

    // Log logo URL information
    if (brandKit.logo_url) {
      console.log("Logo URL provided of type:", typeof brandKit.logo_url)
      if (typeof brandKit.logo_url === "string") {
        console.log("Logo URL prefix:", `${brandKit.logo_url.substring(0, 30)}...`)
      }
    } else {
      console.log("No logo URL provided in brand kit")
    }

    // Step 1: Generate or use the image prompt
    let imagePrompt
    if (userPrompt) {
      // Enhanced user prompt with brand context and critical instructions
      imagePrompt = `Create a highly engaging social media post for ${brandKit.name} that will attract new followers and increase engagement. The image should feature: ${userPrompt}.

Brand Elements:
- Incorporate the brand's signature colors (${brandKit.primary_color || "#000000"} and ${brandKit.secondary_color || "#FFFFFF"})
- Brand Description: ${brandKit.description || "No description provided"}
- Match the brand's tone (${brandKit.brand_tone || "Professional"}) while ensuring the content feels authentic and relatable
- Design with social media visual language in mind (high contrast, vibrant yet cohesive colors, eye-catching composition)

Optimization:
- Create a scroll-stopping visual that stands out in a crowded feed
- Design with mobile-first viewing in mind (clear focal point that works in small formats)
- Include subtle visual elements that encourage engagement
- Create a scene that feels aspirational yet attainable to inspire sharing and saving
- Balance professional quality with authentic storytelling that builds community connection

Technical Requirements:
- Optimize composition for square or 4:5 vertical format
- Ensure the visual remains impactful when viewed as a thumbnail
- Leave space in the bottom right corner for the brand logo
- Create depth and dimension that works well with social media visual environment

CRITICAL INSTRUCTION: The image MUST NOT contain ANY text, typography, letters, numbers, or written elements whatsoever. DO NOT attempt to include any words, phrases, slogans, or text of any kind in the image.`
    } else {
      // Generate AI-crafted prompt based on brand details
      imagePrompt = await generatePromptForImage(brandKit)
    }

    console.log("Using image prompt with length:", imagePrompt?.length || 0)

    // Step 2: Generate the base image
    console.log("Generating image with quality:", quality)
    const imageResponse = await openai.images.generate({
      model: "gpt-image-1",
      prompt:
        (imagePrompt || "") +
        "\n\nCRITICAL: DO NOT include ANY text, typography, letters, numbers, or written elements whatsoever in the image.",
      n: 1,
      size,
      quality,
    })

    // Verify we received a valid response
    if (!imageResponse.data || imageResponse.data.length === 0 || !imageResponse.data[0].b64_json) {
      console.log("No valid image data returned from generation")
      throw new Error("Failed to generate base image")
    }

    console.log("Image generated successfully")

    // Step 3: Check if we have a logo to add
    const validatedLogoUrl = validateLogoUrl(brandKit.logo_url)
    if (!validatedLogoUrl) {
      // If no valid logo, just return the generated image
      console.log("No valid logo URL provided, returning base image only")
      return {
        ...imageResponse,
        hasLogo: false,
      }
    }

    // Step 4: Add the logo to the bottom right of the generated image
    console.log("Adding logo to image")
    const baseImageBuffer = Buffer.from(imageResponse.data[0].b64_json, "base64")
    const imageWithLogo = await addLogoToBottomRight(baseImageBuffer, validatedLogoUrl)

    // Convert the modified image back to base64
    const imageWithLogoBase64 = imageWithLogo.toString("base64")
    console.log("Image with logo created successfully")

    // Step 5: Return the result in the same format as the original response
    return {
      created: imageResponse.created,
      data: [
        {
          ...imageResponse.data[0],
          b64_json: imageWithLogoBase64,
          revised_prompt: imageResponse.data[0].revised_prompt,
        },
      ],
      hasLogo: true,
    }
  } catch (error) {
    console.error("Error in generateBrandAdvertisement:", error)
    throw error
  }
}

// Export additional utility function for handling image with logo edit workflow
export async function generateImageWithLogoEdit(
  caption: string,
  brandKit: any,
  size: "1024x1024" | "auto" | "1536x1024" | "1024x1536" | "256x256" | "512x512" = "1024x1024",
  quality: "standard" | "low" = "low",
) {
  try {
    console.log("Generating image with logo edit workflow for brand:", brandKit.name)

    // Add text prohibition to caption
    const textProhibition =
      "\nCRITICAL INSTRUCTION: The image MUST NOT contain ANY text, typography, letters, numbers, or written elements whatsoever."
    const captionWithProhibition = `${caption}${textProhibition}`

    // First generate base image
    const baseImageResponse = await generateImageWithGPTImage1(captionWithProhibition, brandKit, 1, size, quality)

    // Check if base generation was successful and already has logo
    if (baseImageResponse && "hasLogo" in baseImageResponse && baseImageResponse.hasLogo) {
      console.log("Base image already has logo applied")
      return baseImageResponse
    }

    // If we have a response but no logo was added yet
    if (baseImageResponse && baseImageResponse.data && baseImageResponse.data[0]) {
      const imageData = baseImageResponse.data[0]

      // Check if we have a valid logo
      if (!brandKit.logo_url || typeof brandKit.logo_url !== "string" || !brandKit.logo_url.startsWith("data:image/")) {
        console.log("No valid logo URL in brand kit, returning base image")
        return baseImageResponse
      }

      // If we have base64 data, add logo directly
      if (imageData.b64_json) {
        console.log("Adding logo to base64 image")
        const imageBuffer = Buffer.from(imageData.b64_json, "base64")
        const imageWithLogo = await addLogoToBottomRight(imageBuffer, brandKit.logo_url)

        // Return modified response
        return {
          ...baseImageResponse,
          data: [
            {
              ...imageData,
              b64_json: imageWithLogo.toString("base64"),
            },
          ],
          hasLogo: true,
        }
      }

      // If we have a URL but no base64, download the image first
      if (imageData.url) {
        console.log("Downloading image from URL to add logo")
        try {
          const imageBuffer = await downloadImageToBuffer(imageData.url)
          const imageWithLogo = await addLogoToBottomRight(imageBuffer, brandKit.logo_url)

          // Return modified response
          return {
            ...baseImageResponse,
            data: [
              {
                ...imageData,
                b64_json: imageWithLogo.toString("base64"),
                url: null, // Remove URL as we're now using base64
              },
            ],
            hasLogo: true,
          }
        } catch (downloadErr) {
          console.error("Error downloading image:", downloadErr)
          return baseImageResponse // Return original response if download fails
        }
      }
    }

    // Fallback: return whatever we got from the base generation
    return baseImageResponse
  } catch (error) {
    console.error("Error in generateImageWithLogoEdit:", error)
    throw error
  }
}

// Example usage
if (require.main === module) {
  ;(async () => {
    try {
      console.log("Testing brand advertisement generation...")

      // Example brand kit
      const exampleBrandKit = {
        name: "Example Brand",
        description: "A modern, innovative tech company focused on sustainability",
        brand_tone: "Professional yet friendly",
        primary_color: "#3498db",
        secondary_color: "#2ecc71",
        // No logo for this example
      }

      // Generate an advertisement
      const result = await generateBrandAdvertisement(
        exampleBrandKit,
        "Show our product being used in a natural setting",
        "1024x1024",
        "low",
      )

      console.log("Generation successful:", !!result)
      console.log("Has logo:", result.hasLogo)
    } catch (error) {
      console.error("Test failed:", error)
    }
  })()
}
