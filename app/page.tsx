'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Zap, Wand2, TrendingUp } from 'lucide-react'
import Logo from '@/components/Logo'

export default function HomePage() {
    const router = useRouter()

    const scrollToPricing = () => {
        const pricingSection = document.getElementById('pricing')
        pricingSection?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <div className="min-h-screen mesh-gradient bg-zinc-50 dark:bg-[#0B1120] text-zinc-900 dark:text-zinc-50 smooth-transition">
            {/* Hero Section */}
            <div className="container mx-auto px-4 pt-32 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-5xl mx-auto"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 mb-8 shadow-sm"
                    >
                        <Logo className="w-5 h-5" />
                        <span className="text-sm font-medium">AI-Powered Script Generation</span>
                    </motion.div>

                    {/* Title */}
                    <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tight">
                        Stop staring at a<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 dark:from-white dark:via-blue-100 dark:to-white/50">blank page.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                        ScriptGo uses advanced AI to craft high-conversion scripts for YouTube, Instagram Reels, and LinkedIn. Start creating in seconds.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-24">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push('/login')}
                            className="px-8 py-4 btn-royal flex items-center gap-3 text-lg font-semibold shadow-lg shadow-blue-500/25"
                        >
                            Get Started Free
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={scrollToPricing}
                            className="px-8 py-4 glass hover:bg-white/5 rounded-xl text-lg font-medium smooth-transition"
                        >
                            View Pricing
                        </motion.button>
                    </div>
                </motion.div>
            </div>

            {/* Templates Section */}
            <div className="container mx-auto px-4 py-24 border-t border-white/5 bg-black/20 backdrop-blur-sm">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">Proven Templates</h2>
                    <p className="text-lg text-muted-foreground">Choose from a variety of structures designed for engagement.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* YouTube Card */}
                    <motion.div
                        whileHover={{ y: -10 }}
                        className="glass p-8 rounded-3xl border border-white/10 hover:border-red-500/50 smooth-transition group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 smooth-transition" />
                        <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-[#0B1120] border border-zinc-200 dark:border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 smooth-transition">
                            {/* Youtube Icon */}
                            <svg className="w-7 h-7 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" /><path d="m10 15 5-3-5-3z" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Standard YouTube</h3>
                        <p className="text-muted-foreground">Classic Hook-Intro-Body-Outro flow optimized for retention and likes.</p>
                    </motion.div>

                    {/* Reels/Shorts Card */}
                    <motion.div
                        whileHover={{ y: -10 }}
                        className="glass p-8 rounded-3xl border border-white/10 hover:border-pink-500/50 smooth-transition group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 smooth-transition" />
                        <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-[#0B1120] border border-zinc-200 dark:border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 smooth-transition">
                            {/* Video Icon */}
                            <svg className="w-7 h-7 text-pink-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z" /><rect width="14" height="12" x="2" y="6" rx="2" ry="2" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Viral Short / Reel</h3>
                        <p className="text-muted-foreground">Fast-paced 60s structure designed for maximum replay value and shares.</p>
                    </motion.div>

                    {/* LinkedIn Card */}
                    <motion.div
                        whileHover={{ y: -10 }}
                        className="glass p-8 rounded-3xl border border-white/10 hover:border-blue-500/50 smooth-transition group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 smooth-transition" />
                        <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-[#0B1120] border border-zinc-200 dark:border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 smooth-transition">
                            {/* Linkedin Icon */}
                            <svg className="w-7 h-7 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold mb-3">LinkedIn Story</h3>
                        <p className="text-muted-foreground">Professional narrative structure for high-engagement networking posts.</p>
                    </motion.div>
                </div>
            </div>

            {/* Pricing Section */}
            <div id="pricing" className="container mx-auto px-4 py-24">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple Pricing</h2>
                    <p className="text-lg text-muted-foreground">Start for free, upgrade for power.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Free Plan */}
                    <div className="p-8 rounded-3xl border border-zinc-200 dark:border-white/5 bg-white dark:bg-[#0B1120]/50 backdrop-blur-sm flex flex-col">
                        <h3 className="text-xl font-semibold text-blue-400 mb-2">Starter</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-bold text-white">$0</span>
                            <span className="text-muted-foreground">/month</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-8">Perfect for trying out the AI script generation.</p>

                        <div className="space-y-4 mb-8 flex-1">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-blue-500" />
                                <span className="text-sm">Limited Quota (5 scripts/mo)</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-blue-500" />
                                <span className="text-sm">Standard Templates</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-blue-500" />
                                <span className="text-sm">Export to Text</span>
                            </div>
                        </div>

                        <button
                            onClick={() => router.push('/login')}
                            className="w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 smooth-transition font-medium"
                        >
                            Get Started Free
                        </button>
                    </div>

                    {/* Pro Plan */}
                    <div className="p-8 rounded-3xl border border-blue-500/30 bg-blue-500/5 backdrop-blur-sm relative flex flex-col">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-500 text-white text-xs font-bold rounded-full shadow-lg shadow-blue-500/40">
                            POPULAR
                        </div>
                        <h3 className="text-xl font-semibold text-blue-400 mb-2">Pro Creator</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-bold text-white">$19</span>
                            <span className="text-muted-foreground">/month</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-8">For creators needing more volume and AI power.</p>

                        <div className="space-y-4 mb-8 flex-1">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-blue-400" />
                                <span className="text-sm font-medium text-white">Increased Quota (50/mo)</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-blue-400" />
                                <span className="text-sm">**Basic AI Agent Access**</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-blue-400" />
                                <span className="text-sm">All Premium Templates</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-blue-400" />
                                <span className="text-sm">Tone & Length Controls</span>
                            </div>
                        </div>

                        <button
                            onClick={() => router.push('/login?plan=pro')}
                            className="w-full py-3 rounded-xl btn-royal shadow-lg shadow-blue-500/20 font-semibold"
                        >
                            Upgrade to Pro
                        </button>
                    </div>

                    {/* Premium Plan */}
                    <div className="p-8 rounded-3xl border border-purple-500/20 bg-purple-500/5 backdrop-blur-sm flex flex-col">
                        <h3 className="text-xl font-semibold text-purple-400 mb-2">Agency Premium</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-bold text-white">$49</span>
                            <span className="text-muted-foreground">/month</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-8">Unlimited power for professional agencies.</p>

                        <div className="space-y-4 mb-8 flex-1">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-purple-400" />
                                <span className="text-sm font-medium text-white">**Unlimited Quota**</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-purple-400" />
                                <span className="text-sm font-medium text-white">**Many AI Agents Support**</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-purple-400" />
                                <span className="text-sm">Priority Support</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-purple-400" />
                                <span className="text-sm">API Access</span>
                            </div>
                        </div>

                        <button
                            onClick={() => router.push('/login?plan=premium')}
                            className="w-full py-3 rounded-xl border border-purple-500/30 hover:bg-purple-500/10 text-purple-300 hover:text-white smooth-transition font-medium"
                        >
                            Contact Sales
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-zinc-200 dark:border-white/5 bg-white dark:bg-[#0B1120] py-12">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-6 opacity-70">
                        <Logo className="w-8 h-8" />
                        <span className="text-lg font-bold">ScriptGo</span>
                    </div>
                    <p className="text-zinc-500 dark:text-zinc-500 text-sm">© 2026 ScriptGo AI. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}


