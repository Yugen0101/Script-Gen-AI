'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Sparkles,
    Copy,
    Save,
    Loader2,
    Check,
    Youtube,
    Linkedin,
    ArrowLeft,
    Mic,
    MicOff,
    Feather,
    Music2,
    Video,
    Instagram,
    Twitter,
    Newspaper,
    Calendar as CalendarIcon,
    CheckCircle2,
    XCircle
} from 'lucide-react'
import Image from 'next/image'

import Header from '@/components/Header'
import Logo from '@/components/Logo'
import { generateScript } from '@/app/actions/generate-script'
import { generateCalendarContent } from '@/app/actions/generate-calendar'
import { saveScript } from '@/app/actions/save-script'

import CalendarView from '@/components/CalendarView'
import YouTubeView from '@/components/script-display/YouTubeView'
import InstagramView from '@/components/script-display/InstagramView'
import LinkedInView from '@/components/script-display/LinkedInView'
import TwitterView from '@/components/script-display/TwitterView'


interface Script {
    id: string
    title: string
    platform: string
    tone: string
    content: any
    language?: string
    length?: string
    custom_length?: string
    scheduled_date?: string
}




export default function EditScriptClient({ script }: { script: Script }) {
    const router = useRouter()
    const [platform, setPlatform] = useState(script.platform)
    const [topic, setTopic] = useState(script.title)
    const [tone, setTone] = useState(script.tone || 'Professional')
    const [length, setLength] = useState(script.length || 'General (~60s)')
    const [customLength, setCustomLength] = useState(script.custom_length || '60')
    const [language, setLanguage] = useState(script.language || 'English')
    const [framework, setFramework] = useState('General')
    const [customLengthSet, setCustomLengthSet] = useState(!!script.custom_length)
    const [content, setContent] = useState(() => {
        if (typeof script.content === 'object' && script.content !== null) {
            return JSON.stringify(script.content, null, 2)
        }
        return script.content || ''
    })
    const [title, setTitle] = useState(script.title)
    const [duration, setDuration] = useState(() => {
        if (script.content?.isBundle) return script.content.scripts.length
        try {
            const clean = (typeof script.content === 'string' ? script.content : '').replace(/```json/g, '').replace(/```/g, '').trim()
            if (clean.startsWith('{')) {
                const data = JSON.parse(clean)
                if (data.isBundle) return data.scripts.length
            }
        } catch (e) { }
        return 7
    })
    const [isCalendarMode, setIsCalendarMode] = useState(() => {
        if (script.content?.isBundle) return true
        try {
            const clean = (typeof script.content === 'string' ? script.content : '').replace(/```json/g, '').replace(/```/g, '').trim()
            if (clean.startsWith('{')) {
                const data = JSON.parse(clean)
                if (data.isBundle) return true
            }
        } catch (e) { }
        return false
    })
    const [isListening, setIsListening] = useState(false)


    const [scriptData, setScriptData] = useState<any>(() => {
        if (typeof script.content === 'object' && script.content !== null) {
            return script.content
        }
        try {
            const clean = (script.content || '').replace(/```json/g, '').replace(/```/g, '').trim()
            if (clean.startsWith('{')) {
                return JSON.parse(clean)
            }
        } catch (e) { }
        return null
    })
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    // Date State Management
    const [scheduledDate, setScheduledDate] = useState<string>(
        script.scheduled_date || new Date().toISOString()
    )

    // Completion State
    const [completedThrough, setCompletedThrough] = useState<number>(() => {
        // Try to get from script content
        try {
            if (scriptData && typeof scriptData.completedThrough === 'number') {
                return scriptData.completedThrough
            }
        } catch (e) { }
        return 0
    })

    const loadingMessages = [
        "Analyzing your topic...",
        "Crafting a viral hook...",
        "Brainstorming visual shots...",
        "Writing detailed audio directions...",
        "Structuring for maximum retention...",
        "Finalizing your masterpiece..."
    ]

    const [loadingMessageIndex, setLoadingMessageIndex] = useState(0)


    // Cycle through loading messages
    useEffect(() => {
        if (loading) {
            const interval = setInterval(() => {
                setLoadingMessageIndex(prev => (prev + 1) % loadingMessages.length)
            }, 2500)
            return () => clearInterval(interval)
        } else {
            setLoadingMessageIndex(0)
        }
    }, [loading])

    const tones = ['Professional', 'Casual', 'Creative', 'Funny', 'Educational', 'Viral/High Energy', 'Controversial']


    const startListening = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        if (!SpeechRecognition) {
            alert('Voice input is not supported in this browser.')
            return
        }

        const recognition = new SpeechRecognition()
        recognition.lang = 'en-US'
        recognition.continuous = false
        recognition.interimResults = false

        recognition.onstart = () => setIsListening(true)
        recognition.onend = () => setIsListening(false)

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript
            setTopic(prev => prev ? `${prev} ${transcript}` : transcript)
        }

        recognition.start()
    }

    const handleRegenerate = async () => {
        if (!topic.trim()) {
            setError('Please enter a topic')
            return
        }

        setLoading(true)
        setError('')

        const dayCount = isCalendarMode ? duration : 1

        if (dayCount > 1) {

            const result = await generateCalendarContent({
                platform,
                topic,
                tone,
                days: dayCount,

                language,
                skipSave: true
            })


            if (result.success && result.scripts) {
                const bundle = {
                    isBundle: true,
                    scripts: result.scripts,
                    completedThrough: 0
                }
                const contentStr = JSON.stringify(bundle)
                setContent(contentStr)
                setScriptData(bundle)
                setTitle(`${dayCount}-Day Plan: ${topic}`)
                setCompletedThrough(0)

            } else {
                setError(result.error || 'Failed to generate calendar')
            }
        } else {
            const result = await generateScript({
                platform,
                topic,
                tone,
                length: `${customLength} ${['LinkedIn', 'Twitter'].includes(platform) ? 'words' : 'seconds'}`,
                language,
                framework: framework === 'General' ? undefined : framework
            })

            if (result.success && result.content) {
                setContent(result.content)
                setTitle(topic)
                try {
                    const cleanContent = result.content.replace(/```json/g, '').replace(/```/g, '').trim()
                    let data = JSON.parse(cleanContent)

                    // Fallback: Map sections to scenes if missing for Instagram
                    if (platform.toLowerCase() === 'instagram' && !data.scenes && data.sections) {
                        data.scenes = data.sections.map((s: any) => ({
                            visual: s.visual,
                            overlay: s.audio || '',
                            duration: '5s'
                        }))
                    }
                    // Fallback: Map scenes to sections if missing for YouTube
                    if (platform.toLowerCase() === 'youtube' && !data.sections && data.scenes) {
                        data.sections = data.scenes.map((s: any) => ({
                            visual: s.visual,
                            audio: s.overlay || ''
                        }))
                    }

                    setScriptData(data)
                } catch (e) {
                    console.error("Failed to parse script JSON", e)
                }
            } else {
                setError(result.error || 'Failed to generate script')
            }
        }

        setLoading(false)
    }


    const handleSave = async (overrideContent?: string, overrideScheduledDate?: string) => {
        const contentToSave = overrideContent || content

        if (!contentToSave.trim()) {
            setError('No content to save')
            return
        }

        setSaving(true)
        setError('')

        const result = await saveScript({
            id: script.id,
            title: title || topic,
            platform,
            tone,
            content: contentToSave,
            language,
            length,
            customLength,
            scheduledDate: overrideScheduledDate || scheduledDate
        })

        if (result.success) {
            // Only redirect if it's a manual save button click, not an auto-state update
            if (!overrideContent) {
                router.push('/dashboard')
                router.refresh()
            } else {
                router.refresh()
            }
        } else {
            setError(result.error || 'Failed to save script')
        }

        setSaving(false)
    }

    const handleCompleted = async () => {
        if (!scriptData?.isBundle) return

        const newCompletedThrough = completedThrough + 1
        setCompletedThrough(newCompletedThrough)

        // Update content JSON with new completion status
        const updatedData = { ...scriptData, completedThrough: newCompletedThrough }
        const updatedContent = JSON.stringify(updatedData)
        setScriptData(updatedData)
        setContent(updatedContent)

        await handleSave(updatedContent)
    }

    const handleNotCompleted = async () => {
        // Reset start date to TODAY
        const today = new Date().toISOString()
        setScheduledDate(today)

        await handleSave(undefined, today)
    }

    const handleUndo = async () => {
        if (!scriptData?.isBundle) return
        if (completedThrough <= 0) return // Can't undo if nothing completed

        const newCompletedThrough = completedThrough - 1
        setCompletedThrough(newCompletedThrough)

        // Update content JSON with new completion status
        const updatedData = { ...scriptData, completedThrough: newCompletedThrough }
        const updatedContent = JSON.stringify(updatedData)
        setScriptData(updatedData)
        setContent(updatedContent)

        await handleSave(updatedContent)
    }


    const getCalendarScripts = () => {
        if (!scriptData?.scripts) return []

        // Match CalendarView's base date logic
        const baseDate = scheduledDate ? new Date(scheduledDate) : new Date()

        return scriptData.scripts.map((s: any, idx: number) => {
            // Match CalendarView's loop logic
            const d = new Date(baseDate)
            d.setDate(baseDate.getDate() + idx)

            // Determine status
            let status: 'completed' | 'active' | 'pending' = 'pending'
            if (idx < completedThrough) status = 'completed'
            else if (idx === completedThrough) status = 'active'

            return {
                ...s,
                scheduled_date: d.toISOString().split('T')[0],
                status
            }
        })
    }

    const handleCopy = async () => {
        if (!content) return
        await navigator.clipboard.writeText(content)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 lg:px-6 pt-24 pb-8 relative z-0">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 smooth-transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </button>
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-bold mb-2">
                            <span className="gradient-text">Edit Script</span>
                        </h1>
                        {scheduledDate && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full mb-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-xs font-bold text-green-400 uppercase tracking-widest">
                                    Start Date: {(() => {
                                        // Parse as UTC date to prevent timezone drift
                                        const dateStr = scheduledDate.split('T')[0]; // Get YYYY-MM-DD part
                                        const [year, month, day] = dateStr.split('-').map(Number);
                                        const utcDate = new Date(Date.UTC(year, month - 1, day));
                                        return utcDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', timeZone: 'UTC' });
                                    })()}
                                </span>
                            </div>
                        )}
                        {scriptData?.isBundle && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full mb-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                                    Bundled Plan ({scriptData.scripts.length} Days)
                                </span>
                            </div>
                        )}
                    </div>


                    <p className="text-muted-foreground">
                        Modify and regenerate your script
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Sidebar - Inputs */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-1"
                    >
                        <div className="bg-white dark:bg-[#0B1120] rounded-2xl p-6 sticky top-24 border border-zinc-200 dark:border-white/5 shadow-xl shadow-zinc-200/40 dark:shadow-none text-zinc-900 dark:text-white">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-zinc-900 dark:text-white">
                                <Logo className="w-6 h-6" />
                                Script Settings
                            </h2>

                            <div className="space-y-6">
                                {/* Content Calendar Picker */}
                                <div>
                                    <label className="block text-xs font-bold text-blue-500 uppercase tracking-wider mb-3">CONTENT CALENDAR</label>
                                    <div className="space-y-3">
                                        <div className="flex gap-2 p-1.5 bg-zinc-100 dark:bg-[#1A202C] rounded-2xl border border-zinc-200 dark:border-white/5 shadow-inner">
                                            <button
                                                onClick={() => setIsCalendarMode(false)}
                                                className={`flex-1 py-3 px-2 rounded-xl text-sm font-bold smooth-transition ${!isCalendarMode
                                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                                                    }`}
                                            >
                                                1 Day
                                            </button>
                                            <button
                                                onClick={() => setIsCalendarMode(true)}
                                                className={`flex-1 py-3 px-2 rounded-xl text-sm font-bold smooth-transition ${isCalendarMode
                                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                                                    }`}
                                            >
                                                Calendar
                                            </button>
                                        </div>

                                        <AnimatePresence>
                                            {isCalendarMode && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <CalendarIcon className="w-4 h-4 text-blue-400" />
                                                                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">Plan Duration</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="number"
                                                                    value={duration}
                                                                    onChange={(e) => setDuration(Math.max(2, parseInt(e.target.value) || 2))}
                                                                    className="w-16 py-1.5 px-2 bg-zinc-100 dark:bg-[#1A202C] border border-blue-500/30 rounded-lg text-sm text-center font-bold text-blue-600 dark:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                                                />
                                                                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Days</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            {[7, 30].map((d) => (
                                                                <button
                                                                    key={d}
                                                                    onClick={() => setDuration(d)}
                                                                    className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${duration === d
                                                                        ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                                                                        : 'bg-zinc-100 dark:bg-[#0B1120] border-zinc-200 dark:border-white/5 text-zinc-500 hover:border-zinc-300 dark:hover:border-white/10 hover:text-zinc-600 dark:hover:text-zinc-400'
                                                                        }`}
                                                                >
                                                                    {d} Days
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* Platform */}


                                <div>
                                    <label className="block text-xs font-bold text-blue-500 uppercase tracking-wider mb-3">PLATFORM</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => setPlatform('YouTube')}
                                            className={`p-3 rounded-xl border smooth-transition flex items-center gap-3 ${platform === 'YouTube'
                                                ? 'bg-blue-500/10 border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                                                : 'bg-zinc-100 dark:bg-[#1A202C] border-zinc-200 dark:border-white/5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-[#1A202C]/80 hover:border-zinc-300 dark:hover:border-white/10'
                                                }`}
                                        >
                                            <Youtube className="w-5 h-5" />
                                            <span className="text-sm font-medium">YouTube</span>
                                        </button>
                                        <button
                                            onClick={() => setPlatform('LinkedIn')}
                                            className={`p-3 rounded-xl border smooth-transition flex items-center gap-3 ${platform === 'LinkedIn'
                                                ? 'bg-blue-500/10 border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                                                : 'bg-zinc-100 dark:bg-[#1A202C] border-zinc-200 dark:border-white/5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-[#1A202C]/80 hover:border-zinc-300 dark:hover:border-white/10'
                                                }`}
                                        >
                                            <Linkedin className="w-5 h-5" />
                                            <span className="text-sm font-medium">LinkedIn</span>
                                        </button>
                                        <button
                                            onClick={() => setPlatform('Instagram')}
                                            className={`p-3 rounded-xl border smooth-transition flex items-center gap-3 ${platform === 'Instagram'
                                                ? 'bg-blue-500/10 border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                                                : 'bg-zinc-100 dark:bg-[#1A202C] border-zinc-200 dark:border-white/5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-[#1A202C]/80 hover:border-zinc-300 dark:hover:border-white/10'
                                                }`}
                                        >
                                            <Instagram className="w-5 h-5" />
                                            <span className="text-sm font-medium">Instagram</span>
                                        </button>
                                        <button
                                            onClick={() => setPlatform('Twitter')}
                                            className={`p-3 rounded-xl border smooth-transition flex items-center gap-3 ${platform === 'Twitter'
                                                ? 'bg-blue-500/10 border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                                                : 'bg-zinc-100 dark:bg-[#1A202C] border-zinc-200 dark:border-white/5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-[#1A202C]/80 hover:border-zinc-300 dark:hover:border-white/10'
                                                }`}
                                        >
                                            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current">
                                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                            </svg>
                                            <span className="text-sm font-medium">Twitter</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Topic */}
                                <div>
                                    <label htmlFor="topic" className="block text-xs font-bold text-blue-500 uppercase tracking-wider mb-2">
                                        TOPIC
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="topic"
                                            value={topic}
                                            onChange={(e) => setTopic(e.target.value)}
                                            placeholder="What's your video about?"
                                            className="w-full pl-4 pr-12 py-3 bg-zinc-50 dark:bg-[#1A202C] border border-zinc-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 smooth-transition text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400"
                                        />
                                        <button
                                            onClick={startListening}
                                            className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg smooth-transition ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-400'}`}
                                        >
                                            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Tone */}
                                <div>
                                    <label className="block text-xs font-bold text-blue-500 uppercase tracking-wider mb-2">
                                        SCRIPT TONE
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={tone}
                                            onChange={(e) => setTone(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-[#1A202C] border border-zinc-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 smooth-transition appearance-none text-sm cursor-pointer text-zinc-900 dark:text-white"
                                        >
                                            {tones.map((t) => (
                                                <option key={t} value={t}>{t}</option>
                                            ))}
                                        </select>
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5Z" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Length */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-xs font-bold text-blue-500 uppercase tracking-wider">
                                            {['LinkedIn', 'Twitter'].includes(platform) ? 'POST LENGTH (WORDS)' : 'SCRIPT LENGTH (SECONDS)'}
                                        </label>
                                    </div>
                                    <div className="w-full">
                                        <input
                                            type="number"
                                            value={customLength}
                                            onChange={(e) => {
                                                setCustomLength(e.target.value)
                                                setCustomLengthSet(true)
                                            }}
                                            placeholder={['LinkedIn', 'Twitter'].includes(platform) ? "200" : "60"}
                                            className="w-full px-4 py-3 bg-zinc-50 dark:bg-[#1A202C] border border-zinc-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 smooth-transition text-sm text-zinc-900 dark:text-white"
                                        />
                                    </div>
                                </div>

                                {/* Framework */}
                                <div>
                                    <label className="block text-xs font-bold text-blue-500 uppercase tracking-wider mb-2">
                                        MARKETING FRAMEWORK
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={framework}
                                            onChange={(e) => setFramework(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-[#1A202C] border border-zinc-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 smooth-transition appearance-none text-sm cursor-pointer text-zinc-900 dark:text-white"
                                        >
                                            {['General', 'AIDA', 'PAS'].map((f) => (
                                                <option key={f} value={f}>{f === 'General' ? 'General (No framework)' : `${f} Framework`}</option>
                                            ))}
                                        </select>
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Language */}
                                <div>
                                    <label className="block text-xs font-bold text-blue-500 uppercase tracking-wider mb-2">
                                        SCRIPT LANGUAGE
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={language}
                                            onChange={(e) => setLanguage(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-[#1A202C] border border-zinc-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 smooth-transition appearance-none text-sm cursor-pointer text-zinc-900 dark:text-white"
                                        >
                                            {['English', 'Spanish', 'French', 'German', 'Hindi', 'Tamil', 'Telugu', 'Kannada'].map((l) => (
                                                <option key={l} value={l}>{l}</option>
                                            ))}
                                        </select>
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" x2="22" y1="12" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Regenerate Button */}
                                <button
                                    onClick={handleRegenerate}
                                    disabled={loading || !topic.trim()}
                                    className="w-full py-4 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl smooth-transition shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Writing your Script...
                                        </>
                                    ) : (
                                        <>
                                            <Logo className="w-5 h-5 grayscale brightness-0 invert" />
                                            Write your script
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Panel - Output */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2 min-h-[600px]"
                    >
                        <div className="glass rounded-2xl h-full border border-white/5 relative overflow-hidden">
                            {error && (
                                <div className="absolute top-4 left-4 right-4 z-10">
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm"
                                    >
                                        {error}
                                    </motion.div>
                                </div>
                            )}

                            <AnimatePresence mode="wait">
                                {loading ? (
                                    <motion.div
                                        key="loading"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex flex-col items-center justify-center h-full space-y-8"
                                    >
                                        <div className="relative w-32 h-32 flex items-center justify-center">
                                            {/* Advanced Animated Loading Icon */}
                                            <motion.div
                                                animate={{
                                                    scale: [1, 1.2, 1],
                                                    rotate: [0, 180, 360],
                                                    borderRadius: ["20%", "50%", "20%"],
                                                }}
                                                transition={{
                                                    duration: 3,
                                                    repeat: Infinity,
                                                    ease: "easeInOut",
                                                }}
                                                className="absolute inset-0 border-2 border-blue-500/30 dark:border-blue-400/20"
                                            />
                                            <motion.div
                                                animate={{
                                                    scale: [1.2, 1, 1.2],
                                                    rotate: [360, 180, 0],
                                                    borderRadius: ["50%", "20%", "50%"],
                                                }}
                                                transition={{
                                                    duration: 4,
                                                    repeat: Infinity,
                                                    ease: "easeInOut",
                                                }}
                                                className="absolute inset-0 border-2 border-purple-500/30 dark:border-purple-400/20"
                                            />
                                            <motion.div
                                                animate={{
                                                    scale: [1, 1.1, 1],
                                                    opacity: [0.5, 1, 0.5],
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: "linear",
                                                }}
                                                className="relative z-10"
                                            >
                                                <Logo className="w-12 h-12 text-blue-500" />
                                            </motion.div>

                                            {/* Orbital pulse */}
                                            <motion.div
                                                animate={{
                                                    scale: [1, 1.5],
                                                    opacity: [0.5, 0]
                                                }}
                                                transition={{
                                                    duration: 1.5,
                                                    repeat: Infinity,
                                                    ease: "easeOut"
                                                }}
                                                className="absolute w-full h-full border border-blue-500 rounded-full"
                                            />
                                        </div>

                                        <div className="text-center space-y-2">
                                            <AnimatePresence mode="wait">
                                                <motion.p
                                                    key={loadingMessageIndex}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
                                                >
                                                    {loadingMessages[loadingMessageIndex]}
                                                </motion.p>
                                            </AnimatePresence>
                                            <p className="text-sm text-muted-foreground animate-pulse">Our AI is putting on its creative hat...</p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="content"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="h-full flex flex-col"
                                    >
                                        <div className="p-4 border-b border-zinc-200 dark:border-white/10 flex justify-between items-center bg-zinc-50 dark:bg-[#0B1120]/50 backdrop-blur-sm">
                                            <h3 className="font-semibold text-zinc-900 dark:text-white">Script Content</h3>
                                            <div className="flex gap-2">

                                                <button
                                                    onClick={handleCopy}
                                                    className="p-2 hover:bg-white/10 rounded-lg smooth-transition"
                                                    title="Copy to clipboard"
                                                >
                                                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                                                </button>
                                                <button
                                                    onClick={() => handleSave()}
                                                    disabled={saving}
                                                    className="p-2 hover:bg-white/10 rounded-lg smooth-transition"
                                                    title="Save script"
                                                >
                                                    {saving ? <Loader2 className="w-4 h-4 animate-spin text-blue-400" /> : <Save className="w-4 h-4 text-muted-foreground" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                                            {scriptData?.isBundle ? (
                                                <div className="h-full">
                                                    <CalendarView
                                                        scripts={(scriptData.scripts || []).map((s: any) => ({
                                                            ...s,
                                                            platform: s.platform || script.platform
                                                        }))}
                                                        days={scriptData.scripts.length}
                                                        startDate={scheduledDate}
                                                        onCompleted={handleCompleted}
                                                        onReset={handleNotCompleted}
                                                        onUndo={handleUndo}
                                                    />
                                                </div>
                                            ) : scriptData ? (

                                                <div className="h-full">
                                                    {platform.toLowerCase() === 'youtube' ? (
                                                        <YouTubeView scriptData={scriptData} />
                                                    ) : platform.toLowerCase() === 'instagram' || platform.toLowerCase() === 'insta reels' || platform.toLowerCase() === 'tiktok' ? (
                                                        <InstagramView scriptData={scriptData} />
                                                    ) : platform.toLowerCase() === 'linkedin' ? (
                                                        <LinkedInView scriptData={scriptData} />
                                                    ) : platform.toLowerCase() === 'twitter' ? (
                                                        <TwitterView scriptData={scriptData} />
                                                    ) : (
                                                        <div className="space-y-6 max-w-4xl mx-auto">
                                                            {/* Hook Strategy */}
                                                            {scriptData.hook && (
                                                                <div className="bg-zinc-50 dark:bg-[#0f172a] rounded-xl p-6 border border-zinc-200 dark:border-white/10 relative overflow-hidden group shadow-lg">
                                                                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                                                        <Logo className="w-32 h-32 rotate-12" />
                                                                    </div>
                                                                    <div className="relative z-10">
                                                                        <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-3">HOOK STRATEGY</div>
                                                                        <div className="text-xl md:text-2xl font-medium text-zinc-900 dark:text-white leading-relaxed">
                                                                            {scriptData.hook}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Visual/Audio Table */}
                                                            <div className="border border-zinc-200 dark:border-white/10 rounded-xl overflow-hidden bg-white dark:bg-[#0f172a]/40 shadow-sm">
                                                                <div className="grid grid-cols-2 border-b border-zinc-200 dark:border-white/10 bg-zinc-50/80 dark:bg-white/5 backdrop-blur-sm">
                                                                    <div className="p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">VISUAL (SEE)</div>
                                                                    <div className="p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-l border-zinc-200 dark:border-white/10">AUDIO (HEAR)</div>
                                                                </div>
                                                                {scriptData.sections?.map((section: any, idx: number) => (
                                                                    <div key={idx} className="grid grid-cols-2 border-b last:border-0 border-zinc-200 dark:border-white/10 group hover:bg-zinc-50/50 dark:hover:bg-white/[0.02] transition-colors">
                                                                        <div className="p-5 text-sm text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed relative">
                                                                            <span className="absolute top-5 left-2 text-[10px] font-mono text-zinc-300 dark:text-zinc-700 select-none">0{idx + 1}</span>
                                                                            <div className="pl-4">{section.visual}</div>
                                                                        </div>
                                                                        <div className="p-5 text-sm text-zinc-800 dark:text-zinc-100 leading-relaxed border-l border-zinc-200 dark:border-white/10 bg-zinc-50/30 dark:bg-white/[0.02]">
                                                                            {section.audio}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (

                                                <textarea
                                                    value={content}
                                                    onChange={(e) => setContent(e.target.value)}
                                                    className="w-full h-full min-h-[500px] bg-transparent border-none focus:outline-none resize-none font-mono text-sm leading-relaxed"
                                                    placeholder="Your generated script will appear here..."
                                                />
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    )
}
