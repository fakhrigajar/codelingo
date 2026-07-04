/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#F5F9FF',
        panel: '#FFFFFF',
        ink: '#16213E',
        'ink-soft': '#4A5578',
        indigo: '#2B3A67',
        'indigo-dark': '#1B2647',
        sun: '#FFC93C',
        coral: '#FF6B5B',
        mint: '#2FC493',
        violet: '#8C7AE6',
        line: '#DCE6F7',
      },
      fontFamily: {
        display: ['"Baloo 2"', 'sans-serif'],
        body: ['Nunito', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      boxShadow: {
        coral: '0 4px 0 #C8503F',
        'coral-lg': '0 6px 0 #C8503F',
        dark: '0 4px 0 #0E1730',
        'dark-lg': '0 6px 0 #0E1730',
        card: '0 16px 30px -18px rgba(43,58,103,.35)',
        cart: '0 18px 32px -20px rgba(27,38,71,.4)',
        monitor: '0 20px 50px -18px rgba(27,38,71,.55)',
      },
      keyframes: {
        typeIn: { to: { opacity: 1 } },
      },
      animation: {
        typeIn: 'typeIn .5s forwards',
      },
    },
  },
  plugins: [],
}
