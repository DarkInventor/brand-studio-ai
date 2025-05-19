import { NextRequest, NextResponse } from "next/server";
import { uploadToR2 } from "@/lib/r2";

export async function POST(req: NextRequest) {
  try {
    const { imageDataUrl, userId } = await req.json();
    if (!imageDataUrl || !userId) return NextResponse.json({ error: "Missing image or userId" }, { status: 400 });

    // Parse base64
    const matches = imageDataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches) return NextResponse.json({ error: "Invalid image data" }, { status: 400 });
    const contentType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, "base64");

    // Upload to R2
    const url = await uploadToR2(buffer, contentType, `posts/${userId}`);
    return NextResponse.json({ url });
  } catch (e) {
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
} 