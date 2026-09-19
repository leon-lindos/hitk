/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 驭火朱墨主色
        primary: {
          50: '#fbf1ed',
          100: '#f6ddd6',
          200: '#edb8aa',
          300: '#df8975',
          400: '#cb5b47',
          500: '#b63a2b',
          600: '#9d3025',
          700: '#81281f',
          800: '#67231d',
          900: '#54221d',
          950: '#2d100d'
        },
        gray: {
          50: '#f4f0e8',
          100: '#ebe6dc',
          200: '#d9d5cb',
          300: '#c4bfb4',
          400: '#9c968b',
          500: '#61665e',
          600: '#4a4f48',
          700: '#353a36',
          800: '#282c29',
          900: '#242725',
          950: '#1e211f'
        },
        accent: {
          50: '#f4f0e8',
          100: '#ebe6dc',
          200: '#d9d5cb',
          300: '#c4bfb4',
          400: '#9c968b',
          500: '#61665e',
          600: '#4a4f48',
          700: '#353a36',
          800: '#282c29',
          900: '#242725',
          950: '#1e211f'
        },
        dark: {
          50: '#f4f0e8',
          100: '#ebe6dc',
          200: '#d9d5cb',
          300: '#b9beb5',
          400: '#8b9189',
          500: '#6a7068',
          600: '#545a54',
          700: '#3d4340',
          800: '#282c29',
          900: '#1e211f',
          950: '#161916'
        }
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'PingFang SC',
          'Hiragino Sans GB',
          'Microsoft YaHei',
          'sans-serif'
        ],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.08)',
        'glass-sm': '0 4px 16px rgba(0, 0, 0, 0.06)',
        glow: '0 0 20px rgba(182, 58, 43, 0.18)',
        'glow-lg': '0 0 40px rgba(182, 58, 43, 0.22)',
        card: '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 40px rgba(0, 0, 0, 0.08)',
        'inner-glow': 'inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #b63a2b 0%, #81281f 100%)',
        'gradient-dark': 'linear-gradient(135deg, #282c29 0%, #1e211f 100%)',
        'gradient-glass':
          'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'mesh-gradient':
          'radial-gradient(at 40% 20%, rgba(182, 58, 43, 0.06) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(182, 58, 43, 0.04) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(36, 39, 37, 0.04) 0px, transparent 50%)'
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s linear infinite',
        glow: 'glow 2s ease-in-out infinite alternate'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(182, 58, 43, 0.18)' },
          '100%': { boxShadow: '0 0 30px rgba(182, 58, 43, 0.28)' }
        }
      },
      backdropBlur: {
        xs: '2px'
      },
      borderRadius: {
        '4xl': '2rem'
      }
    }
  },
  plugins: []
}
