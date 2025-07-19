"use client";

import { useState, useEffect, useRef } from "react";
import ReciterDropdown, { Reciter } from "./components/ReciterDropdown";
import SurahInput from "./components/SurahInput";
import AyahRangeInput from "./components/AyahRangeInput";
import ControlButtons from "./components/ControlButtons";
import ThemeToggle from "./components/ThemeToggle";
import { QuranApiService, AudioStream } from "./services/quranApi";
import { APP_TITLE, APP_DESCRIPTION } from "./constant";

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
  const [hasChanges, setHasChanges] = useState(false);
  const [originalSettings, setOriginalSettings] = useState({
    reciter: null as Reciter | null,
    surah: 0,
    ayahFrom: 0,
    ayahTo: null as number | null,
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load user preferences on component mount
  useEffect(() => {
    const loadPreferences = () => {
      try {
        const stored = localStorage.getItem("quran_user_preferences");
        if (stored) {
          const preferences = JSON.parse(stored) as UserPreferences;
          if (
            preferences &&
            preferences.selectedReciter &&
            preferences.surahNumber &&
            preferences.ayahFrom &&
            preferences.ayahTo &&
            preferences.isLooping !== undefined
          ) {
            setSelectedReciter(preferences.selectedReciter);
            setSurahNumber(preferences.surahNumber);
            setAyahFrom(preferences.ayahFrom);
            setAyahTo(preferences.ayahTo);
            setIsLooping(preferences.isLooping);

            // Set original settings for change tracking
            setOriginalSettings({
              reciter: preferences.selectedReciter,
              surah: preferences.surahNumber,
              ayahFrom: preferences.ayahFrom,
              ayahTo: preferences.ayahTo,
            });
          }
        }
      } catch (error) {
        console.warn("Failed to load user preferences:", error);
      } finally {
        setIsPreferencesLoaded(true);
      }
    };
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

  const handleReciterChange = (reciter: Reciter) => {
    setSelectedReciter(reciter);
    checkForChanges();
  };

  const handleSurahChange = (newSurahNumber: number) => {
    setSurahNumber(newSurahNumber);
    checkForChanges();
  };

  const handleAyahRangeChange = (
    newAyahFrom: number,
    newAyahTo: number | null
  ) => {
    setAyahFrom(newAyahFrom);
    setAyahTo(newAyahTo);
    checkForChanges();
  };

  const checkForChanges = () => {
    const currentSettings = {
      reciter: selectedReciter,
      surah: surahNumber,
      ayahFrom: ayahFrom,
      ayahTo: ayahTo,
    };

    const hasChanges =
      originalSettings.reciter?.id !== currentSettings.reciter?.id ||
      originalSettings.surah !== currentSettings.surah ||
      originalSettings.ayahFrom !== currentSettings.ayahFrom ||
      originalSettings.ayahTo !== currentSettings.ayahTo;

    setHasChanges(hasChanges);
  };

  const handleUpdateAudio = async () => {
    if (hasChanges) {
      // Update original settings first
      const newOriginalSettings = {
        reciter: selectedReciter,
        surah: surahNumber,
        ayahFrom: ayahFrom,
        ayahTo: ayahTo,
      };

      setOriginalSettings(newOriginalSettings);
      setHasChanges(false);

      // Clear current audio stream and fetch new audio
      setAudioStream(null);
      setError(null);
      setIsPlaying(false);
      setCurrentAyahIndex(0);

      // Fetch new audio with updated settings
      try {
        setIsLoading(true);
        await fetchAudioData();
        setIsPlaying(true);
      } catch (error) {
        console.error("Failed to update audio:", error);
        setError("Failed to load new audio. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Monitor changes and update hasChanges state
  useEffect(() => {
    if (isPreferencesLoaded) {
      checkForChanges();
    }
  }, [
    selectedReciter,
    surahNumber,
    ayahFrom,
    ayahTo,
    isPreferencesLoaded,
    checkForChanges,
  ]);

  return (
    <div className="min-h-screen theme-bg flex flex-col">
      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Loading Screen */}
      {!isPreferencesLoaded && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
              Loading Quran Audio
            </h2>
            <p className="text-sm text-[var(--foreground)] opacity-60">
              Restoring your preferences...
            </p>
          </div>
        </div>
      )}

      {/* Main Content - Only show when preferences are loaded */}
      {isPreferencesLoaded && (
        <main className="flex-1 max-w-md mx-auto w-full px-4 py-8">
          <div className="bg-[var(--card-bg)] border-[var(--card-border)] rounded-xl shadow-sm border p-6 space-y-6">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-2xl md:text-2xl lg:text-3xl font-bold leading-tight">
                <span className="text-[var(--foreground)]">Quran </span>
                <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Memorizer
                </span>
              </h1>
              <p className="text-sm text-[var(--foreground)] opacity-60 mt-1">
                {APP_DESCRIPTION}
              </p>
            </div>

            {/* Reciter Selection */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Reciter
              </label>
              <ReciterDropdown
                selectedReciter={selectedReciter}
                onReciterChange={handleReciterChange}
              />
            </div>

            {/* Surah Input */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Surah Chapter
              </label>
              <SurahInput
                surahNumberValue={surahNumber}
                onChange={handleSurahChange}
              />
              {surahInfo && (
                <p className="text-sm text-[var(--foreground)] opacity-60 mt-1">
                  {surahInfo.name} ({surahInfo.numberOfAyahs} ayahs)
                </p>
              )}
            </div>

            {/* Ayah Range */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Ayah Range
              </label>
              <AyahRangeInput
                ayahFrom={ayahFrom}
                ayahTo={ayahTo}
                onAyahFromChange={(from) => handleAyahRangeChange(from, ayahTo)}
                onAyahToChange={(to) => handleAyahRangeChange(ayahFrom, to)}
              />
              {surahInfo && (
                <p className="text-sm text-[var(--foreground)] opacity-60 mt-1">
                  Valid range: 1 - {surahInfo.numberOfAyahs}
                </p>
              )}
            </div>

            {/* Content Display Area */}
            <div className="rounded-lg pt-2 pb-4 px-2 text-center">
              {audioStream !== null && !isLoading && (
                <div className="space-y-4">
                  {/* Audio Info Display */}
                  <div className="bg-[var(--success-bg)] border-[var(--success-border)] rounded-lg p-4 border">
                    <div className="text-center">
                      <h3 className="font-medium text-[var(--success-text)]">
                        {audioStream.surahName} - Ayah{" "}
                        {audioStream.ayahRange.from + currentAyahIndex}
                      </h3>
                      <p className="text-sm text-[var(--success-text)] opacity-80 mt-1">
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
              hasChanges={hasChanges}
              onUpdateAudio={handleUpdateAudio}
              audioStream={audioStream}
            />

            {/* Error Display */}
            {error && (
              <div className="bg-[var(--error-bg)] border-[var(--error-border)] rounded-lg p-4 border">
                <p className="text-[var(--error-text)] text-sm">{error}</p>
              </div>
            )}
          </div>
        </main>
      )}
    </div>
  );
}
