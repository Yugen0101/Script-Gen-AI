'use client'

import { motion } from 'framer-motion'
import { Calendar, Trash2, Youtube, Linkedin, Instagram, Newspaper, Video, Globe, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ScriptCardProps {
    id: string
    title: string
    platform: string
    createdAt: string
    scheduledDate?: string
    content?: string
    language?: string
    isStarred?: boolean
    onDelete: (id: string) => void
    onToggleStar: (id: string, currentStarred: boolean) => void
}


export default function ScriptCard({ id, title, platform, createdAt, scheduledDate, content, language, isStarred, onDelete, onToggleStar }: ScriptCardProps) {
    const router = useRouter()

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric',
        })
    }

    const formatScheduledDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        })
    }

    const getPlatformIcon = (platform: string) => {
        switch (platform.toLowerCase()) {
            case 'youtube': return <Youtube className="w-5 h-5" />
            case 'linkedin': return <Linkedin className="w-5 h-5" />
            case 'insta reels':
            case 'instagram': return <Instagram className="w-5 h-5" />
            case 'news articles': return <Newspaper className="w-5 h-5" />
            case 'twitter':
                return (
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                )
            default: return <Video className="w-5 h-5" />
        }
    }

    const getPlatformStyles = (platform: string) => {
        // Screenshot shows blue icons primarily
        return 'bg-blue-500/10 text-blue-500'
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-[#111827] border border-zinc-200 dark:border-blue-500/10 rounded-2xl p-6 hover:border-zinc-300 dark:hover:border-blue-500/30 transition-all duration-300 group relative flex flex-col h-full shadow-lg shadow-zinc-200/50 dark:shadow-black/20"
            onClick={() => router.push(`/editor/${id}`)}
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col gap-2">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getPlatformStyles(platform)}`}>
                        {getPlatformIcon(platform)}
                    </div>
                    {scheduledDate && (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-lg">
                            <Calendar className="w-3 h-3 text-green-400" />
                            <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider whitespace-nowrap">
                                Scheduled: {formatScheduledDate(scheduledDate)}
                            </span>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {/* Star Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onToggleStar(id, isStarred || false)
                        }}
                        className="p-2 hover:bg-yellow-500/10 rounded-lg transition-colors"
                        title={isStarred ? 'Unstar' : 'Star'}
                    >
                        <Star
                            className={`w-5 h-5 transition-all ${isStarred
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-zinc-400 hover:text-yellow-400'
                                }`}
                        />
                    </button>

                    {/* Date and Language */}
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-xs font-mono text-zinc-500 font-medium tracking-wider">
                            {formatDate(createdAt)}
                        </span>
                        {language && (
                            <div className="flex items-center gap-1 text-[10px] text-blue-400 font-bold uppercase tracking-widest bg-blue-500/5 px-2 py-0.5 rounded-full border border-blue-500/10">
                                <Globe className="w-3 h-3" />
                                {language}
                            </div>
                        )}
                    </div>
                </div>
            </div>


            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 line-clamp-1">{title}</h3>

            <div className="text-sm text-zinc-400 mb-8 line-clamp-3 leading-relaxed">
                {(() => {
                    if (!content) return `${platform} script generated regarding ${title}.`;

                    try {
                        const clean = typeof content === 'string'
                            ? content.replace(/```json/g, '').replace(/```/g, '').trim()
                            : JSON.stringify(content);

                        if (clean.startsWith('{')) {
                            const data = JSON.parse(clean);

                            // Check if it's a bundled plan
                            if (data.isBundle && data.scripts) {
                                return (
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <Calendar className="w-3 h-3 text-blue-400" />
                                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                                                Calendar Plan
                                            </span>
                                        </div>
                                        <span className="text-zinc-300 font-medium">
                                            Consolidated {data.scripts.length} days of content generation for "{title.split('Plan: ')[1] || title}".
                                        </span>
                                    </div>
                                );
                            }

                            // Twitter Preview
                            if (data.tweets && Array.isArray(data.tweets) && data.tweets.length > 0) {
                                return (
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-bold text-blue-500/80 uppercase tracking-widest">Twitter Thread</span>
                                        <span className="line-clamp-2">"{data.tweets[0].text}"</span>
                                    </div>
                                );
                            }

                            // LinkedIn Preview
                            if (platform.toLowerCase() === 'linkedin' && data.hook) {
                                return (
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-bold text-blue-500/80 uppercase tracking-widest">LinkedIn Post</span>
                                        <span className="italic line-clamp-2">"{data.hook}"</span>
                                    </div>
                                );
                            }

                            // Instagram Preview
                            if (data.caption) {
                                return (
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-bold text-pink-500/80 uppercase tracking-widest">Instagram Caption</span>
                                        <span className="line-clamp-2">"{data.caption}"</span>
                                    </div>
                                );
                            }

                            if (data.hook) {
                                return (
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-bold text-blue-500/80 uppercase tracking-widest">Script Hook</span>
                                        <span className="italic line-clamp-2">"{data.hook}"</span>
                                    </div>
                                );
                            }
                        }
                    } catch (e) {
                        // Fallback
                    }

                    return typeof content === 'string' ? content : "AI Generated Script content...";
                })()}
            </div>


            <div className="flex items-center gap-3 mt-auto">
                <button className="flex-1 py-3 bg-zinc-50 dark:bg-[#1e293b] border border-zinc-200 dark:border-blue-500/10 rounded-xl text-sm text-zinc-900 dark:text-white font-medium hover:bg-zinc-100 dark:hover:bg-blue-600/10 hover:border-zinc-300 dark:hover:border-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                    Open <span className="text-zinc-400 dark:text-zinc-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">→</span>
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onDelete(id)
                    }}
                    className="p-3 hover:bg-red-500/10 rounded-xl text-zinc-600 hover:text-red-400 transition-colors border border-transparent hover:border-red-500/20"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    )
}
