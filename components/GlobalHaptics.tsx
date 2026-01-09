'use client'

import { useEffect, useRef } from 'react'

export default function GlobalHaptics() {
    const audioContextRef = useRef<AudioContext | null>(null)

    // Initialize Audio Context on first interaction
    const initAudio = () => {
        if (!audioContextRef.current) {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext
            if (AudioContext) {
                audioContextRef.current = new AudioContext()
            }
        }
        if (audioContextRef.current?.state === 'suspended') {
            audioContextRef.current.resume()
        }
    }

    const playClickSound = () => {
        if (!audioContextRef.current) initAudio()

        const ctx = audioContextRef.current
        if (!ctx) return

        // Create a synthesized typewriter sound (Sharp mechanical click + metallic resonance)
        const t = ctx.currentTime

        // 1. The "Snap" (High pitched metal impact)
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.frequency.setValueAtTime(2000, t)
        osc.frequency.exponentialRampToValueAtTime(1000, t + 0.05)
        osc.type = 'triangle'

        gain.gain.setValueAtTime(0.3, t)
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(t)
        osc.stop(t + 0.05)

        // 2. The "Clack" (Mechanical body impact)
        const osc2 = ctx.createOscillator()
        const gain2 = ctx.createGain()

        osc2.frequency.setValueAtTime(600, t)
        osc2.frequency.exponentialRampToValueAtTime(100, t + 0.08)
        osc2.type = 'square'

        gain2.gain.setValueAtTime(0.2, t)
        gain2.gain.exponentialRampToValueAtTime(0.01, t + 0.1)

        osc2.connect(gain2)
        gain2.connect(ctx.destination)

        osc2.start(t)
        osc2.stop(t + 0.1)

        // 3. The "Ping" (Typewriter spring/metal resonance)
        const osc3 = ctx.createOscillator()
        const gain3 = ctx.createGain()

        osc3.frequency.setValueAtTime(2500, t)
        osc3.frequency.exponentialRampToValueAtTime(2000, t + 0.2)
        osc3.type = 'sine'

        gain3.gain.setValueAtTime(0.05, t)
        gain3.gain.exponentialRampToValueAtTime(0.001, t + 0.2)

        osc3.connect(gain3)
        gain3.connect(ctx.destination)

        osc3.start(t)
        osc3.stop(t + 0.2)
    }

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            // Check if clicked element is a button, link, or inside one
            const closestClickable = target.closest('button, a, input[type="submit"], [role="button"]')

            if (closestClickable) {
                initAudio()
                playClickSound()
                // Add visual ripple or haptic effect class temporarily if needed
                closestClickable.classList.add('haptic-tap')
                setTimeout(() => closestClickable.classList.remove('haptic-tap'), 150)
            }
        }

        window.addEventListener('click', handleClick)
        return () => window.removeEventListener('click', handleClick)
    }, [])

    return null
}
