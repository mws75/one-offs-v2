import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    colors: {
      codeGrey: "#282C34",
      purple: "#3f3cbb",
    },
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;
