export default async function handler(req, res) {
    // Разрешаем только POST запросы
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { message, history, isFinal, clientData } = req.body;

    // Сценарий 1: Финальная стадия (генерация Order ID)
    if (isFinal) {
        const orderId = Math.floor(100000 + Math.random() * 900000);
        console.log(`NEW ORDER #${orderId}:`, clientData);
        return res.status(200).json({ success: true, orderId: orderId.toString() });
    }

    // Сценарий 2: Диалог с ИИ
    try {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error("Missing OpenAI API Key");
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "gpt-4-turbo-preview", // или "gpt-3.5-turbo" для экономии
                messages: [
                    {
                        role: "system",
                        content: `Ты — ИИ AIO.CORE. Собирай данные. 
                        Сначала жди URL. После URL — проси контакт (TG/Email). 
                        Когда контакт получен, строго пиши: "АНАЛИЗ ЗАВЕРШЕН. ПАКЕТ СФОРМИРОВАН #XXXXXX".`
                    },
                    ...(history || []),
                    { role: "user", content: message }
                ]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            console.error("OpenAI API Error:", data.error);
            return res.status(500).json({ reply: "Ошибка API: " + data.error.message });
        }

        const reply = data.choices[0].message.content;
        return res.status(200).json({ reply });

    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ reply: "Узел перегружен. Попробуйте еще раз." });
    }
}
