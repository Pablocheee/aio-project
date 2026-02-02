export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { message, history, isFinal, clientData } = req.body;

    if (isFinal) {
        const orderId = Math.floor(100000 + Math.random() * 900000);
        console.log(`NEW ORDER #${orderId}:`, clientData);
        return res.status(200).json({ success: true, orderId: orderId.toString() });
    }

    try {
        const apiKey = process.env.XAI_API_KEY;

        // Проверка ключа в ENV
        if (!apiKey) {
            return res.status(200).json({ reply: "ОШИБКА: XAI_API_KEY не установлен в настройках хостинга." });
        }

        const response = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "grok-beta", 
                messages: [
                    {
                        role: "system",
                        content: `Ты — ИИ AIO.CORE. Получи URL и контакт. 
                        1. При получении URL запроси контакт (TG/Email). 
                        2. При получении контакта напиши строго: ПАКЕТ СФОРМИРОВАН.`
                    },
                    ...(history || []),
                    { role: "user", content: message }
                ],
                temperature: 0.6
            })
        });

        const data = await response.json();

        // Исправленная логика обработки ошибок
        if (data.error || !response.ok) {
            const errorMsg = data.error?.message || data.message || JSON.stringify(data);
            console.error("Grok Error:", errorMsg);
            return res.status(200).json({ reply: `Ошибка Grok: ${errorMsg}` });
        }

        const reply = data.choices?.[0]?.message?.content || "Ошибка: пустой ответ.";
        return res.status(200).json({ reply });

    } catch (error) {
        console.error("Server Error:", error);
        return res.status(200).json({ reply: `Сбой системы: ${error.message}` });
    }
}
