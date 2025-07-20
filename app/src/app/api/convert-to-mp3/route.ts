import { NextRequest, NextResponse } from "next/server";
import { Lame } from "node-lame";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { del } from "@vercel/blob";

export async function POST(request: NextRequest) {
  let blobName: string | null = null;
  let wavPath: string | null = null;
  let mp3Path: string | null = null;

  try {
    const formData = await request.formData();
    const blobUrl = formData.get("blobUrl") as string;
    blobName = formData.get("blobName") as string;
    const filename = formData.get("filename") as string;

    if (!blobUrl || !blobName) {
      return NextResponse.json(
        { error: "Blob URL and blob name are required" },
        { status: 400 }
      );
    }

    // Generate temporary file paths
    const tempDir = tmpdir();
    wavPath = join(tempDir, `temp_${Date.now()}.wav`);
    mp3Path = join(tempDir, `temp_${Date.now()}.mp3`);

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
  } catch (error) {
    console.error("MP3 conversion error:", error);
    await delBlob(blobName);

    return NextResponse.json(
      { error: "Failed to convert audio to MP3" },
      { status: 500 }
    );
  } finally {
    // Clean up temporary files and blob storage
    try {
      // Clean up temporary files
      if (wavPath) {
        await unlink(wavPath);
        console.log("WAV temporary file cleaned up");
      }
      if (mp3Path) {
        await unlink(mp3Path);
        console.log("MP3 temporary file cleaned up");
      }

      await delBlob(blobName);
    } catch (cleanupError) {
      console.warn("Failed to clean up files:", cleanupError);
    }
  }
}

// Helper function to read file
async function readFile(path: string): Promise<Buffer> {
  const { readFile } = await import("fs/promises");
  return readFile(path);
}

async function delBlob(blobName: string | null) {
  console.log("Deleting blob:", blobName);
  // Delete the WAV file from blob storage
  if (blobName) {
    await del(blobName);
    console.log("WAV file deleted from blob storage");
  }
}
