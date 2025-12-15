"use client";

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
  audioStream: AudioStream | null;
  isDownloading: boolean;
}

export default function ControlButtons({
  isPlaying,
  isLooping,
  onPlay,
  onDownload,
  onLoop,
  isLoading,
  hasChanges,
  audioStream,
  isDownloading,
}: ControlButtonsProps) {
  return (
    <div className="flex items-center justify-center">
      {/* Single pill-shaped control bar container */}
      <div className="bg-[var(--card-bg)] border-[var(--card-border)] rounded-full shadow-sm border px-4 py-3 flex items-center space-x-4">
        {/* Download Button */}
        <Tooltip content={isDownloading ? "Generating MP3..." : "Download MP3"}>
          <button
            onClick={onDownload}
            disabled={isLoading || !audioStream || isDownloading}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[var(--button-hover)] disabled:bg-[var(--button-bg)] disabled:opacity-50 disabled:text-[var(--foreground)] disabled:opacity-40 text-[var(--foreground)] transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 relative"
          >
            {isDownloading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-[var(--foreground)] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
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
            )}
          </button>
        </Tooltip>

        {/* Divider */}
        <div className="w-px h-6 bg-[var(--card-border)]"></div>

        {/* Play Button */}
        <Tooltip
          content={hasChanges ? "Load new audio" : isPlaying ? "Pause" : "Play"}
        >
          <button
            onClick={onPlay}
            disabled={isLoading}
            className="flex items-center justify-center w-10 h-10 bg-[var(--foreground)] hover:bg-[var(--button-text)] disabled:bg-[var(--button-bg)] disabled:opacity-50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-[var(--spinner-color)]/30 border-t-[var(--spinner-color)]"></div>
            ) : isPlaying ? (
              <svg
                className="w-5 h-5 text-[var(--background)]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-[var(--background)] ml-0.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </Tooltip>

        {/* Divider */}
        <div className="w-px h-6 bg-[var(--card-border)]"></div>

        {/* Loop Button */}
        <Tooltip content={isLooping ? "Disable loop" : "Enable loop"}>
          <button
            onClick={onLoop}
            disabled={isLoading}
            className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 ${
              isLooping
                ? "bg-[var(--foreground)] text-[var(--background)]"
                : "text-[var(--foreground)] hover:bg-[var(--button-hover)]"
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
      </div>
    </div>
  );
}
