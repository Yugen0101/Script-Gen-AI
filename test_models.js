const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");

function getApiKey() {
    const envPath = path.join(__dirname, '.env.local');
    if (!fs.existsSync(envPath)) return null;
    const content = fs.readFileSync(envPath, 'utf8');
    const match = content.match(/GEMINI_API_KEY=(.*)/);
    return match ? match[1].trim() : null;
}

const candidates = [
    "gemini-2.0-flash-lite",
    "gemini-2.0-flash",
    "gemini-flash-latest",
    "gemini-pro-latest",
    "gemini-3-flash-preview",
    "gemini-2.0-flash-exp"
];

async function testModels() {
    const apiKey = getApiKey();
    const genAI = new GoogleGenerativeAI(apiKey);

    for (const modelId of candidates) {
        console.log(`\nTesting model: ${modelId}`);
        try {
            const model = genAI.getGenerativeModel({ model: modelId });
            const result = await model.generateContent("Say hello");
            const response = await result.response;
            console.log(`✅ Success with ${modelId}: ${response.text().substring(0, 20)}...`);
            break; // Stop at first working model
        } catch (error) {
            console.log(`❌ Failed with ${modelId}: ${error.message || error}`);
            if (error.message && error.message.includes("quota")) {
                console.log("   (Quota exceeded for this specific model)");
            }
        }
    }
}

testModels();
