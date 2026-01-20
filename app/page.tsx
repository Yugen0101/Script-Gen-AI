'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo'
import { Settings } from 'lucide-react'

export default function LandingPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-blue-50 dark:from-[#0B1120] dark:via-[#0f172a] dark:to-[#1e293b] relative overflow-hidden">
            {/* Rotating Gears - Decorative Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Left Gear */}
                <motion.div
                    className="absolute -left-20 top-1/4 text-blue-500/10 dark:text-blue-400/10"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                    <Settings size={400} strokeWidth={1} />
                </motion.div>

                {/* Right Gear */}
                <motion.div
                    className="absolute -right-32 bottom-1/4 text-blue-500/10 dark:text-blue-400/10"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                >
                    <Settings size={600} strokeWidth={0.5} />
                </motion.div>
            </div>
            {/* Floating Feather Pen - Background */}
            <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] dark:opacity-[0.08]"
                initial={{ scale: 0.9, rotate: -15 }}
            >
                <Logo className="w-[800px] h-[800px]" />
            </motion.div>

            {/* Main Content */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-4xl mx-auto"
                >
                    {/* Logo */}
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="mb-8 flex justify-center"
                    >
                        <Logo className="w-32 h-32 sm:w-40 sm:h-40" />
                    </motion.div>

                    {/* Brand Name */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-7xl sm:text-9xl md:text-[140px] font-normal mb-6 leading-none"
                        style={{ fontFamily: '"Brush Script MT", "Lucida Handwriting", cursive', letterSpacing: '0.05em' }}
                    >
                        <span className="text-zinc-900 dark:text-white">Script</span>
                        <span className="text-blue-400 dark:text-blue-400">GO</span>
                    </motion.h1>

                    {/* Tagline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        className="text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-600 dark:text-zinc-400 mb-12 tracking-tight"
                    >
                        You think it. We write it.
                    </motion.p>

                    {/* CTA Button */}
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push('/login')}
                        className="px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white text-xl font-bold rounded-2xl shadow-2xl shadow-blue-500/30 transition-all duration-300 hover:shadow-blue-500/50"
                    >
                        Get Started
                    </motion.button>

                </motion.div>
            </div>

            {/* Footer */}
            <motion.footer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="relative z-10 w-full bg-zinc-100 dark:bg-[#0A0F1C] border-t border-zinc-200 dark:border-white/10 py-12 px-4"
            >
                <div className="max-w-7xl mx-auto">
                    {/* Footer Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                        {/* About Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">ABOUT</h3>
                            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                                <li>
                                    <button onClick={() => router.push('/dashboard')} className="hover:text-blue-500 transition-colors">
                                        Contact Us
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => router.push('/dashboard')} className="hover:text-blue-500 transition-colors">
                                        About Us
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => router.push('/dashboard')} className="hover:text-blue-500 transition-colors">
                                        Careers
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => router.push('/dashboard')} className="hover:text-blue-500 transition-colors">
                                        Press
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => router.push('/dashboard')} className="hover:text-blue-500 transition-colors">
                                        Corporate Information
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Services Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">SERVICES</h3>
                            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                                <li>
                                    <button onClick={() => router.push('/dashboard')} className="hover:text-blue-500 transition-colors">
                                        YouTube Scripts
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => router.push('/dashboard')} className="hover:text-blue-500 transition-colors">
                                        Instagram Content
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => router.push('/dashboard')} className="hover:text-blue-500 transition-colors">
                                        LinkedIn Posts
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => router.push('/dashboard')} className="hover:text-blue-500 transition-colors">
                                        Twitter Threads
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => router.push('/dashboard')} className="hover:text-blue-500 transition-colors">
                                        Content Calendar
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Support Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">SUPPORT</h3>
                            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                                <li>
                                    <button onClick={() => router.push('/dashboard')} className="hover:text-blue-500 transition-colors">
                                        Help Center
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => router.push('/dashboard')} className="hover:text-blue-500 transition-colors">
                                        Privacy Policy
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => router.push('/dashboard')} className="hover:text-blue-500 transition-colors">
                                        Terms & Conditions
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => router.push('/dashboard')} className="hover:text-blue-500 transition-colors">
                                        Security
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => router.push('/dashboard')} className="hover:text-blue-500 transition-colors">
                                        FAQ
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Contact & Address Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">CONTACT US</h3>
                            <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                                <div>
                                    <p className="font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Mail Us:</p>
                                    <a href="mailto:scriptgo26@gmail.com" className="hover:text-blue-500 transition-colors">
                                        scriptgo26@gmail.com
                                    </a>
                                </div>
                                <div>
                                    <p className="font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Registered Office Address:</p>
                                    <p className="leading-relaxed">
                                        Script GO Private Limited,<br />
                                        No. 42, Anna Nagar East,<br />
                                        Thiruvottriyur,<br />
                                        Chennai - 600019,<br />
                                        Tamil Nadu, India
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Social Media & Copyright */}
                    <div className="border-t border-zinc-300 dark:border-white/10 pt-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            {/* Social Media */}
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-zinc-600 dark:text-zinc-400">Follow Us:</span>
                                <div className="flex items-center gap-3">
                                    <a href="#" className="text-zinc-600 dark:text-zinc-400 hover:text-blue-500 transition-colors">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                    </a>
                                    <a href="#" className="text-zinc-600 dark:text-zinc-400 hover:text-pink-500 transition-colors">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                        </svg>
                                    </a>
                                    <a href="#" className="text-zinc-600 dark:text-zinc-400 hover:text-red-500 transition-colors">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                        </svg>
                                    </a>
                                    <a href="#" className="text-zinc-600 dark:text-zinc-400 hover:text-blue-400 transition-colors">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>

                            {/* Copyright */}
                            <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                © 2026 Script GO. All rights reserved.
                            </div>
                        </div>
                    </div>
                </div>
            </motion.footer>

            {/* Decorative Elements */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-3xl" />
        </div>
    )
}
