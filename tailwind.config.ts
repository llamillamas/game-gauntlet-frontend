import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'gg-bg': 'rgb(var(--gg-bg) / <alpha-value>)',
        'gg-surface': 'rgb(var(--gg-surface) / <alpha-value>)',
        'gg-card': 'rgb(var(--gg-card) / <alpha-value>)',
        'gg-border': 'rgb(var(--gg-border) / <alpha-value>)',
        'gg-primary': 'rgb(var(--gg-primary) / <alpha-value>)',
        'gg-secondary': 'rgb(var(--gg-secondary) / <alpha-value>)',
        'gg-accent': 'rgb(var(--gg-accent) / <alpha-value>)',
        'gg-success': 'rgb(var(--gg-success) / <alpha-value>)',
        'gg-error': 'rgb(var(--gg-error) / <alpha-value>)',
        'gg-warning': 'rgb(var(--gg-warning) / <alpha-value>)',
        'gg-text': 'rgb(var(--gg-text) / <alpha-value>)',
        'gg-muted': 'rgb(var(--gg-muted) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      animation: {
        'spin': 'spin 1s linear infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-scale': 'fadeInScale 0.4s ease-out',
        'slide-in-left': 'slideInLeft 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'slide-in-up': 'slideInUp 0.4s ease-out',
        'slide-in-down': 'slideInDown 0.4s ease-out',
        'float-up': 'floatUp 6s ease-in-out infinite',
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
        'bounce-in': 'bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'counter': 'counter 1s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInScale: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        floatUp: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 5px rgb(var(--gg-primary)), 0 0 10px rgb(var(--gg-primary))' },
          '50%': { boxShadow: '0 0 20px rgb(var(--gg-primary)), 0 0 30px rgb(var(--gg-primary))' },
        },
        counter: {
          '0%': { '--tw-num': '0' },
          '100%': { '--tw-num': 'var(--tw-target)' },
        },
      },
      transitionTimingFunction: {
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(233, 69, 96, 0.3)',
        'glow-success': '0 0 20px rgba(0, 210, 106, 0.3)',
        'glow-accent': '0 0 20px rgba(245, 166, 35, 0.3)',
      },
    },
  },
  plugins: [],
}

export default config
