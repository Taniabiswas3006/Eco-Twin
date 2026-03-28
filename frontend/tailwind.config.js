/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        eco: {
          50: '#f4f9f4',
          100: '#e3f0e5',
          200: '#c7e0cb',
          300: '#9bca1b',
          400: '#75ab6b',
          500: '#558d4d',
          600: '#41703a',
          700: '#345930',
          800: '#2b4728',
          900: '#243a22',
          950: '#111f10',
        },
        neutral: {
          50: '#f8f9fa',
          100: '#f1f3f5',
          200: '#e9ecef',
          800: '#343a40',
          900: '#212529',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'apple': '0 4px 24px rgba(0,0,0,0.06)',
      }
    },
  },
  plugins: [],
}
