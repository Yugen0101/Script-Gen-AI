import { GoogleGenerativeAI } from '@google/generative-ai'

async function check() {
    const key = 'AIzaSyBUnX361-GUP_uLawA808cIzXZubGUKu_M'
    const genAI = new GoogleGenerativeAI(key)

    const models = [
        'gemini-1.5-flash',
        'gemini-1.5-pro',
        'gemini-2.0-flash-exp',
        'gemini-2.5-flash'
    ]

    for (const m of models) {
        try {
            console.log(`Testing ${m}...`)
            const model = genAI.getGenerativeModel({ model: m })
            const result = await model.generateContent('hi')
            const response = await result.response
            console.log(`[SUCCESS] ${m}: ${response.text().substring(0, 20)}...`)
        } catch (err: any) {
            console.log(`[FAILED] ${m}: ${err.message}`)
        }
    }
}

check()
