/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: '#0A2048',
        brand: '#00B5C8',
        bright: '#24D2DF',
        orange: '#3D68F5',
        ink: '#0D1B2A',
        canvas: '#F2F8FA',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
