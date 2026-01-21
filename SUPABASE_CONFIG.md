# Supabase Configuration Guide for Production Deployment

This guide will help you configure your Supabase project correctly for production deployment, ensuring features like password reset work properly.

## Table of Contents
1. [Site URL Configuration](#site-url-configuration)
2. [Redirect URLs Configuration](#redirect-urls-configuration)
3. [Email Template Configuration](#email-template-configuration)
4. [Environment Variables](#environment-variables)
5. [Troubleshooting](#troubleshooting)

---

## Site URL Configuration

The **Site URL** is the primary URL of your application. Supabase uses this for authentication redirects and email links.

### Steps to Update Site URL

1. **Navigate to Supabase Dashboard**
   - Go to [https://app.supabase.com](https://app.supabase.com)
   - Select your project

2. **Open Authentication Settings**
   - Click on **Authentication** in the left sidebar
   - Click on **URL Configuration**

3. **Update Site URL**
   - Find the **Site URL** field
   - **For Production**: Set it to your production domain
     ```
     https://script-gen-ai-one.vercel.app
     ```
     or your custom domain:
     ```
     https://your-custom-domain.com
     ```
   - **For Development**: You can keep `http://localhost:3000` for local testing

> [!IMPORTANT]
> The Site URL should match your `NEXT_PUBLIC_APP_URL` environment variable in production.

---

## Redirect URLs Configuration

Redirect URLs control where users can be redirected after authentication actions (login, signup, password reset).

### Steps to Configure Redirect URLs

1. **In the same URL Configuration page**, find **Redirect URLs**

2. **Add Production URLs**
   
   Add these patterns (replace with your actual domain):
   ```
   https://script-gen-ai-one.vercel.app/**
   https://script-gen-ai-one.vercel.app/auth/callback
   https://script-gen-ai-one.vercel.app/update-password
   ```

3. **Keep Development URLs** (for local testing)
   ```
   http://localhost:3000/**
   http://localhost:3000/auth/callback
   http://localhost:3000/update-password
   ```

4. **Click Save**

> [!WARNING]
> The `**` wildcard is important - it allows all paths under your domain. Without it, authentication redirects may fail.

---

## Email Template Configuration

Supabase email templates use variables that need to be configured correctly.

### Default Email Templates

1. **Navigate to Email Templates**
   - In Supabase Dashboard, go to **Authentication** → **Email Templates**

2. **Check Password Recovery Template**
   - Select **Reset Password** template
   - Verify it uses the `{{ .SiteURL }}` variable
   - The default template should look like:
     ```html
     <p>Follow this link to reset the password for your user:</p>
     <p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
     ```

3. **Verify Variables**
   - `{{ .SiteURL }}` - Your configured Site URL
   - `{{ .ConfirmationURL }}` - Auto-generated reset link
   - These should automatically use your Site URL configuration

> [!TIP]
> If you're using custom email templates (via Resend), make sure they also use the correct production URL from environment variables.

---

## Environment Variables

### Local Development (`.env.local`)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
RESEND_API_KEY=your-resend-api-key
GEMINI_API_KEY=your-gemini-api-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Vercel Production

1. **Go to Vercel Dashboard**
   - Navigate to your project
   - Go to **Settings** → **Environment Variables**

2. **Add/Update Variables**
   
   Set these environment variables:
   
   | Variable Name | Value | Environment |
   |--------------|-------|-------------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project-id.supabase.co` | Production, Preview, Development |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon key | Production, Preview, Development |
   | `SUPABASE_SERVICE_ROLE_KEY` | Your service role key | Production, Preview, Development |
   | `RESEND_API_KEY` | Your Resend API key | Production, Preview, Development |
   | `GEMINI_API_KEY` | Your Gemini API key | Production, Preview, Development |
   | **`NEXT_PUBLIC_APP_URL`** | **`https://script-gen-ai-one.vercel.app`** | **Production** |
   | `NEXT_PUBLIC_APP_URL` | `https://your-preview-url.vercel.app` | Preview (optional) |

3. **Redeploy**
   - After adding/updating environment variables, redeploy your application
   - Go to **Deployments** tab
   - Click the three dots on the latest deployment
   - Select **Redeploy**

> [!IMPORTANT]
> The `NEXT_PUBLIC_APP_URL` variable is critical for password reset to work correctly in production.

### Netlify Production (if using Netlify)

1. **Go to Netlify Dashboard**
   - Navigate to your site
   - Go to **Site settings** → **Environment variables**

2. **Add Variables**
   - Add the same variables as listed above for Vercel
   - Set `NEXT_PUBLIC_APP_URL` to your Netlify domain:
     ```
     https://your-app.netlify.app
     ```

---

## Troubleshooting

### Issue: Password reset links still point to localhost

**Solution:**
1. Verify `NEXT_PUBLIC_APP_URL` is set in Vercel/Netlify environment variables
2. Redeploy the application after setting the variable
3. Check Supabase Site URL is set to production domain
4. Clear your browser cache and try again

### Issue: "Invalid redirect URL" error

**Solution:**
1. Check that your production URL is added to **Redirect URLs** in Supabase
2. Make sure you included the `/**` wildcard pattern
3. Verify the URL exactly matches (including `https://` and no trailing slash)

### Issue: Emails not being sent

**Solution:**
1. Check Resend API key is valid and set in environment variables
2. Verify your email domain is verified in Resend dashboard
3. Check Supabase logs for any email-related errors
4. Ensure `SUPABASE_SERVICE_ROLE_KEY` is correctly set

### Issue: Reset link works locally but not in production

**Solution:**
1. This is the exact issue we're fixing! Make sure:
   - `NEXT_PUBLIC_APP_URL` is set to production URL in Vercel
   - Supabase Site URL is set to production URL
   - Code has been updated to use `process.env.NEXT_PUBLIC_APP_URL`
   - Application has been redeployed after changes

---

## Quick Checklist

Before deploying to production, verify:

- [ ] Supabase Site URL is set to production domain
- [ ] Supabase Redirect URLs include production domain with `/**`
- [ ] `NEXT_PUBLIC_APP_URL` environment variable is set in Vercel/Netlify
- [ ] All other environment variables are configured
- [ ] Code has been updated to use environment variable for redirects
- [ ] Application has been redeployed
- [ ] Password reset tested in production

---

## Testing Password Reset Flow

### Local Testing
1. Run `npm run dev`
2. Navigate to `/login`
3. Click "Forgot password?"
4. Enter your email
5. Check email - link should point to `http://localhost:3000/update-password`
6. Click link and verify it works

### Production Testing
1. Navigate to your production URL `/login`
2. Click "Forgot password?"
3. Enter your email
4. Check email - link should point to `https://your-production-url/update-password`
5. Click link and verify it opens the update password page
6. Update password and verify you can log in

---

## Additional Resources

- [Supabase Auth Configuration Docs](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [Resend Email Setup](https://resend.com/docs/introduction)

---

## Need Help?

If you're still experiencing issues:
1. Check the browser console for errors
2. Check Vercel/Netlify deployment logs
3. Check Supabase logs in the dashboard
4. Verify all environment variables are set correctly
5. Try a fresh deployment
