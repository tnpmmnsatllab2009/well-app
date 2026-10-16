export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { question } = req.body;
        if (!question) {
            return res.status(400).json({ error: 'Question is required' });
        }

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "anthropic/claude-3-haiku",
                messages: [
                    {
                        role: "system",
                        content: "You are WELL, an expert English grammar assistant. Please answer the user's grammar question clearly and politely in English with Tamil explanations if needed."
                    },
                    {
                        role: "user",
                        content: question
                    }
                ]
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error?.message || 'OpenRouter API error');
        }

        const reply = data.choices[0].message.content;
        return res.status(200).json({ reply });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
