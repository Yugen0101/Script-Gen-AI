'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface SaveScriptParams {
    id?: string
    title: string
    platform: string
    tone: string
    content: string
}

export async function saveScript({ id, title, platform, tone, content }: SaveScriptParams) {
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
