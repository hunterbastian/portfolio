import type { Config } from 'tailwindcss'

// Keep complete CSS color tokens (hex or oklch) while letting Tailwind 3
// substitute the requested opacity; unmodified utilities use an alpha of 1.
const withOpacity = (token: string) =>
  `color-mix(in srgb, var(${token}) calc(<alpha-value> * 100%), transparent)`

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx}',
    './src/content/**/*.{js,ts,jsx,tsx}',
    './content/**/*.mdx',
  ],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['var(--font-geist-mono)', 'Geist Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        'sans': ['var(--font-geist-mono)', 'Geist Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        'inter': ['var(--font-geist-mono)', 'Geist Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        'header': ['var(--font-geist-pixel-square)', 'Geist Pixel Square', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        'redaction': ['HB Redaction', 'Redaction', 'Redaction 35', 'Georgia', 'serif'],
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
      transitionTimingFunction: {
        soft: 'cubic-bezier(0.16, 1, 0.3, 1)',
        exit: 'cubic-bezier(0.4, 0, 0.7, 0.2)',
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
      // Custom percentages used by existing text, surface, and border utilities.
      opacity: {
        8: '0.08',
        12: '0.12',
        18: '0.18',
        34: '0.34',
        42: '0.42',
        46: '0.46',
        48: '0.48',
        52: '0.52',
        58: '0.58',
        62: '0.62',
        66: '0.66',
        68: '0.68',
        72: '0.72',
        74: '0.74',
        76: '0.76',
        78: '0.78',
        82: '0.82',
        86: '0.86',
        88: '0.88',
        92: '0.92',
        94: '0.94',
      },
      colors: {
        background: withOpacity('--background'),
        foreground: withOpacity('--foreground'),
        card: {
          DEFAULT: withOpacity('--card'),
          foreground: withOpacity('--card-foreground'),
        },
        primary: {
          DEFAULT: withOpacity('--primary'),
          foreground: withOpacity('--primary-foreground'),
        },
        secondary: {
          DEFAULT: withOpacity('--secondary'),
          foreground: withOpacity('--secondary-foreground'),
        },
        muted: {
          DEFAULT: withOpacity('--muted'),
          foreground: withOpacity('--muted-foreground'),
        },
        subtle: {
          foreground: withOpacity('--subtle-foreground'),
        },
        accent: {
          DEFAULT: withOpacity('--accent'),
          foreground: withOpacity('--accent-foreground'),
          subtle: withOpacity('--accent-subtle'),
          muted: withOpacity('--accent-muted'),
          blue: withOpacity('--accent-blue'),
          green: withOpacity('--accent-green'),
        },
        border: withOpacity('--border'),
        input: withOpacity('--input'),
        ring: withOpacity('--ring'),
      },
    },
  },
  plugins: [],
}

export default config
