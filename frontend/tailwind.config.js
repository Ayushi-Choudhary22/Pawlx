/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          dark: '#1D4ED8',
          light: '#DBEAFE',
        },
        secondary: {
          DEFAULT: '#10B981',
          dark: '#059669',
          light: '#D1FAE5',
        },
        accent: {
          DEFAULT: '#F97316',
          dark: '#EA580C',
          light: '#FFEDD5',
        },
        surface: '#FAFAFA',
        card: '#FFFFFF',
        ink: {
          DEFAULT: '#1F2937',
          muted: '#6B7280',
        },
        border: '#E5E7EB',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        cardHover: '0 4px 12px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};
