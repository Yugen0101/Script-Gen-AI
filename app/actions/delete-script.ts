'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteScript(id: string) {
    try {
        const supabase = await createClient()

        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return { success: false, error: 'Not authenticated' }
        }

        const { error } = await supabase
            .from('scripts')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id)

        if (error) throw error

        revalidatePath('/dashboard')
        return { success: true }
    } catch (error: any) {
        console.error('Error deleting script:', error)
        return {
            success: false,
            error: error.message || 'Failed to delete script',
        }
    }
}
