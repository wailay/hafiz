"use client";

import { useState, useEffect, useRef } from "react";
import ReciterDropdown, { Reciter } from "./components/ReciterDropdown";
import SurahInput from "./components/SurahInput";
import AyahRangeInput from "./components/AyahRangeInput";
import ControlButtons from "./components/ControlButtons";
import { QuranApiService, AudioStream } from "./services/quranApi";

interface UserPreferences {
  selectedReciter: {
    id: string;
    englishName: string;
    arabicName: string;
  };
  surahNumber: number;
  ayahFrom: number;
  ayahTo: number | null;
  isLooping: boolean;
}

export default function Home() {
  const [selectedReciter, setSelectedReciter] = useState<Reciter>({
    id: "ar.husary",
    englishName: "Husary",
    arabicName: "محمود خليل الحصري",
  });
  const [surahNumber, setSurahNumber] = useState(1);
  const [ayahFrom, setAyahFrom] = useState(1);
  const [ayahTo, setAyahTo] = useState<number | null>(2);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [audioStream, setAudioStream] = useState<AudioStream | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [surahInfo, setSurahInfo] = useState<{
    numberOfAyahs: number;
    name: string;
  } | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const [isPreferencesLoaded, setIsPreferencesLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load user preferences on component mount
  useEffect(() => {
    const loadPreferences = () => {
      try {
        const stored = localStorage.getItem("quran_user_preferences");
        if (stored) {
          const preferences = JSON.parse(stored) as UserPreferences;

          // Validate the stored preferences
          if (
            preferences &&
            preferences.selectedReciter &&
            typeof preferences.surahNumber === "number" &&
            preferences.surahNumber >= 1 &&
            preferences.surahNumber <= 114 &&
            typeof preferences.ayahFrom === "number" &&
            preferences.ayahFrom >= 1 &&
            (preferences.ayahTo === null ||
              (typeof preferences.ayahTo === "number" &&
                preferences.ayahTo >= 1)) &&
            typeof preferences.isLooping === "boolean"
          ) {
            setSelectedReciter(preferences.selectedReciter);
            setSurahNumber(preferences.surahNumber);
            setAyahFrom(preferences.ayahFrom);
            setAyahTo(preferences.ayahTo);
            setIsLooping(preferences.isLooping);
          }
        }
      } catch (error) {
        console.warn("Failed to load user preferences:", error);
      } finally {
        setIsPreferencesLoaded(true);
      }
    };

    // Small delay to ensure smooth loading experience
    setTimeout(loadPreferences, 100);
  }, []);

  // Save user preferences whenever they change
  useEffect(() => {
    // Don't save preferences until they've been loaded from localStorage
    if (!isPreferencesLoaded) return;

    try {
      const preferences: UserPreferences = {
        selectedReciter,
        surahNumber,
        ayahFrom,
        ayahTo,
        isLooping,
      };
      localStorage.setItem(
        "quran_user_preferences",
        JSON.stringify(preferences)
      );
    } catch (error) {
      console.warn("Failed to save user preferences:", error);
    }
  }, [
    selectedReciter,
    surahNumber,
    ayahFrom,
    ayahTo,
    isLooping,
    isPreferencesLoaded,
  ]);

  const fetchAudioData = async () => {
    // If ayahTo is null, just play the single ayah from ayahFrom
    const endAyah = ayahTo || ayahFrom;

    if (ayahFrom > endAyah) {
      setError('Ayah "from" cannot be greater than ayah "to".');
      setAudioStream(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const audioData = await QuranApiService.createAudioStream(
        surahNumber,
        ayahFrom,
        endAyah,
        selectedReciter.id
      );

      setAudioStream(audioData);
      setCurrentAyahIndex(0); // Reset to first ayah
    } catch (error) {
      console.error("Error fetching audio data:", error);
      setError(
        "Failed to load audio data. Please check your selection and try again."
      );
      setAudioStream(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlay = async () => {
    if (audioStream === null) {
      console.log("Fetching audio data");
      // Fetch audio data when user wants to play but no data is loaded
      await fetchAudioData();
    }

    console.log("Playing audio - audioRef", audioRef.current);
    // Use the audio element's play/pause functionality
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  };

  const handleDownload = async () => {
    if (audioStream === null) {
      // Fetch audio data if not already loaded
      await fetchAudioData();
    }

    // Download the audio stream
    if (audioStream !== null && audioRef.current) {
      try {
        // Get the audio source URL
        const audioUrl = audioRef.current.src;

        // Fetch the audio data
        const response = await fetch(audioUrl);

        if (!response.ok) {
          throw new Error(`Failed to download audio: ${response.statusText}`);
        }

        const blob = await response.blob();

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${selectedReciter.englishName}_${audioStream.surahName}_${audioStream.ayahRange.from}-${audioStream.ayahRange.to}.wav`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download error:", error);
        setError("Failed to download audio. Please try again.");
      }
    }
  };

  const handleLoop = () => {
    setIsLooping(!isLooping);
    // Update the audio element's loop attribute
    if (audioRef.current) {
      audioRef.current.loop = !isLooping;
    }
  };

  const handleSurahChange = (newSurahNumber: number) => {
    setSurahNumber(newSurahNumber);
    // Clear current audio data and surah info when surah changes
    setAudioStream(null);
    setSurahInfo(null);
  };

  const handleAyahRangeChange = (
    newAyahFrom: number,
    newAyahTo: number | null
  ) => {
    // Only clear audio if the values actually changed
    if (newAyahFrom !== ayahFrom || newAyahTo !== ayahTo) {
      setAyahFrom(newAyahFrom);
      setAyahTo(newAyahTo);
      // Clear current audio data when ayah range changes
      setAudioStream(null);
    }
  };

  const handleReciterChange = (newReciter: Reciter) => {
    setSelectedReciter(newReciter);
    // Clear current audio data when reciter changes
    setAudioStream(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Loading Screen */}
      {!isPreferencesLoaded && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Loading Quran Audio
            </h2>
            <p className="text-sm text-gray-600">
              Restoring your preferences...
            </p>
          </div>
        </div>
      )}

      {/* Main Content - Only show when preferences are loaded */}
      {isPreferencesLoaded && (
        <main className="flex-1 max-w-md mx-auto w-full px-4 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Quran Audio</h1>
              <p className="text-sm text-gray-600 mt-1">
                Listen to beautiful Quran recitations
              </p>
            </div>

            {/* Reciter Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reciter
              </label>
              <ReciterDropdown
                selectedReciter={selectedReciter}
                onReciterChange={handleReciterChange}
              />
            </div>

            {/* Surah Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Surah Chapter
              </label>
              <SurahInput value={surahNumber} onChange={handleSurahChange} />
              {surahInfo && (
                <p className="text-sm text-gray-500 mt-1">
                  {surahInfo.name} ({surahInfo.numberOfAyahs} ayahs)
                </p>
              )}
            </div>

            {/* Ayah Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ayah Range
              </label>
              <AyahRangeInput
                ayahFrom={ayahFrom}
                ayahTo={ayahTo}
                onAyahFromChange={(from) => handleAyahRangeChange(from, ayahTo)}
                onAyahToChange={(to) => handleAyahRangeChange(ayahFrom, to)}
              />
              {surahInfo && (
                <p className="text-sm text-gray-500 mt-1">
                  Valid range: 1 - {surahInfo.numberOfAyahs}
                </p>
              )}
            </div>

            {/* Content Display Area */}
            <div className="rounded-lg p-8 text-center">
              {audioStream !== null && !isLoading && (
                <div className="space-y-4">
                  {/* Audio Info Display */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-center">
                      <h3 className="font-medium text-blue-900">
                        {audioStream.surahName} - Ayah{" "}
                        {audioStream.ayahRange.from + currentAyahIndex}
                      </h3>
                      <p className="text-sm text-blue-700 mt-1">
                        {currentAyahIndex + 1} of {audioStream.totalAyahs} ayahs
                      </p>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  {audioStream.totalAyahs > 1 && (
                    <div className="w-full">
                      <audio
                        ref={audioRef}
                        className="w-full"
                        controls
                        src={audioStream.audioUrl}
                        loop={isLooping}
                        autoPlay={true}
                        onTimeUpdate={(e) => {
                          const audio = e.target as HTMLAudioElement;
                          const currentTime = audio.currentTime;

                          // Find which ayah we're currently in based on timestamps
                          const currentAyah = audioStream.ayahTimestamps.find(
                            (timestamp) =>
                              currentTime >= timestamp.start &&
                              currentTime < timestamp.end
                          );

                          if (
                            currentAyah &&
                            currentAyah.ayahIndex !== currentAyahIndex
                          ) {
                            setCurrentAyahIndex(currentAyah.ayahIndex);
                          }
                        }}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onEnded={() => {
                          setIsPlaying(false);
                          setCurrentAyahIndex(0);
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Control Buttons - Always Visible */}
            <ControlButtons
              isPlaying={isPlaying}
              isLooping={isLooping}
              onPlay={handlePlay}
              onDownload={handleDownload}
              onLoop={handleLoop}
              isLoading={isLoading}
            />

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <p className="text-sm text-gray-600 mt-2">
                  Loading audio data...
                </p>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
          </div>
        </main>
      )}
    </div>
  );
}
