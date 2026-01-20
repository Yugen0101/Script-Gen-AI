'use client'

import { useState, useEffect, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { AlertCircle, Loader2, ArrowRight, Lock, ArrowLeft } from 'lucide-react'

function UpdatePasswordContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const supabase = createClient()

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userEmail, setUserEmail] = useState<string | null>(null)
    const [isRecovery, setIsRecovery] = useState(false)

    useEffect(() => {
        setMounted(true)
        const checkSession = async () => {
            // First, check if there's a recovery token in the URL hash
            const hash = window.location.hash
            const typeParam = searchParams.get('type')

            // If there's an access_token in the hash, Supabase will automatically exchange it
            if (hash && hash.includes('access_token')) {
                // Wait a moment for Supabase to process the token
                await new Promise(resolve => setTimeout(resolve, 100))
            }

            const { data: { session } } = await supabase.auth.getSession()
            setIsLoggedIn(!!session)
            setUserEmail(session?.user?.email || null)

            // Check if this is a recovery flow
            if (
                (hash && (hash.includes('type=recovery') || hash.includes('access_token'))) ||
                typeParam === 'recovery'
            ) {
                setIsRecovery(true)
            }

            // If still no session and we have a hash, show error
            if (!session && hash && hash.includes('access_token')) {
                setError('Auth session missing! Please try requesting a new password reset link.')
            }
        }
        checkSession()
    }, [supabase.auth, searchParams])

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        setLoading(true)
        setError(null)

        try {
            const { error } = await supabase.auth.updateUser({
                password: password,
            })
            if (error) throw error

            setSuccess(true)
            setTimeout(() => {
                router.push(isLoggedIn ? '/dashboard' : '/login')
            }, 3000)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (!mounted) return null

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-50 dark:bg-[#0B1120] text-zinc-900 dark:text-zinc-50 smooth-transition">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white/90 dark:bg-[#0B1120]/80 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl space-y-8 relative overflow-hidden"
            >
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="absolute top-6 left-6 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white smooth-transition"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="text-center space-y-4 pt-4">
                    <div className="flex justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-600/20 dark:to-indigo-600/20 flex items-center justify-center shadow-inner">
                            <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-white dark:to-white/70">
                        {isRecovery ? 'Reset Password' : 'Update Password'}
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        {isRecovery
                            ? 'Create a new password for your account'
                            : 'Verify your identity and set a new password'}
                    </p>
                </div>

                <div className="space-y-6">
                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-600 dark:text-red-400 text-sm">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3 text-emerald-600 dark:text-emerald-400 text-sm">
                                <p>Password updated successfully! Redirecting...</p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">New Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                                placeholder="••••••••"
                                required
                                disabled={success}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                                placeholder="••••••••"
                                required
                                disabled={success}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || success}
                            className="w-full py-3 btn-royal text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 smooth-transition flex items-center justify-center gap-2 transform active:scale-[0.98]"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Update Password
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

export default function UpdatePasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-[#0B1120]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        }>
            <UpdatePasswordContent />
        </Suspense>
    )
}
