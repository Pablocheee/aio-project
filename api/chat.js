export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    try {
        const { message, history = [], isFinal, clientData } = req.body;
        
        const GEMINI_KEY = process.env.GEMINI_API_KEY;
        const TG_TOKEN = process.env.TG_TOKEN;
        const TG_CHAT_ID = process.env.TG_CHAT_ID;

        // Финальная отправка в Telegram
        if (isFinal && clientData) {
            const orderId = Math.floor(100000 + Math.random() * 900000);
            const report = `🚀 NEW AI CONTRACT #${orderId}\nURL: ${clientData.url}\nTG: ${clientData.contact}`;
            await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage?chat_id=${TG_CHAT_ID}&text=${encodeURIComponent(report)}`);
            return res.status(200).json({ reply: "Finalized", orderId });
        }

        // ПУТЬ К СТАБИЛЬНОЙ МОДЕЛИ GEMINI-PRO
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    { 
                        role: "user", 
                        parts: [{ text: "Ты ИИ-сотрудник AIO.CORE. Тебе нужно собрать URL и контакт клиента. Веди себя как холодный техно-ассистент. Если данные есть, скажи: ПАКЕТ СФОРМИРОВАН." }] 
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

        // Если все еще ошибка — выводим её полностью в логи
        if (data.error) {
            console.error("DEBUG GEMINI ERROR:", JSON.stringify(data, null, 2));
            return res.status(500).json({ error: data.error.message });
        }

        if (data.candidates && data.candidates[0]?.content?.parts?.[0]) {
            const reply = data.candidates[0].content.parts[0].text;
            res.status(200).json({ reply });
        } else {
            res.status(500).json({ error: "Empty response from AI" });
        }

    } catch (e) {
        res.status(500).json({ error: "Server Error", details: e.message });
    }
}
