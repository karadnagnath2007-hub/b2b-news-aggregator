module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'cream-paper': '#fdfbf7',
        'hairline-stone': '#d1d5db',
      },
      fontFamily: {
        header: ['var(--font-header)', 'serif'],
        body: ['var(--font-body)', 'serif'],
      },
    },
  },
  plugins: [],
};
