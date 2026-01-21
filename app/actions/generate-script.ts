'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/lib/supabase/server'
import { sendScriptReadyEmail } from '@/app/actions/email'
import { after } from 'next/server'

interface GenerateScriptParams {
    platform: string
    topic: string
    tone: string
    length: string
    language: string
    framework?: string
}

export async function generateScript({ platform, topic, tone, length, language, framework }: GenerateScriptParams) {
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
        return {
            success: false,
            error: 'Gemini API Key is missing. Please add GEMINI_API_KEY to your .env.local file to enable script generation.',
        }
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
        model: "gemini-flash-latest",
        generationConfig: {
            responseMimeType: "application/json",
        }
    })

    // Diagnostic log (Masked)
    console.log(`[GenerateScript] Using Gemini Key: ${apiKey.substring(0, 10)}...${apiKey.slice(-4)}`)

    try {
        const isShortInfo = length.toLowerCase().includes('short') || length.toLowerCase().includes('45s');
        const isInDepth = length.toLowerCase().includes('depth') || length.toLowerCase().includes('3m') || length.toLowerCase().includes('4min');
        const isCustom = length.toLowerCase().includes('seconds') || length.toLowerCase().includes('words');
        const isWords = length.toLowerCase().includes('words');

        let platformStyle = "";
        if (platform.toLowerCase() === 'youtube') {
            platformStyle = "Focus on dynamic storytelling, a strong retention-oriented hook, and clear section transitions. Visuals should be cinematic and descriptive.";
        } else if (platform.toLowerCase() === 'insta reels' || platform.toLowerCase() === 'instagram') {
            platformStyle = "Focus on high energy, rapid-fire visual changes, and trending audio styles. Visuals should be vibrant and eye-catching. Hook must be instant and visual.";
        } else if (platform.toLowerCase() === 'news articles' || platform.toLowerCase() === 'news') {
            platformStyle = "Focus on objective, authoritative, and informative reporting. Use a traditional news hook (who, what, when, where, why). Visuals should focus on relevant footage, infographics, and professional settings. Audio should be clear, steady, and trustworthy.";
        } else if (platform.toLowerCase() === 'linkedin') {
            platformStyle = "Professional, authoritative, yet engaging. Visuals should focus on high-quality office/business environments, professional graphics, and 'talking head' clarity. Audio should be articulate and value-driven.";
        } else {
            platformStyle = "General engaging video script style with clear visual and audio directions.";
        }

        let depthInstructions = "";
        if (isShortInfo) {
            depthInstructions = "This is a SHORT INFO script. Keep it ultra-concise, high-impact, and under 45 seconds. Focus on 1 quick takeaway. Maximum 2-3 sections.";
        } else if (isInDepth) {
            depthInstructions = "This is an IN-DEPTH script. Provide comprehensive detail, nuanced explanations, and thorough visual directions. Aim for 8-12 detailed sections (~3 minutes).";
        } else if (isCustom) {
            if (isWords) {
                depthInstructions = `This is a TEXT-ONLY post targeting exactly ${length}. Provide a detailed, engaging post that meets this word count while maintaining high value and readability.`;
            } else {
                depthInstructions = `This is a CUSTOM DURATION script targeting exactly ${length}. 
                CRITICAL: You MUST adjust the section/scene count to fit this specific timeframe. 
                For scripts over 60 seconds, provide at least 8-12 distinct scenes/sections to ensure the content is comprehensive and matches the professional quality expected for this length.`;
            }
        } else {
            depthInstructions = "This is a GENERAL script (~60 seconds). Provide a balanced flow with a solid introduction, middle points, and a clear conclusion. Aim for 5-7 sections.";
        }

        let frameworkInstructions = "";
        if (framework === 'AIDA' || framework === 'AIDA Framework') {
            frameworkInstructions = "\nStrictly follow the AIDA Marketing Framework: \n1. Attention: Start with a powerful pattern interrupt. \n2. Interest: Hook them with relevant facts or a relatable problem. \n3. Desire: Build a craving for the solution/result. \n4. Action: End with a clear, specific call-to-action.";
        } else if (framework === 'PAS' || framework === 'PAS Framework') {
            frameworkInstructions = "\nStrictly follow the PAS Marketing Framework: \n1. Problem: Clearly define a pain point the audience faces. \n2. Agitation: Explore the emotional/practical consequences of the problem. \n3. Solution: Present the topic/product as the definitive fix.";
        }

        let jsonStructure = '';
        let platformSpecificInstructions = '';

        if (platform.toLowerCase() === 'youtube' || platform.toLowerCase() === 'news articles' || platform.toLowerCase() === 'news') {
            jsonStructure = `{
  "hook": "The hook strategy and text here...",
  "sections": [
    { "visual": "Visual description...", "audio": "Audio direction/dialogue..." },
    ...
  ]
}`;
            platformSpecificInstructions = 'Generate a traditional script with visual and audio directions for each scene.';
        } else if (platform.toLowerCase() === 'insta reels' || platform.toLowerCase() === 'instagram' || platform.toLowerCase() === 'tiktok') {
            jsonStructure = `{
  "hook": "Attention-grabbing opening line...",
  "caption": "Engaging caption for the post...",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3"],
  "scenes": [
    { "visual": "Scene description...", "audio": "Voiceover/spoken text for this scene...", "overlay": "Text overlay...", "duration": "2s" },
    ...
  ]
}`;
            platformSpecificInstructions = 'Generate Instagram/TikTok content with a caption, hashtags, and visual scenes with audio/voiceover and text overlays. Focus on quick cuts, high-impact spoken content, and trending formats.';
        } else if (platform.toLowerCase() === 'linkedin') {
            jsonStructure = `{
  "hook": "Professional opening statement...",
  "body": "Main content with value proposition...",
  "keyPoints": ["Key takeaway 1", "Key takeaway 2", "Key takeaway 3"],
  "cta": "Clear call-to-action..."
}`;
            platformSpecificInstructions = 'Generate LinkedIn content with a professional hook, detailed body, key takeaways, and a strong CTA. Focus on value-driven, authoritative content.';
        } else if (platform.toLowerCase() === 'twitter' || platform.toLowerCase() === 'x') {
            jsonStructure = `{
  "tweets": [
    { "text": "Tweet 1 content (hook)..." },
    { "text": "Tweet 2 content..." },
    { "text": "Tweet 3 content (conclusion/CTA)..." }
  ]
}`;
            platformSpecificInstructions = 'Generate a Twitter thread with 3-7 tweets. First tweet must hook, middle tweets provide value, last tweet has CTA. Each tweet max 280 characters.';
        } else {
            jsonStructure = `{
  "hook": "The hook strategy and text here...",
  "sections": [
    { "visual": "Visual description...", "audio": "Audio direction/dialogue..." },
    ...
  ]
}`;
            platformSpecificInstructions = 'Generate a standard script format.';
        }

        const prompt = `You are a world-class script writer for ${platform}. Your task is to generate a script in a strict JSON format.

Platform Style: ${platformStyle}
Script Depth: ${depthInstructions}${frameworkInstructions}

${platformSpecificInstructions}

Returns valid JSON with this EXACT structure for ${platform}:
${jsonStructure}

Input Parameters:
- Platform: ${platform}
- Topic: ${topic}
- Tone: ${tone}
- Target Length: ${length}
- Language: ${language}

CRITICAL LANGUAGE REQUIREMENT:
1. If the target language is English, the entire script must be in English.
2. If the target language is NOT English (e.g., Tamil, Hindi, Malayalam, Kannada, Spanish), you MUST generate a script that is **HYPER-CONVERSATIONAL**, **EASY TO SPEAK**, and **MODERN**.
   - **THE "TALK TEST"**: If a sentence sounds like a textbook or a news anchor, it is WRONG. It must sound like a Reel creator or a YouTuber.
   - **NATIVE SCRIPT FOUNDATION**: Use the native script (e.g., தமிழ், हिंदी) only for simple, everyday connectors and core sentence structure.
   - **MANDATORY ENGLISH (TANGLISH/KANGLISH style)**: For ANY word that is technical, formal, professional, or complex, **YOU MUST** use the **ENGLISH** word (written in English script). 
   - **NO FORMAL WORDS**: Never use formal "dictionary" native words (e.g., instead of the formal Tamil word for "Technology", use "Technology").
   - **EASY TO PRONOUNCE**: If a native word has more than 3-4 syllables or is hard to pronounce, replace it with a simpler English equivalent.
   - **EVERYTHING INSIDE JSON**: This applies to Hooks, Visual Directions, Audio, and Captions.
   - **GOAL**: The creator should be able to read this script without a single stumble. It should feel like they are talking to a close friend.

FACTUAL ACCURACY MANDATE:
- You are a professional researcher. Ensure all information provided is 100% accurate. 
- Carefully verify the origin, genre, and facts about the topic. 
- **CRITICAL**: Do NOT claim a movie or person belongs to a specific region/language unless it is a verified fact (e.g., Do NOT call an Italian movie a 'Tamil' movie).
- If you are unsure about a specific detail, omit it rather than providing misinformation.

Tailor the content to a ${tone} tone. 
ENSURE THE OUTPUT IS PURE VALID JSON ONLY. NO MARKDOWN BLOCK.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let content = response.text() || '{}';

        // Robust JSON cleaning: Remove markdown blocks if present
        if (content.includes('```json')) {
            content = content.split('```json')[1].split('```')[0].trim();
        } else if (content.includes('```')) {
            content = content.split('```')[1].split('```')[0].trim();
        }

        // Send email in the background after response is sent (Next.js 15+)
        after(async () => {
            try {
                const supabase = await createClient()
                const { data: { user } } = await supabase.auth.getUser()

                if (user && user.email) {
                    let preview = "Check your script in the dashboard.";
                    let title = topic;
                    try {
                        const jsonContent = JSON.parse(content);
                        if (jsonContent.hook) preview = jsonContent.hook;
                    } catch (e) { }

                    console.log('--- SENDING SCRIPT EMAIL (Gemini) ---');
                    await sendScriptReadyEmail(user.email, title, preview, 'generated');
                }
            } catch (emailError) {
                console.error("Failed to send script ready email", emailError)
            }
        })

        return {
            success: true,
            content: content,
        }
    } catch (error: any) {
        console.error('Error generating script with Gemini:', error)

        if (error.status === 429 || error.message?.includes('quota')) {
            return {
                success: false,
                error: 'Gemini Quota Exceeded. Please check your Google Cloud Console billing.',
            }
        }

        return {
            success: false,
            error: error.message || 'Failed to generate script with Gemini',
        }
    }
}
