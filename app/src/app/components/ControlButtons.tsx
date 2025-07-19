"use client";

import { useEffect, useState } from "react";
import Tooltip from "./Tooltip";

interface AudioStream {
  audioUrl: string;
  surahName: string;
  ayahRange: { from: number; to: number };
  totalAyahs: number;
  ayahTimestamps: Array<{
    ayahIndex: number;
    start: number;
    end: number;
  }>;
}

interface ControlButtonsProps {
  isPlaying: boolean;
  isLooping: boolean;
  onPlay: () => void;
  onDownload: () => void;
  onLoop: () => void;
  isLoading: boolean;
  hasChanges: boolean;
  onUpdateAudio: () => void;
  audioStream: AudioStream | null;
}

export default function ControlButtons({
  isPlaying,
  isLooping,
  onPlay,
  onDownload,
  onLoop,
  isLoading,
  hasChanges,
  onUpdateAudio,
  audioStream,
}: ControlButtonsProps) {
  const [showButton, setShowButton] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (hasChanges) {
      setShowButton(true);
      setIsExiting(false);
    } else if (showButton && !hasChanges) {
      setIsExiting(true);
      const timer = setTimeout(() => {
        setShowButton(false);
        setIsExiting(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [hasChanges, showButton]);

  return (
    <div className="flex items-center justify-center">
      {/* Single pill-shaped control bar container */}
      <div className="theme-card-bg theme-card-border rounded-full shadow-sm border px-4 py-3 flex items-center space-x-4">
        {/* Download Button */}
        <Tooltip content="Download MP3">
          <button
            onClick={onDownload}
            disabled={isLoading || !audioStream}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:theme-hover-bg disabled:theme-disabled-bg disabled:theme-disabled-text theme-text transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </button>
        </Tooltip>

        {/* Divider */}
        <div className="w-px h-6 theme-divider"></div>

        {/* Play Button */}
        <Tooltip content={isPlaying ? "Pause" : "Play"}>
          <button
            onClick={onPlay}
            disabled={isLoading}
            className="flex items-center justify-center w-10 h-10 theme-play-button-bg hover:theme-play-button-hover disabled:theme-disabled-bg rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 theme-play-button-border"></div>
            ) : isPlaying ? (
              <svg
                className="w-5 h-5 theme-play-button-text"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 theme-play-button-text ml-0.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </Tooltip>

        {/* Divider */}
        <div className="w-px h-6 theme-divider"></div>

        {/* Loop Button */}
        <Tooltip content={isLooping ? "Disable loop" : "Enable loop"}>
          <button
            onClick={onLoop}
            disabled={isLoading}
            className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 ${
              isLooping
                ? "theme-play-button-bg theme-play-button-text"
                : "theme-text hover:theme-hover-bg"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </Tooltip>

        {/* Update Audio Button - Animated */}
        {showButton && (
          <>
            {/* Divider */}
            <div
              className={`w-px h-6 theme-divider ${
                isExiting ? "animate-pulse" : "animate-pulse"
              }`}
            ></div>

            {/* Update Button */}
            <Tooltip content="Update audio with new settings">
              <button
                onClick={onUpdateAudio}
                disabled={isLoading}
                className={`flex items-center justify-center w-8 h-8 theme-play-button-bg hover:theme-play-button-hover theme-play-button-text rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 ${
                  isExiting ? "update-button-exit" : "update-button-animate"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M4 12a8 8 0 018-8 8.5 8.5 0 015.5 2L19 8M19 8v-4M19 8h-4m"
                  ></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 8v8l6-4z"
                  ></path>
                </svg>
              </button>
            </Tooltip>
          </>
        )}
      </div>
    </div>
  );
}
