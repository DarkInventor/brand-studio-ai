import { NextApiRequest, NextApiResponse } from "next";
import { generateLinkedInPost } from "@/lib/openai-linkedin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { topic } = JSON.parse(req.body);
    const suggestion = await generateLinkedInPost(topic);
    res.status(200).json({ suggestion });
  } catch (error) {
    console.error("/api/generate-linkedin-post error:", error);
    res.status(500).json({ suggestion: "", error: "Failed to generate LinkedIn post." });
  }
} 