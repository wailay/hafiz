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
    id: "ar.abdul_basit",
    englishName: "Abdul Basit",
    arabicName: "عبد الباسط عبد الصمد",
  },
  {
    id: "ar.sudais",
    englishName: "Abdur-Rahman As-Sudais",
    arabicName: "عبد الرحمن السديس",
  },
  { id: "ar.ghamdi", englishName: "Saad Al-Ghamdi", arabicName: "سعد الغامدي" },
  {
    id: "ar.ghamdi_64",
    englishName: "Saad Al-Ghamdi (64k)",
    arabicName: "سعد الغامدي",
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
        className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors"
      >
        <div className="flex flex-col">
          <span className="block truncate font-medium text-gray-900">
            {selectedReciter.englishName}
          </span>
          <span className="block truncate text-sm text-gray-500">
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
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="p-2">
            <input
              type="text"
              placeholder="Search reciters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              autoFocus
            />
          </div>

          <div className="max-h-60 overflow-auto">
            {filteredReciters.length > 0 ? (
              filteredReciters.map((reciter) => (
                <button
                  key={reciter.id}
                  onClick={() => handleReciterSelect(reciter)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 ${
                    selectedReciter.id === reciter.id
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-900"
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{reciter.englishName}</span>
                    <span className="text-sm text-gray-500">
                      {reciter.arabicName}
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500">
                No reciters found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
