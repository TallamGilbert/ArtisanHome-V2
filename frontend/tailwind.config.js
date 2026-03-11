/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'artisan': {
          brown: '#6B3E26',
          'brown-light': '#8B5E3C',
          'brown-dark': '#4A2C1A',
          beige: '#F5EFE6',
          cream: '#FAF7F2',
          warm: '#E8DDD0',
          'warm-dark': '#D4C5B0',
          charcoal: '#2C2C2C',
          'gray-soft': '#6B6B6B',
        }
      },
      fontFamily: {
        'display': ['"Cormorant Garamond"', 'Georgia', 'serif'],
        'body': ['"Jost"', 'sans-serif'],
        'accent': ['"Playfair Display"', 'Georgia', 'serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-right': 'slideRight 0.3s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      backgroundImage: {
        'hero-pattern': "url('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1920')",
      }
    },
  },
  plugins: [],
}
