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
        "vibrant-orange": "#962929",
        "normal-orange": "#ff9900",
        "light-orange": "#E6A957",
        "white-blue": "#E4E8EF",
        "lightest-blue": "#C9CFD9",
        "gradient-blue": "#3b82f6",
        "gradient-violet": "#9333ea"
      }
    },
  },
  plugins: [
    '@tailwindcss/typography',
  ],
}