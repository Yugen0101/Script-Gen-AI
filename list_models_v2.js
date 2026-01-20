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

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            fs.writeFileSync('model_list_error.txt', JSON.stringify(data.error, null, 2), 'utf8');
            console.error("API Error: See model_list_error.txt");
        } else if (data.models) {
            const simpleList = data.models.map(m => ({
                id: m.name.replace('models/', ''),
                methods: m.supportedGenerationMethods
            }));
            fs.writeFileSync('model_list.json', JSON.stringify(simpleList, null, 2), 'utf8');
            console.log("Success! Saved model list to model_list.json");
        } else {
            fs.writeFileSync('model_list_plain.txt', JSON.stringify(data, null, 2), 'utf8');
            console.log("Unexpected response format. See model_list_plain.txt");
        }
    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

listModels();
