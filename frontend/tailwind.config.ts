import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        sand: "#f4f2ee",
        paper: "#ffffff",
        ink: "#1c1a16",
        muted: "#5a5750",
        line: "rgba(28,26,22,0.08)",
        accent: "#c8622a",
        accentDark: "#a34d1e",
        accentSoft: "#fdf1eb",
        blueSoft: "#ebf0fc",
        tealSoft: "#e2f5ef"
      },
      borderRadius: {
        xl2: "1.75rem"
      },
      boxShadow: {
        soft: "0 1px 4px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04)",
        card: "0 8px 40px rgba(0,0,0,0.10)"
      },
      fontFamily: {
        display: ["var(--font-syne)"],
        sans: ["var(--font-instrument-sans)"]
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(200,98,42,0.08) 0%, transparent 70%)"
      }
    }
  },
  plugins: []
};

export default config;
