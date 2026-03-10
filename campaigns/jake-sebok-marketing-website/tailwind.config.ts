import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ap: {
          primary: "#0E1624",
          "primary-2": "#192236",
          accent: "#FF6B1A",
          "accent-2": "#FF9F6B",
          mid: "#3A4A5C",
          muted: "#7A8FA8",
          border: "#DDE3ED",
          bg: "#F5F7FA",
          off: "#EEF1F7",
        },
      },
      fontFamily: {
        outfit: ["var(--font-outfit)", "sans-serif"],
        cormorant: ["var(--font-cormorant)", "serif"],
      },
      borderRadius: {
        pill: "100px",
      },
    },
  },
  plugins: [],
};
export default config;
