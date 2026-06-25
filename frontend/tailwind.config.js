/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        kyn: {
          dark: "#314044",
          accent: "#4cc5c4",
          light: "#e1e2e3",
        },
      },
    },
  },
  plugins: [],
};
