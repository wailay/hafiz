"use client";

interface SurahInputProps {
  surahNumberValue: number;
  onChange: (value: number) => void;
}

export default function SurahInput({
  surahNumberValue,
  onChange,
}: SurahInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    // Ensure value is between 1 and 114
    const clampedValue = Math.max(1, Math.min(114, newValue));
    onChange(clampedValue);
  };

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || 1;
    const clampedValue = Math.max(1, Math.min(114, newValue));
    onChange(clampedValue);
  };

  const stringValue = isNaN(surahNumberValue) ? "" : surahNumberValue;

  return (
    <div className="relative">
      <input
        type="number"
        min="1"
        max="114"
        value={stringValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className="w-full px-4 py-3 theme-input-bg theme-input-border theme-input-text rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder:theme-placeholder border"
        placeholder="Enter surah number (1-114)"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
        <span className="text-sm theme-text opacity-60">/ 114</span>
      </div>
    </div>
  );
}
