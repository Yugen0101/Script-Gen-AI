"use client"

import { motion } from "framer-motion"

export default function Logo({ className = "w-10 h-10" }: { className?: string }) {
    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            <motion.div
                initial={{ rotate: -10, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="w-full h-full text-blue-600 dark:text-blue-500"
            >
                <svg
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full drop-shadow-xl"
                >
                    {/* Feather Quill - Main Body */}
                    <path
                        d="M20 85 C 25 70, 35 50, 50 35 C 60 25, 70 20, 78 22 C 80 23, 81 25, 79 28 C 75 35, 68 45, 60 55 C 50 68, 35 80, 20 85 Z"
                        fill="currentColor"
                        className="opacity-90"
                    />

                    {/* Central Spine/Shaft */}
                    <path
                        d="M20 85 L 30 70 L 42 52 L 55 38 L 68 28 L 78 22"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />

                    {/* Left Barbs */}
                    <path
                        d="M30 70 C 25 72, 22 75, 20 78 M42 52 C 37 55, 33 58, 30 62 M55 38 C 50 41, 46 44, 42 48 M68 28 C 63 31, 59 34, 55 38"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        className="opacity-80"
                    />

                    {/* Right Barbs */}
                    <path
                        d="M30 70 C 33 68, 36 66, 40 64 M42 52 C 46 50, 50 48, 54 46 M55 38 C 59 36, 63 34, 67 32 M68 28 C 72 26, 75 24, 78 22"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        className="opacity-80"
                    />

                    {/* Pen Nib */}
                    <path
                        d="M20 85 L 18 90 L 22 90 L 20 85 Z"
                        fill="currentColor"
                    />

                    {/* Nib Slit */}
                    <path
                        d="M20 86 L 20 89"
                        stroke="white"
                        strokeWidth="0.8"
                        strokeLinecap="round"
                        className="dark:stroke-[#0B1120]"
                    />
                </svg>
            </motion.div>
        </div>
    )
}
