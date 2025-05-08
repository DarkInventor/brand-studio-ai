// import OpenAI from 'openai';
// import https from 'https'
// import fetch from 'node-fetch'
// import FormData from 'form-data';
// import path from 'path';
// import os from 'os';
// import fs from 'fs';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function generateCaption(brandKit: any, imageUrl: string) {
//   try {
//     console.log('Generating caption with brandKit:', brandKit, 'and imageUrl:', imageUrl);
//     const logoInfo = brandKit.logo_url ? `Brand logo is available as a data URL.` : `No brand logo provided.`;
//     const prompt = `
//       Generate an Instagram caption for a post featuring an image of ${brandKit.name}.
//       Brand details:
//       - Description: ${brandKit.description}
//       - Tone: ${brandKit.brand_tone}
//       - Primary Color: ${brandKit.primary_color}
//       - Secondary Color: ${brandKit.secondary_color}
//       - Logo: ${logoInfo}
//       The image shows: ${imageUrl}
      
//       Generate a creative, engaging caption that:
//       1. Matches the brand's tone and style
//       2. Is suitable for Instagram
//       3. Includes relevant hashtags
//       4. Is no longer than 2200 characters
//     `;
//     console.log('Generated prompt:', prompt);

//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo-0125",
//       messages: [
//         {
//           role: "system",
//           content: "You are a creative image prompt engineer. You will be given a brand kit and a caption. You will need to generate an image prompt for a OPENAI gpt-image-1 image generation model."
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

// export async function generateImageWithGPTImage1(
//   caption: string,
//   brandKit?: any,
//   n = 1,
//   size: "1024x1024" | "auto" | "1536x1024" | "1024x1536" | "256x256" | "512x512" | "1792x1024" | "1024x1792" = "1024x1024"
// ) {
//   try {
//     let prompt = caption;
//     if (brandKit) {
//       let logoSection = '- Logo: No logo provided.';
//       let logoInstruction = '';
//       if (brandKit.logo_url && typeof brandKit.logo_url === 'string' && brandKit.logo_url.startsWith('data:image/')) {
//         // Try to extract image type and a short hash for reference
//         const match = brandKit.logo_url.match(/^data:(image\/\w+);base64,([A-Za-z0-9+/=]+)/);
//         const type = match ? match[1] : 'image/png';
//         const base64 = match ? match[2] : '';
//         const hash = base64 ? base64.slice(0, 16) + '...' : '';
//         logoSection = `- Logo: [${type}], base64 hash: ${hash}`;
//         logoInstruction = '\nIMPORTANT: Visually include the brand logo on the bottom right of the image.';
//       }
//       prompt = `Generate an Instagram post image for the following brand:\n- Name: ${brandKit.name}\n- Description: ${brandKit.description}\n- Tone: ${brandKit.brand_tone}\n- Primary Color: ${brandKit.primary_color}\n- Secondary Color: ${brandKit.secondary_color}\n${logoSection}\n\nCaption: ${caption}${logoInstruction}`;
//     }
//     console.log('Generating image with prompt:', prompt, 'n:', n, 'size:', size);
//     const response = await openai.images.generate({
//       model: "gpt-image-1",
//       prompt,
//       n,
//       size,
//     });
//     console.log('OpenAI image generation response:', response);
//     if (!response.data || response.data.length === 0) {
//       console.log('No image data returned');
//       return null;
//     }
//     return response;
//   } catch (error) {
//     console.error('Error generating image with gpt-image-1:', error);
//     throw error;
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

