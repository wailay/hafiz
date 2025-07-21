import { NextRequest, NextResponse } from "next/server";
import * as lame from "@breezystack/lamejs";

import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { del, head } from "@vercel/blob";

export async function POST(request: NextRequest) {
  let blobName: string | null = null;
  let wavPath: string | null = null;

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

    console.log("blobUrl", blobUrl);

    const headResponse = await head(blobUrl);

    const wavDownloadUrl = headResponse.downloadUrl;

    // Download WAV file from blob storage
    let wavResponse: Response;
    let retryCount = 0;
    const maxRetries = 10;

    do {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      wavResponse = await fetch(wavDownloadUrl);
      console.log(
        "Trying to fetch WAV file",
        wavResponse.status,
        "Retry count",
        retryCount
      );
      retryCount++;
    } while (!wavResponse.ok && retryCount < maxRetries);

    if (!wavResponse.ok) {
      throw new Error("Failed to fetch WAV file from blob storage");
    }

    if (!wavResponse.ok) {
      throw new Error("Failed to fetch WAV file from blob storage");
    }
    const wavBuffer = await wavResponse.arrayBuffer();
    await writeFile(wavPath, Buffer.from(wavBuffer));

    console.log(`WAV file downloaded from blob and written to: ${wavPath}`);

    // @ts-expect-error - lamejs is not typed
    const wavInfo = new lame.WavHeader.readHeader(new DataView(wavBuffer));

    console.log("WAV Info:", {
      "Data Offset": wavInfo.dataOffset,
      "Data Length": wavInfo.dataLen,
      "Sample Rate": wavInfo.sampleRate,
      Channels: wavInfo.channels,
    });

    // Extract all samples from the WAV data
    const allSamples = new Int16Array(
      wavBuffer,
      wavInfo.dataOffset,
      wavInfo.dataLen / 2
    );

    // For stereo, samples are interleaved: [L, R, L, R, L, R, ...]
    // For mono, all samples are sequential
    let leftSamples: Int16Array;
    let rightSamples: Int16Array;

    if (wavInfo.channels === 2) {
      // Stereo: separate left and right channels
      const numSamples = allSamples.length / 2;
      leftSamples = new Int16Array(numSamples);
      rightSamples = new Int16Array(numSamples);

      for (let i = 0; i < numSamples; i++) {
        leftSamples[i] = allSamples[i * 2]; // Even indices (0, 2, 4, ...)
        rightSamples[i] = allSamples[i * 2 + 1]; // Odd indices (1, 3, 5, ...)
      }
    } else {
      // Mono: use same samples for both channels
      leftSamples = allSamples;
      rightSamples = allSamples;
    }
    const encoder = new lame.Mp3Encoder(
      wavInfo.channels,
      wavInfo.sampleRate,
      128
    );

    const mp3Data: Uint8Array[] = [];

    const chunkSize = 1152;

    for (let i = 0; i < leftSamples.length; i += chunkSize) {
      const leftChunk = leftSamples.subarray(i, i + chunkSize);
      const rightChunk = rightSamples.subarray(i, i + chunkSize);
      const mp3buf = encoder.encodeBuffer(leftChunk, rightChunk);
      if (mp3buf.length > 0) {
        mp3Data.push(mp3buf);
      }
    }

    const finalChunk = encoder.flush();
    if (finalChunk && finalChunk.length > 0) {
      mp3Data.push(finalChunk);
    }

    const mp3Buffer = new Blob(mp3Data);

    // Return MP3 file
    return new NextResponse(mp3Buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": mp3Buffer.size.toString(),
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
    await delBlob(blobName);

    // Clean up temporary files and blob storage
    try {
      // Clean up temporary files
      if (wavPath) {
        await unlink(wavPath);
        console.log("WAV temporary file cleaned up");
      }
    } catch (cleanupError) {
      console.warn("Failed to clean up files:", cleanupError);
    }
  }
}

async function delBlob(blobName: string | null) {
  console.log("Deleting blob:", blobName);
  // Delete the WAV file from blob storage
  if (blobName) {
    await del(blobName);
    console.log("WAV file deleted from blob storage");
  }
}
