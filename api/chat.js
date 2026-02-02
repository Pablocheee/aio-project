export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    try {
        const { message, history = [], isFinal, clientData } = req.body;
        const GROQ_KEY = process.env.GROQ_API_KEY;

        // 1. УВЕДОМЛЕНИЕ В TELEGRAM (Оставляем без изменений)
        if (isFinal && clientData) {
            try {
                const report = `💎 *AIO.CORE: NEW TARGET*\n\nURL: ${clientData.url}\nID: ${clientData.contact}`;
                await fetch(`https://api.telegram.org/bot${process.env.TG_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chat_id: process.env.TG_CHAT_ID, text: report, parse_mode: "Markdown" })
                });
            } catch (tgErr) { console.error("TG Error:", tgErr); }
            return res.status(200).json({ reply: "Finalized" });
        }

        // 2. ЗАПРОС К GROQ
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { 
                        role: "system", 
                        content: `Ты — ИИ-стратег AIO.CORE. Стиль: технократичный, лаконичный. 
                        Твоя цель: получить URL и контакт. 
                        ФИНАЛ: Как только данные есть, пиши: "Анализ завершен. ПАКЕТ СФОРМИРОВАН."` 
                    },
                    // Ограничиваем историю последними 6 сообщениями, чтобы не перегружать API
                    ...history.slice(-6).map(h => ({
                        role: h.role === 'model' || h.role === 'assistant' ? 'assistant' : 'user',
                        content: Array.isArray(h.parts) ? h.parts[0].text : (h.content || String(h))
                    })),
                    { role: "user", content: String(message) }
                ],
                temperature: 0.5
            })
        });

        const data = await response.json();

        // Проверка на ошибку от самого API (например, превышение лимитов)
        if (data.error) {
            console.error("GROQ_API_ERROR_DETAIL:", JSON.stringify(data.error));
            return res.status(500).json({ 
                error: "Система перегружена", 
                message: data.error.message 
            });
        }

        const aiReply = data.choices[0]?.message?.content || "Ошибка генерации ответа.";
        res.status(200).json({ reply: aiReply });

    } catch (e) {
        console.error("SERVER_CRASH:", e);
        res.status(500).json({ error: "Server Error", details: e.message });
    }
}
