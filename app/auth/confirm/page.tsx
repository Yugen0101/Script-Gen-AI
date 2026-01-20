'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { motion } from 'framer-motion'
import { ShieldCheck, ArrowRight } from 'lucide-react'

export default function ConfirmPage() {
    const searchParams = useSearchParams()

    // Construct the callback URL manually to preserve all params
    const params = new URLSearchParams(searchParams.toString())
    const callbackUrl = `/auth/callback?${params.toString()}`

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-50 dark:bg-[#0B1120] text-zinc-900 dark:text-zinc-50 smooth-transition">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white/90 dark:bg-[#0B1120]/80 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl space-y-8 text-center"
            >
                <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-600/20 dark:to-indigo-600/20 flex items-center justify-center shadow-inner">
                        <ShieldCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-2xl font-bold">Security Check</h1>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        Please click the button below to verify your request and continue properly.
                    </p>
                </div>

                <Link
                    href={callbackUrl}
                    className="w-full py-3 btn-royal text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 smooth-transition flex items-center justify-center gap-2 transform active:scale-[0.98]"
                >
                    Proceed to Reset Password
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </motion.div>
        </div>
    )
}
