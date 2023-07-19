import { type Config } from "tailwindcss";

const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        codeGrey: {
          DEFAULT: "#282C34",
        },
        purple: {
          DEFAULT: "#3f3cbb",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

module.exports = config;

// colors: {
//   codeGrey: "#282C34",
//   purple: "#3f3cbb",
// },
