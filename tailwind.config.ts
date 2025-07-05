import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
		theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'space': ['Space Grotesk', 'sans-serif'],
				'jetbrains': ['JetBrains Mono', 'monospace'],
			},
			colors: {
				border: 'hsl(var(--border))',
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
				// Clean theme colors
				bitcoin: 'hsl(var(--bitcoin))',
				lightning: 'hsl(var(--lightning))',
				success: 'hsl(var(--success))',
				info: 'hsl(var(--info))',
				warning: 'hsl(var(--warning))',
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'subtle-bounce': {
					'0%, 100%': { 
						transform: 'translate(0, 0)',
					},
					'50%': { 
						transform: 'translate(-1px, -1px)',
					}
				},
				'slide-up': {
					from: { 
						opacity: '0',
						transform: 'translateY(10px)' 
					},
					to: { 
						opacity: '1',
						transform: 'translateY(0)' 
					}
				},
				'fade-in': {
					from: { 
						opacity: '0'
					},
					to: { 
						opacity: '1'
					}
				},
				'pulse-glow': {
					'0%, 100%': { 
						boxShadow: 'var(--shadow-accent)'
					},
					'50%': { 
						boxShadow: 'var(--shadow-accent), 0 0 20px hsl(var(--accent) / 0.3)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'subtle-bounce': 'subtle-bounce 2s ease-in-out infinite',
				'slide-up': 'slide-up 0.3s ease-out',
				'fade-in': 'fade-in 0.2s ease-out',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite'
			},
			backgroundImage: {
				'gradient-subtle': 'var(--gradient-subtle)',
				'gradient-accent': 'var(--gradient-accent)',
				'gradient-bitcoin': 'var(--gradient-bitcoin)'
			},
			boxShadow: {
				'brutal': 'var(--shadow-brutal)',
				'brutal-hover': 'var(--shadow-brutal-hover)',
				'brutal-sm': 'var(--shadow-brutal-sm)',
				'brutal-accent': 'var(--shadow-accent)',
				'brutal-bitcoin': 'var(--shadow-bitcoin)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;