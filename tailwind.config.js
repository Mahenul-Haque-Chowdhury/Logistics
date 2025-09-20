/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1.25rem',
      screens: { '2xl': '1400px' }
    },
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9ecff',
          200: '#b9ddff',
          300: '#8cc9ff',
          400: '#55abff',
          500: '#2a89ff',
          600: '#1065db',
          700: '#0b4db0',
          800: '#0e448d',
          900: '#123a70',
          950: '#0c2547'
        }
      },
      fontFamily: {
  sans: ['var(--font-lexend)','var(--font-geist-sans)','system-ui','sans-serif'],
  heading: ['var(--font-lexend)','system-ui','sans-serif'],
  mono: ['var(--font-geist-mono)','monospace']
      },
      boxShadow: {
        soft: '0 4px 12px -2px rgba(0,0,0,0.08)',
      },
      keyframes: {
        'fade-in': { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        'slide-up': { '0%': { transform: 'translateY(12px)', opacity: 0 }, '100%': { transform: 'translateY(0)', opacity: 1 } }
      },
      animation: {
        'fade-in': 'fade-in .6s ease forwards',
        'slide-up': 'slide-up .6s ease forwards'
      }
    }
  },
  plugins: []
};

