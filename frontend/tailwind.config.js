/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Palette Markyn — source unique. Modifier ici si la charte change.
        primary: "#314044",
        accent: "#4cc5c4",
        light: "#e1e2e3",
        pause: "#f59e0b",
        danger: "#ef4444",
      },
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
