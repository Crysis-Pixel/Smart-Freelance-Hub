/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        greenPrimary: '#0B9625', 
        greenSecondary: '#8CB700',
        grey: '#D9D9D9',
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        mytheme: {

        },
      },
    ],
    darkTheme: false,
  },
}
