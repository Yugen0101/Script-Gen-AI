'use server'

import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!
})

interface GenerateScriptParams {
    platform: string
    topic: string
    tone: string
    length: string
    language: string
}

export async function generateScript({ platform, topic, tone, length, language }: GenerateScriptParams) {
    try {
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

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are an expert script writer. Always respond with valid JSON only, no markdown formatting."
                },
                {
                    role: "user",
                    content: instructions
                }
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
        })

        const content = completion.choices[0]?.message?.content || '{}'

        return {
            success: true,
            content: content,
        }
    } catch (error: any) {
        console.error('Error generating script:', error)
        return {
            success: false,
            error: error.message || 'Failed to generate script',
        }
    }
}
