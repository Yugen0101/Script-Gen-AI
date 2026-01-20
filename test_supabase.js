const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    console.log('Testing Supabase Connection...');
    console.log('URL:', url);
    console.log('Key defined:', !!key);

    if (!url || !key) {
        console.error('Missing URL or Key!');
        process.exit(1);
    }

    const supabase = createClient(url, key);

    try {
        const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
        if (error) {
            console.error('Connection failed:', error.message);
            process.exit(1);
        }
        console.log('Connection successful! Table exists and is accessible.');
        process.exit(0);
    } catch (err) {
        console.error('Fatal error during connection test:', err.message);
        process.exit(1);
    }
}

testConnection();
