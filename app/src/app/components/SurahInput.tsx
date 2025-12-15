"use client";

import { useState, useRef, useEffect } from "react";

export interface Surah {
  number: number;
  name: string;
  englishName: string;
}

interface SurahInputProps {
  surahNumberValue: number;
  onChange: (value: number) => void;
}

// All 114 Surahs from the Quran
const surahs: Surah[] = [
  { number: 1, name: "سُورَةُ ٱلْفَاتِحَةِ", englishName: "Al-Faatiha" },
  { number: 2, name: "سُورَةُ البَقَرَةِ", englishName: "Al-Baqara" },
  { number: 3, name: "سُورَةُ آلِ عِمۡرَانَ", englishName: "Aal-i-Imraan" },
  { number: 4, name: "سُورَةُ النِّسَاءِ", englishName: "An-Nisaa" },
  { number: 5, name: "سُورَةُ المَائـِدَةِ", englishName: "Al-Maaida" },
  { number: 6, name: "سُورَةُ الأَنۡعَامِ", englishName: "Al-An'aam" },
  { number: 7, name: "سُورَةُ الأَعۡرَافِ", englishName: "Al-A'raaf" },
  { number: 8, name: "سُورَةُ الأَنفَالِ", englishName: "Al-Anfaal" },
  { number: 9, name: "سُورَةُ التَّوۡبَةِ", englishName: "At-Tawba" },
  { number: 10, name: "سُورَةُ يُونُسَ", englishName: "Yunus" },
  { number: 11, name: "سُورَةُ هُودٍ", englishName: "Hud" },
  { number: 12, name: "سُورَةُ يُوسُفَ", englishName: "Yusuf" },
  { number: 13, name: "سُورَةُ الرَّعۡدِ", englishName: "Ar-Ra'd" },
  { number: 14, name: "سُورَةُ إِبۡرَاهِيمَ", englishName: "Ibrahim" },
  { number: 15, name: "سُورَةُ الحِجۡرِ", englishName: "Al-Hijr" },
  { number: 16, name: "سُورَةُ النَّحۡلِ", englishName: "An-Nahl" },
  { number: 17, name: "سُورَةُ الإِسۡرَاءِ", englishName: "Al-Israa" },
  { number: 18, name: "سُورَةُ الكَهۡفِ", englishName: "Al-Kahf" },
  { number: 19, name: "سُورَةُ مَرۡيَمَ", englishName: "Maryam" },
  { number: 20, name: "سُورَةُ طه", englishName: "Taa-Haa" },
  { number: 21, name: "سُورَةُ الأَنبِيَاءِ", englishName: "Al-Anbiyaa" },
  { number: 22, name: "سُورَةُ الحَجِّ", englishName: "Al-Hajj" },
  { number: 23, name: "سُورَةُ المُؤۡمِنُونَ", englishName: "Al-Muminoon" },
  { number: 24, name: "سُورَةُ النُّورِ", englishName: "An-Noor" },
  { number: 25, name: "سُورَةُ الفُرۡقَانِ", englishName: "Al-Furqaan" },
  { number: 26, name: "سُورَةُ الشُّعَرَاءِ", englishName: "Ash-Shu'araa" },
  { number: 27, name: "سُورَةُ النَّمۡلِ", englishName: "An-Naml" },
  { number: 28, name: "سُورَةُ القَصَصِ", englishName: "Al-Qasas" },
  { number: 29, name: "سُورَةُ العَنكَبُوتِ", englishName: "Al-Ankaboot" },
  { number: 30, name: "سُورَةُ الرُّومِ", englishName: "Ar-Room" },
  { number: 31, name: "سُورَةُ لُقۡمَانَ", englishName: "Luqman" },
  { number: 32, name: "سُورَةُ السَّجۡدَةِ", englishName: "As-Sajda" },
  { number: 33, name: "سُورَةُ الأَحۡزَابِ", englishName: "Al-Ahzaab" },
  { number: 34, name: "سُورَةُ سَبَإٍ", englishName: "Saba" },
  { number: 35, name: "سُورَةُ فَاطِرٍ", englishName: "Faatir" },
  { number: 36, name: "سُورَةُ يسٓ", englishName: "Yaseen" },
  { number: 37, name: "سُورَةُ الصَّافَّاتِ", englishName: "As-Saaffaat" },
  { number: 38, name: "سُورَةُ صٓ", englishName: "Saad" },
  { number: 39, name: "سُورَةُ الزُّمَرِ", englishName: "Az-Zumar" },
  { number: 40, name: "سُورَةُ غَافِرٍ", englishName: "Ghafir" },
  { number: 41, name: "سُورَةُ فُصِّلَتۡ", englishName: "Fussilat" },
  { number: 42, name: "سُورَةُ الشُّورَىٰ", englishName: "Ash-Shura" },
  { number: 43, name: "سُورَةُ الزُّخۡرُفِ", englishName: "Az-Zukhruf" },
  { number: 44, name: "سُورَةُ الدُّخَانِ", englishName: "Ad-Dukhaan" },
  { number: 45, name: "سُورَةُ الجَاثِيَةِ", englishName: "Al-Jaathiya" },
  { number: 46, name: "سُورَةُ الأَحۡقَافِ", englishName: "Al-Ahqaf" },
  { number: 47, name: "سُورَةُ مُحَمَّدٍ", englishName: "Muhammad" },
  { number: 48, name: "سُورَةُ الفَتۡحِ", englishName: "Al-Fath" },
  { number: 49, name: "سُورَةُ الحُجُرَاتِ", englishName: "Al-Hujuraat" },
  { number: 50, name: "سُورَةُ قٓ", englishName: "Qaaf" },
  { number: 51, name: "سُورَةُ الذَّارِيَاتِ", englishName: "Adh-Dhaariyat" },
  { number: 52, name: "سُورَةُ الطُّورِ", englishName: "At-Tur" },
  { number: 53, name: "سُورَةُ النَّجۡمِ", englishName: "An-Najm" },
  { number: 54, name: "سُورَةُ القَمَرِ", englishName: "Al-Qamar" },
  { number: 55, name: "سُورَةُ الرَّحۡمَٰن", englishName: "Ar-Rahmaan" },
  { number: 56, name: "سُورَةُ الوَاقِعَةِ", englishName: "Al-Waaqia" },
  { number: 57, name: "سُورَةُ الحَدِيدِ", englishName: "Al-Hadid" },
  { number: 58, name: "سُورَةُ المُجَادلَةِ", englishName: "Al-Mujaadila" },
  { number: 59, name: "سُورَةُ الحَشۡرِ", englishName: "Al-Hashr" },
  { number: 60, name: "سُورَةُ المُمۡتَحنَةِ", englishName: "Al-Mumtahana" },
  { number: 61, name: "سُورَةُ الصَّفِّ", englishName: "As-Saff" },
  { number: 62, name: "سُورَةُ الجُمُعَةِ", englishName: "Al-Jumu'a" },
  { number: 63, name: "سُورَةُ المُنَافِقُونَ", englishName: "Al-Munaafiqoon" },
  { number: 64, name: "سُورَةُ التَّغَابُنِ", englishName: "At-Taghaabun" },
  { number: 65, name: "سُورَةُ الطَّلَاقِ", englishName: "At-Talaaq" },
  { number: 66, name: "سُورَةُ التَّحۡرِيمِ", englishName: "At-Tahrim" },
  { number: 67, name: "سُورَةُ المُلۡكِ", englishName: "Al-Mulk" },
  { number: 68, name: "سُورَةُ القَلَمِ", englishName: "Al-Qalam" },
  { number: 69, name: "سُورَةُ الحَاقَّةِ", englishName: "Al-Haaqqa" },
  { number: 70, name: "سُورَةُ المَعَارِجِ", englishName: "Al-Ma'aarij" },
  { number: 71, name: "سُورَةُ نُوحٍ", englishName: "Nooh" },
  { number: 72, name: "سُورَةُ الجِنِّ", englishName: "Al-Jinn" },
  { number: 73, name: "سُورَةُ المُزَّمِّلِ", englishName: "Al-Muzzammil" },
  { number: 74, name: "سُورَةُ المُدَّثِّرِ", englishName: "Al-Muddaththir" },
  { number: 75, name: "سُورَةُ القِيَامَةِ", englishName: "Al-Qiyaama" },
  { number: 76, name: "سُورَةُ الإِنسَانِ", englishName: "Al-Insaan" },
  { number: 77, name: "سُورَةُ المُرۡسَلَاتِ", englishName: "Al-Mursalaat" },
  { number: 78, name: "سُورَةُ النَّبَإِ", englishName: "An-Naba" },
  { number: 79, name: "سُورَةُ النَّازِعَاتِ", englishName: "An-Naazi'aat" },
  { number: 80, name: "سُورَةُ عَبَسَ", englishName: "Abasa" },
  { number: 81, name: "سُورَةُ التَّكۡوِيرِ", englishName: "At-Takwir" },
  { number: 82, name: "سُورَةُ الانفِطَارِ", englishName: "Al-Infitaar" },
  { number: 83, name: "سُورَةُ المُطَفِّفِينَ", englishName: "Al-Mutaffifin" },
  { number: 84, name: "سُورَةُ الانشِقَاقِ", englishName: "Al-Inshiqaaq" },
  { number: 85, name: "سُورَةُ البُرُوجِ", englishName: "Al-Burooj" },
  { number: 86, name: "سُورَةُ الطَّارِقِ", englishName: "At-Taariq" },
  { number: 87, name: "سُورَةُ الأَعۡلَىٰ", englishName: "Al-A'laa" },
  { number: 88, name: "سُورَةُ الغَاشِيَةِ", englishName: "Al-Ghaashiya" },
  { number: 89, name: "سُورَةُ الفَجۡرِ", englishName: "Al-Fajr" },
  { number: 90, name: "سُورَةُ البَلَدِ", englishName: "Al-Balad" },
  { number: 91, name: "سُورَةُ الشَّمۡسِ", englishName: "Ash-Shams" },
  { number: 92, name: "سُورَةُ اللَّيۡلِ", englishName: "Al-Lail" },
  { number: 93, name: "سُورَةُ الضُّحَىٰ", englishName: "Ad-Dhuhaa" },
  { number: 94, name: "سُورَةُ الشَّرۡحِ", englishName: "Ash-Sharh" },
  { number: 95, name: "سُورَةُ التِّينِ", englishName: "At-Tin" },
  { number: 96, name: "سُورَةُ العَلَقِ", englishName: "Al-Alaq" },
  { number: 97, name: "سُورَةُ القَدۡرِ", englishName: "Al-Qadr" },
  { number: 98, name: "سُورَةُ البَيِّنَةِ", englishName: "Al-Bayyina" },
  { number: 99, name: "سُورَةُ الزَّلۡزَلَةِ", englishName: "Az-Zalzala" },
  { number: 100, name: "سُورَةُ العَادِيَاتِ", englishName: "Al-Aadiyaat" },
  { number: 101, name: "سُورَةُ القَارِعَةِ", englishName: "Al-Qaari'a" },
  { number: 102, name: "سُورَةُ التَّكَاثُرِ", englishName: "At-Takaathur" },
  { number: 103, name: "سُورَةُ العَصۡرِ", englishName: "Al-Asr" },
  { number: 104, name: "سُورَةُ الهُمَزَةِ", englishName: "Al-Humaza" },
  { number: 105, name: "سُورَةُ الفِيلِ", englishName: "Al-Fil" },
  { number: 106, name: "سُورَةُ قُرَيۡشٍ", englishName: "Quraish" },
  { number: 107, name: "سُورَةُ المَاعُونِ", englishName: "Al-Maa'un" },
  { number: 108, name: "سُورَةُ الكَوۡثَرِ", englishName: "Al-Kawthar" },
  { number: 109, name: "سُورَةُ الكَافِرُونَ", englishName: "Al-Kaafiroon" },
  { number: 110, name: "سُورَةُ النَّصۡرِ", englishName: "An-Nasr" },
  { number: 111, name: "سُورَةُ المَسَدِ", englishName: "Al-Masad" },
  { number: 112, name: "سُورَةُ الإِخۡلَاصِ", englishName: "Al-Ikhlaas" },
  { number: 113, name: "سُورَةُ الفَلَقِ", englishName: "Al-Falaq" },
  { number: 114, name: "سُورَةُ النَّاسِ", englishName: "An-Naas" },
];

