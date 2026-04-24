export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0A0A0F',
        surface: '#111118',
        'surface-2': '#16161F',
        border: '#1E1E2E',
        accent: '#6366F1',
        'accent-dim': '#4F46E5',
        teal: '#14B8A6',
        'teal-dim': '#0D9488',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#F43F5E',
        't1': '#F8F8FF',
        't2': '#94949F',
        't3': '#44444F',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:   { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp:  { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        pulseDot: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.3 } },
      },
    },
  },
};
