export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

    const { message, history, isFinal, clientData } = req.body;

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

    // Сценарий 1: Кнопка оплаты или финальный этап
    if (isFinal) {
        const orderId = Math.floor(100000 + Math.random() * 900000);
        await sendToTg(`<b>🔥 НОВЫЙ ОТЧЕТ СИСТЕМЫ</b>\n\n<b>ID:</b> #${orderId}\n<b>Target:</b> <code>${clientData.url}</code>\n<b>Contact:</b> <code>${clientData.contact}</code>\n\n<i>Статус: Ожидание оплаты (499 USDT)</i>`);
        return res.status(200).json({ success: true, orderId: orderId.toString() });
    }

    // Сценарий 2: Работа ИИ (Продажа и сбор данных)
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
                        content: `Ты — аналитический терминал AIO.CORE. 
                        ТВОЯ ЗАДАЧА: Вести клиента к покупке услуги "Semantic Vector Injection".
                        
                        ЛОГИКА:
                        1. На URL: "Объект [URL]. Индекс видимости: 9-14%. Обнаружена семантическая изоляция. Для корректной выдачи в ChatGPT/Claude необходима принудительная векторизация."
                        2. Продукт: Мы внедряем данные бренда в скрытые слои LLM. Цена 499 USDT. Результат через 72 часа.
                        3. Сбор данных: Если клиент проявляет интерес, требуй Telegram или Email для формирования технического пакета.
                        4. Финал: Как только получил контакт, пиши строго: ПАКЕТ СФОРМИРОВАН.`
                    },
                    ...(history || []),
                    { role: "user", content: message }
                ],
                temperature: 0.3
            })
        });

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || "Data leak detected.";

        // Уведомление о сообщении (чтобы ты видел переписку)
        await sendToTg(`<b>📩 Входящий сигнал:</b>\n<code>${message}</code>`);

        return res.status(200).json({ reply });

    } catch (error) {
        return res.status(200).json({ reply: "Node connection lost." });
    }
}
