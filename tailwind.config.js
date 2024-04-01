/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'smMobile': {'max': '320px'},
      'mobile': {'max': '480px'},
      'notOnMobile': {'min': '481px'},
      
    },
    extend: {},
  },
  plugins: [],
}

