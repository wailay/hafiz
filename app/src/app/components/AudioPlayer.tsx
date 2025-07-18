"use client";

import { useState, useRef, useEffect } from "react";
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
  currentAyahIndex,
  onPlayStateChange,
  onCurrentAyahIndexChange,
}: AudioPlayerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
        setError("Failed to play audio. Please try again.");
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
        onLoadStart={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onError={(e) => {
          console.error("Audio error:", e);
          setError("Failed to load audio. Please try again.");
          setIsLoading(false);
          onPlayStateChange(false);
        }}
      />
    </div>
  );
}
