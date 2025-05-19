import type { NextApiRequest, NextApiResponse } from "next";
import { uploadToR2 } from "@/lib/r2";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { imageDataUrl, userId } = req.body;
    if (!imageDataUrl || !userId) return res.status(400).json({ error: "Missing image or userId" });

    // Parse base64
    const matches = imageDataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches) return res.status(400).json({ error: "Invalid image data" });
    const contentType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, "base64");

    // Upload to R2
    const url = await uploadToR2(buffer, contentType, `posts/${userId}`);
    return res.status(200).json({ url });
  } catch (e) {
    return res.status(500).json({ error: "Failed to upload image" });
  }
} 