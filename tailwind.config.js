/** @type {import('tailwindcss').Config} */
module.exports = {

  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-skeleton' :'linear-gradient(to left , transparent, rgba(255,255,255,0.5),transparent)',
      },
      background : {
        'faint05Black' : 'rgba(0, 0, 0, 0.05)',
        'faint07Black' : 'rgba(0, 0, 0, 0.07)',
        'faint10Black' : 'rgba(0, 0, 0, 0.1)',
        'black' : '#0f0f0f',
        'white' : '#f1f1f1',
      },
      animation : {
        'skeleton' : 'skeletonLoading 1s infinite',
      },
      keyframes : {
        skeletonLoading : {
          '0%' : {transform : 'translateX(0%)'},
          '100%' : {transform : 'translateX(100%)'}
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      }
    },
  },
  plugins: [],
}
