# Pre-Deployment Checklist

Use this checklist before deploying Script GO to production.

## Environment Configuration
- [ ] All environment variables are set in hosting platform
- [ ] `NEXT_PUBLIC_APP_URL` updated to production domain
- [ ] Supabase project URL and keys are correct
- [ ] Resend API key is valid and active
- [ ] Gemini API key is configured

## Database Setup
- [ ] Run `full_db_setup.sql` or `supabase-schema.sql` in Supabase SQL Editor
- [ ] Verify `handle_new_user` trigger is active
- [ ] Check all RLS policies are enabled
- [ ] Test database connection from application

## Email Configuration
- [ ] Domain verified in Resend dashboard
- [ ] Test email sending (welcome, password reset, script ready)
- [ ] Email templates reviewed and updated if needed

## Security
- [ ] `.env.local` is NOT committed to Git (check `.gitignore`)
- [ ] All API keys are stored as environment variables
- [ ] RLS policies enabled on all Supabase tables
- [ ] HTTPS configured for production domain

## Build & Test
- [ ] Run `npm run build` locally to verify build succeeds
- [ ] Test authentication flow (signup, login, password reset)
- [ ] Test script generation with Gemini AI
- [ ] Verify dashboard and calendar functionality
- [ ] Test theme switching (light/dark mode)

## Deployment Platform
- [ ] Choose deployment platform (Vercel/Netlify/Self-hosted)
- [ ] Platform CLI installed (if needed)
- [ ] Logged into platform account
- [ ] Project linked or initialized

## Post-Deployment
- [ ] Verify application loads at production URL
- [ ] Test user signup and profile creation
- [ ] Generate a test script
- [ ] Check email notifications are sent
- [ ] Monitor logs for errors
- [ ] Test on mobile devices

## Documentation
- [ ] README.md updated with production URL
- [ ] Team notified of deployment
- [ ] Deployment notes documented

---

**Deployment Date**: _______________
**Deployed By**: _______________
**Platform**: _______________
**Production URL**: _______________
