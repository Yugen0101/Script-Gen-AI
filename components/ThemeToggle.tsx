"use client"

import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { Sun, Moon } from "lucide-react"
import { useEffect, useState } from "react"

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Avoid hydration mismatch
    useEffect(() => setMounted(true), [])

    if (!mounted) return null

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="relative w-14 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 p-1 smooth-transition overflow-hidden hover:shadow-inner"
            aria-label="Toggle Theme"
        >
            <motion.div
                className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none"
                initial={false}
            >
                <Sun className="w-4 h-4 text-amber-500 opacity-0 dark:opacity-50" />
                <Moon className="w-4 h-4 text-blue-400 opacity-50 dark:opacity-0" />
            </motion.div>

            <motion.div
                layout
                transition={{
                    type: "spring",
                    stiffness: 700,
                    damping: 30
                }}
                className={`w-5 h-5 rounded-full shadow-sm flex items-center justify-center relative z-10 
                    ${theme === 'dark' ? 'bg-[#0B1120] translate-x-6' : 'bg-white translate-x-0'}
                `}
            >
                <motion.div
                    initial={false}
                    animate={{ rotate: theme === 'dark' ? 0 : 180, scale: theme === 'dark' ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <Moon className="w-3 h-3 text-blue-400 fill-blue-400/20" />
                </motion.div>

                <motion.div
                    initial={false}
                    animate={{ rotate: theme === 'dark' ? -180 : 0, scale: theme === 'dark' ? 0 : 1 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <Sun className="w-3 h-3 text-amber-500 fill-amber-500/20" />
                </motion.div>
            </motion.div>
        </button>
    )
}
