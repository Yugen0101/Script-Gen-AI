import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch user's scripts
    const { data: scripts, error } = await supabase
        .from('scripts')
        .select('*')
        .order('created_at', { ascending: false })

    return <DashboardClient scripts={scripts || []} />
}
