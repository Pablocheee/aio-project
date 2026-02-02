export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { message, history, isFinal, clientData } = req.body;

    // Сценарий 1: Финальная стадия
    if (isFinal) {
        const orderId = Math.floor(100000 + Math.random() * 900000);
        // Тут можно вставить отправку в ТГ
        console.log(`NEW ORDER #${orderId}:`, clientData);
        return res.status(200).json({ success: true, orderId: orderId.toString() });
    }

    // Сценарий 2: Диалог с Grok
    try {
        const apiKey = process.env.XAI_API_KEY; // Убедись, что ключ в ENV называется так
        
        const response = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "grok-beta", // Или актуальная модель, например "grok-2"
                messages: [
                    {
                        role: "system",
                        content: `Ты — ИИ-интерфейс системы AIO.CORE. 
                        Твоя цель: получить URL и контакт клиента.
                        1. Если прислали URL — подтверди "захват цели" и запроси контакт (TG/Email).
                        2. Если прислали контакт — напиши строго: "ПАКЕТ СФОРМИРОВАН".
                        Стиль: Лаконичный, хакерский, футуристичный.`
                    },
                    ...(history || []),
                    { role: "user", content: message }
                ],
                temperature: 0.6
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("Grok API Error:", data.error);
            return res.status(500).json({ reply: "Ошибка Grok: " + data.error.message });
        }

        const reply = data.choices[0].message.content;
        return res.status(200).json({ reply });

    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ reply: "Узел перегружен. Попробуйте еще раз." });
    }
}
