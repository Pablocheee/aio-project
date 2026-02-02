export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    try {
        const { message, history = [] } = req.body;
        const GEMINI_KEY = process.env.GEMINI_API_KEY;

        // Используем самую простую ссылку
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: "Ты ИИ-сотрудник AIO.CORE. Ответь очень кратко: " + (message || "Привет") }]
                }]
            })
        });

        const data = await response.json();

        // Если опять 404 - выведем подробности
        if (data.error) {
            console.error("FINAL_DEBUG:", JSON.stringify(data.error));
            return res.status(data.error.code || 500).json({ error: data.error.message });
        }

        const reply = data.candidates[0].content.parts[0].text;
        res.status(200).json({ reply });

    } catch (e) {
        res.status(500).json({ error: "Server Error", details: e.message });
    }
}
