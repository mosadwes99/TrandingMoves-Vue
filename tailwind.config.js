/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  daisyui: {
    themes: ["light"],
  },
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        pramiary: "#c11119",
        third: "#151515",
        secondary: "#ffb921",
        fourth: "#242a36",
      },
    },
  },
  plugins: [require("daisyui")],
};
