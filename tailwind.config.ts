import type { Config } from 'tailwindcss'
// @ts-expect-error -- daisyui has no type declarations
import daisyui from 'daisyui'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['var(--font-geist-pixel-square)', 'Geist Pixel Square', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        'sans': ['var(--font-geist-sans)', 'Geist Sans', 'system-ui', '-apple-system', 'sans-serif'],
        'inter': ['var(--font-geist-sans)', 'Geist Sans', 'system-ui', 'sans-serif'],
      },
      screens: {
        'xs': '375px',      // Extra small phones
        'sm': '640px',      // Small tablets
        'md': '768px',      // Large tablets 
        'lg': '1024px',     // Small desktops
        'xl': '1280px',     // Large desktops
        '2xl': '1536px',    // Extra large desktops
        'tall': { 'raw': '(min-height: 800px)' }, // Tall viewports
        'short': { 'raw': '(max-height: 600px)' }, // Short viewports
        'landscape': { 'raw': '(orientation: landscape)' },
        'portrait': { 'raw': '(orientation: portrait)' },
      },
      fontSize: {
        'sm': ['0.8125rem', { lineHeight: '1.25rem' }],
        'fluid-sm': 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',
        'fluid-base': 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',
        'fluid-lg': 'clamp(1.125rem, 1rem + 0.625vw, 1.25rem)',
        'fluid-xl': 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)',
        'fluid-2xl': 'clamp(1.5rem, 1.3rem + 1vw, 2rem)',
        'fluid-3xl': 'clamp(1.875rem, 1.6rem + 1.375vw, 2.5rem)',
        'fluid-4xl': 'clamp(2.25rem, 2rem + 1.25vw, 3rem)',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      borderRadius: {
        sm: 'var(--box-radius)',
        DEFAULT: 'var(--box-radius)',
        md: 'var(--box-radius)',
        lg: 'var(--box-radius)',
        xl: 'var(--box-radius)',
        '2xl': 'var(--box-radius)',
        '3xl': 'var(--box-radius)',
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: false,
  },
}

export default config
