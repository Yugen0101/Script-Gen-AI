'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { AlertCircle, ArrowLeft, Loader2, ArrowRight } from 'lucide-react'
import Logo from '@/components/Logo'

export default function LoginPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const supabase = createClient()

    // Check if we should start in signup mode
    const [isLogin, setIsLogin] = useState(() => !searchParams.get('signup'))

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                router.push('/dashboard')
                router.refresh()
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${location.origin}/auth/callback`,
                    },
                })
                if (error) throw error
                // Check if session was created immediately (for auto-confirm) or verify needed
                const { data: { session } } = await supabase.auth.getSession()
                if (session) {
                    router.push('/dashboard')
                    router.refresh()
                } else {
                    setError('Please check your email to confirm your account.')
                }
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (!mounted) return null;

    return (
        <div className="min-h-screen flex items-center justify-center p-4 mesh-gradient bg-zinc-50 dark:bg-[#0B1120] text-zinc-900 dark:text-zinc-50 smooth-transition">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white dark:bg-[#0B1120]/80 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl space-y-8 relative overflow-hidden"
            >
                {/* Back Button */}
                <button
                    onClick={() => router.push('/')}
                    className="absolute top-6 left-6 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white smooth-transition"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="text-center space-y-4 pt-4">
                    <div className="flex justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-600/20 dark:to-indigo-600/20 flex items-center justify-center shadow-inner">
                            <Logo className="w-10 h-10" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-white dark:to-white/70">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        {isLogin ? 'Enter your credentials to continue' : 'Start generating amazing scripts today'}
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Toggle Login/Signup */}
                    <div className="flex bg-zinc-100 dark:bg-white/5 p-1 rounded-xl mb-6">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-2.5 text-sm font-medium rounded-lg smooth-transition ${isLogin
                                    ? 'bg-white dark:bg-[#0B1120] text-blue-600 dark:text-blue-400 shadow-sm'
                                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                                }`}
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2.5 text-sm font-medium rounded-lg smooth-transition ${!isLogin
                                    ? 'bg-white dark:bg-[#0B1120] text-blue-600 dark:text-blue-400 shadow-sm'
                                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-600 dark:text-red-400 text-sm">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 btn-royal text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 smooth-transition flex items-center justify-center gap-2 transform active:scale-[0.98]"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    {isLogin ? 'Sign In' : 'Create Account'}
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    )
}
