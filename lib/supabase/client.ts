import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Supabase Environment Variables Missing!', {
            urlLength: supabaseUrl ? supabaseUrl.length : 0,
            keyLength: supabaseAnonKey ? supabaseAnonKey.length : 0,
            NODE_ENV: process.env.NODE_ENV
        })
        throw new Error('Supabase URL and Anon Key are required! Please check your .env.local file.')
    }

    return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
