/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins'],
        Oswald: ['Oswald', 'sans-serif'],
        playlist: ['Playlist', 'cursive'],
        signature: ["'Great Vibes'", "cursive"],
      },
    },
  },
  plugins: [],
}

