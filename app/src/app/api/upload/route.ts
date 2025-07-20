import { handleUpload } from "@vercel/blob/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json();

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      onBeforeGenerateToken: async (pathname: string) => {
        // This runs server-side before the upload
        console.log(`Uploading to: ${pathname}`);
        return {
          allowedContentTypes: ["audio/wav", "audio/mpeg"],
          allowOverwrite: true,
        };
      },
      onUploadCompleted: async ({ blob }) => {
        // This runs server-side after the upload
        console.log(`Upload completed: ${blob.url}`);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
