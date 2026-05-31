/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['ui-monospace', 'monospace'],
      },
      colors: {
        vault: {
          bg: '#141414',
          surface: '#181818',
          card: '#232323',
          border: '#333333',
          accent: '#E50914',
          'accent-dim': '#B81D24',
          glow: '#ff1a22',
          text: '#ffffff',
          muted: '#b3b3b3',
          anime: '#ff6b9d',
          movie: '#ffd166',
          series: '#06d6a0',
          danger: '#E50914',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        shimmer: 'shimmer 1.5s infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { from: { opacity: '0', transform: 'scale(0.95)' }, to: { opacity: '1', transform: 'scale(1)' } },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glow: {
          from: { boxShadow: '0 0 10px #E5091433' },
          to: { boxShadow: '0 0 25px #E5091455, 0 0 50px #E5091422' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'card-shimmer': 'linear-gradient(90deg, transparent, rgba(229, 9, 20, 0.06), transparent)',
      },
    },
  },
  plugins: [],
};
