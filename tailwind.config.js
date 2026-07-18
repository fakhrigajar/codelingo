import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    screens: {
      sm: "640px",
      desktop: "1024px",
    },
    extend: {
      colors: {
        bg: "#F5F9FF",
        panel: "#FFFFFF",
        ink: "#16213E",
        "ink-soft": "#4A5578",
        "indigo-dark": "#1B2647",
        sun: "#FFC93C",
        "sun-dark": "#D9A400",
        coral: "#FF6B5B",
        "coral-dark": "#C8503F",
        mint: "#2FC493",
        "mint-dark": "#1F9A73",
        violet: "#8C7AE6",
        line: "#DCE6F7",
        "indigo-darker": "#0E1730",
      },
      fontFamily: {
        display: ['"Baloo 2"', "sans-serif"],
        body: ["Nunito", "sans-serif"],
        mono: ['"Space Mono"', "monospace"],
      },
      boxShadow: {
        card: "0 16px 30px -18px rgba(43,58,103,.35)",
        monitor: "0 20px 50px -18px rgba(27,38,71,.55)",
      },
      keyframes: {
        cardFloat: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        logoFloat: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-12px) rotate(6deg)" },
        },
        blobDrift: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)", opacity: 0.7 },
          "50%": { transform: "translate(18px, -22px) scale(1.12)", opacity: 1 },
        },
        fadeUp: {
          from: { opacity: 0, transform: "translateY(18px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        heroPop: {
          "0%": { opacity: 0, transform: "translateY(26px) scale(.7)" },
          "60%": { opacity: 1, transform: "translateY(-4px) scale(1.05)" },
          "100%": { opacity: 1, transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        cardFloat: "cardFloat 5s ease-in-out infinite",
        logoFloat: "logoFloat 5.5s ease-in-out infinite",
        blobDrift: "blobDrift 9s ease-in-out infinite",
        fadeUp: "fadeUp .7s ease both",
        heroPop: "heroPop .7s cubic-bezier(.34,1.56,.64,1) both",
      },
    },
  },
  plugins: [typography],
};
