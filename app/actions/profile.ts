'use server'

import { createClient } from '@supabase/supabase-js'

export async function ensureUserProfile(params: {
    userId: string;
    email: string;
    username?: string | null;
    fullName?: string | null;
}) {
    // 1. Capture and standardize all inputs
    const { userId, email, username, fullName } = params;

    // 2. Read environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    console.log(`[SYNC] Request for: ${userId} (${email})`);

    // 3. Check for specific missing key scenario
    if (!supabaseServiceKey || supabaseServiceKey.includes('YOUR_NEW_SERVICE_ROLE_KEY_HERE')) {
        console.warn('[SYNC] Service Role Key is missing or default. Redirecting to manual sync.');
        return {
            success: false,
            error: 'MISSING_SERVICE_KEY',
            message: 'Supabase Service Role Key is not configured in .env.local'
        };
    }

    if (!supabaseUrl) {
        return { success: false, error: 'MISSING_URL' };
    }

    try {
        console.log('[SYNC] Creating Supabase client...');
        const supabase = createClient(supabaseUrl, supabaseServiceKey, {
            auth: { persistSession: false, autoRefreshToken: false }
        });
        console.log('[SYNC] Supabase client created successfully');

        // 4. Database Operation - Only insert columns that exist in the schema
        console.log('[SYNC] Attempting upsert for user:', userId);
        const { data, error } = await supabase
            .from('profiles')
            .upsert({
                id: userId,
                email: email,
                is_premium: false,
                usage_count: 0
            }, { onConflict: 'id' });

        if (error) {
            console.error('[SYNC] Database error:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            });
            return { success: false, error: error.message };
        }

        console.log('[SYNC] Profile upsert successful for:', userId);
        return { success: true };
    } catch (err: any) {
        console.error('[SYNC] Fatal runtime error:', {
            message: err.message,
            stack: err.stack,
            name: err.name
        });
        return {
            success: false,
            error: 'RUNTIME_ERROR',
            message: err.message || 'Unknown error'
        };
    }
}
