/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#b02f00",
        "primary-container": "#ff5722",
        secondary: "#1b6d24",
        "secondary-container": "#a0f399",
        surface: "#f9f9ff",
        "surface-container-high": "#dee8ff",
        "surface-container-low": "#ffffff",
        tertiary: "#7e5700",
        error: "#ba1a1a",
        "on-surface": "#1c1b1f",
        "on-surface-variant": "#5c5c66",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      fontSize: {
        "headline-xl": ["2.25rem", { lineHeight: "1.15", fontWeight: "800" }],
        "headline-lg": ["1.75rem", { lineHeight: "1.2", fontWeight: "800" }],
        "headline-md": ["1.375rem", { lineHeight: "1.25", fontWeight: "700" }],
        "body-lg": ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
        "label-lg": ["0.875rem", { lineHeight: "1.4", fontWeight: "700" }],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        card: "0 2px 10px 0 rgb(0 0 0 / 0.06)",
        "card-md": "0 8px 24px -6px rgb(176 47 0 / 0.15)",
      },
    },
  },
  plugins: [],
};
