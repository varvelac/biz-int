/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class', // class, 'media' or boolean
  theme: {
    extend: {
      colors: {
				primary: 'rgb(239 68 68 / var(--tw-bg-opacity))',
        gray: {
          900: '#202225',
          800: '#2f3136',
          700: '#36393f',
          600: '#333333',
          400: '#d4d7dc',
          300: '#e3e5e8',
          200: '#ebedef',
          100: '#f2f3f5',
        },
      },
      spacing: {
        88: '22rem',
      },
    },
  },
  plugins: [],
};
