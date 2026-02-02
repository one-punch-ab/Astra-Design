/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Astra DSM 2.0 colors
        astra: {
          primary: '#173DA6',
          'primary-hover': '#122E82',
          'primary-light': '#F0F4FF',
          secondary: '#007AF5',
        },
        success: {
          DEFAULT: '#10B981',
          light: '#D1FAE5',
          dark: '#059669',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7',
          dark: '#D97706',
        },
        error: {
          DEFAULT: '#EF4444',
          light: '#FEE2E2',
          dark: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      spacing: {
        '4.5': '18px',
      },
      boxShadow: {
        'astra': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'astra-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'astra-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'astra-card': '8px',
        'astra-button': '6px',
        'astra-input': '4px',
      },
    },
  },
  plugins: [],
}
