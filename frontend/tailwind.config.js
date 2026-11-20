/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        brand: {
          dark: '#0a0f1d',
          navy: '#0f172a',
          slate: '#1e293b',
          muted: '#475569',
          light: '#64748b',
          bg: '#f6f8fc',
        },
      },
      boxShadow: {
        'glass': '0 20px 50px -12px rgba(30, 41, 59, 0.08), 0 0 0 1px rgba(226, 232, 240, 0.8)',
        'hero': '0 30px 70px -20px rgba(220, 180, 220, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.95)',
        'pill': '0 4px 14px rgba(15, 23, 42, 0.16)',
        'floating': '0 12px 30px -5px rgba(50, 50, 93, 0.09), 0 4px 10px -2px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'float-slow': 'float 5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
}
