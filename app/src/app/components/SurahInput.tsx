"use client";

interface SurahInputProps {
  value: number;
  onChange: (value: number) => void;
}

export default function SurahInput({ value, onChange }: SurahInputProps) {
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

  return (
    <div className="relative">
      <input
        type="number"
        max="114"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className="w-full px-4 py-3 theme-input-bg theme-input-border theme-input-text rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors placeholder-gray-500 dark:placeholder-gray-400 border"
        placeholder="Enter surah number (1-114)"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <span className="text-sm text-gray-500 dark:text-gray-400">/ 114</span>
      </div>
    </div>
  );
}
