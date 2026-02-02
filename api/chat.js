export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { message, history, isFinal, clientData } = req.body;

    // Сценарий 1: Завершение заказа
    if (isFinal) {
        const orderId = Math.floor(100000 + Math.random() * 900000);
        console.log(`NEW ORDER #${orderId}:`, clientData);
        // Сюда можно будет вставить уведомление в Telegram
        return res.status(200).json({ success: true, orderId: orderId.toString() });
    }

    // Сценарий 2: Диалог через Groq
    try {
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            return res.status(200).json({ reply: "ОШИБКА: GROQ_API_KEY не установлен в Vercel." });
        }

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                // Llama 3.3 70B — самая мощная бесплатная модель на Groq сейчас
                model: "llama-3.3-70b-versatile", 
                messages: [
                    {
                        role: "system",
                        content: `Ты — ИИ-интерфейс системы AIO.CORE. 
                        Твоя цель: получить URL и контакт. 
                        1. Если видишь URL — подтверди захват цели и запроси контакт (TG/Email). 
                        2. Если видишь контакт — напиши строго: ПАКЕТ СФОРМИРОВАН.
                        Стиль: Лаконичный, технический, без лишних слов.`
                    },
                    ...(history || []),
                    { role: "user", content: message }
                ],
                temperature: 0.5
            })
        });

        const data = await response.json();

        // Обработка ошибок API
        if (data.error || !response.ok) {
            const errorMsg = data.error?.message || "Неизвестная ошибка API";
            console.error("Groq Error:", errorMsg);
            return res.status(200).json({ reply: `Ошибка Groq: ${errorMsg}` });
        }

        const reply = data.choices?.[0]?.message?.content || "Ошибка: пустой ответ.";
        return res.status(200).json({ reply });

    } catch (error) {
        console.error("Server Error:", error);
        return res.status(200).json({ reply: `Сбой системы: ${error.message}` });
    }
}
