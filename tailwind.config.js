/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        'pink-500': '#E74694',

        'gray-50': '#F9FAFB',
        'gray-900': '#111928',
        'gray-500': '#6B7280',
      },
    },
  },
  plugins: [require('flowbite/plugin')],
}
