import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function generateTweet(context: string, user: { full_name?: string }) {
  const prompt = `Write a concise, engaging tweet (max 280 characters) for the following context: "${context}". Personalize it for the user: ${user?.full_name || "User"}.`;
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You are a witty, concise Twitter content creator." },
      { role: "user", content: prompt }
    ],
    max_tokens: 100,
    temperature: 0.8
  });
  let tweet = completion.choices[0].message.content || "";
  if (tweet.length > 280) tweet = tweet.slice(0, 280);
  return tweet;
} 