export default function SurahInput({
  surahNumberValue,
  onChange,
}: SurahInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedSurah = surahs.find((s) => s.number === surahNumberValue) || surahs[0];

  const filteredSurahs = surahs.filter(
    (surah) =>
      surah.number.toString().includes(searchTerm) ||
      surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      surah.name.includes(searchTerm)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSurahSelect = (surah: Surah) => {
    onChange(surah.number);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 text-left bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--input-text)] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 hover:bg-[var(--button-hover)] transition-colors border"
      >
        <div className="flex flex-col">
          <span className="block truncate font-medium text-[var(--foreground)]">
            {selectedSurah.number} - {selectedSurah.name}
          </span>
          <span className="block truncate text-sm text-[var(--foreground)] opacity-60">
            {selectedSurah.englishName}
          </span>
        </div>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <svg
            className="h-5 w-5 text-[var(--foreground)] opacity-40"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-[var(--card-bg)] border-[var(--card-border)] shadow-lg rounded-md border">
          <div className="p-2">
            <input
              type="text"
              className="w-full px-3 py-2 bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--input-text)] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border"
              placeholder="Search by number or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <ul className="max-h-60 overflow-auto rounded-md py-1 text-base">
            {filteredSurahs.map((surah) => (
              <li key={surah.number}>
                <button
                  onClick={() => handleSurahSelect(surah)}
                  className={`w-full px-4 py-3 text-left hover:bg-[var(--button-hover)] focus:outline-none focus:bg-[var(--button-hover)] transition-colors ${
                    selectedSurah.number === surah.number
                      ? "bg-[var(--success-bg)] text-[var(--success-text)]"
                      : "text-[var(--foreground)]"
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {surah.number} - {surah.name}
                    </span>
                    <span className="text-sm text-[var(--foreground)] opacity-60">
                      {surah.englishName}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
          <div className="px-4 py-3 text-sm text-[var(--foreground)] opacity-60">
            {filteredSurahs.length} surahs {searchTerm && "found"}
          </div>
        </div>
      )}
    </div>
  );
}
