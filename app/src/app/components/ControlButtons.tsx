"use client";

import { AudioStream } from "../services/quranApi";

interface ControlButtonsProps {
  isPlaying: boolean;
  isLooping: boolean;
  isLoading: boolean;
  audioStream: AudioStream | null;
  onPlay: () => void;
  onDownload: () => void;
  onLoop: () => void;
}

export default function ControlButtons({
  isPlaying,
  isLooping,
  isLoading,
  onPlay,
  onDownload,
  onLoop,
  audioStream,
}: ControlButtonsProps) {
  return (
    <div className="flex items-center justify-center space-x-6">
      {/* Download Button */}
      <button
        onClick={onDownload}
        disabled={isLoading || !audioStream}
        className="flex items-center justify-center w-12 h-12 theme-button-bg hover:theme-button-hover disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600 theme-button-text rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        title="Download MP3"
      >
        <svg
          className="w-6 h-6"
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

      {/* Play Button */}
      <button
        onClick={onPlay}
        disabled={isLoading}
        className="flex items-center justify-center w-16 h-16 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
        title={isPlaying ? "Pause" : "Play"}
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        ) : isPlaying ? (
          <svg
            className="w-8 h-8 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg
            className="w-8 h-8 text-white ml-1"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      {/* Loop Button */}
      <button
        onClick={onLoop}
        disabled={isLoading}
        className={`flex items-center justify-center w-12 h-12 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          isLooping
            ? "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
            : "theme-button-bg hover:theme-button-hover theme-button-text"
        }`}
        title={isLooping ? "Disable loop" : "Enable loop"}
      >
        <svg
          className="w-6 h-6"
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
    </div>
  );
}
