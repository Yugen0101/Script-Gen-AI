'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'

interface CustomSelectProps {
    value: string
    onChange: (value: string) => void
    options: string[]
    label?: string
    icon?: React.ReactNode
    className?: string
    placeholder?: string
}

export default function CustomSelect({
    value,
    onChange,
    options,
    label,
    icon,
    className = "",
    placeholder = "Select an option"
}: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            {label && (
                <label className="block text-xs font-bold text-blue-500 uppercase tracking-wider mb-2">
                    {label}
                </label>
            )}

            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between pl-4 pr-3 py-3 bg-zinc-50 dark:bg-[#1A202C] border border-zinc-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 group overflow-hidden"
            >
                <div className="flex items-center gap-3">
                    {icon && (
                        <div className="text-zinc-400 group-hover:text-blue-400 transition-colors">
                            {icon}
                        </div>
                    )}
                    <span className={`text-sm font-medium ${value ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'}`}>
                        {value || placeholder}
                    </span>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <ChevronDown className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white" />
                </motion.div>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 8, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute z-[110] w-full mt-2 bg-white dark:bg-[#0B1120] border border-zinc-200 dark:border-white/10 rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] backdrop-blur-3xl overflow-hidden"
                    >
                        <div className="max-h-64 overflow-y-auto custom-scrollbar p-2">
                            {options.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => {
                                        onChange(option)
                                        setIsOpen(false)
                                    }}
                                    className={`w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all duration-200 group/item mb-1 last:mb-0 ${value === option
                                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                        : 'hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                                        }`}
                                >
                                    <span className="text-sm font-semibold tracking-wide text-left">
                                        {option}
                                    </span>
                                    {value === option && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            className="text-blue-400"
                                        >
                                            <Check className="w-4 h-4" />
                                        </motion.div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    )
}