// export async function generateImageWithLogoEdit(
//   caption: string,
//   brandKit: any,
//   n = 1,
//   size: "1024x1024" | "auto" | "1536x1024" | "1024x1536" | "256x256" | "512x512" | "1792x1024" | "1024x1792" = "1024x1024"
// ) {
//   if (!brandKit.logo_url || typeof brandKit.logo_url !== 'string' || !brandKit.logo_url.startsWith('data:image/')) {
//     throw new Error('Brand kit does not have a valid logo data URL');
//   }
//   // 1. Generate a base image from the prompt
//   const basePrompt = `Generate an Instagram post image for the following brand:\n- Name: ${brandKit.name}\n- Description: ${brandKit.description}\n- Tone: ${brandKit.brand_tone}\n- Primary Color: ${brandKit.primary_color}\n- Secondary Color: ${brandKit.secondary_color}\n\nCaption: ${caption}`;
//   const baseImageResponse = await openai.images.generate({
//     model: "gpt-image-1",
//     prompt: basePrompt,
//     n,
//     size,
//     response_format: "b64_json"
//   });
//   if (!baseImageResponse.data || !baseImageResponse.data[0] || !baseImageResponse.data[0].b64_json) {
//     throw new Error('Failed to generate base image for edit');
//   }
//   // 2. Decode base image and logo to buffers and write to temp files
//   const baseImageBuffer = Buffer.from(baseImageResponse.data[0].b64_json, 'base64');
//   const baseTmpPath = path.join(os.tmpdir(), `brand-base-${Date.now()}.png`);
//   fs.writeFileSync(baseTmpPath, baseImageBuffer as Buffer);
//   const match = brandKit.logo_url.match(/^data:(image\/\w+);base64,([A-Za-z0-9+/=]+)/);
//   if (!match) throw new Error('Invalid logo data URL');
//   const ext = match[1].split('/')[1];
//   const logoBuffer = Buffer.from(match[2], 'base64');
//   const logoTmpPath = path.join(os.tmpdir(), `brand-logo-${Date.now()}.${ext}`);
//   fs.writeFileSync(logoTmpPath, logoBuffer as Buffer);
//   // 3. Prepare form data for edits endpoint
//   const form = new FormData();
//   form.append('model', 'gpt-image-1');
//   form.append('image[]', fs.createReadStream(baseTmpPath));
//   form.append('image[]', fs.createReadStream(logoTmpPath));
//   form.append('prompt', `Place the provided logo (second image) on the bottom right of the Instagram post image (first image).`);
//   form.append('n', n);
//   form.append('size', size);
//   // 4. Send request
//   const response = await fetch('https://api.openai.com/v1/images/edits', {
//     method: 'POST',
//     headers: {
//       'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//       ...form.getHeaders(),
//     },
//     body: form,
//   });
//   fs.unlinkSync(baseTmpPath);
//   fs.unlinkSync(logoTmpPath);
//   if (!response.ok) {
//     const errText = await response.text();
//     throw new Error(`OpenAI edits endpoint error: ${errText}`);
//   }
//   return await response.json();
// }
import OpenAI from 'openai';
import https from 'https'
// @ts-expect-error: no types for node-fetch
import fetch from 'node-fetch'
import FormData from 'form-data';
import path from 'path';
import os from 'os';
import fs from 'fs';
import sharp from 'sharp'; // Add sharp for image processing

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate image with brand data using GPT-4 vision for better caption generation
export async function generatePromptForImage(brandKit: any) {
  try {
    console.log('Generating image prompt for brand:', brandKit.name);
    const prompt = `
      Create a detailed, creative prompt for generating a brand advertisement image for ${brandKit.name}.
      
      Brand Details:
      - Name: ${brandKit.name}
      - Description: ${brandKit.description}
      - Brand Voice/Tone: ${brandKit.brand_tone}
      - Primary Color: ${brandKit.primary_color}
      - Secondary Color: ${brandKit.secondary_color}
      
      The prompt should:
      1. Describe a visually striking, professional advertisement image
      2. Incorporate the brand's color scheme and personality
      3. Suggest specific visual elements that would represent the brand well
      4. Include guidance on composition, lighting, and mood
      5. Be detailed enough for an AI image generator to create a high-quality brand advertisement
      6. Leave space in the bottom right corner for a logo to be added later
      7. Not include any text in the image
      
      Write a detailed 3-4 sentence prompt that would help generate an excellent advertisement image.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        {
          role: "system",
          content: "You are a professional art director who creates detailed prompts for generating brand advertisement images. You understand visual design principles and brand identity."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 300
    });

    console.log('Generated image prompt:', response.choices[0].message.content);
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating image prompt:', error);
    throw error;
  }
}

export async function generateCaption(brandKit: any, imageUrl: string) {
  try {
    console.log('Generating caption with brandKit:', brandKit, 'and imageUrl:', imageUrl);
    const logoInfo = brandKit.logo_url ? `Brand logo is available as a data URL.` : `No brand logo provided.`;
    const prompt = `
      Generate a compelling advertisement caption for an image featuring ${brandKit.name}.
      
      Brand Details:
      - Name: ${brandKit.name}
      - Description: ${brandKit.description}
      - Brand Voice/Tone: ${brandKit.brand_tone}
      - Primary Color: ${brandKit.primary_color}
      - Secondary Color: ${brandKit.secondary_color}
      ${logoInfo}
      
      Image Context: ${imageUrl}
      
      Create a captivating brand advertisement caption that:
      1. Captures the brand's unique voice and personality (${brandKit.brand_tone})
      2. Relates directly to what's shown in the image
      3. Includes a clear call-to-action that encourages audience engagement
      4. Features 3-5 relevant and strategic hashtags if appropriate for the platform
      5. Uses emojis appropriately to match the brand's tone
      6. Is between 100-200 characters for maximum impact
      
      Format the caption with line breaks for readability.
    `;
    console.log('Generated prompt:', prompt);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        {
          role: "system",
          content: "You are a creative marketing copywriter specialized in writing compelling brand advertisement captions. You craft concise, engaging, and brand-aligned copy that drives audience action."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    console.log('OpenAI response:', response);
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating caption:', error);
    throw error;
  }
}

// Function to validate and fix logo URL issues
export function validateLogoUrl(logoUrl: string | undefined): string | undefined {
  console.log('Validating logo URL:', logoUrl?.substring(0, 30) + '...');
  
  if (!logoUrl) {
    console.log('No logo URL provided');
    return undefined;
  }
  
  if (typeof logoUrl !== 'string') {
    console.log('Logo URL is not a string:', typeof logoUrl);
    return undefined;
  }
  
  // Check if it's a valid data URL
  if (!logoUrl.startsWith('data:image/')) {
    console.log('Logo URL is not a valid data URL');
    return undefined;
  }
  
  // Verify the base64 part exists
  const logoMatch = logoUrl.match(/^data:(image\/\w+);base64,([A-Za-z0-9+/=]+)/);
  if (!logoMatch) {
    console.log('Invalid logo data URL format');
    return undefined;
  }
  
  try {
    // Check if base64 can be decoded
    const logoBase64 = logoMatch[2];
    const buffer = Buffer.from(logoBase64, 'base64');
    if (buffer.length === 0) {
      console.log('Logo base64 decodes to empty buffer');
      return undefined;
    }
    console.log('Logo validation successful, buffer length:', buffer.length);
    return logoUrl;
  } catch (err) {
    console.error('Error validating logo:', err);
    return undefined;
  }
}

export async function downloadImageToBuffer(url: string): Promise<Buffer> {
  try {
    console.log('Downloading image from URL:', url);
    const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
    console.log('Fetch response status:', response.status, response.statusText);

    if (!response.ok) {
      console.error('Failed to fetch image:', response.status, response.statusText);
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    console.log('Downloaded image buffer length:', buffer.length);
    return buffer;
  } catch (err) {
    console.error('Error in downloadImageToBuffer:', err);
    throw err;
  }
}

// Enhanced version with better debugging to add logo to the bottom right corner
export async function addLogoToBottomRight(imageBuffer: Buffer, logoDataUrl: string, padding = 30): Promise<Buffer> {
  try {
    console.log('Starting logo addition process');
    
    // Validate logo URL
    const validLogoUrl = validateLogoUrl(logoDataUrl);
    if (!validLogoUrl) {
      console.error('Logo validation failed, returning original image');
      return imageBuffer;
    }
    
    // Extract the logo data
    const logoMatch = validLogoUrl.match(/^data:(image\/\w+);base64,([A-Za-z0-9+/=]+)/);
    if (!logoMatch) {
      throw new Error('Invalid logo data URL format');
    }
    
    const logoBase64 = logoMatch[2];
    const logoBuffer = Buffer.from(logoBase64, 'base64');
    console.log('Decoded logo buffer length:', logoBuffer.length);
    
    // Get dimensions of the main image
    const mainImageMetadata = await sharp(imageBuffer).metadata();
    const mainWidth = mainImageMetadata.width || 1024;
    const mainHeight = mainImageMetadata.height || 1024;
    console.log('Main image dimensions:', mainWidth, 'x', mainHeight);
    
    // Resize logo to be proportional to the main image (about 10-15% of width)
    const logoWidth = Math.round(mainWidth * 0.15);
    console.log('Target logo width:', logoWidth);
    
    // Resize the logo while maintaining aspect ratio
    const resizedLogo = await sharp(logoBuffer)
      .resize({ width: logoWidth, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer();
    
    // Get dimensions of the resized logo
    const logoMetadata = await sharp(resizedLogo).metadata();
    const resizedLogoWidth = logoMetadata.width || logoWidth;
    const resizedLogoHeight = logoMetadata.height || logoWidth;
    console.log('Resized logo dimensions:', resizedLogoWidth, 'x', resizedLogoHeight);
    
    // Calculate position for bottom right placement with padding
    const left = mainWidth - resizedLogoWidth - padding;
    const top = mainHeight - resizedLogoHeight - padding;
    console.log('Logo position (left, top):', left, top);
    
    // Composite the logo onto the main image
    const result = await sharp(imageBuffer)
      .composite([
        {
          input: resizedLogo,
          top: top,
          left: left
        }
      ])
      .toBuffer();
    
    console.log('Logo successfully added to image');
    return result;
  } catch (err) {
    console.error('Error adding logo to image:', err);
    console.log('Returning original image due to error');
    return imageBuffer; // Return original image if logo addition fails
  }
}

export async function generateImageWithGPTImage1(
  caption: string,
  brandKit?: any,
  n = 1,
  size: "1024x1024" | "auto" | "1536x1024" | "1024x1536" | "256x256" | "512x512" | "1792x1024" | "1024x1792" = "1024x1024",
  quality: "standard" | "low" = "low"
) {
  try {
    let prompt = caption;
    if (brandKit) {
      // We'll always leave space for the logo in the bottom right
      const logoInstruction = '\nIMPORTANT: Leave space in the bottom right corner for the brand logo to be added later.';
      
      prompt = `Generate a high-quality brand advertisement image for ${brandKit.name}.

Brand Identity:
- Name: ${brandKit.name} 
- Brand Description: ${brandKit.description}
- Brand Tone/Style: ${brandKit.brand_tone}
- Primary Brand Color: ${brandKit.primary_color}
- Secondary Brand Color: ${brandKit.secondary_color}

Advertisement Context:
- Advertisement Focus: ${caption}
- Create a visually striking promotional image that represents the brand's values and aesthetic
- Incorporate the brand's color scheme (${brandKit.primary_color} and ${brandKit.secondary_color}) tastefully
- Design should reflect the brand's personality (${brandKit.brand_tone})
- Image should be well-composed with professional-quality lighting and composition
- Should look like a polished advertisement created by a professional designer, not AI-generated
- Create a clean, impactful visual that effectively communicates the brand message
${logoInstruction}

DO NOT include text in the image unless specifically requested.`;
    }
    console.log('Generating image with prompt:', prompt, 'n:', n, 'size:', size, 'quality:', quality);
    
    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      n,
      size,
      quality: 'low'
    });
    
    console.log('OpenAI image generation response:', response);
    if (!response.data || response.data.length === 0) {
      console.log('No image data returned');
      return null;
    }
    
    // Check if brandKit has a logo to add
    if (brandKit && brandKit.logo_url && typeof brandKit.logo_url === 'string' && 
        brandKit.logo_url.startsWith('data:image/')) {
      console.log('Brand has logo, attempting to add to image');
      
      if (response.data[0].b64_json) {
        // Convert base64 to buffer for processing
        const imageBuffer = Buffer.from(response.data[0].b64_json, 'base64');
        
        // Add logo to bottom right
        const imageWithLogo = await addLogoToBottomRight(imageBuffer, brandKit.logo_url);
        
        // Convert back to base64
        const imageWithLogoBase64 = imageWithLogo.toString('base64');
        
        // Return modified response with logo
        return {
          ...response,
          data: [
            {
              ...response.data[0],
              b64_json: imageWithLogoBase64
            }
          ],
          hasLogo: true
        };
      } else {
        console.log('No b64_json in response, cannot add logo');
      }
    }
    
    return response;
  } catch (error) {
    console.error('Error generating image with gpt-image-1:', error);
    throw error;
  }
}

// New function to handle the edit endpoint workflow (which may be used in server code)
export async function generateImageWithLogoEdit(
  caption: string,
  brandKit: any,
  size: "1024x1024" | "auto" | "1536x1024" | "1024x1536" | "256x256" | "512x512" = "1024x1024",
  quality: "standard" | "low" = "low"
) {
  try {
    console.log('Generating image with logo edit workflow for brand:', brandKit.name);
    
    // First generate base image
    const baseImageResponse = await generateImageWithGPTImage1(
      caption, 
      brandKit, 
      1, 
      size,
      quality
    );
    
    // Check if base generation was successful and already has logo
    if (baseImageResponse && 'hasLogo' in baseImageResponse && baseImageResponse.hasLogo) {
      console.log('Base image already has logo applied');
      return baseImageResponse;
    }
    
    // If we have a response but no logo was added yet
    if (baseImageResponse && baseImageResponse.data && baseImageResponse.data[0]) {
      const imageData = baseImageResponse.data[0];
      
      // Check if we have a valid logo
      if (!brandKit.logo_url || typeof brandKit.logo_url !== 'string' || 
          !brandKit.logo_url.startsWith('data:image/')) {
        console.log('No valid logo URL in brand kit, returning base image');
        return baseImageResponse;
      }
      
      // If we have base64 data, add logo directly
      if (imageData.b64_json) {
        console.log('Adding logo to base64 image');
        const imageBuffer = Buffer.from(imageData.b64_json, 'base64');
        const imageWithLogo = await addLogoToBottomRight(imageBuffer, brandKit.logo_url);
        
        // Return modified response
        return {
          ...baseImageResponse,
          data: [
            {
              ...imageData,
              b64_json: imageWithLogo.toString('base64')
            }
          ],
          hasLogo: true
        };
      }
      
      // If we have a URL but no base64, download the image first
      if (imageData.url) {
        console.log('Downloading image from URL to add logo');
        try {
          const imageBuffer = await downloadImageToBuffer(imageData.url);
          const imageWithLogo = await addLogoToBottomRight(imageBuffer, brandKit.logo_url);
          
          // Return modified response
          return {
            ...baseImageResponse,
            data: [
              {
                ...imageData,
                b64_json: imageWithLogo.toString('base64'),
                url: null // Remove URL as we're now using base64
              }
            ],
            hasLogo: true
          };
        } catch (downloadErr) {
          console.error('Error downloading image:', downloadErr);
          return baseImageResponse; // Return original response if download fails
        }
      }
    }
    
    // Fallback: return whatever we got from the base generation
    return baseImageResponse;
  } catch (error) {
    console.error('Error in generateImageWithLogoEdit:', error);
    throw error;
  }
}

// Main workflow function to generate brand advertisement image with logo on the bottom right
export async function generateBrandAdvertisement(
  brandKit: any,
  userPrompt?: string,
  size: "1024x1024" | "auto" | "1536x1024" | "1024x1536" | "256x256" | "512x512" | "1792x1024" | "1024x1792" = "1024x1024",
  quality: "standard" | "low" = "low"
) {
  try {
    console.log('Starting brand advertisement generation for:', brandKit.name);
    console.log('Quality setting:', quality);
    
    // Validate brand kit has required fields
    if (!brandKit || !brandKit.name) {
      throw new Error('Invalid brand kit: missing name');
    }
    
    // Log if logo URL exists
    if (brandKit.logo_url) {
      console.log('Logo URL provided of type:', typeof brandKit.logo_url);
      if (typeof brandKit.logo_url === 'string') {
        console.log('Logo URL prefix:', brandKit.logo_url.substring(0, 30) + '...');
      }
    } else {
      console.log('No logo URL provided in brand kit');
    }
    
    // Step 1: Generate a detailed image prompt based on brand identity
    let imagePrompt;
    if (userPrompt) {
      // If user provided a prompt, use it with brand context
      imagePrompt = `Create a professional advertisement for ${brandKit.name} that features: ${userPrompt}. 
      Incorporate the brand's colors (${brandKit.primary_color} and ${brandKit.secondary_color}) 
      and match the brand tone (${brandKit.brand_tone}). 
      Leave space in the bottom right corner for a logo.`;
    } else {
      // Generate AI-crafted prompt based on brand details
      imagePrompt = await generatePromptForImage(brandKit);
      
      // Ensure instruction is for bottom right logo placement
      if (imagePrompt && !imagePrompt.toLowerCase().includes('bottom right')) {
        imagePrompt += '\nLeave space in the bottom right corner for a logo.';
      }
    }
    
    console.log('Using image prompt:', imagePrompt);
    
    // Step 2: Generate the base image
    console.log('Generating image with quality:', 'low');
    const imageResponse = await openai.images.generate({
      model: "gpt-image-1",
      prompt: imagePrompt || '',
      n: 1,
      size,
      quality: 'low'
    });
    
    // Verify we received a valid response
    if (!imageResponse.data || imageResponse.data.length === 0 || !imageResponse.data[0].b64_json) {
      console.log('No valid image data returned from generation');
      throw new Error('Failed to generate base image');
    }
    
    console.log('Image generated successfully');
    
    // Step 3: Check if we have a logo to add
    const validatedLogoUrl = validateLogoUrl(brandKit.logo_url);
    if (!validatedLogoUrl) {
      // If no valid logo, just return the generated image
      console.log('No valid logo URL provided, returning base image only');
      return {
        ...imageResponse,
        hasLogo: false
      };
    }
    
    // Step 4: Add the logo to the bottom right of the generated image
    console.log('Adding logo to image');
    const baseImageBuffer = Buffer.from(imageResponse.data[0].b64_json, 'base64');
    const imageWithLogo = await addLogoToBottomRight(baseImageBuffer, validatedLogoUrl);
    
    // Convert the modified image back to base64
    const imageWithLogoBase64 = imageWithLogo.toString('base64');
    console.log('Image with logo created successfully');
    
    // Step 5: Return the result in the same format as the original response
    return {
      created: imageResponse.created,
      data: [
        {
          ...imageResponse.data[0],
          b64_json: imageWithLogoBase64,
          revised_prompt: imageResponse.data[0].revised_prompt
        }
      ],
      hasLogo: true
    };
  } catch (error) {
    console.error('Error in generateBrandAdvertisement:', error);
    throw error;
  }
}