import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        if (process.env.NODE_ENV === 'production') {
            console.warn('Supabase Environment Variables Missing during build! Prerendering may be incomplete.')
            return {} as any // Return dummy object to prevent crash during build
        }
        throw new Error('Supabase URL and Anon Key are required! Please check your .env.local file.')
    }

    return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
