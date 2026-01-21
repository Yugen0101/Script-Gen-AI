require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testKey() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('Testing Key:', apiKey);

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent("Say hello");
        const response = await result.response;
        console.log('SUCCESS:', response.text());
    } catch (error) {
        console.error('FAILURE:', error);
        if (error.response) {
            console.error('Response Status:', error.response.status);
            console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

testKey();
