"use client";

import localFont from "next/font/local";

interface AyahTextProps {
  text: string;
}

const uthmanicHafsFont = localFont({
  src: "../assets/fonts/Kitab-Regular.ttf",
  display: "swap",
});

export default function AyahText({ text }: AyahTextProps) {
  return (
    <div
      className={`text-lg leading-relaxed text-[var(--foreground)] ${uthmanicHafsFont.className}`}
      style={{
        direction: "rtl",
        textAlign: "right",
        lineHeight: "2",
        fontSize: "1.75rem",
      }}
    >
      {text}
    </div>
  );
}
