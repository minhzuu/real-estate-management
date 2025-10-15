/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f5f7ff",
          100: "#ebf0ff",
          200: "#d6e0ff",
          300: "#b3c5ff",
          400: "#809fff",
          500: "#667eea",
          600: "#5568d3",
          700: "#4553b8",
          800: "#3a4695",
          900: "#333d7a",
        },
        secondary: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#764ba2",
          600: "#6b3f92",
          700: "#5f3482",
          800: "#532971",
          900: "#47235f",
        },
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-10px)" },
          "75%": { transform: "translateX(10px)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-in-out",
        shake: "shake 0.3s ease-in-out",
      },
    },
  },
  plugins: [],
};
