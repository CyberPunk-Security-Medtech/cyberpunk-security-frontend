import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        "short-lg": { raw: "(max-height: 700px)" }, // short and wide screens
        xs: "480px", // extra small
        "3xl": "1920px", // very large screens
      },
      colors: {
        primary: {
          DEFAULT: "#2563EB", // Blue from the design
          hover: "#1D4ED8",
          contrast: "#FFFFFF",
          100: "#EFF6FF",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
        },
        secondary: {
          DEFAULT: "#ffffff",
          hover: "#f5f5f5", // Light gray
          contrast: "#000000",
          100: "#FFFFFF",
          200: "#FAFAFA",
          300: "#ECECEC",
          400: "#D9D9D9",
        },
        green: {
          100: "#50C878",
        },
        gray: {
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          900: "#1a1a1a",
        },
        success: "#10B981",
        error: "#EF4444",
        warning: "#F59E0B",
      },
    fontFamily: {
  sans: ["var(--font-nunito-sans)", "sans-serif"],
},

      fontSize: {
        xxs: "0.625rem", // 10px
        tiny: "0.7rem", // 11.2px
      },
      fontWeight: {
        hairline: "50",
      },

      spacing: {
        13: "3.25rem",
        15: "3.75rem",
        18: "4.5rem",
        22: "5.5rem",
        100: "25rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
