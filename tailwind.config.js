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
      keyframes:{
        carregamento: {
          to: { transform: "scaleX(1.25)" },
          from: { transform: "translateY(-12px) scaleX(1)" },
        },
      },
      animation:{
        "carregar-um": "carregamento 450ms alternate infinite",
        "carregar-dois": "carregamento 450ms 150ms alternate infinite",
        "carregar-tres": "carregamento 450ms 300ms alternate infinite",
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

