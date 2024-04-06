/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        azure: '#f0ffff',
        darkgreen: '#2f4f4f',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
