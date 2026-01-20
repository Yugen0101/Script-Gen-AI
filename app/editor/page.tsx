'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Loader2,
    Youtube,
    Instagram,
    Linkedin,
    Mic,
    MicOff,
    Volume2,
    Globe,
    Wrench,
    ChevronDown,
    Save,
    Calendar as CalendarIcon,
    Star,
    Layout,
    Check,
    Copy,
    Rocket,
    Feather,
    Newspaper
} from 'lucide-react'
import CustomSelect from '@/components/CustomSelect'
import Logo from '@/components/Logo'
import { generateScript } from '@/app/actions/generate-script'
import { generateCalendarContent } from '@/app/actions/generate-calendar'
import { saveScript, saveBundledScript } from '@/app/actions/save-script'
import CalendarView from '@/components/CalendarView'
import YouTubeView from '@/components/script-display/YouTubeView'
import InstagramView from '@/components/script-display/InstagramView'
import LinkedInView from '@/components/script-display/LinkedInView'
import TwitterView from '@/components/script-display/TwitterView'




export default function EditorPage() {
    const router = useRouter()
    const [platform, setPlatform] = useState('YouTube')
    const [topic, setTopic] = useState('')
    const [tone, setTone] = useState('Professional')
    const [length, setLength] = useState('General (~60s)')
    const [customLength, setCustomLength] = useState('60')
    const [language, setLanguage] = useState('English')
    const [framework, setFramework] = useState('General')
    const [customLengthSet, setCustomLengthSet] = useState(false)

    const [content, setContent] = useState('')
    const [title, setTitle] = useState('')
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')
    const [isListening, setIsListening] = useState(false)
    const [scriptData, setScriptData] = useState<any>(null)
    const [duration, setDuration] = useState(7)
    const [isCalendarMode, setIsCalendarMode] = useState(false)
    const [multiDayScripts, setMultiDayScripts] = useState<any[]>([])
    const tones = ['Professional', 'Casual', 'Creative', 'Funny', 'Educational', 'Viral/High Energy', 'Controversial']


    // Update default length based on platform if user hasn't custom set it
    useEffect(() => {
        if (!customLengthSet) {
            if (['LinkedIn', 'Twitter'].includes(platform)) {
                setCustomLength('200')
            } else {
                setCustomLength('60')
            }
        }
    }, [platform, customLengthSet])






    const loadingMessages = [
        "Analyzing your topic...",
        "Crafting a viral hook...",
        "Brainstorming visual shots...",
        "Writing detailed audio directions...",
        "Structuring for maximum retention...",
        "Finalizing your masterpiece..."
    ]

    const [loadingMessageIndex, setLoadingMessageIndex] = useState(0)

    // Update custom length based on preset


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

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError('Please enter a topic')
            return
        }

        setLoading(true)
        setError('')
        setContent('')
        setScriptData(null)
        setMultiDayScripts([])

        const dayCount = isCalendarMode ? duration : 1


        if (dayCount > 1) {
            // Multi-day calendar generation
            const result = await generateCalendarContent({
                platform,
                topic,
                tone,
                language,
                days: dayCount,
                skipSave: true
            })

            if (result.success && result.scripts) {
                setMultiDayScripts(result.scripts)
                setContent(JSON.stringify(result.scripts)) // Store for potential bulk save
            } else {
                setError(result.error || 'Failed to generate calendar')
            }
        } else {
            // Single script generation
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


    const handleSave = async () => {
        if (!content.trim() && multiDayScripts.length === 0) {
            setError('No content to save')
            return
        }

        setSaving(true)
        setError('')

        try {
            if (multiDayScripts.length > 0) {
                // Bulk save for calendar (now bundled)
                const result = await saveBundledScript(multiDayScripts, topic || 'Untitled Plan')
                if (result.success) {
                    router.push('/dashboard')
                } else {
                    setError(result.error || 'Failed to save scripts')
                }
            } else {

                // Single script save
                const result = await saveScript({
                    title: title || topic || 'Untitled Script',
                    platform,
                    tone,
                    content,
                    language,
                    length: `${customLength} seconds`,
                    customLength: customLength
                })


                if (result.success) {
                    router.push('/dashboard')
                } else {
                    setError(result.error || 'Failed to save script')
                }
            }
        } catch (err: any) {

            setError(err.message || 'An error occurred while saving')
        } finally {
            setSaving(false)
        }
    }


    const handleCopy = async () => {
        if (!content) return
        await navigator.clipboard.writeText(content)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="min-h-screen bg-background">
            <main className="container mx-auto px-4 lg:px-6 pt-24 pb-8 relative z-0">

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Sidebar - Inputs */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-1"
                    >
                        <div className="bg-white dark:bg-[#0B1120] rounded-2xl p-6 sticky top-24 border border-zinc-200 dark:border-white/5 shadow-xl shadow-zinc-200/50 dark:shadow-none bg-white/50 dark:bg-black/20 text-zinc-900 dark:text-white">
                            <div className="flex items-center gap-3 mb-6">
                                <button onClick={() => router.back()} className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white smooth-transition">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                                </button>
                                <h2 className="text-xl font-semibold flex items-center gap-2 text-zinc-900 dark:text-white">
                                    <Logo className="w-6 h-6" />
                                    Script Settings
                                </h2>
                            </div>

                            <div className="space-y-8">
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
                                                                <span className="text-sm font-medium text-zinc-300">Plan Duration</span>
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
                                                ? 'bg-blue-500/10 border-blue-500/50 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                                                : 'bg-zinc-100 dark:bg-[#1e293b] border-zinc-200 dark:border-white/5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-[#1e293b]/80 hover:border-zinc-300 dark:hover:border-white/10'
                                                }`}
                                        >
                                            <Youtube className="w-5 h-5" />
                                            <span className="text-sm font-medium">YouTube</span>
                                        </button>
                                        <button
                                            onClick={() => setPlatform('LinkedIn')}
                                            className={`p-3 rounded-xl border smooth-transition flex items-center gap-3 ${platform === 'LinkedIn'
                                                ? 'bg-blue-500/10 border-blue-500/50 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                                                : 'bg-zinc-100 dark:bg-[#1e293b] border-zinc-200 dark:border-white/5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-[#1e293b]/80 hover:border-zinc-300 dark:hover:border-white/10'
                                                }`}
                                        >
                                            <Linkedin className="w-5 h-5" />
                                            <span className="text-sm font-medium">LinkedIn</span>
                                        </button>
                                        <button
                                            onClick={() => setPlatform('Instagram')}
                                            className={`p-3 rounded-xl border smooth-transition flex items-center gap-3 ${platform === 'Instagram'
                                                ? 'bg-blue-500/10 border-blue-500/50 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                                                : 'bg-zinc-100 dark:bg-[#1e293b] border-zinc-200 dark:border-white/5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-[#1e293b]/80 hover:border-zinc-300 dark:hover:border-white/10'
                                                }`}
                                        >
                                            <Instagram className="w-5 h-5" />
                                            <span className="text-sm font-medium">Instagram</span>
                                        </button>
                                        <button
                                            onClick={() => setPlatform('Twitter')}
                                            className={`p-3 rounded-xl border smooth-transition flex items-center gap-3 ${platform === 'Twitter'
                                                ? 'bg-blue-500/10 border-blue-500/50 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                                                : 'bg-zinc-100 dark:bg-[#1e293b] border-zinc-200 dark:border-white/5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-[#1e293b]/80 hover:border-zinc-300 dark:hover:border-white/10'
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
                                <CustomSelect
                                    label="SCRIPT TONE"
                                    value={tone}
                                    onChange={setTone}
                                    options={tones}
                                    icon={<Volume2 className="w-4 h-4" />}
                                />

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
                                <CustomSelect
                                    label="MARKETING FRAMEWORK"
                                    value={framework === 'General' ? 'General (No framework)' : `${framework} Framework`}
                                    onChange={(val) => {
                                        const actualVal = val.startsWith('General') ? 'General' : val.split(' ')[0]
                                        setFramework(actualVal)
                                    }}
                                    options={['General (No framework)', 'AIDA Framework', 'PAS Framework']}
                                    icon={<Wrench className="w-4 h-4" />}
                                />

                                {/* Language */}
                                <CustomSelect
                                    label="SCRIPT LANGUAGE"
                                    value={language}
                                    onChange={setLanguage}
                                    options={['English', 'Spanish', 'French', 'German', 'Hindi', 'Tamil', 'Telugu', 'Kannada']}
                                    icon={<Globe className="w-4 h-4" />}
                                />

                                {/* Generate Button */}
                                <button
                                    onClick={handleGenerate}
                                    disabled={loading || !topic.trim()}
                                    className="w-full py-4 px-4 btn-royal text-base hover:brightness-110 flex items-center justify-center gap-3 mt-4"
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
                        <div className="bg-white dark:bg-[#0B1120] rounded-2xl h-full border border-zinc-200 dark:border-white/5 relative overflow-hidden shadow-xl shadow-zinc-200/50 dark:shadow-none">
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
                                ) : content ? (
                                    <motion.div
                                        key="content"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="h-full flex flex-col"
                                    >
                                        <div className="p-4 border-b border-zinc-200 dark:border-white/10 flex flex-col sm:flex-row justify-between items-center bg-zinc-50/50 dark:bg-[#0B1120]/50 backdrop-blur-sm sticky top-0 z-20 gap-4">
                                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                                <div>
                                                    <h3 className="font-semibold text-zinc-900 dark:text-white leading-tight">{title || 'Generated Content'}</h3>
                                                    <div className="flex gap-2 text-[10px] text-muted-foreground mt-0.5">
                                                        <span className="uppercase">{platform}</span>
                                                        <span>•</span>
                                                        <span>{language}</span>
                                                        {multiDayScripts.length > 0 && (
                                                            <>
                                                                <span>•</span>
                                                                <span className="text-blue-500 font-bold">{multiDayScripts.length} DAYS</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 w-full sm:w-auto justify-end">

                                                <button
                                                    onClick={handleCopy}
                                                    className="px-3 py-1.5 bg-zinc-100 dark:bg-white/10 hover:bg-zinc-200 dark:hover:bg-white/20 rounded-lg smooth-transition text-xs font-medium flex items-center gap-2"
                                                >
                                                    {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                                                    {copied ? 'Copied' : 'Copy'}
                                                </button>
                                                <button
                                                    onClick={handleSave}
                                                    disabled={saving}
                                                    className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg smooth-transition text-xs font-bold flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-blue-500/20"
                                                >
                                                    {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                                                    Confirm Save
                                                </button>
                                            </div>
                                        </div>


                                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                                            {multiDayScripts.length > 0 ? (
                                                <div className="max-w-6xl mx-auto">
                                                    <CalendarView
                                                        scripts={multiDayScripts.map(s => ({ ...s, platform }))}
                                                        days={isCalendarMode ? duration : 1}
                                                    />


                                                </div>
                                            ) : scriptData ? (
                                                <>
                                                    {/* Platform-Specific Rendering */}
                                                    {platform.toLowerCase() === 'instagram' || platform.toLowerCase() === 'insta reels' || platform.toLowerCase() === 'tiktok' ? (
                                                        <InstagramView scriptData={scriptData} />
                                                    ) : platform.toLowerCase() === 'linkedin' ? (
                                                        <LinkedInView scriptData={scriptData} />
                                                    ) : platform.toLowerCase() === 'twitter' ? (
                                                        <TwitterView scriptData={scriptData} />
                                                    ) : (
                                                        <YouTubeView scriptData={scriptData} />
                                                    )}
                                                </>
                                            ) : (
                                                <textarea
                                                    value={content}
                                                    onChange={(e) => setContent(e.target.value)}
                                                    className="w-full h-full min-h-[500px] bg-transparent border-none focus:outline-none resize-none font-mono text-sm leading-relaxed text-zinc-800 dark:text-zinc-300"
                                                    placeholder="Your generated script will appear here..."
                                                />
                                            )}
                                        </div>

                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="empty"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex flex-col items-center justify-center h-full text-center p-8"
                                    >
                                        <div className="w-24 h-24 rounded-3xl bg-zinc-100 dark:bg-[#0B1120] border border-blue-500/10 flex items-center justify-center mb-6 shadow-2xl shadow-blue-900/10">
                                            <Logo className="w-12 h-12" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-200">Ready to create?</h3>
                                        <p className="text-zinc-500">
                                            Configure your script settings on the left.
                                        </p>
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
