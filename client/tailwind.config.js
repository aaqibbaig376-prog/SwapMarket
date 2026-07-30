/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#10B981', // Emerald green for sustainability vibe
        secondary: '#4F46E5', // Indigo
        dark: '#1F2937',
        light: '#F3F4F6'
      }
    },
  },
  plugins: [],
}
