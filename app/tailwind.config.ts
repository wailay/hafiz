import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          bg: "var(--card-bg)",
          border: "var(--card-border)",
        },
        input: {
          bg: "var(--input-bg)",
          border: "var(--input-border)",
          text: "var(--input-text)",
        },
        button: {
          bg: "var(--button-bg)",
          hover: "var(--button-hover)",
          text: "var(--button-text)",
        },
        primary: {
          bg: "var(--primary-bg)",
          hover: "var(--primary-hover)",
          text: "var(--primary-text)",
        },
        success: {
          bg: "var(--success-bg)",
          border: "var(--success-border)",
          text: "var(--success-text)",
        },
        error: {
          bg: "var(--error-bg)",
          border: "var(--error-border)",
          text: "var(--error-text)",
        },
      },
    },
  },
  plugins: [],
};

export default config;
