"use client"

import { motion } from "framer-motion"

export default function Logo({ className = "w-16 h-16" }: { className?: string }) {
    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`relative flex items-center justify-center ${className} overflow-hidden`}
        >
            <motion.img
                src="/logo.png"
                alt="Script GO Logo"
                className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-lighten"
                animate={{
                    // Wind shake effect (fast, subtle)
                    rotate: [0, 0.4, -0.4, 0.2, -0.2, 0],
                    skewX: [0, 0.8, -0.8, 0.4, -0.4, 0],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                    // Mix of speeds for a more natural "organic" feel
                    times: [0, 0.2, 0.4, 0.6, 0.8, 1]
                }}
            />
        </motion.div>
    )
}
