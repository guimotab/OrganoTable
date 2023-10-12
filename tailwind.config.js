/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  // corePlugins: {
  //   preflight: false,
  // },
  theme: {
    extend: {
      keyframes: {
        slideLeft: {
          "0%": { transform: "translateX(5px)", opacity: "0" },
          "100%": { transform: "translateX(0px)", opacity: "1" }
        },
      },
      animation: {
        slideLeftIcon: "slideLeft 0.5s 0.2s cubic-bezier(0.250, 0.460, 0.450, 0.940) both",
      },
      left:{
        "60rem": "60rem"
      },
      width:{
        "20rem": "20rem"
      },
      margin:{
        "6.25rem": "6.25rem",
        "21rem": "21rem",
        "25rem": "25rem"
      },
      colors: {
        cor: {
          primaria: '#DBE2EF',
          secundaria: '#3F72AF',
          terciaria: '#112D4E',
          outline: '#011e42',
          hover: '#1355a0',
          erro: "#b92626",
          aside: "#1e344d",
        },
        fontFamily:{
          primaria: ["Work Sans, sans-serif"],
          secundaria: ["Open Sans, sans-serif"]
        }
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif']
      },
    }
  },
  plugins: [],
}

