import { NextApiRequest, NextApiResponse } from "next";
import { generateTweet } from "@/lib/openai-tweet";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { context, user } = JSON.parse(req.body);
    const tweet = await generateTweet(context, user);
    res.status(200).json({ tweet });
  } catch (error) {
    console.error("/api/generate-tweet error:", error);
    res.status(500).json({ tweet: "", error: "Failed to generate tweet." });
  }
} 