"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "system" | "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem("quran-theme") as Theme;
    if (
      savedTheme &&
      (savedTheme === "system" ||
        savedTheme === "light" ||
        savedTheme === "dark")
    ) {
      setThemeState(savedTheme);
      console.log("Loaded theme from localStorage:", savedTheme);
    } else {
      console.log("Using default system theme");
    }
  }, []);

  useEffect(() => {
    // Determine the resolved theme based on current theme setting
    let newResolvedTheme: "light" | "dark";

    if (theme === "system") {
      newResolvedTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
    } else {
      newResolvedTheme = theme;
    }

    setResolvedTheme(newResolvedTheme);

    // Apply theme to document
    document.documentElement.setAttribute("data-theme", newResolvedTheme);
    localStorage.setItem("quran-theme", theme);
    console.log("Applied theme:", theme, "resolved to:", newResolvedTheme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        const newResolvedTheme = mediaQuery.matches ? "dark" : "light";
        setResolvedTheme(newResolvedTheme);
        document.documentElement.setAttribute("data-theme", newResolvedTheme);
        console.log("System theme changed to:", newResolvedTheme);
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    console.log("Setting theme to:", newTheme);
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
