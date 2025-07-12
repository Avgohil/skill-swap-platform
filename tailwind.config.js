/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(214.3 31.8% 91.4%)',
        input: 'hsl(214.3 31.8% 91.4%)',
        ring: 'hsl(262.1 83.3% 57.8%)',
        background: 'hsl(0 0% 100%)',
        foreground: 'hsl(224 71.4% 4.1%)',
        primary: {
          DEFAULT: 'hsl(262.1 83.3% 57.8%)',
          foreground: 'hsl(210 20% 98%)',
        },
        secondary: {
          DEFAULT: 'hsl(210 40% 96%)',
          foreground: 'hsl(222.2 84% 4.9%)',
        },
        destructive: {
          DEFAULT: 'hsl(0 84.2% 60.2%)',
          foreground: 'hsl(210 20% 98%)',
        },
        muted: {
          DEFAULT: 'hsl(210 40% 96%)',
          foreground: 'hsl(215.4 16.3% 46.9%)',
        },
        accent: {
          DEFAULT: 'hsl(210 40% 96%)',
          foreground: 'hsl(222.2 84% 4.9%)',
        },
        popover: {
          DEFAULT: 'hsl(0 0% 100%)',
          foreground: 'hsl(224 71.4% 4.1%)',
        },
        card: {
          DEFAULT: 'hsl(0 0% 100%)',
          foreground: 'hsl(224 71.4% 4.1%)',
        },
      },
    },
  },
  plugins: [],
};
