/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#111827',    
          gold: '#D4AF37',    
          gray: '#6B7280',     
          bgLight: '#FAFAFA',  
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'serif'],
      },
      letterSpacing: {
        widest: '0.2em',
        extreme: '0.45em',
      }
    },
  },
  plugins: [],
}
