/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {
    colors: {
      ink: '#0b1220',
      panel: '#111b2c',
      panel2: '#162338',
      mint: '#39d6b0',
      muted: '#93a4bb'
    },
    boxShadow: { glow: '0 0 40px rgba(57,214,176,.08)' }
  }},
  plugins: []
}
