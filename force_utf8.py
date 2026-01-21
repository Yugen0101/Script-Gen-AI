def force_utf8():
    path = '.env.local'
    lines = [
        "NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL",
        "NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY",
        "RESEND_API_KEY=YOUR_RESEND_API_KEY",
        "NEXT_PUBLIC_APP_URL=http://localhost:3000",
        "GEMINI_API_KEY=YOUR_GEMINI_API_KEY",
        "SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY"
    ]
    with open(path, 'wb') as f:
        # Write clean UTF-8 without BOM
        f.write('\n'.join(lines).encode('utf-8'))
    print("Successfully forced .env.local to UTF-8")

if __name__ == "__main__":
    force_utf8()
