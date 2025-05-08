import OpenAI from 'openai';
import https from 'https'
import fetch from 'node-fetch'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateCaption(brandKit: any, imageUrl: string) {
  try {
    console.log('Generating caption with brandKit:', brandKit, 'and imageUrl:', imageUrl);
    const prompt = `
      Generate an Instagram caption for a post featuring an image of ${brandKit.name}.
      Consider the following brand characteristics:
      - Tone: ${brandKit.brand_tone}
      - Primary Color: ${brandKit.primary_color}
      - Secondary Color: ${brandKit.secondary_color}
      
      The image shows: ${imageUrl}
      
      Generate a creative, engaging caption that:
      1. Matches the brand's tone and style
      2. Is suitable for Instagram
      3. Includes relevant hashtags
      4. Is no longer than 2200 characters
    `;
    console.log('Generated prompt:', prompt);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        {
          role: "system",
          content: "You are a creative Instagram caption generator that understands brand identity."
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

export async function generateImageWithGPTImage1(prompt: string, n = 1, size: "1024x1024" | "auto" | "1536x1024" | "1024x1536" | "256x256" | "512x512" | "1792x1024" | "1024x1792" = "1024x1024") {
  try {
    console.log('Generating image with prompt:', prompt, 'n:', n, 'size:', size);
    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      n,
      size,
    });
    console.log('OpenAI image generation response:', response);
    if (!response.data || response.data.length === 0) {
      console.log('No image data returned');
      return null;
    }
    return response;
  } catch (error) {
    console.error('Error generating image with gpt-image-1:', error);
    throw error;
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