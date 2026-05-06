/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95"
        },
        neon: {
          purple: "#a855f7",
          pink:   "#ec4899",
          cyan:   "#06b6d4",
          blue:   "#3b82f6"
        },
        dark: {
          950: "#020617",
          900: "#0f172a",
          800: "#1e293b",
          700: "#334155",
          600: "#475569"
        }
      },
      fontFamily: {
        sans: ['"Inter"', '"Segoe UI"', 'system-ui', 'sans-serif']
      },
      backgroundImage: {
        'hero-gradient':   'linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #0f172a 100%)',
        'card-glass':      'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        'btn-gradient':    'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
        'btn-gradient-hover': 'linear-gradient(135deg, #6d28d9 0%, #db2777 100%)',
        'sidebar-gradient':'linear-gradient(180deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
        'orb-purple':      'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
        'orb-pink':        'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)',
        'orb-cyan':        'radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)'
      },
      boxShadow: {
        'card':       '0 4px 24px rgba(0,0,0,0.4)',
        'elevated':   '0 12px 40px rgba(0,0,0,0.5)',
        'glow-purple':'0 0 30px rgba(139,92,246,0.4)',
        'glow-pink':  '0 0 30px rgba(236,72,153,0.4)',
        'glow-cyan':  '0 0 30px rgba(6,182,212,0.4)',
        'glow-sm':    '0 0 15px rgba(139,92,246,0.3)',
        'inner-glass':'inset 0 1px 0 rgba(255,255,255,0.1)'
      },
      animation: {
        'fade-in':      'fadeIn 0.5s ease-out',
        'slide-up':     'slideUp 0.5s ease-out',
        'slide-in-left':'slideInLeft 0.3s ease-out',
        'float':        'float 6s ease-in-out infinite',
        'pulse-slow':   'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'gradient-x':   'gradientX 8s ease infinite',
        'glow-pulse':   'glowPulse 3s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideInLeft: {
          '0%':   { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' }
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' }
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(139,92,246,0.3)' },
          '50%':      { boxShadow: '0 0 40px rgba(139,92,246,0.6)' }
        }
      },
      backdropBlur: {
        xs: '2px'
      }
    }
  },
  plugins: []
};
