import tailwindAnimate from 'tailwindcss-animate';
import containerQuery from '@tailwindcss/container-queries';

export default {
    darkMode: ['class'],
    content: [
        './index.html',
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
        './node_modules/streamdown/dist/**/*.js'
    ],
    safelist: ['border', 'border-border'],
    prefix: '',
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px'
            }
        },
        extend: {
            colors: {
                border: 'hsl(var(--border))',
                borderColor: {
                    border: 'hsl(var(--border))'
                },
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
                'islamic-teal': 'hsl(var(--islamic-teal))',
                'islamic-gold': 'hsl(var(--islamic-gold))',
                'islamic-green': 'hsl(var(--islamic-green))',
                'islamic-cream': 'hsl(var(--islamic-cream))',
                'islamic-pattern': 'hsl(var(--islamic-pattern))',
                sidebar: {
                    DEFAULT: 'hsl(var(--sidebar-background))',
                    background: 'hsl(var(--sidebar-background))',
                    foreground: 'hsl(var(--sidebar-foreground))',
                    primary: 'hsl(var(--sidebar-primary))',
                    'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
                    accent: 'hsl(var(--sidebar-accent))',
                    'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
                    border: 'hsl(var(--sidebar-border))',
                    ring: 'hsl(var(--sidebar-ring))'
                },
                chart: {
                    '1': 'hsl(var(--chart-1))',
                    '2': 'hsl(var(--chart-2))',
                    '3': 'hsl(var(--chart-3))',
                    '4': 'hsl(var(--chart-4))',
                    '5': 'hsl(var(--chart-5))'
                }
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            backgroundImage: {
                'gradient-primary': 'var(--gradient-primary)',
                'gradient-card': 'var(--gradient-card)',
                'gradient-background': 'var(--gradient-background)'
            },
            boxShadow: {
                card: 'var(--shadow-card)',
                hover: 'var(--shadow-hover)',
                'luxury': '0 2px 4px rgba(0, 0, 0, 0.04), 0 8px 16px rgba(0, 0, 0, 0.06), 0 16px 32px rgba(0, 0, 0, 0.08), 0 32px 64px rgba(0, 0, 0, 0.12)',
                'glow': '0 0 30px rgba(23, 162, 184, 0.4), 0 0 60px rgba(23, 162, 184, 0.3)',
                'neon': '0 0 20px rgba(23, 162, 184, 0.5), 0 0 40px rgba(23, 162, 184, 0.4), inset 0 0 20px rgba(23, 162, 184, 0.1)',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' }
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' }
                },
                'fade-in': {
                    from: { opacity: '0', transform: 'translateY(10px)' },
                    to: { opacity: '1', transform: 'translateY(0)' }
                },
                'slide-in': {
                    from: { opacity: '0', transform: 'translateX(-20px)' },
                    to: { opacity: '1', transform: 'translateX(0)' }
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' }
                },
                'scale-in': {
                    from: { opacity: '0', transform: 'scale(0.9)' },
                    to: { opacity: '1', transform: 'scale(1)' }
                },
                'shimmer': {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' }
                },
                'glow': {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(23, 162, 184, 0.3)' },
                    '50%': { boxShadow: '0 0 40px rgba(23, 162, 184, 0.6), 0 0 60px rgba(23, 162, 184, 0.4)' }
                }
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'fade-in': 'fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                'slide-in': 'slide-in 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                'float': 'float 6s ease-in-out infinite',
                'scale-in': 'scale-in 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                'shimmer': 'shimmer 2s linear infinite',
                'glow': 'glow 3s ease-in-out infinite',
                'slide-up': 'slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                'scale-bounce': 'scale-bounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                'rotate-in': 'rotate-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                'fade-blur': 'fade-blur 0.8s ease-out',
                'bounce-slow': 'bounce 3s infinite',
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
            },
            backdropBlur: {
                xs: '2px',
            },
            transitionTimingFunction: {
                'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
            }
        }
    },
    plugins: [
        tailwindAnimate,
        containerQuery,
        function ({ addUtilities }) {
            addUtilities(
                {
                    '.border-t-solid': { 'border-top-style': 'solid' },
                    '.border-r-solid': { 'border-right-style': 'solid' },
                    '.border-b-solid': { 'border-bottom-style': 'solid' },
                    '.border-l-solid': { 'border-left-style': 'solid' },
                    '.border-t-dashed': { 'border-top-style': 'dashed' },
                    '.border-r-dashed': { 'border-right-style': 'dashed' },
                    '.border-b-dashed': { 'border-bottom-style': 'dashed' },
                    '.border-l-dashed': { 'border-left-style': 'dashed' },
                    '.border-t-dotted': { 'border-top-style': 'dotted' },
                    '.border-r-dotted': { 'border-right-style': 'dotted' },
                    '.border-b-dotted': { 'border-bottom-style': 'dotted' },
                    '.border-l-dotted': { 'border-left-style': 'dotted' },
                },
                ['responsive']
            );
        },
    ],
};
