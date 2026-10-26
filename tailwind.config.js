/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: '#253B32',
        brand: '#3E8248',
        bright: '#F0B83F',
        orange: '#C95D2A',
        ink: '#0D1B2A',
        canvas: '#FFFAF1',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
