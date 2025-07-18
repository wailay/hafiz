import { NextRequest, NextResponse } from "next/server";

// Proxy route to fetch MP3 audio files from the API
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const audioUrl = searchParams.get("url");

  if (!audioUrl) {
    return NextResponse.json(
      { error: "Audio URL is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(audioUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();

    // Calculate cache headers
    const now = new Date();
    const maxAge = 24 * 60 * 60; // 24 hours in seconds
    const expires = new Date(now.getTime() + maxAge * 1000);

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        // Caching headers
        "Cache-Control": `public, max-age=${maxAge}, immutable`,
        Expires: expires.toUTCString(),
        ETag: `"${Buffer.from(audioUrl).toString("base64").slice(0, 8)}"`,
        "Last-Modified": now.toUTCString(),
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch audio" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
