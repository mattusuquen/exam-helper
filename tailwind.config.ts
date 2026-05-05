import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(40px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-out-left': {
          from: { opacity: '1', transform: 'translateX(0)' },
          to:   { opacity: '0', transform: 'translateX(-40px)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'pop': {
          '0%':   { transform: 'scale(1)' },
          '40%':  { transform: 'scale(0.96)' },
          '70%':  { transform: 'scale(1.03)' },
          '100%': { transform: 'scale(1)' },
        },
        'dot-pop': {
          '0%':   { transform: 'scale(0)', opacity: '0' },
          '60%':  { transform: 'scale(1.4)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'timer-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%':      { transform: 'scale(1.18)' },
        },
        'ripple': {
          '0%':   { transform: 'scale(0)', opacity: '0.5' },
          '100%': { transform: 'scale(3)', opacity: '0' },
        },
        'score-pop': {
          '0%':   { transform: 'scale(0.7)', opacity: '0' },
          '60%':  { transform: 'scale(1.08)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'slide-in-right': 'slide-in-right 0.28s cubic-bezier(0.22, 1, 0.36, 1)',
        'slide-out-left': 'slide-out-left 0.2s ease-in forwards',
        'fade-up':        'fade-up 0.35s ease-out both',
        'pop':            'pop 0.25s ease-out',
        'dot-pop':        'dot-pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'timer-pulse':    'timer-pulse 0.9s ease-in-out infinite',
        'ripple':         'ripple 0.55s ease-out forwards',
        'score-pop':      'score-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both',
      },
    },
  },
  plugins: [],
}

export default config
