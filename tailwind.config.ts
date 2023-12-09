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
      ssm: "499px",
      sm: "576px",
      md: "800px",
      lg: "992px",
      xl: "1230px",
      "2xl": "1350px",
    },
    container: {
      center: true,
      // padding: {
      //   DEFAULT: "0rem",
      // },
    },
    colors: {
      "primary-color": "#639df1",
      "secondary-color": "#f22a59",
      "text-color": "#333",
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
        "product-detail": "url('/src/assests/1.jpg')",
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
      keyframes: {
        shine: {
          "100%": {
            left: "125%",
          },
        },
        appear: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
      },
      animation: {
        shine: "shine 0.85s ease",
        appear: "appear 0.8s ease",
      },
      boxShadow: {
        sd: "0 35px 60px -15px rgba(0, 0, 0, 0.3)",
        hd: "0 3px 10px 0 rgba(0,0,0,0.14)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
  ],
};
export default config;
