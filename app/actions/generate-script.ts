'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

interface GenerateScriptParams {
    platform: string
    topic: string
    tone: string
    length: string
    language: string
}

export async function generateScript({ platform, topic, tone, length, language }: GenerateScriptParams) {
    try {
        // Fresh API key generated on 2026-01-09
        const key = 'AIzaSyDxWEyMiHcob4lpC0VPx2i9uJ9K-g2L65k'
        const localGenAI = new GoogleGenerativeAI(key)
        const model = localGenAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

        const instructions = `You are an expert script writer. Your task is to generate a script in a strict JSON format.
        
Returns valid JSON with this structure:
{
  "hook": "The hook text here...",
  "sections": [
    { "visual": "Visual description...", "audio": "Audio direction/dialogue..." },
     ...
  ]
}

Input Parameters:
- Platform: ${platform}
- Topic: ${topic}
- Tone: ${tone}
- Length: ${length}
- Language: ${language}

Guidelines for Visual/Audio split:
- Visual (See): Describe exactly what is on screen (e.g., "Close up shot of...", "Text overlay saying...", "Rapid montage of...").
- Audio (Hear): Write the actual spoken script, voiceover, or sound design notes.

Make the content engaging, high-retention, and tailored to the platform. 
ENSURE THE OUTPUT IS PURE VALID JSON ONLY. NO MARKDOWN BLOCK.`;

        const result = await model.generateContent(instructions)
        const response = await result.response
        const text = response.text()

        return {
            success: true,
            content: text,
        }
    } catch (error: any) {
        console.error('Error generating script:', error)
        return {
            success: false,
            error: error.message || 'Failed to generate script',
        }
    }
}
