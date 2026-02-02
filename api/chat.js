export default async function handler(req, res) {
    const { message, history, isFinal, clientData } = req.body;
    
    // Берем секреты из настроек Vercel
    const GEMINI_KEY = process.env.GEMINI_API_KEY;
    const TG_TOKEN = process.env.TG_TOKEN;
    const TG_CHAT_ID = process.env.TG_CHAT_ID;

    // 1. Если это финальный шаг — отправляем отчет в Telegram
    if (isFinal && clientData) {
        const orderId = Math.floor(100000 + Math.random() * 900000);
        const report = `🚀 NEW AI CONTRACT #${orderId}\nURL: ${clientData.url}\nTG: ${clientData.contact}\nLOG: User finished chat.`;
        
        await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage?chat_id=${TG_CHAT_ID}&text=${encodeURIComponent(report)}`);
        return res.status(200).json({ reply: "Finalized", orderId });
    }

    // 2. Иначе — общаемся с Gemini
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    { role: "user", parts: [{ text: "Ты — ИИ-сотрудник AIO.CORE. Твоя задача: вежливо и профессионально собрать данные у клиента (URL, ниша, цели). Веди себя как холодный техно-ассистент из 2026 года. Если данных достаточно, скажи фразу: 'ПАКЕТ СФОРМИРОВАН'." }]},
                    ...history,
                    { role: "user", parts: [{ text: message }]}
                ]
            } )
        });

        const data = await response.json();
        const reply = data.candidates[0].content.parts[0].text;
        res.status(200).json({ reply });
    } catch (e) {
        res.status(500).json({ error: "Gemini Error" });
    }
}
