'use client'

import { motion } from 'framer-motion'
import { MessageCircle, Repeat2, Heart, Share2, MoreHorizontal, Verified, TrendingUp } from 'lucide-react'

interface TwitterViewProps {
    scriptData: {
        tweets?: Array<{
            text: string
            media?: string
        }>
    }
}

export default function TwitterView({ scriptData }: TwitterViewProps) {
    return (
        <div className="max-w-xl mx-auto space-y-6 pb-12">
            {/* Platform Header Pill */}
            <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900/10 dark:bg-white/10 rounded-full border border-zinc-200 dark:border-white/10 backdrop-blur-md">
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-current">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span className="text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-white">X Thread Blueprint</span>
                </div>
            </div>

            {/* Tweet Thread */}
            <div className="relative">
                {scriptData.tweets?.map((tweet, idx) => (
                    <div key={idx} className="relative group">
                        {/* Connection Line - Visualized Thread */}
                        {idx < (scriptData.tweets?.length || 0) - 1 && (
                            <div className="absolute left-[2.25rem] top-16 bottom-0 w-0.5 bg-zinc-200 dark:bg-zinc-800 z-0 group-hover:bg-blue-500/30 transition-colors" />
                        )}

                        {/* Tweet Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="relative bg-white dark:bg-[#0f172a] rounded-[2rem] p-6 border border-zinc-200 dark:border-white/10 mb-4 shadow-xl hover:shadow-2xl transition-all duration-300 z-10"
                        >
                            {/* Tweet Header */}
                            <div className="flex items-start gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-zinc-800 to-black p-0.5 relative group-hover:p-1 transition-all">
                                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center border-2 border-white dark:border-[#0f172a]">
                                        <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-white">
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1">
                                        <span className="font-black text-zinc-900 dark:text-white tracking-tight text-sm">Your Visionary Account</span>
                                        <Verified className="w-3.5 h-3.5 text-blue-400 fill-current" />
                                        <div className="w-1 h-1 rounded-full bg-zinc-400 mx-1" />
                                        <span className="text-zinc-500 text-[11px] font-bold">@thecreative_ai</span>
                                    </div>
                                    <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">THREAD PART {idx + 1}/{scriptData.tweets?.length}</div>
                                </div>
                                <button className="p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-full transition-colors">
                                    <MoreHorizontal className="w-4 h-4 text-zinc-400" />
                                </button>
                            </div>

                            {/* Tweet Content */}
                            <div className="text-[15px] font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-line mb-4 px-2 italic">
                                "{tweet.text}"
                            </div>

                            {/* Social Engagement Mockup */}
                            <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-white/5 text-zinc-500">
                                <EngagementIcon Icon={MessageCircle} count="42" hover="hover:text-blue-500 hover:bg-blue-500/10" />
                                <EngagementIcon Icon={Repeat2} count="12" hover="hover:text-green-500 hover:bg-green-500/10" />
                                <EngagementIcon Icon={Heart} count="156" hover="hover:text-pink-500 hover:bg-pink-500/10" isFill />
                                <div className="flex items-center gap-4">
                                    <Share2 className="w-4 h-4 hover:text-blue-500 cursor-pointer" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                ))}
            </div>

            {/* Virality Tips */}
            <div className="bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-white/[0.02] dark:to-white/[0.05] rounded-[2rem] p-6 border border-zinc-200 dark:border-white/10 shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-black text-zinc-900 dark:text-zinc-200 uppercase tracking-widest">Growth Strategy</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
                    <div className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-blue-500" /> High-impact hook first</div>
                    <div className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-blue-500" /> Visual formatting wins</div>
                    <div className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-blue-500" /> Clear CTA at the end</div>
                    <div className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-blue-500" /> Value-per-tweet ratio</div>
                </div>
            </div>
        </div>
    )
}

function EngagementIcon({ Icon, count, hover, isFill = false }: { Icon: any, count: string, hover: string, isFill?: boolean }) {
    return (
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-all duration-200 ${hover} group/icon`}>
            <Icon className={`w-4 h-4 ${isFill ? 'group-hover/icon:fill-current' : ''}`} />
            <span className="text-[11px] font-black tracking-tight">{count}</span>
        </div>
    )
}

