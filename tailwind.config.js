const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  mode: 'jit',
  content: [
    "./src/**/*.{html,scss,ts}",
  ],
  important: true,
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      }
    }
  },
  plugins: [
    require('@tailwindcss/container-queries')
  ],
}