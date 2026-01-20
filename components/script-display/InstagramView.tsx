'use client'

import { motion } from 'framer-motion'
import { Instagram, Hash, Sparkles, Mic } from 'lucide-react'

interface InstagramViewProps {
    scriptData: {
        hook?: string
        caption?: string
        hashtags?: string[]
        scenes?: Array<{
            visual: string
            audio?: string
            overlay?: string
            duration?: string
        }>
    }
}

export default function InstagramView({ scriptData }: InstagramViewProps) {
    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
            {/* Platform Header */}
            <div className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-transparent dark:from-pink-500/20 dark:via-purple-500/20 dark:to-transparent rounded-2xl p-5 border border-pink-200/50 dark:border-pink-500/20 backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-purple-500/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center shadow-lg shadow-pink-500/20">
                            <Instagram className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-white leading-none mb-1">Instagram Reel</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-pink-600 dark:text-pink-400 px-2 py-0.5 bg-pink-500/10 rounded-full">Visual Masterpiece</span>
                                <span className="text-[10px] text-zinc-500 dark:text-zinc-400">• {scriptData.scenes?.length || 0} Scenes</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Sticky Preview */}
                <div className="lg:col-span-5 lg:sticky lg:top-8 order-2 lg:order-1">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-[3.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-zinc-900 dark:bg-black rounded-[3rem] p-3 shadow-2xl border border-zinc-200/10">
                            {/* Screen */}
                            <div className="bg-black rounded-[2.5rem] overflow-hidden aspect-[9/16] relative group/screen">
                                {/* Instagram Header Overlay */}
                                <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/60 via-black/20 to-transparent p-6 flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="w-9 h-9 rounded-full border-2 border-pink-500 p-0.5">
                                            <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
                                                <Instagram className="w-4 h-4 text-white" />
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-white text-xs font-bold block leading-tight">your_brand</span>
                                            <span className="text-[10px] text-white/70 block">Original Audio</span>
                                        </div>
                                    </div>
                                    <button className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                                        <div className="w-1 h-1 bg-white rounded-full shadow-[0_4px_0_white,0_-4px_0_white]" />
                                    </button>
                                </div>

                                {/* Content Preview */}
                                <div className="h-full bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-pink-900/40 flex items-center justify-center p-8 text-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                                    {scriptData.hook && (
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="relative z-10"
                                        >
                                            <div className="text-2xl md:text-3xl font-black text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] tracking-tight leading-tight uppercase">
                                                {scriptData.hook}
                                            </div>
                                            <div className="mt-4 inline-block px-4 py-1.5 bg-white/20 backdrop-blur-xl rounded-full border border-white/30 text-[10px] text-white font-bold tracking-widest uppercase">
                                                Tap for Sound
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Bottom Right Actions (Instagram Style) */}
                                <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center gap-5">
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="w-6 h-6 text-white opacity-90 drop-shadow-lg">
                                            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                                        </div>
                                        <span className="text-[10px] text-white font-bold drop-shadow-md">K+</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="w-6 h-6 text-white opacity-90 drop-shadow-lg">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                                        </div>
                                        <span className="text-[10px] text-white font-bold drop-shadow-md">K+</span>
                                    </div>
                                    <div className="w-6 h-6 text-white opacity-90 drop-shadow-lg">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                                    </div>
                                </div>

                                {/* Caption Area */}
                                <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 pb-8">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-white text-xs font-bold">your_brand</span>
                                                <button className="px-2 py-0.5 border border-white/30 rounded text-[9px] text-white font-bold">Follow</button>
                                            </div>
                                            <p className="text-white text-[11px] leading-relaxed line-clamp-2 mb-2">
                                                {scriptData.caption || 'Your high-converting Instagram caption strategy starts here...'}
                                            </p>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1">
                                                    <div className="flex -space-x-1.5">
                                                        {[1, 2, 3].map(i => (
                                                            <div key={i} className="w-4 h-4 rounded-full border border-black bg-zinc-800 flex items-center justify-center overflow-hidden">
                                                                <div className="w-full h-full bg-gradient-to-br from-pink-500/50 to-purple-500/50" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <span className="text-[9px] text-white/70">Liked by others</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-9 h-9 rounded-lg border-2 border-white/20 overflow-hidden flex-shrink-0">
                                            <div className="w-full h-full bg-gradient-to-br from-pink-500/30 to-purple-500/30 animate-pulse" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Scrollable Content */}
                <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
                    {/* Caption Card */}
                    {scriptData.caption && (
                        <div className="bg-white dark:bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl p-6 border border-zinc-200 dark:border-white/10 shadow-sm relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl transition-all group-hover:bg-pink-500/10"></div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-black text-pink-500 uppercase tracking-[0.2em] px-2 py-1 bg-pink-500/5 rounded-md">Captivating Caption</span>
                                <Instagram className="w-4 h-4 text-zinc-300 dark:text-zinc-700" />
                            </div>
                            <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
                                {scriptData.caption}
                            </p>

                            {/* Hashtags Integration */}
                            {scriptData.hashtags && scriptData.hashtags.length > 0 && (
                                <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-zinc-100 dark:border-white/5">
                                    {scriptData.hashtags.map((tag, idx) => (
                                        <span key={idx} className="text-[11px] font-bold text-blue-500 dark:text-blue-400/80 hover:text-blue-600 dark:hover:text-blue-300 transition-colors cursor-pointer">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Shot List */}
                    {scriptData.scenes && scriptData.scenes.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <h4 className="text-xs font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em]">Shot-by-Shot Blueprint</h4>
                                <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500">
                                    SCROLL FOR DEPTH
                                </div>
                            </div>

                            <div className="space-y-3">
                                {scriptData.scenes.map((scene, idx) => (
                                    <motion.div
                                        key={idx}
                                        whileHover={{ x: 4 }}
                                        className="bg-white dark:bg-[#0f172a]/60 backdrop-blur-xl rounded-2xl p-5 border border-zinc-200 dark:border-white/5 shadow-sm hover:shadow-md hover:border-pink-500/30 dark:hover:border-pink-500/20 transition-all group"
                                    >
                                        <div className="flex gap-5">
                                            <div className="flex flex-col items-center gap-2 flex-shrink-0">
                                                <div className="w-10 h-10 rounded-full bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center border border-zinc-200 dark:border-white/5 text-[11px] font-black text-zinc-400 group-hover:text-pink-500 transition-colors">
                                                    {(idx + 1).toString().padStart(2, '0')}
                                                </div>
                                                <div className="w-0.5 h-full bg-gradient-to-b from-zinc-100 to-transparent dark:from-zinc-800 dark:to-transparent rounded-full" />
                                            </div>
                                            <div className="flex-1 space-y-3 pb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg">VISUAL</span>
                                                    {scene.duration && (
                                                        <span className="text-[10px] font-bold px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-lg">
                                                            {scene.duration}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm md:text-[15px] font-semibold text-zinc-800 dark:text-zinc-200 leading-relaxed">
                                                    {scene.visual}
                                                </p>
                                                {scene.audio && (
                                                    <div className="flex items-start gap-2 p-3 bg-blue-500/5 dark:bg-blue-500/10 rounded-xl border border-blue-500/10">
                                                        <Mic className="w-3.5 h-3.5 text-blue-500 mt-0.5" />
                                                        <div className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed italic">
                                                            <span className="uppercase text-[9px] font-black tracking-tighter text-blue-500 block mb-0.5 not-italic">Voiceover / Audio</span>
                                                            "{scene.audio}"
                                                        </div>
                                                    </div>
                                                )}
                                                {scene.overlay && (
                                                    <div className="mt-3 flex items-start gap-2 p-3 bg-pink-500/5 dark:bg-pink-500/10 rounded-xl border border-pink-500/10">
                                                        <Sparkles className="w-3 h-3 text-pink-500 mt-0.5" />
                                                        <div className="text-[11px] text-pink-600 dark:text-pink-400 font-bold leading-tight">
                                                            <span className="uppercase text-[9px] opacity-70 block mb-1">Text Overlay</span>
                                                            "{scene.overlay}"
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
