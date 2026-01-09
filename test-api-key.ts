import { GoogleGenerativeAI } from '@google/generative-ai';

async function testNewKey() {
    try {
        const key = 'AIzaSyDxWEyMiHcob4lpC0VPx2i9uJ9K-g2L65k';
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        console.log('Testing new Gemini API key...');

        const result = await model.generateContent('Write a short 2-sentence script hook about AI technology.');
        const response = await result.response;
        const text = response.text();

        console.log('\n✅ SUCCESS! API key is working!');
        console.log('\nGenerated content:');
        console.log(text);

        return { success: true, content: text };
    } catch (error: any) {
        console.error('\n❌ ERROR! API key test failed:');
        console.error(error.message);
        return { success: false, error: error.message };
    }
}

testNewKey();
