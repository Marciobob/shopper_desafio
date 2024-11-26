/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fundo': '#0d1723',
        'primary': '#4048bf',
        'gray': '#f1f2f4',
        'secondary': '#514bc3',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'], 
        light: ['Poppins', 'sans-serif'],  
        regular: ['Poppins', 'sans-serif'],
        bold: ['Poppins', 'sans-serif'],
      },
    
    },
  },
  plugins: [],
}

