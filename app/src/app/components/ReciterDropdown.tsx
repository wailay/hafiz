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
  { id: "ar.husary", englishName: "Husary", arabicName: "محمود خليل الحصري" },
  {
    id: "ar.alafasy",
    englishName: "Mishary Alafasy",
    arabicName: "مشاري العفاسي",
  },
  {
    id: "ar.abdurrahmaansudais",
    englishName: "Abdurrahmaan As-Sudais",
    arabicName: "عبدالرحمن السديس",
  },
  {
    id: "ar.mahermuaiqly",
    arabicName: "ماهر المعيقلي",
    englishName: "Maher Al Muaiqly",
  },
  {
    id: "ar.minshawi",
    arabicName: "محمد صديق المنشاوي",
    englishName: "Minshawi",
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
        className="w-full px-4 py-3 text-left theme-input-bg theme-input-border theme-input-text rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors border"
      >
        <div className="flex flex-col">
          <span className="block truncate font-medium theme-text">
            {selectedReciter.englishName}
          </span>
          <span className="block truncate text-sm text-gray-500 dark:text-gray-400">
            {selectedReciter.arabicName}
          </span>
        </div>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 theme-card-bg theme-card-border rounded-lg shadow-lg border">
          <div className="p-2">
            <input
              type="text"
              placeholder="Search reciters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm theme-input-bg theme-input-border theme-input-text rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border"
              autoFocus
            />
          </div>

          <div className="max-h-60 overflow-auto">
            {filteredReciters.length > 0 ? (
              filteredReciters.map((reciter) => (
                <button
                  key={reciter.id}
                  onClick={() => handleReciterSelect(reciter)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700 ${
                    selectedReciter.id === reciter.id
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : "theme-text"
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{reciter.englishName}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {reciter.arabicName}
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                No reciters found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
