/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin');

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],

  theme: {
    extend: {
      colors: {
        bluee00: '#006ce6',
        blue21: '#215584',
        black34: '#344054',
        grayD8: '#d8dce3',
        grayA3: '#a3aab7'
      },
      fontFamily: {
        Roboto: ['Roboto']
      }
    }
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant('children', '&>*');
    })
    // require('@tailwindcss/custom-forms'),
  ]
};
