import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0F0F0F",
        primary: "#E879F9",
        "primary-dark": "#A855F7",
        success: "#10B981",
        danger: "#EF4444",
        warning: "#F59E0B",
        gray: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          850: "#1A1A1A",
          900: "#111827",
          950: "#0F0F0F",
        },
      },
      backgroundImage: {
        'gradient-purple': 'linear-gradient(135deg, #E879F9 0%, #A855F7 100%)',
        'gradient-green': 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
