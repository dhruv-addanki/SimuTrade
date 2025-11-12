module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0f172a",
          light: "#1f2937",
          accent: "#38bdf8",
          glow: "#c084fc",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        glow: "0 25px 70px rgba(15,23,42,0.45)",
        card: "0 20px 35px rgba(2,6,23,0.35)",
      },
      backgroundImage: {
        "grid-pattern":
          "radial-gradient(circle at 1px 1px, rgba(148,163,184,0.15) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};
