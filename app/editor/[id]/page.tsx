import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import EditScriptClient from './EditScriptClient'

export default async function EditScriptPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch the script
    const { data: script, error } = await supabase
        .from('scripts')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

    if (error || !script) {
        redirect('/dashboard')
    }

    return <EditScriptClient script={script} />
}
