import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy:     '#0E1B2E',
        ivory:    '#F5F0E8',
        gold:     '#C8A96A',
        steel:    '#8A9BAE',
        linen:    '#E8E0D5',
        charcoal: '#2C2C2A',
      },
      fontFamily: {
        cormorant: ['var(--font-cormorant)', 'serif'],
        sans:      ['var(--font-dm-sans)', 'sans-serif'],
      },
      borderWidth: {
        DEFAULT: '0.5px',
        '0.5': '0.5px',
      },
      letterSpacing: {
        widest: '0.18em',
        wider: '0.15em',
        wide: '0.12em',
      },
      lineHeight: {
        tightest: '1.05',
        tight: '1.1',
        snug: '1.2',
        normal: '1.3',
        relaxed: '1.6',
        loose: '1.8',
      },
      aspectRatio: {
        '4/5': '4 / 5',
      },
    },
  },
  plugins: [],
}

export default config
