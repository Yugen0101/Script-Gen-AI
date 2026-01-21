'use server'

import { resend } from '@/lib/resend'
import { WelcomeEmail } from '@/components/emails/WelcomeEmail'
import { ScriptReadyEmail } from '@/components/emails/ScriptReadyEmail'
import { ResetPasswordEmail } from '@/components/emails/ResetPasswordEmail'
import { createClient } from '@supabase/supabase-js'

// Client initialized lazily to prevent build-time errors

export async function sendWelcomeEmail(email: string, name: string = 'User') {
    try {
        const { data, error } = await resend.emails.send({
            from: 'ScriptGo <onboarding@resend.dev>', // Update this if you have a custom domain
            to: [email],
            subject: 'Welcome to ScriptGo!',
            react: WelcomeEmail({ name }),
        })

        if (error) {
            console.error('Error sending welcome email:', error)
            return { success: false, error }
        }

        return { success: true, data }
    } catch (error: any) {
        console.error('Exception sending welcome email:', error)
        return { success: false, error: error.message || 'Unknown error' }
    }
}

export async function sendScriptReadyEmail(email: string, title: string, previewContent: string, scriptId: string) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'ScriptGo <notifications@resend.dev>', // Update this if you have a custom domain
            to: [email],
            subject: `Your script "${title}" is ready!`,
            react: ScriptReadyEmail({ title, previewContent, scriptId }),
        })

        if (error) {
            console.error('Error sending script ready email:', error)
            return { success: false, error }
        }

        return { success: true, data }
    } catch (error: any) {
        console.error('Exception sending script ready email:', error)
        return { success: false, error: error.message || 'Unknown error' }
    }
}

export async function sendPasswordResetEmail(email: string, origin?: string) {
    const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY
        ? createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        )
        : null

    if (!supabaseAdmin) {
        console.error('Missing SUPABASE_SERVICE_ROLE_KEY')
        return { success: false, error: 'Server configuration error' }
    }

    try {
        console.log('Generating reset link for:', email)
        const { data, error } = await supabaseAdmin.auth.admin.generateLink({
            type: 'recovery',
            email,
            options: {
                redirectTo: `${origin || process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/update-password`,
            },
        })

        if (error) {
            console.error('Supabase generateLink error:', error)
            throw error
        }

        const { properties } = data
        const resetLink = properties.action_link
        console.log('Reset link generated successfully')

        console.log('Sending email via Resend to:', email)
        const { data: emailData, error: emailError } = await resend.emails.send({
            from: 'Script GO <onboarding@resend.dev>',
            to: [email],
            subject: 'Reset your Script GO password',
            react: ResetPasswordEmail({ resetLink }),
        })

        if (emailError) {
            console.error('Resend email sending error:', emailError)
            throw emailError
        }

        console.log('Email sent successfully via Resend:', emailData)
        return { success: true }
    } catch (error: any) {
        console.error('Detailed error sending password reset email:', error)
        return { success: false, error: error.message || 'Unknown error' }
    }
}
