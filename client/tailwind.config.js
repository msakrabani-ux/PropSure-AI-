/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 700: '#1e3a5f', 800: '#14294a', 900: '#0b1b33' }
      }
    }
  },
  plugins: []
};
