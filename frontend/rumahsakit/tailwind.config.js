/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        expandDown: {
         '0%': { opacity: 0 },
     
          
          '100%': {  opacity: 1 },
        },
        
      },
      animation: {
        slideDown: 'slideDown 0.3s ease-out',
        expandDown: 'expandDown 1s forwards ease', // Change to forwards
      },
      transformOrigin: {
        'top': '0', // Adding custom transform origin
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        playwrite:['"Playwrite US Trad"', 'cursive'],
      },
    },
  },
  plugins: [],
}
