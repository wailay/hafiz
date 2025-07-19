"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import ReciterDropdown, { Reciter } from "./components/ReciterDropdown";
import SurahInput from "./components/SurahInput";
import AyahRangeInput from "./components/AyahRangeInput";
import ControlButtons from "./components/ControlButtons";
import ThemeToggle from "./components/ThemeToggle";
import ArabicText from "./components/ArabicText";
import { QuranApiService, AudioStream } from "./services/quranApi";
import { APP_DESCRIPTION } from "./constant";

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
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const [isPreferencesLoaded, setIsPreferencesLoaded] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalSettings, setOriginalSettings] =
    useState<UserPreferences | null>(null);
  const [pausedTime, setPausedTime] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

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
              selectedReciter: preferences.selectedReciter,
              surahNumber: preferences.surahNumber,
              ayahFrom: preferences.ayahFrom,
              ayahTo: preferences.ayahTo,
              isLooping: preferences.isLooping,
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

  // State for tracking original settings and audio position
  const checkForChanges = useCallback(() => {
    if (!originalSettings) return false;

    const hasReciterChanged =
      selectedReciter.id !== originalSettings.selectedReciter.id;
    const hasSurahChanged = surahNumber !== originalSettings.surahNumber;
    const hasAyahFromChanged = ayahFrom !== originalSettings.ayahFrom;
    const hasAyahToChanged = ayahTo !== originalSettings.ayahTo;

    return (
      hasReciterChanged ||
      hasSurahChanged ||
      hasAyahFromChanged ||
      hasAyahToChanged
    );
  }, [originalSettings, selectedReciter, surahNumber, ayahFrom, ayahTo]);

  // Monitor changes and pause audio when settings change
  useEffect(() => {
    if (isPreferencesLoaded && originalSettings) {
      const changes = checkForChanges();
      setHasChanges(changes);

      if (changes && isPlaying) {
        // Pause audio and store current time
        if (audioRef.current) {
          setPausedTime(audioRef.current.currentTime);
        }
        setIsPlaying(false);
        audioRef.current?.pause();
      } else if (!changes && !isPlaying && audioStream && pausedTime > 0) {
        // Resume audio from where it was paused if settings are reverted
        setIsPlaying(true);
        if (audioRef.current) {
          audioRef.current.currentTime = pausedTime;
          audioRef.current.play();
        }
      }
    }
  }, [
    selectedReciter,
    surahNumber,
    ayahFrom,
    ayahTo,
    isPreferencesLoaded,
    originalSettings,
    checkForChanges,
    isPlaying,
    audioStream,
    pausedTime,
  ]);

  // Set original settings when preferences are first loaded
  useEffect(() => {
    if (isPreferencesLoaded && !originalSettings) {
      setOriginalSettings({
        selectedReciter,
        surahNumber,
        ayahFrom,
        ayahTo,
        isLooping,
      });
    }
  }, [
    isPreferencesLoaded,
    selectedReciter,
    surahNumber,
    ayahFrom,
    ayahTo,
    isLooping,
    originalSettings,
  ]);

  const handlePlay = async () => {
    if (isLoading) return;

    // If audio is currently playing, pause it
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    if (hasChanges) {
      // Load new audio with current settings
      try {
        setIsLoading(true);
        setError(null);
        setAudioStream(null);
        setCurrentAyahIndex(0);
        setPausedTime(0);

        await fetchAudioData();
        setIsPlaying(true);

        // Update original settings to current settings
        setOriginalSettings({
          selectedReciter,
          surahNumber,
          ayahFrom,
          ayahTo,
          isLooping,
        });
        setHasChanges(false);
      } catch (error) {
        console.error("Failed to load new audio:", error);
        setError("Failed to load new audio. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      // Resume or start playing current audio
      if (audioStream) {
        setIsPlaying(true);
        audioRef.current?.play();
      } else {
        // No audio loaded yet, load with current settings
        try {
          setIsLoading(true);
          setError(null);
          await fetchAudioData();
          setIsPlaying(true);
        } catch (error) {
          console.error("Failed to load audio:", error);
          setError("Failed to load audio. Please try again.");
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  const handleDownload = async () => {
    if (!audioStream) return;

    try {
      setIsDownloading(true);
      setError(null);

      // Fetch the WAV audio
      const response = await fetch(audioStream.audioUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch audio file");
      }

      const wavBlob = await response.blob();

      // Generate WAV filename
      const wavFilename = `${audioStream.surahName}_Ayah_${audioStream.ayahRange.from}-${audioStream.ayahRange.to}.wav`;

      // Download WAV directly
      const url = URL.createObjectURL(wavBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = wavFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      setError("Failed to download audio. Please try again.");
    } finally {
      setIsDownloading(false);
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
        <main className="flex-1 max-w-xl mx-auto w-full px-4 py-8">
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
            <div className="rounded-lg pt-2 text-center">
              {audioStream !== null && !isLoading && (
                <div className="space-y-4">
                  {/* Audio Info Display */}
                  <div className="bg-[var(--card-bg)] border-[var(--card-border)] rounded-lg p-4 border shadow-sm">
                    <div className="text-center">
                      <div className="flex justify-center items-center gap-2 mb-2">
                        <h3 className="font-medium text-[var(--foreground)]">
                          {audioStream.surahName} -{" "}
                        </h3>
                        <ArabicText
                          fontSize="1rem"
                          text={audioStream.surahArabicName}
                        />
                      </div>
                      <p className="text-sm text-[var(--foreground)] opacity-60 mb-2">
                        {audioStream.ayahRange.from + currentAyahIndex} /{" "}
                        {audioStream.ayahRange.to}
                      </p>
                    </div>

                    {/* Ayah Text Display */}
                    {audioStream.ayahTexts &&
                      audioStream.ayahTexts[currentAyahIndex] && (
                        <div className="pt-4 mb-2 px-2 text-center min-h-[170px] max-h-[170px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                          <ArabicText
                            text={audioStream.ayahTexts[currentAyahIndex]}
                          />
                        </div>
                      )}
                  </div>

                  {/* Audio Player */}
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
              audioStream={audioStream}
              isDownloading={isDownloading}
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
