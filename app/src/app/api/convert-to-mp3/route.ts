import { NextRequest, NextResponse } from "next/server";
import { Lame } from "node-lame";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { del } from "@vercel/blob";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const blobUrl = formData.get("blobUrl") as string;
    const blobName = formData.get("blobName") as string;
    const filename = formData.get("filename") as string;

    if (!blobUrl || !blobName) {
      return NextResponse.json(
        { error: "Blob URL and blob name are required" },
        { status: 400 }
      );
    }

    // Generate temporary file paths
    const tempDir = tmpdir();
    const wavPath = join(tempDir, `temp_${Date.now()}.wav`);
    const mp3Path = join(tempDir, `temp_${Date.now()}.mp3`);

    try {
      // Download WAV file from blob storage
      const wavResponse = await fetch(blobUrl);
      if (!wavResponse.ok) {
        throw new Error("Failed to fetch WAV file from blob storage");
      }
      const wavBuffer = await wavResponse.arrayBuffer();
      await writeFile(wavPath, Buffer.from(wavBuffer));

      console.log(`WAV file downloaded from blob and written to: ${wavPath}`);

      // Convert WAV to MP3 using node-lame
      const encoder = new Lame({
        output: mp3Path,
        bitrate: 128,
      }).setFile(wavPath);

      console.log("Starting MP3 conversion...");
      await encoder.encode();
      console.log("MP3 conversion completed");

      // Read the MP3 file
      const mp3Buffer = await readFile(mp3Path);
      console.log(`MP3 file size: ${mp3Buffer.length} bytes`);

      // Generate filename
      const mp3Filename = filename ? filename : "audio.mp3";

      // Return MP3 file
      return new NextResponse(mp3Buffer, {
        headers: {
          "Content-Type": "audio/mpeg",
          "Content-Disposition": `attachment; filename="${mp3Filename}"`,
          "Content-Length": mp3Buffer.length.toString(),
        },
      });
    } finally {
      // Clean up temporary files and blob storage
      try {
        await unlink(wavPath);
        await unlink(mp3Path);
        console.log("Temporary files cleaned up");

        // Delete the WAV file from blob storage
        await del(blobName);
        console.log("WAV file deleted from blob storage");
      } catch (cleanupError) {
        console.warn("Failed to clean up files:", cleanupError);
      }
    }
  } catch (error) {
    console.error("MP3 conversion error:", error);
    return NextResponse.json(
      { error: "Failed to convert audio to MP3" },
      { status: 500 }
    );
  }
}

// Helper function to read file
async function readFile(path: string): Promise<Buffer> {
  const { readFile } = await import("fs/promises");
  return readFile(path);
}
