export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

    const { message, history, isFinal, clientData } = req.body;

    // Вспомогательная функция отправки в твой ТГ
    async function sendToTg(text) {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;
        if (!token || !chatId) return;
        try {
            await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, text: text, parse_mode: "HTML" })
            });
        } catch (e) { console.error("TG Error:", e); }
    }

    // Сценарий 1: Финальный лид (нажали кнопку оплаты или подтвердили контакт)
    if (isFinal) {
        const orderId = Math.floor(100000 + Math.random() * 900000);
        await sendToTg(`<b>✅ ЗАКАЗ #${orderId}</b>\nURL: ${clientData.url}\nКонтакт: ${clientData.contact}`);
        return res.status(200).json({ success: true, orderId: orderId.toString() });
    }

    // Сценарий 2: Диалог
    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: `Ты — ИИ AIO.CORE. 
                        Твои гарантии: 100% индексация в LLM за 72 часа. Манибэк, если через неделю проект не выдается в ответах ИИ.
                        Что получит клиент: прошивку в векторные БД и доминирование в ответах ChatGPT/Claude.
                        
                        Правила:
                        1. Отвечай кратко и уверенно.
                        2. Сначала получи URL, затем контакт (TG/Email).
                        3. После контакта пиши: ПАКЕТ СФОРМИРОВАН.`
                    },
                    ...(history || []),
                    { role: "user", content: message }
                ],
                temperature: 0.4
            })
        });

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || "Ошибка данных.";

        // Пересылаем важные ответы в ТГ сразу (чтобы не упустить лид)
        if (message.includes('.') || message.includes('@') || message.length > 5) {
            await sendToTg(`<b>💬 Сообщение:</b> <code>${message}</code>`);
        }

        return res.status(200).json({ reply });

    } catch (error) {
        return res.status(200).json({ reply: "Узел связи временно перегружен." });
    }
}
