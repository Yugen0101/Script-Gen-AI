'use client'

import { createClient } from '@/lib/supabase/client'
import { LogOut, User } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'

export default function Header() {
    const router = useRouter()
    const pathname = usePathname()
    const supabase = createClient()
    const [showMenu, setShowMenu] = useState(false)
    const [user, setUser] = useState<any>(null)

    // Check for user session on mount
    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setUser(session?.user || null)
        }
        checkUser()
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        setUser(null)
        router.push('/login')
        router.refresh()
    }

    // Hide Header on Login page
    if (pathname === '/login') return null

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200 dark:border-white/10 bg-white dark:bg-[#0B1120] backdrop-blur-xl"
        >
            <div className="container mx-auto px-4 lg:px-6 h-16 sm:h-20 flex items-center justify-between">
                {/* 1. Logo Section (Left) */}
                <button
                    onClick={() => router.push('/')}
                    className="flex items-center gap-3 hover:opacity-80 smooth-transition group"
                >
                    <Logo className="w-9 h-9 sm:w-10 sm:h-10" />
                    <span className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-white dark:to-white/90">
                        ScriptGo
                    </span>
                </button>

                {/* 2. Actions Section (Right) */}
                <div className="flex items-center gap-4 sm:gap-6">
                    {/* Theme Toggle */}
                    <ThemeToggle />

                    {user ? (
                        // Logged In State
                        <div className="relative">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 smooth-transition border border-transparent hover:border-zinc-200 dark:hover:border-white/5"
                            >
                                <User className="w-5 h-5 text-zinc-600 dark:text-blue-400" />
                                <span className="hidden sm:inline font-medium text-sm text-zinc-700 dark:text-zinc-200">Account</span>
                            </button>

                            {showMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1A202C] rounded-xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-white/10"
                                >
                                    <button
                                        onClick={() => router.push('/dashboard')}
                                        className="w-full px-4 py-3 flex items-center gap-2 hover:bg-zinc-50 dark:hover:bg-white/5 smooth-transition text-left text-sm text-zinc-700 dark:text-zinc-200"
                                    >
                                        <div className="w-4 h-4">🚀</div>
                                        Dashboard
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-3 flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-500/10 smooth-transition text-left text-sm text-red-500"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    ) : (
                        // Logged Out State (Exact Match to Screenshot)
                        <div className="flex items-center gap-2 sm:gap-4">
                            {/* "Log In" - Ghost Text Button */}
                            <button
                                onClick={() => router.push('/login')}
                                className="px-3 py-2 text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white smooth-transition"
                            >
                                Log In
                            </button>

                            {/* "Get Started" - Solid Blue Button */}
                            <button
                                onClick={() => router.push('/login?signup=true')}
                                className="px-5 py-2.5 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 smooth-transition transform hover:-translate-y-0.5 active:translate-y-0"
                            >
                                Get Started
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </motion.header >
    )
}
