const fs = require('fs');
const path = require('path');

function getApiKey() {
    const envPath = path.join(__dirname, '.env.local');
    if (!fs.existsSync(envPath)) return null;
    const content = fs.readFileSync(envPath, 'utf8');
    const match = content.match(/GEMINI_API_KEY=(.*)/);
    return match ? match[1].trim() : null;
}

async function listModels() {
    const apiKey = getApiKey();
    if (!apiKey) {
        console.error("No GEMINI_API_KEY found in .env.local");
        return;
    }

    console.log(`Using Key: ${apiKey.substring(0, 5)}...`);

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        console.log(`Fetching from: ${url.replace(apiKey, 'REDACTED')}`);

        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("API Error Response:", JSON.stringify(data.error, null, 2));
        } else if (data.models) {
            console.log("AVAILABLE MODELS FOR THIS KEY:");
            data.models.forEach(m => {
                console.log(`- ID: ${m.name.replace('models/', '')}`);
                console.log(`  Name: ${m.displayName}`);
                console.log(`  Description: ${m.description}`);
                console.log(`  Methods: ${m.supportedGenerationMethods.join(", ")}`);
                console.log("---");
            });
        } else {
            console.log("No models returned. Response:", JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

listModels();
