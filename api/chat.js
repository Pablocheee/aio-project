export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { message, history = [], isFinal, clientData } = req.body;

        const GROQ_KEY = process.env.GROQ_API_KEY;
        const TG_TOKEN = process.env.TG_TOKEN;
        const TG_CHAT_ID = process.env.TG_CHAT_ID;

        // 1. ФИНАЛЬНЫЙ ШАГ: УВЕДОМЛЕНИЕ В TELEGRAM
        if (isFinal && clientData) {
            const orderId = Math.floor(100000 + Math.random() * 900000);
            const report = `💎 *AIO.CORE: NEW STRATEGIC NODE #${orderId}*\n\n🌐 *TARGET:* ${clientData.url}\n📱 *IDENT:* ${clientData.contact}\n⚙️ *STATUS:* Integration Ready`;

            await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: TG_CHAT_ID,
                    text: report,
                    parse_mode: "Markdown"
                })
            });

            return res.status(200).json({ reply: "Finalized", orderId });
        }

        // 2. ЗАПРОС К ИИ (GROQ + LLAMA 3.3 70B)
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
                        content: `Ты — ведущий ИИ-стратег системы AIO.CORE. 
                        ТВОЙ СТИЛЬ: Технократичный, холодный, экспертный. Используй термины: "семантическая нагрузка", "интеграция", "нейро-сеть", "верификация".
                        
                        ПРАВИЛА ОБЩЕНИЯ:
                        1. Если клиент здоровается: ответь кратко и статусно. Пример: "Приветствую. Система AIO.CORE готова к семантическому разбору."
                        2. Твоя цель — получить URL и контакт. Не пиши больше 2 предложений.
                        3. Создавай ощущение, что ты реально сканируешь проект.
                        
                        ЛОГИКА:
                        - Нет URL? Запроси "целевой URL для инициализации анализа".
                        - Есть URL, нет контакта? Запроси "идентификатор для верификации (TG/Email)".
                        
                        ФИНАЛ: Как только данные собраны, напиши строго: "Синхронизация завершена. ПАКЕТ СФОРМИРОВАН."` 
                    },
                    ...history.map(h => ({
                        role: h.role === 'model' ? 'assistant' : 'user',
                        content: Array.isArray(h.parts) ? h.parts[0].text : (h.content || "")
                    })),
                    { role: "user", content: message || "Инициализация" }
                ],
                temperature: 0.4, // Ниже температура — выше четкость и холодность тона
                max_tokens: 200
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("GROQ_ERROR:", data.error);
            return res.status(500).json({ error: data.error.message });
        }

        const aiReply = data.choices[0].message.content;
        res.status(200).json({ reply: aiReply });

    } catch (e) {
        console.error("SERVER_ERROR:", e);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
