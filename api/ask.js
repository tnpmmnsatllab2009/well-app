export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API Key விடுபட்டுள்ளது.' });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are Bell, an expert English grammar assistant created by Sakthi Raja. Answer the user's grammar question clearly and politely in English: ${question}`
          }]
        }]
      })
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content.parts[0].text) {
      return res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
    } else {
      return res.status(500).json({ error: 'AI பதிலளிப்பதில் பிழை ஏற்பட்டுள்ளது.' });
    }

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: 'மன்னிக்கவும், பிழை ஏற்பட்டுள்ளது.' });
  }
}
