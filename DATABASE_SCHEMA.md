# Script-Gen-AI Database Schema Documentation

## Project Overview

**Application**: Script-Gen-AI  
**Database**: Supabase (PostgreSQL)  
**Authentication**: Supabase Auth  
**Repository**: https://github.com/Yugen0101/Script-Gen-AI

---

## Database Tables

### 1. `profiles` Table

Stores user profile information linked to authentication.

```sql
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text,
  is_premium boolean DEFAULT false,
  usage_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

**Columns**:
- `id` (uuid, PK): User ID from Supabase Auth
- `email` (text): User's email address
- `is_premium` (boolean): Premium subscription status
- `usage_count` (integer): Number of scripts generated
- `created_at` (timestamp): Profile creation timestamp

**Relationships**:
- Foreign key to `auth.users` with cascade delete

---

### 2. `scripts` Table

Stores generated scripts and content.

```sql
CREATE TABLE scripts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  platform text NOT NULL,
  tone text,
  content text NOT NULL,
  language text,
  length text,
  custom_length text,
  scheduled_date date,
  is_starred boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

**Columns**:
- `id` (uuid, PK): Unique script identifier
- `user_id` (uuid, FK): Owner of the script
- `title` (text): Script title
- `platform` (text): Target platform (YouTube, Instagram, etc.)
- `tone` (text): Script tone/style
- `content` (text): Generated script content
- `language` (text): Content language
- `length` (text): Script length category
- `custom_length` (text): Custom length specification
- `scheduled_date` (date): Publication schedule date
- `is_starred` (boolean): Favorite/starred status
- `created_at` (timestamp): Creation timestamp
- `updated_at` (timestamp): Last update timestamp

**Relationships**:
- Foreign key to `auth.users` with cascade delete

---

## Row Level Security (RLS)

All tables have RLS enabled for data security.

### Profiles Policies

```sql
-- Users can view own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can insert own profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

### Scripts Policies

```sql
-- Users can view own scripts
CREATE POLICY "Users can view own scripts"
  ON scripts FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert own scripts
CREATE POLICY "Users can insert own scripts"
  ON scripts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update own scripts
CREATE POLICY "Users can update own scripts"
  ON scripts FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete own scripts
CREATE POLICY "Users can delete own scripts"
  ON scripts FOR DELETE
  USING (auth.uid() = user_id);
```

---

## Database Triggers

### Automatic Profile Creation

Automatically creates a profile when a new user signs up.

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, is_premium, usage_count)
  VALUES (NEW.id, NEW.email, false, 0)
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

**Purpose**: Ensures every authenticated user has a corresponding profile record.

---

## Setup Instructions

### Initial Setup

Run the complete schema setup:

```bash
# File: supabase-schema.sql
# Location: C:\Users\YUGEN\Downloads\Script-Gen-AI\supabase-schema.sql
```

This creates:
- Tables (`profiles`, `scripts`)
- RLS policies
- Authentication trigger

### Profile Trigger Migration

Apply the profile creation trigger:

```bash
# File: profile_trigger_setup.sql
# Location: C:\Users\YUGEN\Downloads\Script-Gen-AI\profile_trigger_setup.sql
```

This migration:
- Creates/updates the `handle_new_user()` function
- Sets up the `on_auth_user_created` trigger
- Backfills profiles for existing users
- Includes verification queries

---

## Database Diagram

```
┌─────────────────┐
│   auth.users    │ (Supabase Auth)
│  (Built-in)     │
└────────┬────────┘
         │
         │ 1:1
         ▼
┌─────────────────┐
│    profiles     │
├─────────────────┤
│ id (PK, FK)     │
│ email           │
│ is_premium      │
│ usage_count     │
│ created_at      │
└─────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐
│    scripts      │
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ title           │
│ platform        │
│ tone            │
│ content         │
│ language        │
│ length          │
│ custom_length   │
│ scheduled_date  │
│ is_starred      │
│ created_at      │
│ updated_at      │
└─────────────────┘
```

---

## Recent Changes

### Authentication Fix (Commit: 9e696af)

**Problem**: Profile sync errors during user signup/login

**Solution**:
- Removed problematic server action calls
- Implemented database trigger for automatic profile creation
- Simplified authentication flow

**Files Modified**:
- `app/login/page.tsx` - Removed manual profile sync
- `app/actions/profile.ts` - Schema fixes
- `profile_trigger_setup.sql` - New migration file

---

## Environment Variables

Required for application:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GEMINI_API_KEY=your_gemini_key
RESEND_API_KEY=your_resend_key
NEXT_PUBLIC_APP_URL=http://localhost:3005
```

**Note**: Never commit `.env.local` or similar files to version control.

---

## Contact

**Developer**: YUGEN  
**Repository**: https://github.com/Yugen0101/Script-Gen-AI  
**Last Updated**: January 20, 2026
