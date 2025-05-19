import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function generateLinkedInPost(topic: string) {
  const prompt = `Write a professional, engaging LinkedIn post about "${topic}". Use a business tone, provide value, and include a relevant call-to-action.`;
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You are a professional LinkedIn content creator." },
      { role: "user", content: prompt }
    ],
    max_tokens: 300,
    temperature: 0.7
  });
  return completion.choices[0].message.content || "";
} 