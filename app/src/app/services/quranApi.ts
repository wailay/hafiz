export interface AyahData {
  number: number;
  audio: string;
  audioSecondary: string[];
  text: string;
  edition: {
    identifier: string;
    language: string;
    name: string;
    englishName: string;
    format: string;
    type: string;
    direction: string | null;
  };
  surah: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    revelationType: string;
  };
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
}

export interface SurahData {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface ApiResponse {
  code: number;
  status: string;
  data: AyahData | SurahData;
}

export interface SurahInfo {
  number: number;
  name: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface AudioInfo {
  audioUrl: string;
  surahName: string;
  surahArabicName: string;
  ayahNumberInSurah: number;
  ayahNumber: number;
  text?: string;
}

export interface AudioStream {
  audioUrl: string;
  totalDuration: number;
  ayahTimestamps: { start: number; end: number; ayahIndex: number }[];
  surahName: string;
  surahArabicName: string;
  ayahRange: { from: number; to: number };
  totalAyahs: number;
  currentAyahNumber: number;
  ayahTexts: string[];
}

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

export class QuranApiService {
  private static baseUrl = "https://api.alquran.cloud/v1";

  static async getAyahAudioInfo(
    surahNumber: number,
    ayahNumber: number,
    reciterId: string
  ): Promise<AudioInfo> {
    const response = await fetch(
      `${this.baseUrl}/ayah/${surahNumber}:${ayahNumber}/${reciterId}`
    );
    const data: ApiResponse = await response.json();

    if (data.code !== 200) {
      throw new Error(`API Error: ${data.status}`);
    }

    const ayahData = data.data as AyahData;

    return {
      audioUrl: ayahData.audio,
      surahName: ayahData.surah.englishName,
      surahArabicName: ayahData.surah.name,
      ayahNumberInSurah: ayahData.numberInSurah,
      ayahNumber: ayahData.number,
      text: ayahData.text,
    };
  }

  static async getAyahRangeAudioInfo(
    surahNumber: number,
    ayahFrom: number,
    ayahTo: number,
    reciterId: string
  ): Promise<AudioInfo[]> {
    const promises: Promise<AudioInfo>[] = [];

    for (let ayah = ayahFrom; ayah <= ayahTo; ayah++) {
      promises.push(this.getAyahAudioInfo(surahNumber, ayah, reciterId));
    }

    return Promise.all(promises);
  }

  // Create audio stream from ayah range
  static async createAudioStream(
    surahNumber: number,
    ayahFrom: number,
    ayahTo: number,
    reciterId: string
  ): Promise<AudioStream> {
    // Fetch all ayahs in the range (will use cache if available)
    const audioInfos = await this.getAyahRangeAudioInfo(
      surahNumber,
      ayahFrom,
      ayahTo,
      reciterId
    );

    // Create audio context for concatenation
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContextClass();

    try {
      // Fetch and decode all audio files through proxy
      const audioBuffers: AudioBuffer[] = [];
      const durations: number[] = [];

      for (const audioInfo of audioInfos) {
        // Use proxy to avoid CORS issues
        const proxyUrl = `/api/proxy?url=${encodeURIComponent(
          audioInfo.audioUrl
        )}`;
        const response = await fetch(proxyUrl);

        if (!response.ok) {
          throw new Error(`Failed to fetch audio: ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        audioBuffers.push(audioBuffer);
        durations.push(audioBuffer.duration);
      }

      // Calculate total duration and create timestamps
      let currentTime = 0;
      const ayahTimestamps = audioBuffers.map((_, index) => {
        const start = currentTime;
        currentTime += durations[index];
        return {
          start,
          end: currentTime,
          ayahIndex: index,
        };
      });

      // Concatenate all audio buffers into one
      const totalDuration = durations.reduce(
        (sum, duration) => sum + duration,
        0
      );
      const concatenatedBuffer = audioContext.createBuffer(
        audioBuffers[0].numberOfChannels,
        Math.ceil(totalDuration * audioBuffers[0].sampleRate),
        audioBuffers[0].sampleRate
      );

      let offset = 0;
      for (let i = 0; i < audioBuffers.length; i++) {
        const buffer = audioBuffers[i];
        for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
          const channelData = buffer.getChannelData(channel);
          const concatenatedChannelData =
            concatenatedBuffer.getChannelData(channel);
          concatenatedChannelData.set(
            channelData,
            Math.floor(offset * buffer.sampleRate)
          );
        }
        offset += buffer.duration;
      }

      // Convert the concatenated buffer to a blob URL
      const offlineContext = new OfflineAudioContext(
        concatenatedBuffer.numberOfChannels,
        concatenatedBuffer.length,
        concatenatedBuffer.sampleRate
      );

      const source = offlineContext.createBufferSource();
      source.buffer = concatenatedBuffer;
      source.connect(offlineContext.destination);
      source.start();

      const renderedBuffer = await offlineContext.startRendering();
      const wavBlob = this.audioBufferToWav(renderedBuffer);
      const audioUrl = URL.createObjectURL(wavBlob);

      return {
        audioUrl,
        totalDuration,
        ayahTimestamps,
        surahName: audioInfos[0].surahName,
        surahArabicName: audioInfos[0].surahArabicName,
        ayahRange: { from: ayahFrom, to: ayahTo },
        totalAyahs: audioInfos.length,
        currentAyahNumber: ayahFrom,
        ayahTexts: audioInfos.map((info) => info.text || ""),
      };
    } finally {
      audioContext.close();
    }
  }

  private static audioBufferToWav(buffer: AudioBuffer): Blob {
    const length = buffer.length;
    const numberOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
    const view = new DataView(arrayBuffer);

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, "RIFF");
    view.setUint32(4, 36 + length * numberOfChannels * 2, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numberOfChannels * 2, true);
    view.setUint16(32, numberOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, "data");
    view.setUint32(40, length * numberOfChannels * 2, true);

    // Convert audio data to 16-bit PCM
    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(
          -1,
          Math.min(1, buffer.getChannelData(channel)[i])
        );
        view.setInt16(
          offset,
          sample < 0 ? sample * 0x8000 : sample * 0x7fff,
          true
        );
        offset += 2;
      }
    }

    return new Blob([arrayBuffer], { type: "audio/wav" });
  }
}
