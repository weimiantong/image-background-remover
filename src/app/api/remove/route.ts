import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';

const REMOVE_BG_API_URL = "https://api.remove.bg/v1.0/removebg";

export async function POST(req: NextRequest) {
  // Cloudflare Pages: env vars are available via process.env in edge runtime
  // when configured in wrangler.toml or Cloudflare dashboard
  const apiKey = process.env.REMOVE_BG_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "API key not configured", code: "MISSING_API_KEY" },
      { status: 500 }
    );
  }

  try {
    const formData = await req.formData();
    const imageFile = formData.get("image");

    if (!imageFile || !(imageFile instanceof File)) {
      return NextResponse.json(
        { error: "No image provided", code: "NO_IMAGE" },
        { status: 400 }
      );
    }

    // Validate size
    if (imageFile.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image too large (max 10MB)", code: "IMAGE_TOO_LARGE" },
        { status: 400 }
      );
    }

    // Validate type
    const validTypes = ["image/png", "image/jpeg", "image/webp"];
    if (!validTypes.includes(imageFile.type)) {
      return NextResponse.json(
        { error: "Unsupported format. Use PNG, JPG or WEBP.", code: "INVALID_FORMAT" },
        { status: 400 }
      );
    }

    // Forward to Remove.bg
    const bgFormData = new FormData();
    bgFormData.append("image_file", imageFile);
    bgFormData.append("size", "auto");
    bgFormData.append("output_format", "auto");

    const bgRes = await fetch(REMOVE_BG_API_URL, {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
      },
      body: bgFormData,
    });

    if (!bgRes.ok) {
      const errorText = await bgRes.text().catch(() => "Unknown error");
      let errorMsg = `Remove.bg API error (${bgRes.status})`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMsg = errorJson?.errors?.[0]?.title || errorMsg;
      } catch {}
      return NextResponse.json(
        { error: errorMsg, code: "API_ERROR" },
        { status: bgRes.status }
      );
    }

    const resultBuffer = await bgRes.arrayBuffer();

    return new NextResponse(resultBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
