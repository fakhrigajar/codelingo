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
        indigo: "#2B3A67",
        "indigo-dark": "#1B2647",
        sun: "#FFC93C",
        coral: "#FF6B5B",
        mint: "#2FC493",
        violet: "#8C7AE6",
        line: "#DCE6F7",
      },
      fontFamily: {
        display: ['"Baloo 2"', "sans-serif"],
        body: ["Nunito", "sans-serif"],
        mono: ['"Space Mono"', "monospace"],
      },
      boxShadow: {
        coral: "0 4px 0 #C8503F",
        "coral-lg": "0 6px 0 #C8503F",
        mint: "0 4px 0 #1F9A73",
        "mint-lg": "0 6px 0 #1F9A73",
        dark: "0 4px 0 #0E1730",
        "dark-lg": "0 6px 0 #0E1730",
        card: "0 16px 30px -18px rgba(43,58,103,.35)",
        cart: "0 18px 32px -20px rgba(27,38,71,.4)",
        monitor: "0 20px 50px -18px rgba(27,38,71,.55)",
      },
      keyframes: {
        typeIn: { to: { opacity: 1 } },
        robotFloat: {
          "0%, 100%": { transform: "translateY(0) rotateY(-6deg)" },
          "50%": { transform: "translateY(-14px) rotateY(6deg)" },
        },
        robotShadow: {
          "0%, 100%": { transform: "scale(1)", opacity: 0.5 },
          "50%": { transform: "scale(.8)", opacity: 0.3 },
        },
        robotPulse: {
          "0%, 100%": { opacity: 1, transform: "scale(1)" },
          "50%": { opacity: 0.55, transform: "scale(.8)" },
        },
        robotBlink: {
          "0%, 92%, 100%": { transform: "scaleY(1)" },
          "96%": { transform: "scaleY(.15)" },
        },
        robotBar: {
          "0%, 100%": { width: "20px" },
          "50%": { width: "58px" },
        },
      },
      animation: {
        typeIn: "typeIn .5s forwards",
        robotFloat: "robotFloat 4.5s ease-in-out infinite",
        robotShadow: "robotShadow 4.5s ease-in-out infinite",
        robotPulse: "robotPulse 1.8s ease-in-out infinite",
        robotBlink: "robotBlink 4s ease-in-out infinite",
        robotBar: "robotBar 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
