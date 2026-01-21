# Script GO - AI-Powered Script Generator

A modern web application that generates professional video scripts and LinkedIn posts using AI.

## Features

- 🤖 AI-powered script generation using Google Gemini
- 🎬 Support for YouTube and LinkedIn platforms
- 🎨 Beautiful dark mode UI with glassmorphism
- 🔐 Secure authentication with Supabase
- 💾 Save and manage your scripts
- ✨ Smooth animations and transitions
- 📱 Fully responsive design

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS, Framer Motion
- **Backend**: Supabase (Auth & Database)
- **AI**: Google Gemini API
- **Deployment**: Netlify

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

3. Run the Supabase schema:
- Go to your Supabase project SQL Editor
- Run the SQL from `supabase-schema.sql`

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3001](http://localhost:3001)

## Deployment

For detailed instructions on how to deploy this application manually, please refer to:

- 📑 [Manual Deployment Guide](file:///c:/Users/YUGEN/Downloads/Script-Gen-AI/DEPLOYMENT.md) - Step-by-step instructions for Vercel, Netlify, and Self-hosting.
- ✅ [Pre-Deployment Checklist](file:///c:/Users/YUGEN/Downloads/Script-Gen-AI/DEPLOYMENT_CHECKLIST.md) - Ensuring everything is ready before you go live.

This app is configured for Netlify deployment by default via `netlify.toml`. Make sure to set all required environment variables (see [.env.example](file:///c:/Users/YUGEN/Downloads/Script-Gen-AI/.env.example)) in your hosting dashboard.

## License

MIT
