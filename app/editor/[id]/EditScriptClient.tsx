'use client'

import { useState } from 'react'
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
    Rocket,
    Music2,
    Video
} from 'lucide-react'
import Header from '@/components/Header'
import Logo from '@/components/Logo'
import { generateScript } from '@/app/actions/generate-script'
import { saveScript } from '@/app/actions/save-script'

interface Script {
    id: string
    title: string
    platform: string
    tone: string
    content: string
}

export default function EditScriptClient({ script }: { script: Script }) {
    const router = useRouter()
    const [platform, setPlatform] = useState(script.platform)
    const [topic, setTopic] = useState(script.title)
    const [tone, setTone] = useState(script.tone || 'Professional')
    const [length, setLength] = useState('General (~60s)')
    const [customLength, setCustomLength] = useState('')
    const [language, setLanguage] = useState('English')
    const [content, setContent] = useState(script.content)
    const [title, setTitle] = useState(script.title)
    const [isListening, setIsListening] = useState(false)
    const [scriptData, setScriptData] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const tones = ['Professional', 'Casual', 'Creative', 'Funny', 'Educational', 'Viral/High Energy', 'Controversial']
    const lengths = ['Bytes (60secs)', 'General writeup (2mins)', 'Dive deep (4minutes)', 'Custom duration']

    // Parse initial content if it's JSON
    useState(() => {
        try {
            const clean = script.content.replace(/```json/g, '').replace(/```/g, '').trim()
            if (clean.startsWith('{')) {
                setScriptData(JSON.parse(clean))
            }
        } catch (e) { }
    })

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

        const result = await generateScript({
            platform,
            topic,
            tone,
            length: length === 'Custom duration' ? customLength : length,
            language
        })

        if (result.success && result.content) {
            setContent(result.content)
            setTitle(topic)
            try {
                const cleanContent = result.content.replace(/```json/g, '').replace(/```/g, '').trim()
                const data = JSON.parse(cleanContent)
                setScriptData(data)
            } catch (e) {
                console.error("Failed to parse script JSON", e)
            }
        } else {
            setError(result.error || 'Failed to generate script')
        }

        setLoading(false)
    }

    const handleSave = async () => {
        if (!content.trim()) {
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
            content,
        })

        if (result.success) {
            router.push('/dashboard')
        } else {
            setError(result.error || 'Failed to save script')
        }

        setSaving(false)
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
                    <h1 className="text-4xl font-bold mb-2">
                        <span className="gradient-text">Edit Script</span>
                    </h1>
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
                        <div className="glass rounded-2xl p-6 sticky top-24 border border-white/5">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-primary" />
                                Script Settings
                            </h2>

                            <div className="space-y-6">
                                {/* Platform */}
                                <div>
                                    <label className="block text-xs font-bold text-blue-500 uppercase tracking-wider mb-3">PLATFORM</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => setPlatform('YouTube')}
                                            className={`p-3 rounded-xl border smooth-transition flex items-center gap-3 ${platform === 'YouTube'
                                                ? 'bg-blue-500/10 border-blue-500/50 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                                                : 'bg-[#1e293b] border-white/5 text-zinc-400 hover:bg-[#1e293b]/80 hover:border-white/10'
                                                }`}
                                        >
                                            <Youtube className="w-5 h-5" />
                                            <span className="text-sm font-medium">YouTube</span>
                                        </button>
                                        <button
                                            onClick={() => setPlatform('LinkedIn')}
                                            className={`p-3 rounded-xl border smooth-transition flex items-center gap-3 ${platform === 'LinkedIn'
                                                ? 'bg-blue-500/10 border-blue-500/50 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                                                : 'bg-[#1e293b] border-white/5 text-zinc-400 hover:bg-[#1e293b]/80 hover:border-white/10'
                                                }`}
                                        >
                                            <Linkedin className="w-5 h-5" />
                                            <span className="text-sm font-medium">LinkedIn</span>
                                        </button>
                                        <button
                                            onClick={() => setPlatform('TikTok')}
                                            className={`p-3 rounded-xl border smooth-transition flex items-center gap-3 ${platform === 'TikTok'
                                                ? 'bg-blue-500/10 border-blue-500/50 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                                                : 'bg-[#1e293b] border-white/5 text-zinc-400 hover:bg-[#1e293b]/80 hover:border-white/10'
                                                }`}
                                        >
                                            <Music2 className="w-5 h-5" />
                                            <span className="text-sm font-medium">TikTok</span>
                                        </button>
                                        <button
                                            onClick={() => setPlatform('Shorts')}
                                            className={`p-3 rounded-xl border smooth-transition flex items-center gap-3 ${platform === 'Shorts'
                                                ? 'bg-blue-500/10 border-blue-500/50 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                                                : 'bg-[#1e293b] border-white/5 text-zinc-400 hover:bg-[#1e293b]/80 hover:border-white/10'
                                                }`}
                                        >
                                            <Video className="w-5 h-5" />
                                            <span className="text-sm font-medium">Shorts</span>
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
                                            className="w-full pl-4 pr-12 py-3 bg-[#0B1120] border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 smooth-transition text-sm"
                                        />
                                        <button
                                            onClick={startListening}
                                            className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg smooth-transition ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'hover:bg-white/10 text-muted-foreground'}`}
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
                                            className="w-full pl-10 pr-4 py-3 bg-[#0B1120] border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 smooth-transition appearance-none text-sm cursor-pointer"
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
                                            SCRIPT LENGTH
                                        </label>
                                        {length === 'Custom duration' && (
                                            <span className="text-xs text-zinc-500">Custom Seconds</span>
                                        )}
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="relative flex-1">
                                            <select
                                                value={length}
                                                onChange={(e) => setLength(e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 bg-[#0B1120] border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 smooth-transition appearance-none text-sm cursor-pointer"
                                            >
                                                {lengths.map((l) => (
                                                    <option key={l} value={l}>{l}</option>
                                                ))}
                                            </select>
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                            </div>
                                        </div>
                                        {length === 'Custom duration' && (
                                            <motion.div
                                                initial={{ opacity: 0, width: 0 }}
                                                animate={{ opacity: 1, width: '6rem' }}
                                                className="overflow-hidden"
                                            >
                                                <input
                                                    value={customLength}
                                                    onChange={(e) => setCustomLength(e.target.value)}
                                                    placeholder="60"
                                                    className="w-full h-full px-3 py-3 bg-[#0B1120] border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 smooth-transition text-sm text-center"
                                                />
                                            </motion.div>
                                        )}
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
                                            className="w-full pl-10 pr-4 py-3 bg-[#0B1120] border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 smooth-transition appearance-none text-sm cursor-pointer"
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
                                        className="flex flex-col items-center justify-center h-full"
                                    >
                                        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                                        <p className="text-muted-foreground">Regenerating your magic...</p>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="content"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="h-full flex flex-col"
                                    >
                                        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0B1120]/50 backdrop-blur-sm">
                                            <h3 className="font-semibold text-white">Script Content</h3>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleCopy}
                                                    className="p-2 hover:bg-white/10 rounded-lg smooth-transition"
                                                    title="Copy to clipboard"
                                                >
                                                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                                                </button>
                                                <button
                                                    onClick={handleSave}
                                                    disabled={saving}
                                                    className="p-2 hover:bg-white/10 rounded-lg smooth-transition"
                                                    title="Save script"
                                                >
                                                    {saving ? <Loader2 className="w-4 h-4 animate-spin text-blue-400" /> : <Save className="w-4 h-4 text-muted-foreground" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                                            {scriptData ? (
                                                <div className="space-y-6 max-w-4xl mx-auto">
                                                    {/* Hook Strategy */}
                                                    {scriptData.hook && (
                                                        <div className="bg-zinc-900 dark:bg-[#0f172a] rounded-xl p-6 border border-zinc-200 dark:border-white/10 relative overflow-hidden group shadow-lg">
                                                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                                                <Logo className="w-32 h-32 rotate-12" />
                                                            </div>
                                                            <div className="relative z-10">
                                                                <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-3">HOOK STRATEGY</div>
                                                                <div className="text-xl md:text-2xl font-medium text-white leading-relaxed">
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
