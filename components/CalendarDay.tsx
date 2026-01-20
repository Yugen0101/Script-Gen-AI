'use client'

import { motion } from 'framer-motion'
import { Calendar as CalendarIcon, FileText, CheckCircle2, Circle } from 'lucide-react'

interface CalendarDayProps {
    day: number
    date: string
    title?: string
    onClick?: () => void
    isToday?: boolean
    status?: 'completed' | 'active' | 'pending'
}

export default function CalendarDay({ day, date, title, onClick, isToday, status = 'pending' }: CalendarDayProps) {
    const isCompleted = status === 'completed'
    const isActive = status === 'active'

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`relative group h-32 p-3 rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between 
            ${isActive
                    ? 'bg-blue-600/10 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] ring-1 ring-blue-400'
                    : isCompleted
                        ? 'bg-green-500/5 border-green-500/30 opacity-80 hover:opacity-100'
                        : 'bg-zinc-50 dark:bg-[#1A202C]/50 border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/20 hover:bg-zinc-100 dark:hover:bg-[#1A202C]/80'
                }`}
        >
            {/* Background Accent */}
            {isActive && (
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
            )}
            {isCompleted && (
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-16 h-16 bg-green-500/10 rounded-full blur-xl" />
            )}

            {/* Date Header */}
            <div className="flex justify-between items-start relative z-10">
                <div className="flex items-center gap-2">
                    {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : isActive ? (
                        <div className="w-4 h-4 rounded-full border-2 border-blue-500 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        </div>
                    ) : (
                        <span className="w-4 h-4 flex items-center justify-center text-[10px] font-bold text-zinc-400 bg-zinc-100 dark:bg-white/5 rounded-full">
                            {day}
                        </span>
                    )}
                    <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-blue-400' : isCompleted ? 'text-green-600 dark:text-green-400' : 'text-zinc-500'}`}>
                        Day {day}
                    </span>
                </div>

                <span className={`text-[10px] font-medium ${isActive ? 'text-blue-300' : 'text-zinc-600'}`}>
                    {new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', timeZone: 'UTC' })}
                </span>
            </div>

            {/* Content Preview */}
            {title ? (
                <div className="relative z-10 pt-2">
                    <h4 className={`text-xs font-semibold line-clamp-2 leading-relaxed mb-1 ${isCompleted ? 'text-zinc-500 line-through' : 'text-zinc-900 dark:text-zinc-100'}`}>
                        {title}
                    </h4>
                    <div className={`flex items-center gap-1 text-[10px] ${isActive ? 'text-blue-400' : 'text-zinc-400'}`}>
                        <FileText className="w-3 h-3" />
                        <span>{isActive ? 'Current Script' : 'View Script'}</span>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full opacity-20 group-hover:opacity-40 transition-opacity">
                    <CalendarIcon className="w-6 h-6 text-zinc-400 mb-1" />
                    <span className="text-[10px] text-zinc-500">Empty</span>
                </div>
            )}
        </motion.div>
    )
}
