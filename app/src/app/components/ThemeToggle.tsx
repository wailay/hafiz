"use client";

import { useTheme } from "../contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (newTheme: "system" | "light" | "dark") => {
    console.log("Theme toggle clicked, setting theme to:", newTheme);
    setTheme(newTheme);
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center space-x-4">
      {/* Theme Toggle */}
      <div className="flex items-center theme-toggle-bg rounded-full p-1 shadow-lg">
        {/* Light Mode */}
        <button
          onClick={() => handleThemeChange("light")}
          className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${
            theme === "light"
              ? "theme-toggle-active-bg shadow-sm"
              : "hover:theme-toggle-hover-bg"
          }`}
          title="Light mode"
        >
          <svg
            className={`w-4 h-4 ${
              theme === "light" ? "text-yellow-500" : "theme-text"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </button>

        {/* System Mode */}
        <button
          onClick={() => handleThemeChange("system")}
          className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${
            theme === "system"
              ? "theme-toggle-active-bg shadow-sm"
              : "hover:theme-toggle-hover-bg"
          }`}
          title="System preference"
        >
          <svg
            className={`w-4 h-4 ${
              theme === "system" ? "text-blue-500" : "theme-text"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </button>

        {/* Dark Mode */}
        <button
          onClick={() => handleThemeChange("dark")}
          className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${
            theme === "dark"
              ? "theme-toggle-active-bg shadow-sm"
              : "hover:theme-toggle-hover-bg"
          }`}
          title="Dark mode"
        >
          <svg
            className={`w-4 h-4 ${
              theme === "dark" ? "text-indigo-500" : "theme-text"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
