# Script GO - Manual Deployment Guide

This guide will help you deploy your Script GO application manually to various hosting platforms.

## Pre-Deployment Checklist

### 1. Environment Variables
Ensure all environment variables are configured in your hosting platform:

```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY=YOUR_RESEND_API_KEY
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
NEXT_PUBLIC_APP_URL=https://your-production-domain.com
```

> **⚠️ IMPORTANT**: Update `NEXT_PUBLIC_APP_URL` to your actual production domain before deployment!

### 2. Database Setup
Ensure your Supabase database has all required tables and triggers:
- Run `full_db_setup.sql` or `supabase-schema.sql` in your Supabase SQL Editor
- Verify the `handle_new_user` trigger is active
- Check that RLS policies are enabled

### 3. Email Domain Verification
- Verify your domain with Resend at https://resend.com/domains
- Update email templates if needed in `components/emails/`

---

## Deployment Options

### Option 1: Vercel (Recommended for Next.js)

#### Steps:
1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   - Follow the prompts
   - Select your project settings
   - Vercel will auto-detect Next.js configuration

4. **Set Environment Variables**:
   - Go to your project on Vercel Dashboard
   - Navigate to Settings → Environment Variables
   - Add all variables from `.env.local`
   - **Update `NEXT_PUBLIC_APP_URL`** to your Vercel domain

5. **Redeploy** (if needed):
   ```bash
   vercel --prod
   ```

#### Vercel Configuration
The project already includes optimal settings in `next.config.ts`.

---

### Option 2: Netlify

#### Steps:
1. **Install Netlify CLI**:
   ```bash
   npm i -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Initialize and Deploy**:
   ```bash
   netlify init
   ```
   - Follow the prompts to create a new site or link existing
   - Build command: `npm run build`
   - Publish directory: `.next`

4. **Set Environment Variables**:
   ```bash
    netlify env:set NEXT_PUBLIC_SUPABASE_URL "YOUR_SUPABASE_URL"
    netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "YOUR_SUPABASE_ANON_KEY"
    netlify env:set SUPABASE_SERVICE_ROLE_KEY "YOUR_SUPABASE_SERVICE_ROLE_KEY"
    netlify env:set RESEND_API_KEY "YOUR_RESEND_API_KEY"
    netlify env:set GEMINI_API_KEY "YOUR_GEMINI_API_KEY"
    netlify env:set NEXT_PUBLIC_APP_URL "https://your-netlify-domain.netlify.app"
   ```

5. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

#### Netlify Configuration
The project includes `netlify.toml` with optimized settings.

---

### Option 3: Self-Hosted (VPS/Cloud Server)

#### Requirements:
- Node.js 18+ installed
- PM2 or similar process manager
- Nginx or Apache for reverse proxy

#### Steps:

1. **Clone/Upload Project** to your server:
   ```bash
   git clone <your-repo-url>
   cd Script-Gen-AI
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Create Production Environment File**:
   ```bash
   nano .env.production.local
   ```
   Add all environment variables (update `NEXT_PUBLIC_APP_URL` to your domain)

4. **Build the Application**:
   ```bash
   npm run build
   ```

5. **Start with PM2**:
   ```bash
   npm i -g pm2
   pm2 start npm --name "scriptgo" -- start
   pm2 save
   pm2 startup
   ```

6. **Configure Nginx** (example):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3005;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

7. **Setup SSL** with Let's Encrypt:
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

---

## Post-Deployment Verification

### 1. Test Authentication
- [ ] Sign up with a new account
- [ ] Verify email is sent (check Resend dashboard)
- [ ] Login with existing account
- [ ] Test password reset flow

### 2. Test Core Features
- [ ] Generate a script (test AI integration)
- [ ] Save and edit scripts
- [ ] Test dashboard functionality
- [ ] Verify calendar view
- [ ] Check theme switching (light/dark mode)

### 3. Test Email Notifications
- [ ] Welcome email on signup
- [ ] Password reset email
- [ ] Script ready notification
- [ ] Subscription confirmation (if applicable)

### 4. Monitor Logs
- Check your hosting platform's logs for errors
- Monitor Supabase logs for database issues
- Review Resend dashboard for email delivery

---

## Troubleshooting

### Build Fails
- Ensure all dependencies are installed: `npm install`
- Clear Next.js cache: `rm -rf .next`
- Check for TypeScript errors: `npm run lint`

### Authentication Issues
- Verify Supabase URL and keys are correct
- Check that `handle_new_user` trigger is active in Supabase
- Ensure RLS policies are properly configured

### Email Not Sending
- Verify Resend API key is valid
- Check domain verification status in Resend
- Ensure `NEXT_PUBLIC_APP_URL` is set correctly

### Database Errors
- Run the latest schema migration in Supabase SQL Editor
- Check that all required columns exist in tables
- Verify RLS policies are not blocking operations

---

## Security Reminders

- ✅ Never commit `.env.local` to Git
- ✅ Use environment variables for all secrets
- ✅ Enable RLS on all Supabase tables
- ✅ Keep dependencies updated regularly
- ✅ Monitor API usage and set rate limits
- ✅ Use HTTPS in production
- ✅ Implement proper error handling

---

## Support & Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **Supabase Documentation**: https://supabase.com/docs
- **Vercel Deployment**: https://vercel.com/docs
- **Netlify Deployment**: https://docs.netlify.com

---

## Quick Deploy Commands

### Vercel
```bash
vercel --prod
```

### Netlify
```bash
netlify deploy --prod
```

### Self-Hosted
```bash
npm run build && pm2 restart scriptgo
```

---

**Last Updated**: January 2026
**Version**: 1.0.0
