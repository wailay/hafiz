import { NextRequest, NextResponse } from "next/server";
import { Lame } from "node-lame";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;
    const filename = formData.get("filename") as string;

    if (!audioFile) {
      return NextResponse.json(
        { error: "Audio file is required" },
        { status: 400 }
      );
    }

    // Generate temporary file paths
    const tempDir = tmpdir();
    const wavPath = join(tempDir, `temp_${Date.now()}.wav`);
    const mp3Path = join(tempDir, `temp_${Date.now()}.mp3`);

    try {
      // Write WAV file to temp directory
      const wavBuffer = await audioFile.arrayBuffer();
      await writeFile(wavPath, Buffer.from(wavBuffer));

      console.log(`WAV file written to: ${wavPath}`);

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
      // Clean up temporary files
      try {
        await unlink(wavPath);
        await unlink(mp3Path);
        console.log("Temporary files cleaned up");
      } catch (cleanupError) {
        console.warn("Failed to clean up temporary files:", cleanupError);
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
