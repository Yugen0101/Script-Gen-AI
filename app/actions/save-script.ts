'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface SaveScriptParams {
    id?: string
    title: string
    platform: string
    tone: string
    content: string
    language?: string
    length?: string
    customLength?: string
    scheduledDate?: string
}



export async function saveScript({ id, title, platform, tone, content, language, length, customLength, scheduledDate }: SaveScriptParams) {

    try {
        const supabase = await createClient()

        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return { success: false, error: 'Not authenticated' }
        }

        if (id) {
            // Update existing script
            const { error } = await supabase
                .from('scripts')
                .update({
                    title,
                    platform,
                    tone,
                    content,
                    language,
                    length,
                    custom_length: customLength,
                    scheduled_date: scheduledDate,
                    updated_at: new Date().toISOString(),

                })
                .eq('id', id)
                .eq('user_id', user.id)

            if (error) throw error
        } else {
            // Create new script
            const { data, error } = await supabase
                .from('scripts')
                .insert({
                    user_id: user.id,
                    title,
                    platform,
                    tone,
                    content,
                    language,
                    length,
                    custom_length: customLength,
                    scheduled_date: scheduledDate,

                })
                .select()
                .single()

            if (error) throw error


            revalidatePath('/dashboard')
            return { success: true, id: data.id }
        }

        revalidatePath('/dashboard')
        return { success: true, id }
    } catch (error: any) {
        console.error('Error saving script:', error)
        return {
            success: false,
            error: error.message || 'Failed to save script',
        }
    }
}
export async function saveBundledScript(scripts: any[], topic: string) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return { success: false, error: 'Not authenticated' }
        }

        // Create a single bundle object
        const bundleContent = {
            isBundle: true,
            scripts: scripts.map(s => ({
                title: s.title,
                content: s.content,
                day: s.day || scripts.indexOf(s) + 1
            }))
        }

        const { data, error } = await supabase
            .from('scripts')
            .insert({
                user_id: user.id,
                title: `${scripts.length}-Day Plan: ${topic}`,
                platform: scripts[0]?.platform || 'Multiple',
                tone: scripts[0]?.tone || 'Mixed',
                content: JSON.stringify(bundleContent),
                language: scripts[0]?.language || 'English',
                length: `${scripts.length} Days`,
            })
            .select()
            .single()

        if (error) throw error

        revalidatePath('/dashboard')
        return { success: true, id: data.id }
    } catch (error: any) {
        console.error('Error in saveBundledScript:', error)
        return { success: false, error: error.message || 'Failed to save bundled script' }
    }
}


