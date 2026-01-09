'use client'

import { motion } from 'framer-motion'
import { Calendar, Trash2, Youtube, Linkedin, Instagram, Video } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ScriptCardProps {
    id: string
    title: string
    platform: string
    createdAt: string
    content?: string
    onDelete: (id: string) => void
}

export default function ScriptCard({ id, title, platform, createdAt, content, onDelete }: ScriptCardProps) {
    const router = useRouter()

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric',
        })
    }

    const getPlatformIcon = (platform: string) => {
        switch (platform.toLowerCase()) {
            case 'youtube': return <Youtube className="w-5 h-5" />
            case 'linkedin': return <Linkedin className="w-5 h-5" />
            case 'instagram': return <Instagram className="w-5 h-5" />
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
            className="bg-[#111827] border border-blue-500/10 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300 group relative flex flex-col h-full shadow-lg shadow-black/20"
            onClick={() => router.push(`/editor/${id}`)}
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getPlatformStyles(platform)}`}>
                    {getPlatformIcon(platform)}
                </div>
                <span className="text-xs font-mono text-zinc-500 font-medium tracking-wider">
                    {formatDate(createdAt)}
                </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{title}</h3>

            <p className="text-sm text-zinc-400 mb-8 line-clamp-2 leading-relaxed">
                {content
                    ? (content.includes('"visual"') ? "AI Generated Script content..." : content) // Handle JSON content simplisticly or just show raw/fallback
                    : `${platform} script generated regarding ${title}. Click to view full content options.`}
            </p>

            <div className="flex items-center gap-3 mt-auto">
                <button className="flex-1 py-3 bg-[#1e293b] border border-blue-500/10 rounded-xl text-sm text-white font-medium hover:bg-blue-600/10 hover:border-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                    Open <span className="text-zinc-500 group-hover:text-blue-400 transition-colors">→</span>
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
