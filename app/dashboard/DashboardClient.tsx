'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, Star } from 'lucide-react'

import ScriptCard from '@/components/ScriptCard'
import Logo from '@/components/Logo'
import { createClient } from '@/lib/supabase/client'

interface Script {
    id: string
    title: string
    platform: string
    created_at: string
    scheduled_date?: string
    content?: string
    language?: string
    is_starred?: boolean
}


export default function DashboardClient({ scripts: initialScripts }: { scripts: Script[] }) {
    const [scripts, setScripts] = useState(initialScripts)
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'alphabetical'>('newest')
    const [showStarredOnly, setShowStarredOnly] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const getSortedScripts = () => {
        let sorted = [...scripts]

        // Filter starred if enabled
        if (showStarredOnly) {
            sorted = sorted.filter(s => s.is_starred)
        }

        // Apply sorting
        switch (sortBy) {
            case 'newest':
                sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                break
            case 'oldest':
                sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                break
            case 'alphabetical':
                sorted.sort((a, b) => a.title.localeCompare(b.title))
                break
        }

        return sorted
    }

    const handleToggleStar = async (id: string, currentStarred: boolean) => {
        const { error } = await supabase
            .from('scripts')
            .update({ is_starred: !currentStarred })
            .eq('id', id)

        if (!error) {
            setScripts(scripts.map(s =>
                s.id === id ? { ...s, is_starred: !currentStarred } : s
            ))
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this script?')) return

        const { error } = await supabase.from('scripts').delete().eq('id', id)

        if (!error) {
            setScripts(scripts.filter((s) => s.id !== id))
        }
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-[#0B1120] text-zinc-900 dark:text-zinc-50 transition-colors duration-300">
            <main className="container mx-auto px-4 pt-24 pb-8">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4"
                >
                    <div>
                        <h1 className="text-4xl font-bold mb-2 text-zinc-900 dark:text-white">
                            Dashboard
                        </h1>
                        <p className="text-zinc-400">
                            Manage your generated scripts and content.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Sort Dropdown */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="px-4 py-2 bg-white dark:bg-[#1e293b] border border-zinc-200 dark:border-white/10 rounded-xl text-sm font-medium text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer transition-colors"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="alphabetical">A-Z</option>
                        </select>

                        {/* Starred Filter Toggle */}
                        <button
                            onClick={() => setShowStarredOnly(!showStarredOnly)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${showStarredOnly
                                    ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20'
                                    : 'bg-white dark:bg-[#1e293b] text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20'
                                }`}
                        >
                            <Star className={`w-4 h-4 ${showStarredOnly ? 'fill-yellow-400' : ''}`} />
                            {showStarredOnly ? 'Starred' : 'All'}
                        </button>

                        {/* New Script Button */}
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
                        {getSortedScripts().map((script, index) => (
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
                                    scheduledDate={script.scheduled_date}
                                    content={script.content}
                                    language={script.language}
                                    isStarred={script.is_starred}
                                    onDelete={handleDelete}
                                    onToggleStar={handleToggleStar}
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
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-zinc-100 dark:bg-[#1e293b] mb-4 border border-zinc-200 dark:border-white/5">
                            <Logo className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-2 text-zinc-900 dark:text-white">No scripts yet</h3>
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
