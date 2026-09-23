import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "sans-serif"],
        mono: ["var(--font-mono)", "IBM Plex Mono", "monospace"],
      },
      colors: {
        ivory: {
          50: "#ffffff",
          100: "#faf8f5",
          200: "#f4f0e8",
          300: "#e9e4d8",
          400: "#dfdad0",
        },
        cinema: {
          navy: "#0b132b",
          midnight: "#1c2541",
          blue: "#2563eb",
          electric: "#3b82f6",
          slate: "#334155",
          muted: "#64748b",
          border: "#e2e8f0",
          card: "#ffffff",
        },
      },
      boxShadow: {
        cinema: "0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 6px 16px -4px rgba(15, 23, 42, 0.05)",
        "cinema-elevated": "0 4px 6px -1px rgba(15, 23, 42, 0.05), 0 12px 28px -4px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
