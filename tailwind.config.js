/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'poker-red': '#dc2626',
        'poker-black': '#1f2937',
        'poker-green': '#059669',
        'poker-gold': '#fbbf24',
      },
      fontFamily: {
        'poker': ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
