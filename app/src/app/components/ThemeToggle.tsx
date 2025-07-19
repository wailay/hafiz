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
      <div className="flex items-center bg-[var(--button-bg)] rounded-full p-1 shadow-lg">
        {/* Light Mode */}
        <button
          onClick={() => handleThemeChange("light")}
          className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${
            theme === "light"
              ? "bg-[var(--card-bg)] shadow-sm"
              : "hover:bg-[var(--button-hover)]"
          }`}
          title="Light mode"
        >
          <svg
            className={`w-4 h-4 ${
              theme === "light" ? "text-yellow-500" : "text-[var(--foreground)]"
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
              ? "bg-[var(--card-bg)] shadow-sm"
              : "hover:bg-[var(--button-hover)]"
          }`}
          title="System preference"
        >
          <svg
            className={`w-4 h-4 ${
              theme === "system" ? "text-blue-500" : "text-[var(--foreground)]"
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
              ? "bg-[var(--card-bg)] shadow-sm"
              : "hover:bg-[var(--button-hover)]"
          }`}
          title="Dark mode"
        >
          <svg
            className={`w-4 h-4 ${
              theme === "dark" ? "text-indigo-500" : "text-[var(--foreground)]"
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

      {/* GitHub Link */}
      <a
        href="https://github.com/wailay/hafiz"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-8 h-8 bg-[var(--button-bg)] hover:bg-[var(--button-hover)] rounded-full shadow-lg transition-all duration-200"
        title="View on GitHub"
      >
        <svg
          className="w-4 h-4 text-[var(--foreground)]"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      </a>
    </div>
  );
}
