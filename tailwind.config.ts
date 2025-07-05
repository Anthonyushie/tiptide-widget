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
				// Neo Brutalist theme colors
				bitcoin: 'hsl(var(--bitcoin))',
				lightning: 'hsl(var(--lightning))',
				'neon-green': 'hsl(var(--neon-green))',
				'cyber-blue': 'hsl(var(--cyber-blue))',
				'hot-pink': 'hsl(var(--hot-pink))',
				'brutal-purple': 'hsl(var(--brutal-purple))',
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
				'brutal-bounce': {
					'0%, 100%': { 
						transform: 'translate(0, 0)',
						boxShadow: 'var(--shadow-brutal)'
					},
					'50%': { 
						transform: 'translate(-2px, -2px)',
						boxShadow: 'var(--shadow-brutal-hover)'
					}
				},
				'slide-brutal': {
					from: { 
						opacity: '0',
						transform: 'translate(20px, 20px)' 
					},
					to: { 
						opacity: '1',
						transform: 'translate(0, 0)' 
					}
				},
				'counter-brutal': {
					from: { 
						transform: 'scale(0.8) translate(10px, 10px)', 
						opacity: '0' 
					},
					to: { 
						transform: 'scale(1) translate(0, 0)', 
						opacity: '1' 
					}
				},
				'neon-pulse': {
					'0%, 100%': { 
						boxShadow: 'var(--shadow-brutal-neon), 0 0 30px hsl(var(--brutal-purple) / 0.5)'
					},
					'50%': { 
						boxShadow: 'var(--shadow-brutal-neon), 0 0 50px hsl(var(--brutal-purple) / 0.8)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'brutal-bounce': 'brutal-bounce 2s ease-in-out infinite',
				'slide-brutal': 'slide-brutal 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
				'counter-brutal': 'counter-brutal 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
				'neon-pulse': 'neon-pulse 2s ease-in-out infinite'
			},
			backgroundImage: {
				'gradient-brutal': 'var(--gradient-brutal)',
				'gradient-bitcoin': 'var(--gradient-bitcoin)',
				'gradient-neon': 'var(--gradient-neon)'
			},
			boxShadow: {
				'brutal': 'var(--shadow-brutal)',
				'brutal-hover': 'var(--shadow-brutal-hover)',
				'brutal-sm': 'var(--shadow-brutal-sm)',
				'brutal-color': 'var(--shadow-brutal-color)',
				'brutal-neon': 'var(--shadow-brutal-neon)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
