export default async function handler(req, res) {
    // Разрешаем только POST запросы
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { message, history = [], isFinal, clientData } = req.body;

        const GROQ_KEY = process.env.GROQ_API_KEY;
        const TG_TOKEN = process.env.TG_TOKEN;
        const TG_CHAT_ID = process.env.TG_CHAT_ID;

        // 1. ФИНАЛЬНЫЙ ШАГ: ОТПРАВКА В TELEGRAM
        if (isFinal && clientData) {
            const orderId = Math.floor(100000 + Math.random() * 900000);
            const report = `🚀 *NEW AI STRATEGY CONTRACT #${orderId}*\n\n🌐 *URL:* ${clientData.url}\n📱 *Contact:* ${clientData.contact}\n💎 *Status:* High-Priority Analysis`;

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

        // 2. ЗАПРОС К ИИ (GROQ + LLAMA 3)
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
                        content: `Ты — ведущий ИИ-стратег и лучший сотрудник компании AIO.CORE. 
                        ТВОЙ СТИЛЬ: Премиальный, уверенный, экспертный. Ты общаешься с клиентом как высокоуровневый партнер.
                        
                        ИНСТРУКЦИЯ ПО ОБЩЕНИЮ:
                        1. ПРИВЕТСТВИЕ: Если клиент здоровается, ответь вежливо и статусно (например: "Приветствую. Я готов к анализу вашего проекта."). 
                        2. СТРАТЕГИЯ: Твоя цель — четко получить URL сайта и контакт (TG/Email). 
                        3. ЛАКОНИЧНОСТЬ: Не пиши длинных текстов. Максимум 2-3 предложения. 
                        
                        ЛОГИКА ВОПРОСОВ:
                        - Если нет URL, запроси его для начала семантического разбора.
                        - Если есть URL, но нет контакта, запроси контакт для завершения формирования пакета.
                        
                        ФИНАЛ: Как только у тебя есть ОБА значения, напиши строго: "Благодарю. Анализ запущен. ПАКЕТ СФОРМИРОВАН."` 
                    },
                    // Корректная обработка истории сообщений
                    ...history.map(h => ({
                        role: h.role === 'model' ? 'assistant' : 'user',
                        content: Array.isArray(h.parts) ? h.parts[0].text : (h.content || "")
                    })),
                    { role: "user", content: message || "Привет" }
                ],
                temperature: 0.6, 
                max_tokens: 250
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
        console.error("SERVER_CRASH:", e);
        res.status(500).json({ error: "Internal Server Error", details: e.message });
    }
}
