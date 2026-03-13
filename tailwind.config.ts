import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: "#FF7722",
        "trust-blue": "#1E3A8A",
        cream: "#FFF7ED",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        clay: "0 2px 0 0 rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)",
        "clay-hover": "0 4px 0 0 rgba(0,0,0,0.06), 0 8px 20px rgba(0,0,0,0.08), 0 16px 40px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.9)",
      },
    },
  },
  plugins: [],
};
export default config;
