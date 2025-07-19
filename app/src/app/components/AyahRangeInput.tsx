"use client";

interface AyahRangeInputProps {
  ayahFrom: number;
  ayahTo: number | null;
  onAyahFromChange: (value: number) => void;
  onAyahToChange: (value: number | null) => void;
}

export default function AyahRangeInput({
  ayahFrom,
  ayahTo,
  onAyahFromChange,
  onAyahToChange,
}: AyahRangeInputProps) {
  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    onAyahFromChange(newValue);
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      onAyahToChange(null);
    } else {
      const newValue = parseInt(value);
      onAyahToChange(newValue);
    }
  };

  const handleFromBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    onAyahFromChange(newValue);
  };

  const handleToBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      onAyahToChange(null);
    } else {
      const newValue = parseInt(value);
      onAyahToChange(newValue);
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <div className="flex-1">
        <input
          type="number"
          min="1"
          value={ayahFrom}
          onChange={handleFromChange}
          onBlur={handleFromBlur}
          className="w-full px-4 py-3 theme-input-bg theme-input-border theme-input-text rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors text-center placeholder:theme-placeholder border"
          placeholder="From"
        />
      </div>

      <span className="theme-text font-medium">—</span>

      <div className="flex-1">
        <input
          type="number"
          min="1"
          value={ayahTo || ""}
          onChange={handleToChange}
          onBlur={handleToBlur}
          className="w-full px-4 py-3 theme-input-bg theme-input-border theme-input-text rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors text-center placeholder:theme-placeholder border"
          placeholder="To"
        />
      </div>
    </div>
  );
}
