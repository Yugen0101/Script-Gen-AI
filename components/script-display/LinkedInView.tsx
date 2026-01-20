'use client'

import { motion } from 'framer-motion'
import { Linkedin, TrendingUp, Users, Heart, MessageSquare, Share2, Send, Lightbulb } from 'lucide-react'

interface LinkedInViewProps {
    scriptData: {
        hook?: string
        body?: string
        cta?: string
        keyPoints?: string[]
    }
}

export default function LinkedInView({ scriptData }: LinkedInViewProps) {
    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-12">
            {/* Platform Header Pill */}
            <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 dark:bg-blue-500/20 rounded-full border border-blue-500/20 backdrop-blur-md">
                    <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                    <span className="text-xs font-black uppercase tracking-widest text-[#0A66C2] dark:text-blue-400">LinkedIn Thought Leadership</span>
                </div>
            </div>

            {/* LinkedIn Strategy Card */}
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#0A66C2] to-blue-400 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>

                <div className="relative bg-white dark:bg-[#0f172a] rounded-[2rem] border border-zinc-200 dark:border-white/10 overflow-hidden shadow-2xl">
                    {/* Fake Profile Header */}
                    <div className="p-6 border-b border-zinc-100 dark:border-white/5 flex items-center gap-4">
                        <div className="relative">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0A66C2] to-blue-500 flex items-center justify-center p-0.5">
                                <div className="w-full h-full rounded-full border-2 border-white dark:border-[#0f172a] flex items-center justify-center bg-blue-600">
                                    <Users className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white dark:border-[#0f172a] rounded-full flex items-center justify-center">
                                <TrendingUp className="w-3 h-3 text-white" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-1.5">
                                <span className="font-black text-zinc-900 dark:text-white tracking-tight">Expert Contributor</span>
                                <div className="w-1 h-1 rounded-full bg-zinc-400" />
                                <span className="text-xs font-bold text-[#0A66C2]">Follow</span>
                            </div>
                            <div className="text-[11px] text-zinc-500 font-medium">Industry Thought Leader & Global Strategist</div>
                            <div className="text-[10px] text-zinc-400 mt-0.5">Just now • 🌐</div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8 space-y-6">
                        {/* High Impact Hook */}
                        {scriptData.hook && (
                            <div className="text-xl font-bold text-zinc-900 dark:text-white leading-tight border-l-4 border-[#0A66C2] pl-6 py-2">
                                {scriptData.hook}
                            </div>
                        )}

                        {/* Narrative Body */}
                        {scriptData.body && (
                            <div className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line font-medium">
                                {scriptData.body}
                            </div>
                        )}

                        {/* Value Bullets (Key Points) */}
                        {scriptData.keyPoints && scriptData.keyPoints.length > 0 && (
                            <div className="bg-blue-500/5 dark:bg-blue-400/5 rounded-2xl p-6 border border-blue-500/10 relative group-hover:bg-blue-500/10 transition-colors">
                                <div className="flex items-center gap-2 mb-4">
                                    <Lightbulb className="w-4 h-4 text-blue-500" />
                                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Key Takeaways</span>
                                </div>
                                <ul className="space-y-3">
                                    {scriptData.keyPoints.map((point, idx) => (
                                        <li key={idx} className="flex gap-3 text-sm text-zinc-700 dark:text-zinc-300 font-medium italic">
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Call to Action */}
                        {scriptData.cta && (
                            <div className="pt-6 border-t border-zinc-100 dark:border-white/5">
                                <div className="inline-block px-4 py-2 bg-[#0A66C2]/10 dark:bg-blue-500/20 text-[#0A66C2] dark:text-blue-400 rounded-xl text-sm font-black italic tracking-tight">
                                    🚀 {scriptData.cta}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Social Stats & Actions */}
                    <div className="px-8 py-4 bg-zinc-50/50 dark:bg-white/[0.02] border-t border-zinc-100 dark:border-white/5">
                        <div className="flex items-center justify-between text-xs text-zinc-400 font-bold mb-4">
                            <div className="flex items-center gap-1.5">
                                <div className="flex -space-x-1.5">
                                    <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white dark:border-[#0f172a] flex items-center justify-center">
                                        <Heart className="w-2.5 h-2.5 text-white fill-current" />
                                    </div>
                                    <div className="w-5 h-5 rounded-full bg-blue-400 border-2 border-white dark:border-[#0f172a] flex items-center justify-center">
                                        <TrendingUp className="w-2.5 h-2.5 text-white" />
                                    </div>
                                </div>
                                <span>241 likes</span>
                            </div>
                            <span>18 comments • 5 reposts</span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-white/5">
                            {[
                                { icon: Heart, label: 'Like' },
                                { icon: MessageSquare, label: 'Comment' },
                                { icon: Share2, label: 'Repost' },
                                { icon: Send, label: 'Send' }
                            ].map((action, i) => (
                                <button key={i} className="flex items-center gap-2 hover:bg-zinc-200/50 dark:hover:bg-white/5 py-2 px-3 rounded-lg transition-colors text-zinc-500 dark:text-zinc-400">
                                    <action.icon className="w-4 h-4" />
                                    <span className="text-[11px] font-bold uppercase tracking-tighter hidden sm:block">{action.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
