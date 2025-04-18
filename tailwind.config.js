/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './vueform.config.js', // or where `vueform.config.js` is located
    './node_modules/@vueform/vueform/themes/tailwind/**/*.vue',
    './node_modules/@vueform/vueform/themes/tailwind/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        muted: {
          50: 'rgb(248, 250, 252)',
          100: 'rgb(241, 245, 249)',
          200: 'rgb(226, 232, 240)',
          300: 'rgb(203, 213, 225)',
          400: 'rgb(148, 163, 184)',
          500: 'rgb(100, 116, 139)',
          600: 'rgb(71, 85, 105)',
          700: 'rgb(51, 65, 85)',
          800: 'rgb(30, 41, 59)',
          900: 'rgb(15, 23, 42)',
          950: 'rgb(2, 6, 23)'
        },
        primary: {
          50: 'rgb(245, 243, 255)',
          100: 'rgb(237, 233, 254)',
          200: 'rgb(221, 214, 254)',
          300: 'rgb(196, 181, 253)',
          400: 'rgb(167, 139, 250)',
          500: 'rgb(139, 92, 246)',
          600: 'rgb(124, 58, 237)',
          700: 'rgb(109, 40, 217)',
          800: 'rgb(91, 33, 182)',
          900: 'rgb(76, 29, 149)',
          950: 'rgb(46, 16, 101)'
        }
      }
    }
  },
  plugins: [require('@vueform/vueform/tailwind')]
}
