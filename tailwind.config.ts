import type { Config } from "tailwindcss";

export default {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                // New Royal+Thunder theme colors
                royal: {
                    DEFAULT: "#1e3a8a", // blue-900 like
                    light: "#3b82f6", // blue-500
                },
                thunder: {
                    DEFAULT: "#0ea5e9", // sky-500
                    bright: "#38bdf8", // sky-400
                    glow: "#60a5fa", // blue-400
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
            },
            backgroundImage: {
                'royal-thunder': 'linear-gradient(135deg, #1e3a8a 0%, #0369a1 50%, #38bdf8 100%)',
                'royal-thunder-hover': 'linear-gradient(135deg, #1e40af 0%, #0284c7 50%, #7dd3fc 100%)',
                'mesh-dark': 'radial-gradient(at 0% 0%, hsla(222,47%,11%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(217,91%,60%,0.3) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(199,89%,48%,0.3) 0, transparent 50%)',
            },
            boxShadow: {
                'royal': '0 0 15px rgba(56, 189, 248, 0.3)',
                'royal-hover': '0 0 25px rgba(56, 189, 248, 0.6)',
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            animation: {
                "fade-in": "fadeIn 0.5s ease-in-out",
                "slide-up": "slideUp 0.5s ease-out",
                "pulse-glow": "pulseGlow 2s infinite",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { transform: "translateY(20px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
                pulseGlow: {
                    "0%, 100%": { boxShadow: "0 0 10px rgba(56, 189, 248, 0.5)" },
                    "50%": { boxShadow: "0 0 25px rgba(56, 189, 248, 0.8)" },
                },
            },
        },
    },
    plugins: [],
} satisfies Config;
