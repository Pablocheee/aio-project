export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    try {
        const { message, history = [], isFinal, clientData } = req.body;
        
        const GEMINI_KEY = process.env.GEMINI_API_KEY;
        const TG_TOKEN = process.env.TG_TOKEN;
        const TG_CHAT_ID = process.env.TG_CHAT_ID;

        // Финальный шаг для Telegram
        if (isFinal && clientData) {
            const orderId = Math.floor(100000 + Math.random() * 900000);
            const report = `🚀 NEW AI CONTRACT #${orderId}\nURL: ${clientData.url}\nTG: ${clientData.contact}`;
            await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage?chat_id=${TG_CHAT_ID}&text=${encodeURIComponent(report)}`);
            return res.status(200).json({ reply: "Finalized", orderId });
        }

        // КОРРЕКТНЫЙ URL: v1beta и полное имя модели
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    { 
                        role: "user", 
                        parts: [{ text: "Ты ИИ-сотрудник AIO.CORE. Тебе нужно собрать URL и контакт клиента. Если данные есть, скажи: ПАКЕТ СФОРМИРОВАН." }] 
                    },
                    ...history,
                    { 
                        role: "user", 
                        parts: [{ text: message || "Привет" }] 
                    }
                ]
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("Gemini API Error Detail:", JSON.stringify(data.error, null, 2));
            return res.status(500).json({ error: data.error.message });
        }

        // Проверка структуры ответа
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const reply = data.candidates[0].content.parts[0].text;
            res.status(200).json({ reply });
        } else {
            console.error("Unexpected API Response:", data);
            res.status(500).json({ error: "Unexpected response format from Google AI" });
        }

    } catch (e) {
        console.error("Global Server Error:", e);
        res.status(500).json({ error: "Server Error", details: e.message });
    }
}
