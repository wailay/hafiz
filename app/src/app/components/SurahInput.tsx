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
        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors text-gray-900 placeholder-gray-500"
        placeholder="Enter surah number (1-114)"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <span className="text-sm text-gray-500">/ 114</span>
      </div>
    </div>
  );
}
