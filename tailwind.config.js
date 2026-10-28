/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blush: {
          50: '#FDF7F8',
          100: '#FBF0F2',
          200: '#F8DDE2', // Brand Blush
          300: '#F2C3CC',
          400: '#E9A1AD', // Brand Rose
          500: '#D67688',
          600: '#B85065',
        },
        rose: {
          brand: '#E9A1AD',
          dark: '#D47A8A',
        },
        ivory: {
          50: '#FFFFFF',
          100: '#FFFDFB',
          200: '#FFF9F4', // Brand Ivory
          300: '#F9F1E9',
          400: '#EFE3D5',
        },
        gold: {
          100: '#F8F1E1',
          200: '#EFE2C2',
          300: '#E0CB98',
          400: '#D5BA79',
          500: '#C8A45D', // Brand Champagne Gold
          600: '#B08B42',
          700: '#8E6D2F',
        },
        burgundy: {
          50: '#F8EEF0',
          100: '#EBD4D8',
          200: '#D5ACB4',
          300: '#B57482',
          400: '#8A4252',
          500: '#632C3B', // Brand Burgundy
          600: '#52202E',
          700: '#411622',
          800: '#320E18',
          900: '#23070E',
        },
        charcoal: {
          DEFAULT: '#2B1E22',
          light: '#5A4E52',
          muted: '#8A7E82',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Montserrat', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 10px 30px -5px rgba(99, 44, 59, 0.08), 0 4px 12px -2px rgba(200, 164, 93, 0.12)',
        'luxury-hover': '0 20px 40px -10px rgba(99, 44, 59, 0.16), 0 8px 20px -4px rgba(200, 164, 93, 0.22)',
        'gold-glow': '0 0 25px rgba(200, 164, 93, 0.35)',
      }
    },
  },
  plugins: [],
}
