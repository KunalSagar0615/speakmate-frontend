/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#38bdf8",
      },
      boxShadow: {
        soft: "0 10px 25px -10px rgb(2 132 199 / 0.35)",
      },
    },
  },
  plugins: [],
};
