'use client'

import { motion } from 'framer-motion'
import { Play, Video, Mic2, Clock, Youtube } from 'lucide-react'

interface YouTubeViewProps {
    scriptData: {
        hook?: string
        sections?: Array<{
            visual: string
            audio: string
            duration?: string
        }>
    }
}

export default function YouTubeView({ scriptData }: YouTubeViewProps) {
    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            {/* Platform Header Pill */}
            <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 dark:bg-red-500/20 rounded-full border border-red-500/20 backdrop-blur-md">
                    <Youtube className="w-4 h-4 text-red-500" />
                    <span className="text-xs font-black uppercase tracking-widest text-red-600 dark:text-red-400">YouTube Studio Blueprint</span>
                </div>
            </div>

            {/* Hook Strategy - High Impact */}
            {scriptData.hook && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative group lg:mx-8"
                >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                    <div className="relative bg-white dark:bg-[#0f172a] rounded-[2rem] p-8 border border-zinc-200 dark:border-white/10 shadow-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-500 rounded-lg">
                                <Play className="w-4 h-4 text-white fill-current" />
                            </div>
                            <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">The Hook Strategy</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white leading-tight">
                            "{scriptData.hook}"
                        </h2>
                    </div>
                </motion.div>
            )}

            {/* Production Shot List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-6 lg:px-8">
                    <div className="flex items-center gap-2">
                        <Video className="w-5 h-5 text-zinc-400" />
                        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Production Shot List</h3>
                    </div>
                    <div className="text-[10px] font-medium text-zinc-400 uppercase tracking-tighter">Total Sections: {scriptData.sections?.length || 0}</div>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:mx-8">
                    {scriptData.sections?.map((section, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="group relative flex flex-col md:flex-row gap-0.5 rounded-[2rem] overflow-hidden border border-zinc-200 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            {/* Sequence Number & Time */}
                            <div className="md:w-32 bg-zinc-50 dark:bg-white/[0.03] p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-zinc-200 dark:border-white/10">
                                <span className="text-3xl font-black text-zinc-200 dark:text-zinc-800 group-hover:text-red-500/20 transition-colors">
                                    {(idx + 1).toString().padStart(2, '0')}
                                </span>
                                <div className="mt-2 flex items-center gap-1.5 px-3 py-1 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-full">
                                    <Clock className="w-3 h-3 text-zinc-500" />
                                    <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400">{section.duration || 'EST. 8s'}</span>
                                </div>
                            </div>

                            {/* Content Split */}
                            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
                                {/* Visual - Left */}
                                <div className="p-6 bg-white dark:bg-[#0f172a] relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                                        <Video className="w-24 h-24 -rotate-12" />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                            <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Visual Direction</span>
                                        </div>
                                        <p className="text-sm md:text-[15px] font-semibold text-zinc-800 dark:text-zinc-200 leading-relaxed">
                                            {section.visual}
                                        </p>
                                    </div>
                                </div>

                                {/* Audio - Right */}
                                <div className="p-6 bg-zinc-50/50 dark:bg-white/[0.01] border-t lg:border-t-0 lg:border-l border-zinc-200 dark:border-white/10 relative">
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                            <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">Audio / Voiceover</span>
                                        </div>
                                        <p className="text-sm md:text-[15px] text-zinc-600 dark:text-zinc-400 leading-relaxed italic">
                                            "{section.audio}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}
