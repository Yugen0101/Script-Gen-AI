'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/lib/supabase/server'

interface GenerateCalendarParams {
    platform: string
    topic: string
    tone: string
    language: string
    days: number
    skipSave?: boolean
}

export async function generateCalendarContent({ platform, topic, tone, language, days, skipSave = false }: GenerateCalendarParams) {

    const apiKey = process.env.GEMINI_API_KEY
    const supabase = await createClient()

    if (!apiKey) {
        return {
            success: false,
            error: 'Gemini API Key is missing.',
        }
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return {
            success: false,
            error: 'User not authenticated.',
        }
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
        model: "gemini-flash-latest",
        generationConfig: {
            responseMimeType: "application/json",
        }
    })

    try {
        // Step 1: Generate a list of titles/topics for the selected duration
        const planInstructions = `You are a content strategist for ${platform}. Your task is to generate a content plan for EXACTLY ${days} consecutive days.

        CRITICAL REQUIREMENT: You MUST generate EXACTLY ${days} items in the plan array. No more, no less.

        Main Topic: ${topic}
        Tone: ${tone}
        Language: ${language}

        Return a valid JSON object with a "plan" array containing EXACTLY ${days} items.
        Each item in the array MUST have:
        - "day": The day number (1, 2, 3, ... up to ${days})
        - "title": A catchy title for the content that day.
        - "brief": A short brief or specific angle for that day's content.

        VERIFICATION: Before returning, count the items in your plan array. It MUST equal ${days}.

        Ensure the content is diverse but stays on the main topic.
        Output ONLY valid JSON.`;

        const planResult = await model.generateContent(planInstructions);
        const planResponse = await planResult.response;
        let planRaw = planResponse.text() || '{}';

        if (planRaw.includes('```json')) {
            planRaw = planRaw.split('```json')[1].split('```')[0].trim();
        } else if (planRaw.includes('```')) {
            planRaw = planRaw.split('```')[1].split('```')[0].trim();
        }

        const planData = JSON.parse(planRaw);
        const plan = planData.plan || [];

        // Validate that we have the correct number of days
        if (plan.length !== days) {
            console.warn(`⚠️ AI generated ${plan.length} days instead of ${days}. Adjusting...`);

            // If too few, pad with generic days
            while (plan.length < days) {
                plan.push({
                    day: plan.length + 1,
                    title: `${topic} - Day ${plan.length + 1}`,
                    brief: `Continue exploring ${topic} with fresh insights and perspectives`
                });
            }

            // If too many, trim
            if (plan.length > days) {
                plan.splice(days);
            }
        }

        // Ensure day numbers are sequential
        plan.forEach((item: any, index: number) => {
            item.day = index + 1;
        });

        console.log(`✅ Validated plan: ${plan.length} days (requested: ${days})`);

        if (plan.length === 0) {
            return { success: false, error: 'Failed to generate content plan.' };
        }

        // Step 2: For each day, generate a full script in parallel
        const today = new Date();

        const scriptPromises = plan.map(async (item: any) => {
            const scriptInstructions = `You are a world-class script writer for ${platform}. 
            Generate a script for Day ${item.day} of a ${days}-day challenge.
            Title: ${item.title}
            Brief: ${item.brief}
            Tone: ${tone}
            Language: ${language}

            Returns valid JSON with this structure:
            {
              "hook": "The hook strategy and text here...",
              "sections": [
                { "visual": "Visual description...", "audio": "Audio direction/dialogue..." },
                ...
              ]
            }

            The entire script content MUST be in ${language}. 
            
            CRITICAL LANGUAGE REQUIREMENT & ACCURACY:
            - If ${language} is English, the entire script must be in English.
            - If ${language} is NOT English (e.g., Tamil, Hindi, Malayalam, Kannada, Spanish), you MUST generate a script that is **HYPER-CONVERSATIONAL**, **EASY TO SPEAK**, and **MODERN**.
            - **THE "TALK TEST"**: It must sound like a social media creator, NOT a dictionary or a news reporter.
            - **NATIVE SCRIPT FOUNDATION**: Use the native script (e.g., தமிழ், हिंदी) for basic sentence structure.
            - **MANDATORY ENGLISH (TANGLISH/KANGLISH style)**: For ANY word that is technical, formal, or complicated, **YOU MUST** use the **ENGLISH** word (written in English script). 
            - **NO FORMAL WORDS**: Avoid formal/literary native words. Use the common English equivalent instead.
            - **GOAL**: The script must be "talkable" and follow the flow of how people naturally speak on social media today.
            - **EVERYTHING INSIDE JSON**: This applies to Hooks, Visual Directions, and Audio.
            - **FACTUAL ACCURACY**: Ensure all information about the topic is 100% correct.

            Output ONLY valid JSON.`;

            try {
                const scriptResult = await model.generateContent(scriptInstructions);
                const scriptResponse = await scriptResult.response;
                let scriptRaw = scriptResponse.text() || '{}';

                if (scriptRaw.includes('```json')) {
                    scriptRaw = scriptRaw.split('```json')[1].split('```')[0].trim();
                } else if (scriptRaw.includes('```')) {
                    scriptRaw = scriptRaw.split('```')[1].split('```')[0].trim();
                }

                const scriptContent = JSON.parse(scriptRaw);

                // Calculate scheduled date
                const scheduledDate = new Date(today);
                scheduledDate.setDate(today.getDate() + (item.day - 1));
                const dateString = scheduledDate.toISOString().split('T')[0];

                if (skipSave) {
                    return {
                        title: item.title,
                        platform: platform,
                        tone: tone,
                        language: language,
                        content: scriptContent,
                        scheduled_date: dateString
                    };
                }

                // Save to database
                const { data, error } = await supabase.from('scripts').insert({
                    user_id: user.id,
                    title: item.title,
                    platform: platform,
                    tone: tone,
                    language: language,
                    content: scriptContent,
                    length: '60s', // Default length for calendar items
                    scheduled_date: dateString
                }).select().single();

                if (error) {
                    console.error(`Error saving script for day ${item.day}:`, error);
                    return null;
                }
                return data;

            } catch (err) {
                console.error(`Error generating script for day ${item.day}:`, err);
                return null;
            }
        });

        const results = (await Promise.all(scriptPromises)).filter(r => r !== null);

        if (results.length === 0) {
            return { success: false, error: 'Failed to generate any scripts for the calendar.' };
        }

        return {
            success: true,
            scripts: results,
        }
    } catch (error: any) {
        console.error('Error generating calendar with Gemini:', error)
        return {
            success: false,
            error: error.message || 'Failed to generate content calendar with Gemini',
        }
    }
}
