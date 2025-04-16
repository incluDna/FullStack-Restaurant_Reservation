/** @type {import('tailwindcss').Config} */
const colorClasses = [
  '#FFECAD', 
  'gray-100'
];
module.exports = {
  purge:{
    content: [
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}'
    ],
    safelist: [
      ...colorClasses.map((color) => `bg-${color}`)
    ]
  },
  theme: {
    extend: {},
  },
  plugins: [],
};

