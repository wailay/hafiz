"use client";

import { useRef, useEffect } from "react";
import { AudioStream } from "../services/quranApi";

interface AudioPlayerProps {
  audioStream: AudioStream;
  isPlaying: boolean;
  isLooping: boolean;
  currentAyahIndex: number;
  onPlayStateChange: (isPlaying: boolean) => void;
  onCurrentAyahIndexChange: (index: number) => void;
}

export default function AudioPlayer({
  audioStream,
  isPlaying,
  isLooping,
  onPlayStateChange,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync with external audio controls
  useEffect(() => {
    if (!audioRef.current) return;

    // Update loop attribute
    audioRef.current.loop = isLooping;
  }, [isLooping]);

  // Handle play/pause from external controls
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying && audioRef.current.paused) {
      audioRef.current.play().catch((error) => {
        console.error("Audio playback error:", error);
        onPlayStateChange(false);
      });
    } else if (!isPlaying && !audioRef.current.paused) {
      audioRef.current.pause();
    }
  }, [isPlaying, onPlayStateChange]);

  return (
    <div className="hidden">
      <audio
        ref={audioRef}
        src={audioStream.audioUrl}
        onError={(e) => {
          console.error("Audio error:", e);
          onPlayStateChange(false);
        }}
      />
    </div>
  );
}
