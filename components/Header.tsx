'use client'

import { createClient } from '@/lib/supabase/client'
import { LogOut, User, Key } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Logo from './Logo'
import { ThemeToggle } from './ThemeToggle'

export default function Header() {
    const router = useRouter()
    const pathname = usePathname()
    const supabase = createClient()
    const [showMenu, setShowMenu] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Check for user session on mount and listen for changes
    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setUser(session?.user || null)
        }
        checkUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
            setUser(session?.user || null)
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement
            // Check if click is outside the dropdown menu
            if (showMenu && !target.closest('.account-dropdown')) {
                setShowMenu(false)
            }
        }

        if (showMenu) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [showMenu])

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
            initial={{ y: -100, opacity: 0, x: '-50%' }}
            animate={{ y: 0, opacity: 1, x: '-50%' }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className={`fixed top-6 sm:top-8 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl ${mounted ? 'z-[101]' : 'z-50'}`}
        >
            <div className="glass-premium rounded-full px-6 sm:px-10 py-2.5 sm:py-3.5 flex items-center justify-between shadow-premium">
                {/* 1. Logo Section (Left) - Editorial Style */}
                <button
                    onClick={() => router.push('/')}
                    className="flex items-center gap-2.5 hover:opacity-80 transition-opacity duration-500 group"
                >
                    <div className="relative">
                        <Logo className="w-9 h-9 sm:w-11 sm:h-11" />
                        <div className="absolute -inset-1 bg-blue-500/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-xl sm:text-2xl font-black tracking-tight text-white/95">
                        Script <span className="text-blue-400">GO</span>
                    </span>
                </button>

                {/* Middle Navigation - Creative Minimalist */}
                <nav className="hidden md:flex items-center gap-10">
                    {[
                        { name: 'Home', href: '/' },
                        { name: 'Dashboard', href: '/dashboard' },
                        { name: 'Script Workspace', href: '/editor' }
                    ].map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`nav-link-bespoke group ${pathname === link.href ? 'nav-link-active' : ''}`}
                        >
                            <span className="relative z-10 font-bold tracking-wide text-[13px] uppercase">
                                {link.name}
                            </span>
                            {pathname === link.href && (
                                <motion.div
                                    layoutId="living-indicator"
                                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.8)]"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </Link>
                    ))}
                </nav>

                {/* 2. Actions Section (Right) - Hand-crafted Buttons */}
                <div className="flex items-center gap-4">
                    <div className="hidden sm:block opacity-60 hover:opacity-100 transition-opacity">
                        <ThemeToggle />
                    </div>

                    {user ? (
                        // Logged In State - Boutique Account Control
                        <div className="relative account-dropdown">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="group flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/5 hover:border-white/10 bg-white/5 hover:bg-white/[0.08] transition-all duration-300 active:scale-95"
                            >
                                <div className="p-1 rounded-full bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                                    <User className="w-4 h-4" />
                                </div>
                                <span className="hidden sm:inline font-bold text-[13px] tracking-wide text-zinc-300 group-hover:text-white uppercase">
                                    {user.user_metadata?.username || user.email?.split('@')[0] || 'Account'}
                                </span>
                            </button>

                            {showMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className="absolute right-0 mt-5 w-52 bg-white dark:bg-[#0B1120] border border-zinc-200/20 dark:border-white/10 rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] backdrop-blur-3xl overflow-hidden z-[100]"
                                >
                                    <button
                                        onClick={() => router.push('/update-password')}
                                        className="w-full px-5 py-3.5 flex items-center gap-2.5 hover:bg-zinc-100 dark:hover:bg-white/5 transition-all text-left text-[13px] font-bold text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white uppercase tracking-wider group/item"
                                    >
                                        <div className="p-1 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover/item:scale-110 transition-transform">
                                            <Key className="w-3.5 h-3.5" />
                                        </div>
                                        <span>Change Password</span>
                                    </button>

                                    <div className="h-[1px] bg-zinc-200/50 dark:bg-white/5 mx-4" />

                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-5 py-3.5 flex items-center gap-2.5 hover:bg-red-500/5 transition-all text-left text-[13px] font-bold text-red-500 dark:text-red-400/80 hover:text-red-600 dark:hover:text-red-400 uppercase tracking-wider"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    ) : (
                        // Logged Out State - "Liquid Solid" Premium Controls
                        <div className="flex items-center gap-4">
                            <button className="px-5 py-2.5 text-[13px] font-bold text-zinc-400 hover:text-white uppercase tracking-widest transition-all duration-300"
                                onClick={() => router.push('/login')}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => router.push('/login?signup=true')}
                                className="btn-bespoke-white text-[13px] tracking-tighter"
                            >
                                Join now
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </motion.header >
    )
}
