import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gray: {
          50: "var(--gray-50)",
          200: "var(--gray-200)",
          400: "var(--gray-400)",
          600: "var(--gray-600)",
          700: "var(--gray-700)",
          900: "var(--gray-900)",
        },
        pink: {
          50: "var(--pink-50)",
          200: "var(--pink-200)",
          700: "var(--pink-700)",
          900: "var(--pink-900)",
        },
        amber: {
          50: "var(--amber-50)",
          200: "var(--amber-200)",
          700: "var(--amber-700)",
          900: "var(--amber-900)",
        },
        blue: {
          50: "var(--blue-50)",
          200: "var(--blue-200)",
          700: "var(--blue-700)",
          900: "var(--blue-900)",
        },
        red: {
          50: "var(--red-50)",
          200: "var(--red-200)",
          700: "var(--red-700)",
          900: "var(--red-900)",
        },
        green: {
          50: "var(--green-50)",
          200: "var(--green-200)",
          700: "var(--green-700)",
          900: "var(--green-900)",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
