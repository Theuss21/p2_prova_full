/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        graphite: {
          950: '#0F1115',
          900: '#16181D',
          800: '#1F2127',
          700: '#2A2D35',
          600: '#3A3E48',
        },
        surface: '#F7F5F1',
        signal: {
          light: '#FFE4D6',
          DEFAULT: '#FF6A39',
          dark: '#E2541F',
        },
        ink: '#1B1D22',
        line: '#DDD9D0',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        panel: '0 1px 2px rgba(15, 17, 21, 0.06), 0 8px 24px rgba(15, 17, 21, 0.06)',
      },
    },
  },
  plugins: [],
};
