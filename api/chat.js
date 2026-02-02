export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    try {
        // Добавляем = [] чтобы сервер не падал на первом сообщении
        const { message, history = [], isFinal, clientData } = req.body;
        
        const GEMINI_KEY = process.env.GEMINI_API_KEY;
        const TG_TOKEN = process.env.TG_TOKEN;
        const TG_CHAT_ID = process.env.TG_CHAT_ID;

        if (isFinal && clientData) {
            const orderId = Math.floor(100000 + Math.random() * 900000);
            const report = `🚀 NEW AI CONTRACT #${orderId}\nURL: ${clientData.url}\nTG: ${clientData.contact}`;
            await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage?chat_id=${TG_CHAT_ID}&text=${encodeURIComponent(report)}`);
            return res.status(200).json({ reply: "Finalized", orderId });
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    { role: "user", parts: [{ text: "Ты — ИИ-сотрудник AIO.CORE. Твоя задача: собрать URL, нишу и контакт. Если всё есть, скажи: ПАКЕТ СФОРМИРОВАН." }]},
                    ...history,
                    { role: "user", parts: [{ text: message || "Привет" }]}
                ]
            })
        });

        const data = await response.json();

        // Проверка: пришел ли ответ от ИИ или ошибка ключа
        if (!data.candidates || !data.candidates[0]) {
            console.error("Gemini Error Detail:", data);
            return res.status(500).json({ error: "API Key invalid or limit reached" });
        }

        const reply = data.candidates[0].content.parts[0].text;
        res.status(200).json({ reply });

    } catch (e) {
        console.error("Global Error:", e);
        res.status(500).json({ error: "Server Crash", details: e.message });
    }
}
