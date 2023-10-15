import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
  content: {
    files: [
      "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/container/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
  },

  blocklist: [],
  theme: {
    screens: {
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
      "2xl": "1400px",
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "0rem",
      },
    },
    colors: {
      "primary-color": "#8c52ff",
      "text-color": "#e5e5e5",
      background: "#F3F3F3",
      "text-light-color": "#999",
      "border-color": "#e5e5e5",
      ...colors,
    },
    extend: {
      spacing: {
        "128": "32rem",
        "144": "36rem",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      screens: {
        "3xl": "1600px",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
  ],
};
export default config;
