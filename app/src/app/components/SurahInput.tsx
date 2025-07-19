"use client";

import { useState } from "react";

interface SurahInputProps {
  surahNumberValue: number;
  onChange: (value: number) => void;
}

export default function SurahInput({
  surahNumberValue,
  onChange,
}: SurahInputProps) {
  const [stringValue, setStringValue] = useState(surahNumberValue.toString());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStringValue(value);

    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 114) {
      onChange(numValue);
    }
  };

  const handleBlur = () => {
    const numValue = parseInt(stringValue);
    if (isNaN(numValue) || numValue < 1) {
      setStringValue("1");
      onChange(1);
    } else if (numValue > 114) {
      setStringValue("114");
      onChange(114);
    }
  };

  return (
    <div className="relative">
      <input
        type="number"
        min="1"
        max="114"
        value={stringValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className="w-full px-4 py-3 bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--input-text)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-[var(--foreground)] placeholder-opacity-50 border"
        placeholder="Enter surah number (1-114)"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
        <span className="text-sm text-[var(--foreground)] opacity-60">
          / 114
        </span>
      </div>
    </div>
  );
}
