export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    try {
        const { message, history = [], isFinal, clientData } = req.body;

        // Финальный шаг для Telegram (оставляем как было)
        if (isFinal && clientData) {
            const orderId = Math.floor(100000 + Math.random() * 900000);
            const report = `🚀 NEW AI CONTRACT #${orderId}\nURL: ${clientData.url}\nTG: ${clientData.contact}`;
            await fetch(`https://api.telegram.org/bot${process.env.TG_TOKEN}/sendMessage?chat_id=${process.env.TG_CHAT_ID}&text=${encodeURIComponent(report)}`);
            return res.status(200).json({ reply: "Finalized", orderId });
        }

        // Запрос к Groq
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: "Ты ИИ-сотрудник AIO.CORE. Тебе нужно собрать URL и контакт клиента. Если данные есть, скажи: ПАКЕТ СФОРМИРОВАН." },
                    ...history.map(h => ({
                        role: h.role === 'model' ? 'assistant' : 'user',
                        content: h.parts[0].text
                    })),
                    { role: "user", content: message || "Привет" }
                ]
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(500).json({ error: data.error.message });
        }

        res.status(200).json({ reply: data.choices[0].message.content });

    } catch (e) {
        res.status(500).json({ error: "Server Error", details: e.message });
    }
}
