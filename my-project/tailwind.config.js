const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        themeColor100: "#5356FF",
        themeColor75: "#378CE7",
        themeColor50: "#67C6E3",
        themeColor25: "#DFF5FF",
      }
    },
  },
  plugins: [],
});