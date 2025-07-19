"use client";

import { useState } from "react";

interface AyahRangeInputProps {
  ayahFrom: number;
  ayahTo: number | null;
  onAyahFromChange: (from: number) => void;
  onAyahToChange: (to: number | null) => void;
}

export default function AyahRangeInput({
  ayahFrom,
  ayahTo,
  onAyahFromChange,
  onAyahToChange,
}: AyahRangeInputProps) {
  const [fromValue, setFromValue] = useState(ayahFrom.toString());
  const [toValue, setToValue] = useState(ayahTo?.toString() || "");

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFromValue(value);

    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 1) {
      onAyahFromChange(numValue);
    }
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setToValue(value);

    if (value === "") {
      onAyahToChange(null);
    } else {
      const numValue = parseInt(value);
      if (!isNaN(numValue) && numValue >= 1) {
        onAyahToChange(numValue);
      }
    }
  };

  const handleFromBlur = () => {
    const numValue = parseInt(fromValue);
    if (isNaN(numValue) || numValue < 1) {
      setFromValue("1");
      onAyahFromChange(1);
    }
  };

  const handleToBlur = () => {
    if (toValue === "") {
      onAyahToChange(null);
    } else {
      const numValue = parseInt(toValue);
      if (isNaN(numValue) || numValue < 1) {
        setToValue("");
        onAyahToChange(null);
      }
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <div className="flex-1">
        <input
          type="number"
          min="1"
          value={fromValue}
          onChange={handleFromChange}
          onBlur={handleFromBlur}
          className="w-full px-4 py-3 bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--input-text)] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors text-center placeholder-[var(--foreground)] placeholder-opacity-50 border"
          placeholder="From"
        />
      </div>

      <span className="text-[var(--foreground)] font-medium">—</span>

      <div className="flex-1">
        <input
          type="number"
          min="1"
          value={toValue}
          onChange={handleToChange}
          onBlur={handleToBlur}
          className="w-full px-4 py-3 bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--input-text)] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors text-center placeholder-[var(--foreground)] placeholder-opacity-50 border"
          placeholder="To"
        />
      </div>
    </div>
  );
}
