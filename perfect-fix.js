const fs = require('fs');
const path = require('path');

const handlerPath = path.join(__dirname, '.netlify', 'functions-internal', '___netlify-server-handler', '___netlify-server-handler.mjs');

if (fs.existsSync(handlerPath)) {
    console.log('Fixing:', handlerPath);
    let content = fs.readFileSync(handlerPath, 'utf8');

    // Step 1: Replace the literal broken Windows prefix with the expected Linux path
    // The prefix is: \var\task\Downloads\Script-Gen-AI
    content = content.replace(/\\var\\task\\Downloads\\Script-Gen-AI/g, '/var/task');

    // Step 2: Convert all remaining backslashes to forward slashes within the path strings
    // This handles cases like \.netlify\dist\... which might still exist
    content = content.replace(/(['"])(\/var\/task.*?)\1/g, (match, quote, p1) => {
        return quote + p1.replace(/\\/g, '/') + quote;
    });

    fs.writeFileSync(handlerPath, content);
    console.log('Perfect fix applied successfully!');
} else {
    console.error('File not found:', handlerPath);
}
