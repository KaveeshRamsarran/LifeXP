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
        primary: '#4f46e5', // Indigo 600
        secondary: '#ec4899', // Pink 500
        accent: '#8b5cf6', // Violet 500
        background: '#0f172a', // Slate 900
        surface: '#1e293b', // Slate 800
        text: '#f8fafc', // Slate 50
        muted: '#94a3b8', // Slate 400
      },
    },
  },
  plugins: [],
};
export default config;
