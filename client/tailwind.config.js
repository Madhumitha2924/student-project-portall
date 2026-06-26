/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        surface: {
          light: '#ffffff',
          dark:  '#0f172a',
        },
        card: {
          light: '#f8fafc',
          dark:  '#1e293b',
        },
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease-in-out',
        'slide-up':   'slideUp 0.3s ease-out',
        'scale-in':   'scaleIn 0.2s ease-out',
        'spin-slow':  'spin 1.5s linear infinite',
        'bounce-dot': 'bounceDot 1.4s infinite ease-in-out both',
      },
      keyframes: {
        fadeIn:    { from: { opacity: 0 },                    to: { opacity: 1 } },
        slideUp:   { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        scaleIn:   { from: { opacity: 0, transform: 'scale(0.95)' },      to: { opacity: 1, transform: 'scale(1)' } },
        bounceDot: {
          '0%, 80%, 100%': { transform: 'scale(0)' },
          '40%':           { transform: 'scale(1)' },
        },
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
}
