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

        // Step 2: For each day, generate a full script SEQUENTIALLY
        const today = new Date();
        const results = [];

        for (const item of plan) {
            console.log(`🎬 Generating script for Day ${item.day}/${days}: ${item.title}`);

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
            Keep the script length to approximately 60 seconds.
            
            CRITICAL LANGUAGE REQUIREMENT:
            - If ${language} is English, use English.
            - If ${language} is NOT English, use native script but keep technical words in English.
            - High energy, conversational tone.

            Output ONLY valid JSON.`;

            let scriptContent = null;
            try {
                const scriptResult = await model.generateContent(scriptInstructions);
                const scriptResponse = await scriptResult.response;
                let scriptRaw = scriptResponse.text() || '{}';

                if (scriptRaw.includes('```json')) {
                    scriptRaw = scriptRaw.split('```json')[1].split('```')[0].trim();
                } else if (scriptRaw.includes('```')) {
                    scriptRaw = scriptRaw.split('```')[1].split('```')[0].trim();
                }

                scriptContent = JSON.parse(scriptRaw);
                console.log(`✅ Success for Day ${item.day}`);
            } catch (err) {
                console.error(`❌ Failed to generate script for day ${item.day}:`, err);
                // Fallback content to prevent empty cards
                scriptContent = {
                    hook: `Welcome to Day ${item.day}! Today we're diving into ${item.title}.`,
                    sections: [
                        { visual: "Creator on camera", audio: `Hey everyone! Today is day ${item.day} and we're talking about ${item.title}.` },
                        { visual: "Dynamic transitions", audio: `${item.brief}` },
                        { visual: "Call to action", audio: "Don't forget to follow for the rest of the challenge!" }
                    ]
                };
            }

            // Calculate scheduled date
            const scheduledDate = new Date(today);
            scheduledDate.setDate(today.getDate() + (item.day - 1));
            const dateString = scheduledDate.toISOString().split('T')[0];

            let dataToReturn = null;

            if (skipSave) {
                dataToReturn = {
                    title: item.title,
                    platform: platform,
                    tone: tone,
                    language: language,
                    content: scriptContent,
                    scheduled_date: dateString
                };
            } else {
                // Save to database
                const { data, error } = await supabase.from('scripts').insert({
                    user_id: user.id,
                    title: item.title,
                    platform: platform,
                    tone: tone,
                    language: language,
                    content: scriptContent,
                    length: '60s',
                    scheduled_date: dateString
                }).select().single();

                if (error) {
                    console.error(`Error saving script for day ${item.day}:`, error);
                    // Add as unsaved data
                    dataToReturn = {
                        title: item.title,
                        platform: platform,
                        tone: tone,
                        language: language,
                        content: scriptContent,
                        scheduled_date: dateString
                    };
                } else {
                    dataToReturn = data;
                }
            }

            if (dataToReturn) results.push(dataToReturn);

            // Subtle delay to respect potential rate limits (150ms)
            await new Promise(resolve => setTimeout(resolve, 150));
        }

        console.log(`✨ Total scripts generated: ${results.length}/${days}`);

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
