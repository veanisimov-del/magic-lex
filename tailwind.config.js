/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b1020",
        accent: {
          50: "#fff6e6",
          200: "#ffd89a",
          400: "#ffab2e",
          500: "#ff9800",
          600: "#ea8400"
        },
        mystic: {
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed"
        }
      },
      boxShadow: {
        glow: "0 0 0 2px rgba(139,92,246,0.3), 0 10px 30px rgba(0,0,0,.45)"
      },
      borderRadius: {
        "2xl": "1.25rem"
      }
    },
  },
  plugins: [],
}
