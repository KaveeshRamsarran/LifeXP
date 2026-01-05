import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Fantasy palette
        gold: {
          DEFAULT: '#ffd700',
          light: '#ffe55c',
          dark: '#b8860b',
        },
        ember: {
          DEFAULT: '#ff6b35',
          light: '#ff8c5a',
        },
        crimson: '#dc143c',
        jade: {
          DEFAULT: '#00d98b',
          light: '#50ffc0',
        },
        mystic: {
          DEFAULT: '#9d4edd',
          light: '#c77dff',
        },
        azure: {
          DEFAULT: '#00b4d8',
          light: '#48cae4',
        },
        // Legacy
        primary: '#ffd700',
        secondary: '#ff6b35',
        accent: '#9d4edd',
        background: '#0f0c19',
        surface: '#1e1432',
        text: '#f8fafc',
        muted: '#94a3b8',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'bounce-in': 'bounce-in 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
        'spin-slow': 'spin-slow 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 215, 0, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 215, 0, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'fantasy-gradient': 'linear-gradient(135deg, rgba(30, 20, 50, 0.9) 0%, rgba(40, 25, 60, 0.9) 100%)',
      },
    },
  },
  plugins: [],
};
export default config;
