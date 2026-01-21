'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Maximize2, X, CheckCircle2, XCircle, RotateCcw, FileText, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import CalendarDay from './CalendarDay'


import YouTubeView from './script-display/YouTubeView'
import InstagramView from './script-display/InstagramView'
import LinkedInView from './script-display/LinkedInView'
import TwitterView from './script-display/TwitterView'

interface Script {
    id?: string
    title: string
    content: any
    scheduled_date: string
    status?: 'completed' | 'active' | 'pending'
    platform?: string
}

interface CalendarViewProps {
    scripts: Script[]
    days: number
    startDate?: string
    onCompleted?: () => void
    onReset?: () => void
    onUndo?: () => void
}

export default function CalendarView({ scripts, days, startDate, onCompleted, onReset, onUndo }: CalendarViewProps) {
    const router = useRouter()
    const [selectedScript, setSelectedScript] = useState<Script | null>(null)


    // Map scripts to dates for easy lookup
    const scriptMap = new Map(scripts.map(s => [s.scheduled_date, s]));

    // Use provided startDate or default to today
    const start = startDate ? new Date(startDate) : new Date();

    const calendarDays = Array.from({ length: days }, (_, i) => {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        const dateString = date.toISOString().split('T')[0];
        return {
            day: i + 1,
            date: dateString,
            script: scriptMap.get(dateString)
        };
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                        <CalendarIcon className="w-5 h-5 text-blue-400" />
                    </div>
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                        {days === 7 ? 'Weekly Content Plan' : 'Monthly Content Calendar'}
                    </h2>
                </div>

                <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-[#1e293b] px-3 py-1.5 rounded-full border border-zinc-200 dark:border-white/5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    {scripts.length} Scripts Generated
                </div>
            </div>

            <div className={`grid gap-4 ${days === 7 ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-7' : 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6'}`}>
                {calendarDays.map((dayData, index) => (
                    <motion.div
                        key={dayData.date}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.02 }}
                    >
                        <CalendarDay
                            day={dayData.day}
                            date={dayData.date}
                            title={dayData.script?.title}
                            status={dayData.script?.status}
                            isToday={index === 0}
                            onClick={() => dayData.script && setSelectedScript(dayData.script)}
                        />
                    </motion.div>
                ))}
            </div>

            {/* Script Detail Modal */}
            <AnimatePresence>
                {selectedScript && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-5xl bg-white dark:bg-[#0B1120] border border-zinc-200 dark:border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            <div className="p-8 border-b border-zinc-100 dark:border-white/5 flex items-center justify-between bg-gradient-to-r from-blue-600/5 to-transparent">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                        <FileText className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-black uppercase tracking-[2px] text-blue-600 dark:text-blue-400">
                                                Content Draft
                                            </span>
                                            <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                                            <span className="text-[10px] font-black uppercase tracking-[2px] text-zinc-500">
                                                {selectedScript.platform || 'General'}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight leading-none">
                                            {selectedScript.title}
                                        </h3>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedScript(null)}
                                    className="p-3 bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 rounded-2xl transition-all"
                                >
                                    <X className="w-5 h-5 text-zinc-500" />
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto flex-grow custom-scrollbar">
                                <ScriptPreview
                                    content={selectedScript.content}
                                    platform={selectedScript.platform || ''}
                                />
                            </div>

                            <div className="p-6 border-t border-zinc-100 dark:border-white/5 bg-zinc-50 dark:bg-black/20 flex flex-col sm:flex-row justify-between gap-4 items-center">
                                <div className="flex gap-2 w-full sm:w-auto">
                                    {(selectedScript.status === 'active' || selectedScript.status === 'pending') && onReset && (
                                        <button
                                            onClick={() => {
                                                onReset()
                                                setSelectedScript(null)
                                            }}
                                            className="px-5 py-2.5 rounded-2xl bg-red-500/10 text-red-600 border border-red-500/10 hover:bg-red-500/20 transition-all text-xs font-black uppercase tracking-wider flex items-center gap-2"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            Not Completed
                                        </button>
                                    )}
                                    {selectedScript.status === 'active' && onCompleted && (
                                        <button
                                            onClick={() => {
                                                onCompleted()
                                                setSelectedScript(null)
                                            }}
                                            className="px-5 py-2.5 rounded-2xl bg-green-500/10 text-green-600 border border-green-500/10 hover:bg-green-500/20 transition-all text-xs font-black uppercase tracking-wider flex items-center gap-2"
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                            Completed
                                        </button>
                                    )}
                                    {selectedScript.status === 'completed' && onUndo && (
                                        <button
                                            onClick={() => {
                                                onUndo()
                                                setSelectedScript(null)
                                            }}
                                            className="px-5 py-2.5 rounded-2xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/10 hover:bg-yellow-500/20 transition-all text-xs font-black uppercase tracking-wider flex items-center gap-2"
                                        >
                                            <RotateCcw className="w-4 h-4" />
                                            Undo
                                        </button>
                                    )}
                                </div>
                                <div className="flex gap-3 w-full sm:w-auto justify-end">
                                    <button
                                        onClick={() => setSelectedScript(null)}
                                        className="px-8 py-2.5 rounded-2xl bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm font-black hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-all uppercase tracking-tighter"
                                    >
                                        Dismiss
                                    </button>
                                    {selectedScript.id && (
                                        <button
                                            onClick={() => router.push(`/editor/${selectedScript.id}`)}
                                            className="px-8 py-2.5 rounded-2xl bg-blue-600 text-white text-sm font-black hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2 uppercase tracking-tighter"
                                        >
                                            <Maximize2 className="w-4 h-4" />
                                            Edit Script
                                        </button>
                                    )}
                                </div>
                            </div>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

function ScriptPreview({ content, platform }: { content: any, platform: string }) {
    let data;
    try {
        if (typeof content === 'string') {
            const clean = content.replace(/```json/g, '').replace(/```/g, '').trim()
            data = JSON.parse(clean);
        } else {
            data = content;
        }
    } catch (e) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
                <XCircle className="w-12 h-12 text-red-400" />
                <div>
                    <p className="font-bold text-zinc-900 dark:text-white">Rendering Error</p>
                    <p className="text-sm text-zinc-500">The script content is in an invalid format.</p>
                </div>
            </div>
        )
    }

    const platformLower = platform.toLowerCase()

    // Pass data through premium views
    if (platformLower === 'instagram' || platformLower === 'insta reels' || platformLower === 'tiktok') {
        // Fix data structure if needed
        if (!data.scenes && data.sections) {
            data.scenes = data.sections.map((s: any) => ({
                visual: s.visual,
                overlay: s.audio || '',
                duration: '5s'
            }))
        }
        return <InstagramView scriptData={data} />
    }

    if (platformLower === 'linkedin') {
        // Fix data structure for calendar-generated scripts
        if (!data.body && data.sections) {
            data.body = data.sections.map((s: any) => s.audio).join('\n\n')
        }
        return <LinkedInView scriptData={data} />
    }

    if (platformLower === 'twitter') {
        // Fix data structure for calendar-generated scripts
        if (!data.tweets && data.sections) {
            data.tweets = data.sections.map((s: any) => ({
                text: s.audio || s.visual
            }))
        }
        return <TwitterView scriptData={data} />
    }

    if (platformLower === 'youtube') {
        if (!data.sections && data.scenes) {
            data.sections = data.scenes.map((s: any) => ({
                visual: s.visual,
                audio: s.overlay || ''
            }))
        }
        return <YouTubeView scriptData={data} />
    }

    // Default Fallback - Premium General View
    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            {/* Platform Header Pill */}
            <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 dark:bg-blue-500/20 rounded-full border border-blue-500/20 backdrop-blur-md">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">General Content Strategy</span>
                </div>
            </div>

            {/* Hook Strategy */}
            {data.hook && (
                <div className="relative group lg:mx-8">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                    <div className="relative bg-white dark:bg-[#0f172a] rounded-[2rem] p-8 border border-zinc-200 dark:border-white/10 shadow-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-500 rounded-lg">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">The Impact Hook</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white leading-tight italic">
                            "{data.hook}"
                        </h2>
                    </div>
                </div>
            )}

            {/* Content Sections */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-6 lg:px-8">
                    <div className="flex items-center gap-2">
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 4 }}
                        >
                            <FileText className="w-5 h-5 text-zinc-400" />
                        </motion.div>
                        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Script Blueprint</h3>
                    </div>
                    <div className="text-[10px] font-medium text-zinc-400 uppercase tracking-tighter">Total Sections: {data.sections?.length || 0}</div>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:mx-8">
                    {data.sections?.map((section: any, idx: number) => (
                        <div key={idx} className="group relative flex flex-col md:flex-row gap-0.5 rounded-[2rem] overflow-hidden border border-zinc-200 dark:border-white/10 shadow-md hover:shadow-lg transition-all duration-300">
                            {/* Sequence Number */}
                            <div className="md:w-24 bg-zinc-50 dark:bg-white/[0.03] p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-zinc-200 dark:border-white/10 font-black text-2xl text-zinc-200 dark:text-zinc-800 group-hover:text-blue-500/20 transition-colors">
                                {(idx + 1).toString().padStart(2, '0')}
                            </div>

                            {/* Content split */}
                            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
                                <div className="p-6 bg-white dark:bg-[#0f172a]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                                        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Visual Strategy</span>
                                    </div>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">{section.visual}</p>
                                </div>
                                <div className="p-6 bg-zinc-50 dark:bg-white/[0.04] border-t lg:border-t-0 lg:border-l border-zinc-200 dark:border-white/10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Audio / Script</span>
                                    </div>
                                    <p className="text-sm text-zinc-900 dark:text-zinc-100 font-bold leading-relaxed italic">"{section.audio}"</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

