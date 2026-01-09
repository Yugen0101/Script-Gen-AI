'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import ScriptCard from '@/components/ScriptCard'
import Logo from '@/components/Logo'
import { createClient } from '@/lib/supabase/client'

interface Script {
    id: string
    title: string
    platform: string
    created_at: string
    content?: string
}

export default function DashboardClient({ scripts: initialScripts }: { scripts: Script[] }) {
    const [scripts, setScripts] = useState(initialScripts)
    const router = useRouter()
    const supabase = createClient()

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this script?')) return

        const { error } = await supabase.from('scripts').delete().eq('id', id)

        if (!error) {
            setScripts(scripts.filter((s) => s.id !== id))
        }
    }

    return (
        <div className="min-h-screen bg-[#0B1120] text-zinc-50 transition-colors duration-300">
            <main className="container mx-auto px-4 pt-24 pb-8">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4"
                >
                    <div>
                        <h1 className="text-4xl font-bold mb-2 text-white">
                            Dashboard
                        </h1>
                        <p className="text-zinc-400">
                            Manage your generated scripts and content.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="px-5 py-2.5 bg-[#1e293b] border border-blue-500/20 text-blue-400 rounded-full text-sm font-medium hover:bg-blue-500/10 hover:border-blue-500/50 transition-all duration-300">
                            Upgrade Plan
                        </button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push('/editor')}
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-500 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-blue-500/25"
                        >
                            <Plus className="w-4 h-4" />
                            New Script
                        </motion.button>
                    </div>
                </motion.div>

                {/* Scripts Grid */}
                {scripts.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {scripts.map((script, index) => (
                            <motion.div
                                key={script.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <ScriptCard
                                    id={script.id}
                                    title={script.title}
                                    platform={script.platform}
                                    createdAt={script.created_at}
                                    content={script.content}
                                    onDelete={handleDelete}
                                />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#1e293b] mb-4 border border-white/5">
                            <Logo className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-2 text-white">No scripts yet</h3>
                        <p className="text-zinc-400 mb-6">
                            Create your first AI-powered script to get started
                        </p>
                        <button
                            onClick={() => router.push('/editor')}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl inline-flex items-center gap-2 transition-colors"
                        >
                            <Logo className="w-5 h-5 grayscale brightness-0 invert" />
                            Write your script
                        </button>
                    </motion.div>
                )}
            </main>
        </div>
    )
}
