import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/dashboard'

    console.log('========== AUTH CALLBACK ==========')
    console.log('Full URL:', request.url)

    // Log all params
    const params: Record<string, string> = {}
    searchParams.forEach((value, key) => {
        params[key] = value
    })
    console.log('All Search Params:', params)

    console.log('Code present:', !!code)
    console.log('Next destination:', next)

    // Check for error from Supabase
    if (searchParams.get('error')) {
        console.error('Supabase Error URL Param:', searchParams.get('error'))
        console.error('Supabase Error Description:', searchParams.get('error_description'))
    }

    if (code) {
        try {
            const supabase = await createClient()
            console.log('Attempting to exchange code for session...')

            const { data, error } = await supabase.auth.exchangeCodeForSession(code)

            console.log('Exchange result:', {
                hasSession: !!data?.session,
                hasUser: !!data?.user,
                error: error?.message
            })

            if (!error && data?.session) {
                let finalNext = next
                if (next === '/update-password') {
                    finalNext = '/update-password?type=recovery'
                }

                console.log('Success! Redirecting to:', finalNext)
                console.log('===================================')
                return NextResponse.redirect(`${origin}${finalNext}`)
            }

            console.error('Exchange failed:', error)
        } catch (err) {
            console.error('Exception during code exchange:', err)
        }
    } else {
        console.log('No code parameter found, checking for existing session...')
        const supabase = await createClient()
        const { data: { session } } = await supabase.auth.getSession()

        if (session) {
            console.log('Existing session found, redirecting to:', next)
            let finalNext = next
            if (next === '/update-password') {
                finalNext = '/update-password?type=recovery'
            }
            console.log('===================================')
            return NextResponse.redirect(`${origin}${finalNext}`)
        }
        console.log('No code and no session found.')
    }

    // return the user to an error page with instructions
    console.log('Redirecting to login with error')
    console.log('===================================')
    return NextResponse.redirect(`${origin}/login?error=Could not verify email`)
}
