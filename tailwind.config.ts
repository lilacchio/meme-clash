import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        foreground: "#ffffff",
        primary: "#ccff00", // Neon Lime
        secondary: "#ff00ff", // Hot Pink
        surface: "#1a1a1a",
        border: "#ffffff",
      },
      boxShadow: {
        neo: "4px 4px 0px 0px #ffffff",
        "neo-sm": "2px 2px 0px 0px #ffffff",
        "neo-lg": "8px 8px 0px 0px #ffffff",
      },
      fontFamily: {
        mono: ["var(--font-geist-mono)", "monospace"],
        sans: ["var(--font-geist-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
