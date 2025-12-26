/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      // Beginner - calm, soft theme
      {
        beginner: {
          "primary": "#a8d5ba",
          "secondary": "#d4a5c7",
          "accent": "#c5d5e5",
          "neutral": "#e5e5e5",
          "base-100": "#f5f5f5",
          "base-200": "#e8e8e8",
          "base-300": "#d1d1d1",
          "info": "#7dd3fc",
          "success": "#86efac",
          "warning": "#fde047",
          "error": "#fca5a5",
        },
      },
      // Intermediate - energetic, balanced theme
      {
        intermediate: {
          "primary": "#fbbf24",
          "secondary": "#f59e0b",
          "accent": "#10b981",
          "neutral": "#374151",
          "base-100": "#1f2937",
          "base-200": "#111827",
          "base-300": "#0f172a",
          "info": "#3b82f6",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      },
      // Advanced - intense, high-contrast theme
      {
        advanced: {
          "primary": "#ef4444",
          "secondary": "#dc2626",
          "accent": "#f59e0b",
          "neutral": "#000000",
          "base-100": "#0a0a0a",
          "base-200": "#1a1a1a",
          "base-300": "#2d2d2d",
          "info": "#3b82f6",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#dc2626",
        },
      },
    ],
  },
}

