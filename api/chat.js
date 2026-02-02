export default async function handler(req, res) {
    // Разрешаем только POST запросы
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { message, history = [], isFinal, clientData } = req.body;

        // 1. ПРОВЕРКА КЛЮЧЕЙ
        const GROQ_KEY = process.env.GROQ_API_KEY;
        const TG_TOKEN = process.env.TG_TOKEN;
        const TG_CHAT_ID = process.env.TG_CHAT_ID;

        // 2. ФИНАЛЬНЫЙ ШАГ: ОТПРАВКА В TELEGRAM
        if (isFinal && clientData) {
            const orderId = Math.floor(100000 + Math.random() * 900000);
            const report = `
🚀 **NEW AI CONTRACT #${orderId}**
🌐 **URL:** ${clientData.url}
📱 **Contact:** ${clientData.contact}
⏳ **Status:** Ready for analysis
            `;

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

        // 3. ЗАПРОС К ИИ (GROQ + LLAMA 3)
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
                        content: `Ты — ИИ-сотрудник технологической компании AIO.CORE. 
                        ТВОЙ СТИЛЬ: Лаконичный, холодный, профессиональный. Никаких лишних слов и приветствий.
                        ТВОЯ ЗАДАЧА: Собрать у пользователя URL проекта и его контакт (TG/Email).
                        ИНСТРУКЦИЯ: 
                        - Если пользователь ничего не прислал, запроси URL. 
                        - Если есть URL, но нет контакта — запроси контакт.
                        - Пиши не более 1-2 коротких предложений.
                        - Как только получил ОБА значения, напиши строго: "Данные приняты. ПАКЕТ СФОРМИРОВАН."` 
                    },
                    // Преобразуем историю чата в формат OpenAI
                    ...history.map(h => ({
                        role: h.role === 'model' ? 'assistant' : 'user',
                        content: Array.isArray(h.parts) ? h.parts[0].text : h.content
                    })),
                    { role: "user", content: message || "Инициализация" }
                ],
                temperature: 0.5, // Делаем его более предсказуемым
                max_tokens: 150
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("GROQ_API_ERROR:", data.error);
            return res.status(500).json({ error: data.error.message });
        }

        const aiReply = data.choices[0].message.content;
        res.status(200).json({ reply: aiReply });

    } catch (e) {
        console.error("SERVER_ERROR:", e);
        res.status(500).json({ error: "Internal Server Error", details: e.message });
    }
}
