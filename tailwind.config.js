/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Tu na razie pusto. Będziemy korzystać z domyślnych klas:
      // bg-white, bg-gray-50, text-gray-800 itd.
    },
  },
  plugins: [],
}