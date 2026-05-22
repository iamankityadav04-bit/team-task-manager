/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#172033',
        muted: '#657084',
        line: '#E6EAF0',
        brand: '#2563EB',
        mint: '#14B8A6',
        amber: '#F59E0B',
        coral: '#F97373'
      },
      boxShadow: {
        soft: '0 18px 45px rgba(23, 32, 51, 0.08)'
      }
    }
  },
  plugins: []
};
