/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef2ff",
          500: "#4f46e5",
        },
      },
      boxShadow: {
        smooth: "0 4px 20px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};
