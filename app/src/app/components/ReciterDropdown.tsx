"use client";

import { useState, useRef, useEffect } from "react";

export interface Reciter {
  englishName: string;
  arabicName: string;
  id: string;
}

interface ReciterDropdownProps {
  selectedReciter: Reciter;
  onReciterChange: (reciter: Reciter) => void;
}

// Reciters available in the AlQuran.cloud API
const reciters: Reciter[] = [
  {
    id: "ar.abdullahbasfar",
    englishName: "Abdullah Basfar",
    arabicName: "عبد الله بصفر",
  },
  {
    id: "ar.abdurrahmaansudais",
    englishName: "Abdurrahmaan As-Sudais",
    arabicName: "عبدالرحمن السديس",
  },
  {
    id: "ar.abdulsamad",
    englishName: "Abdul Samad",
    arabicName: "عبدالباسط عبدالصمد",
  },
  {
    id: "ar.shaatree",
    englishName: "Abu Bakr Ash-Shaatree",
    arabicName: "أبو بكر الشاطري",
  },
  {
    id: "ar.ahmedajamy",
    englishName: "Ahmed ibn Ali al-Ajamy",
    arabicName: "أحمد بن علي العجمي",
  },
  {
    id: "ar.alafasy",
    englishName: "Alafasy",
    arabicName: "مشاري العفاسي",
  },
  {
    id: "ar.hanirifai",
    englishName: "Hani Rifai",
    arabicName: "هاني الرفاعي",
  },
  {
    id: "ar.husary",
    englishName: "Husary",
    arabicName: "محمود خليل الحصري",
  },
  {
    id: "ar.husarymujawwad",
    englishName: "Husary (Mujawwad)",
    arabicName: "محمود خليل الحصري (المجود)",
  },
  {
    id: "ar.hudhaify",
    englishName: "Hudhaify",
    arabicName: "علي بن عبدالرحمن الحذيفي",
  },
  {
    id: "ar.ibrahimakhbar",
    englishName: "Ibrahim Akhdar",
    arabicName: "إبراهيم الأخضر",
  },
  {
    id: "ar.mahermuaiqly",
    englishName: "Maher Al Muaiqly",
    arabicName: "ماهر المعيقلي",
  },
  {
    id: "ar.muhammadayyoub",
    englishName: "Muhammad Ayyoub",
    arabicName: "محمد أيوب",
  },
  {
    id: "ar.muhammadjibreel",
    englishName: "Muhammad Jibreel",
    arabicName: "محمد جبريل",
  },
  {
    id: "ar.saoodshuraym",
    englishName: "Saood bin Ibraaheem Ash-Shuraym",
    arabicName: "سعود الشريم",
  },
  {
    id: "ar.parhizgar",
    englishName: "Parhizgar",
    arabicName: "شهریار پرهیزگار",
  },
  {
    id: "ar.aymanswoaid",
    englishName: "Ayman Sowaid",
    arabicName: "أيمن سويد",
  },
];

export default function ReciterDropdown({
  selectedReciter,
  onReciterChange,
}: ReciterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredReciters = reciters.filter(
    (reciter) =>
      reciter.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reciter.arabicName.includes(searchTerm)
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

  const handleReciterSelect = (reciter: Reciter) => {
    onReciterChange(reciter);
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
            {selectedReciter.englishName}
          </span>
          <span className="block truncate text-sm text-[var(--foreground)] opacity-60">
            {selectedReciter.arabicName}
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
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <ul className="max-h-60 overflow-auto rounded-md py-1 text-base">
            {filteredReciters.map((reciter) => (
              <li key={reciter.id}>
                <button
                  onClick={() => handleReciterSelect(reciter)}
                  className={`w-full px-4 py-3 text-left hover:bg-[var(--button-hover)] focus:outline-none focus:bg-[var(--button-hover)] transition-colors ${
                    selectedReciter.id === reciter.id
                      ? "bg-[var(--success-bg)] text-[var(--success-text)]"
                      : "text-[var(--foreground)]"
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{reciter.englishName}</span>
                    <span className="text-sm text-[var(--foreground)] opacity-60">
                      {reciter.arabicName}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
          <div className="px-4 py-3 text-sm text-[var(--foreground)] opacity-60">
            {filteredReciters.length} reciters {searchTerm && "found"}
          </div>
        </div>
      )}
    </div>
  );
}
