def force_utf8():
    path = '.env.local'
    lines = [
        "NEXT_PUBLIC_SUPABASE_URL=https://vulbaduarnjcnieqryhf.supabase.co",
        "NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_wqg6_w1zgvyWHo84MouWyA_QUd_JLVd",
        "RESEND_API_KEY=re_7y6x4cQ3_6s17L4PHx75udDNxcaCPExrQ",
        "NEXT_PUBLIC_APP_URL=http://localhost:3000",
        "GEMINI_API_KEY=AIzaSyCABy9OIx8SQMIrrIf_TdRbK4eADdDqWj4",
        "SUPABASE_SERVICE_ROLE_KEY=sb_secret__cFvXe0zPHH1NytgE1DTIQ_vjARMhM7"
    ]
    with open(path, 'wb') as f:
        # Write clean UTF-8 without BOM
        f.write('\n'.join(lines).encode('utf-8'))
    print("Successfully forced .env.local to UTF-8")

if __name__ == "__main__":
    force_utf8()
