/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dbe6ff",
          200: "#bfd3ff",
          300: "#93b4ff",
          400: "#608aff",
          500: "#3b66ff",
          600: "#2547f5",
          700: "#1d36d8",
          800: "#1e31ae",
          900: "#1f3089",
          950: "#161d52",
        },
        accent: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d6b4fe",
          400: "#bd87fc",
          500: "#a259f7",
          600: "#8b3bee",
          700: "#7528d3",
          800: "#6122ab",
          900: "#511f8b",
        },
        surface: {
          0: "#ffffff",
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
        success: { light: "#dcfce7", DEFAULT: "#22c55e", dark: "#15803d" },
        warning: { light: "#fef9c3", DEFAULT: "#eab308", dark: "#a16207" },
        danger: { light: "#fee2e2", DEFAULT: "#ef4444", dark: "#b91c1c" },
        info: { light: "#dbeafe", DEFAULT: "#3b82f6", dark: "#1d4ed8" },
      },
      fontFamily: {
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
        display: ['"Instrument Sans"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(15 23 42 / 0.04), 0 1px 3px 0 rgb(15 23 42 / 0.03)",
        elevated: "0 4px 12px -2px rgb(15 23 42 / 0.06), 0 2px 6px -2px rgb(15 23 42 / 0.04)",
        float: "0 12px 32px -8px rgb(15 23 42 / 0.12), 0 4px 12px -4px rgb(15 23 42 / 0.06)",
        modal: "0 24px 48px -12px rgb(15 23 42 / 0.25), 0 12px 24px -8px rgb(15 23 42 / 0.1)",
        glow: "0 0 0 4px rgb(59 102 255 / 0.1), 0 4px 16px -2px rgb(59 102 255 / 0.25)",
        "glow-sm": "0 0 0 3px rgb(59 102 255 / 0.08)",
        "inner-border": "inset 0 0 0 1px rgb(255 255 255 / 0.08)",
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #2547f5 0%, #8b3bee 100%)",
        "gradient-brand-soft": "linear-gradient(135deg, #eef4ff 0%, #f3e8ff 100%)",
        "gradient-mesh":
          "radial-gradient(at 20% 0%, rgb(219 230 255 / 0.7) 0px, transparent 50%), radial-gradient(at 80% 0%, rgb(233 213 255 / 0.5) 0px, transparent 50%), radial-gradient(at 0% 50%, rgb(219 230 255 / 0.4) 0px, transparent 50%)",
        "gradient-auth":
          "radial-gradient(at 25% 15%, rgb(96 138 255 / 0.25) 0px, transparent 50%), radial-gradient(at 75% 85%, rgb(189 135 252 / 0.22) 0px, transparent 50%), radial-gradient(at 50% 50%, rgb(255 255 255 / 0.6) 0px, transparent 50%)",
        "grid-pattern":
          "linear-gradient(to right, rgb(226 232 240 / 0.5) 1px, transparent 1px), linear-gradient(to bottom, rgb(226 232 240 / 0.5) 1px, transparent 1px)",
      },
      animation: {
        "slide-in": "slideIn 0.25s ease-out",
        "fade-in": "fadeIn 0.3s ease-out",
        "scale-in": "scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-up": "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        shimmer: "shimmer 2s linear infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        slideIn: {
          "0%": { transform: "translateX(-8px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.96)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
