# Quick Setup Guide: Fix Password Reset URL Issue

This guide will help you fix the password reset URL issue where links redirect to localhost instead of your production domain.

## What We Fixed

1. ✅ **Code Updated**: Modified `app/login/page.tsx` to use `NEXT_PUBLIC_APP_URL` environment variable
2. ✅ **Local Environment**: Updated `.env.local` to use your Vercel production URL
3. ✅ **Documentation**: Created comprehensive configuration guides

## What You Need to Do

### Step 1: Configure Vercel Environment Variables

1. **Go to Vercel Dashboard**
   - Visit [https://vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your `script-gen-ai` project

2. **Navigate to Settings**
   - Click **Settings** tab
   - Click **Environment Variables** in the left sidebar

3. **Add/Update `NEXT_PUBLIC_APP_URL`**
   - Check if `NEXT_PUBLIC_APP_URL` exists
   - If it exists, click **Edit** and update the value
   - If it doesn't exist, click **Add New**
   
   **Variable Configuration:**
   - **Key**: `NEXT_PUBLIC_APP_URL`
   - **Value**: `https://script-gen-ai-one.vercel.app`
   - **Environment**: Select **Production**, **Preview**, and **Development**
   
   - Click **Save**

4. **Verify Other Environment Variables**
   
   Make sure these are also set:
   - ✅ `NEXT_PUBLIC_SUPABASE_URL`
   - ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - ✅ `SUPABASE_SERVICE_ROLE_KEY`
   - ✅ `RESEND_API_KEY`
   - ✅ `GEMINI_API_KEY`

---

### Step 2: Configure Supabase Dashboard

1. **Go to Supabase Dashboard**
   - Visit [https://app.supabase.com](https://app.supabase.com)
   - Select your project

2. **Update Site URL**
   - Click **Authentication** in the left sidebar
   - Click **URL Configuration**
   - Find **Site URL** field
   - Change from `http://localhost:3000` to:
     ```
     https://script-gen-ai-one.vercel.app
     ```
   - Click **Save**

3. **Update Redirect URLs**
   - In the same **URL Configuration** page
   - Find **Redirect URLs** section
   - Add these URLs (if not already present):
     ```
     https://script-gen-ai-one.vercel.app/**
     https://script-gen-ai-one.vercel.app/auth/callback
     https://script-gen-ai-one.vercel.app/update-password
     ```
   - Keep your localhost URLs for local development:
     ```
     http://localhost:3000/**
     http://localhost:3000/auth/callback
     http://localhost:3000/update-password
     ```
   - Click **Save**

---

### Step 3: Deploy to Vercel

Now that the code is updated, deploy to Vercel:

#### Option A: Deploy via GitHub (Recommended)

1. **Commit and Push Changes**
   ```bash
   git add .
   git commit -m "Fix password reset URL to use production domain"
   git push origin main
   ```

2. **Vercel Auto-Deploy**
   - Vercel will automatically detect the push and start deploying
   - Go to your Vercel dashboard to monitor the deployment
   - Wait for deployment to complete (usually 2-3 minutes)

#### Option B: Manual Deploy via Vercel CLI

If you prefer to deploy manually:

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Deploy
vercel --prod
```

---

### Step 4: Test the Fix

After deployment completes:

1. **Navigate to Production Site**
   - Go to `https://script-gen-ai-one.vercel.app/login`

2. **Request Password Reset**
   - Click "Forgot password?"
   - Enter your email address
   - Click "Send Reset Link"

3. **Check Your Email**
   - Open the password reset email
   - **Verify the link** - it should now point to:
     ```
     https://script-gen-ai-one.vercel.app/update-password
     ```
   - **NOT** `http://localhost:3000/update-password`

4. **Click the Link**
   - The link should open the update password page on your production site
   - Enter your new password
   - Verify you can log in with the new password

---

## Troubleshooting

### Issue: Still seeing localhost in email links

**Solution:**
1. Make sure you completed **Step 1** (Vercel environment variables)
2. Make sure you completed **Step 3** (redeployed after setting variables)
3. Clear your browser cache
4. Try requesting a new password reset email

### Issue: "Invalid redirect URL" error

**Solution:**
1. Double-check **Step 2** - make sure redirect URLs are added in Supabase
2. Verify the URL exactly matches (including `https://` and no trailing slash)
3. Make sure you included the `/**` wildcard pattern

### Issue: Environment variable not working

**Solution:**
1. In Vercel dashboard, verify the variable is set for **Production** environment
2. After adding/updating variables, you MUST redeploy
3. Go to Deployments → Click three dots → Select "Redeploy"

---

## Summary of Changes

### Files Modified
- ✅ `app/login/page.tsx` - Updated to use `NEXT_PUBLIC_APP_URL` environment variable
- ✅ `.env.local` - Updated to use Vercel production URL
- ✅ `.env.example` - Enhanced with better documentation

### Files Created
- ✅ `SUPABASE_CONFIG.md` - Comprehensive Supabase configuration guide
- ✅ `SETUP_GUIDE.md` - This quick setup guide

### Configuration Required
- ⏳ Vercel environment variables (Step 1)
- ⏳ Supabase dashboard settings (Step 2)
- ⏳ Deploy to Vercel (Step 3)

---

## Next Steps

1. **Complete Step 1**: Set `NEXT_PUBLIC_APP_URL` in Vercel
2. **Complete Step 2**: Update Supabase Site URL and Redirect URLs
3. **Complete Step 3**: Deploy to Vercel (push to GitHub or use CLI)
4. **Complete Step 4**: Test the password reset flow

Once you complete these steps, your password reset feature will work perfectly in production! 🎉

---

## Need More Help?

- See `SUPABASE_CONFIG.md` for detailed Supabase configuration instructions
- Check Vercel deployment logs if deployment fails
- Check Supabase logs for authentication errors
- Verify all environment variables are set correctly in Vercel dashboard
