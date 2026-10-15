import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { question } = req.body;
        if (!question) {
            return res.status(400).json({ error: 'Question is required' });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        const response =.ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are WELL, an expert English grammar assistant. Please answer the user's grammar question clearly and politely in English with Tamil explanations if needed: ${question}`,
        });

        const reply = response.text;
        return res.status(200).json({ reply });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
