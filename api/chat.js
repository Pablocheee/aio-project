export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    try {
        const { message, history = [], isFinal, clientData } = req.body;
        const GEMINI_KEY = process.env.GEMINI_API_KEY;

        if (isFinal && clientData) {
            const orderId = Math.floor(100000 + Math.random() * 900000);
            const report = `🚀 NEW AI CONTRACT #${orderId}\nURL: ${clientData.url}\nTG: ${clientData.contact}`;
            await fetch(`https://api.telegram.org/bot${process.env.TG_TOKEN}/sendMessage?chat_id=${process.env.TG_CHAT_ID}&text=${encodeURIComponent(report)}`);
            return res.status(200).json({ reply: "Finalized", orderId });
        }

        // Попробуем v1 (стабильную) с уточненным именем модели
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    ...history,
                    { role: "user", parts: [{ text: "Ты ИИ AIO.CORE. Кратко ответь на: " + message }] }
                ],
                generationConfig: { temperature: 0.7, maxOutputTokens: 200 }
            })
        });

        const data = await response.json();

        if (data.error) {
            // Это поможет нам увидеть, если Google ругается на регион (Location not supported)
            console.error("GOOGLE_RAW_ERROR:", JSON.stringify(data.error));
            return res.status(data.error.code || 500).json({ error: data.error.message });
        }

        if (data.candidates && data.candidates[0]?.content?.parts?.[0]) {
            res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
        } else {
            res.status(500).json({ error: "No candidates found", raw: data });
        }

    } catch (e) {
        res.status(500).json({ error: "Server error", details: e.message });
    }
}
