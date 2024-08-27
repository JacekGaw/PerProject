/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "black-blue": "#070F1B",
        "darkest-blue": "#0C1A2E",
        "dark-blue": "#102543",
        "normal-blue": "#315993",
        "light-blue": "#B8C8DF",
        "vibrant-orange": "#fc4545",
        "normal-orange": "#e0942e",
        "light-orange": "#E6A957"
      }
    },
  },
  plugins: [],
}