/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#070b16',
          panel: '#0f1729',
          panel2: '#141d34',
          border: '#22304b',
          glow: '#2a3d63'
        },
        brand: {
          teal: '#2dd4bf',
          indigo: '#6366f1',
          violet: '#8b5cf6',
          amber: '#f59e0b',
          rose: '#f43f5e'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      backgroundImage: {
        'mesh-1': 'radial-gradient(at 20% 20%, rgba(99,102,241,0.35) 0px, transparent 55%), radial-gradient(at 80% 10%, rgba(45,212,191,0.25) 0px, transparent 50%), radial-gradient(at 50% 90%, rgba(244,63,94,0.18) 0px, transparent 55%)',
        'card-sheen': 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 60%)'
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(99,102,241,0.25), 0 8px 30px -8px rgba(99,102,241,0.35)',
        'glow-teal': '0 0 0 1px rgba(45,212,191,0.25), 0 8px 30px -8px rgba(45,212,191,0.35)',
        'glow-rose': '0 0 0 1px rgba(244,63,94,0.3), 0 8px 30px -8px rgba(244,63,94,0.4)'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' }
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '50%': { transform: 'translateY(-20px) translateX(10px)' }
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: 0.8 },
          '80%, 100%': { transform: 'scale(1.6)', opacity: 0 }
        },
        'gradient-pan': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        },
        dash: {
          to: { strokeDashoffset: -200 }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 10s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'gradient-pan': 'gradient-pan 8s ease infinite',
        dash: 'dash 3s linear infinite',
        shimmer: 'shimmer 2.5s linear infinite'
      }
    }
  },
  plugins: []
};
