/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0a0a0b",
        paper: "#f4f7f8",
        ice: "#bfe9f2",
        holo: "#7fd8e8",
        cyan2: "#0aa8c4",
        acid: "#c8ff2e",
      },
      fontFamily: {
        display: ["Archivo", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        jp: ["Noto Sans JP", "sans-serif"],
      },
    },
  },
  plugins: [],
};
