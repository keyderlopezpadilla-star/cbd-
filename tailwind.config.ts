import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx,mdx}", "./components/**/*.{ts,tsx,mdx}", "./lib/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        black: "var(--color-black)",
        gold: {
          DEFAULT: "var(--color-gold)",
          bright: "var(--color-gold-bright)",
        },
        offwhite: "var(--color-offwhite)",
        "green-rustic": "var(--color-green-rustic)",
        "green-moss": "var(--color-green-moss)",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      keyframes: {
        breathe: {
          "0%, 100%": { opacity: "0.85", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.03)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        breathe: "breathe 6s ease-in-out infinite",
        float: "float 7s ease-in-out infinite",
        shimmer: "shimmer 3.5s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
