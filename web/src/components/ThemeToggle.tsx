"use client";

import { useTheme } from "@/hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      className={`flex items-center gap-1 p-1.5 rounded-full transition-colors duration-300 cursor-pointer ${
        isDark ? "bg-surface-container" : "bg-surface-container-high"
      }`}
    >
      <span
        className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
          !isDark ? "bg-[#3b5bdb] text-white" : "text-on-surface-variant"
        }`}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
          light_mode
        </span>
      </span>
      <span
        className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
          isDark ? "bg-[#3b5bdb] text-white" : "text-on-surface-variant"
        }`}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
          dark_mode
        </span>
      </span>
    </button>
  );
}
