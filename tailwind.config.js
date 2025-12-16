/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Nasza paleta "SpelnioneMarzenie":
        brand: {
          dark: '#0f172a',  // Ciemne indygo (tło logo)
          primary: '#3730a3', // Jaśniejsze indygo (akcenty)
          gold: '#fbbf24',  // Złoto (gwiazda/wstążka)
          light: '#f1f5f9', // Szary błękit (tło strony)
          text: '#334155',  // Ciemny szary (tekst czytelny)
        }
      },
    },
  },
  plugins: [],
}