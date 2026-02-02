export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    try {
        const { message, history = [], isFinal, clientData } = req.body;
        const GROQ_KEY = process.env.GROQ_API_KEY;

        // 1. УВЕДОМЛЕНИЕ В TELEGRAM (СРАБАТЫВАЕТ ПОСЛЕ ОПЛАТЫ/ФИНАЛА)
        if (isFinal && clientData) {
            const orderId = Math.floor(100000 + Math.random() * 900000);
            const report = `💎 *AIO.CORE: NEW TARGET #${orderId}*\n\n🌐 *URL:* ${clientData.url}\n📱 *IDENT:* ${clientData.contact}\n⚙️ *STATUS:* Ready to Unlock`;
            
            await fetch(`https://api.telegram.org/bot${process.env.TG_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: process.env.TG_CHAT_ID,
                    text: report,
                    parse_mode: "Markdown"
                })
            });
            return res.status(200).json({ reply: "Finalized" });
        }

        // 2. ПОДГОТОВКА ИСТОРИИ (ФОРМАТ assistant/user)
        const formattedMessages = [
            { 
                role: "system", 
                content: `Ты — ведущий ИИ-стратег AIO.CORE. 
                СТИЛЬ: Лаконичный, холодный, технократичный.
                ЗАДАЧА: Собрать URL и контакт (СТРОГО Telegram или Email). Номер телефона НЕ запрашивать.
                
                ИНСТРУКЦИЯ:
                - На приветствие отвечай кратко: "Приветствую. Система в режиме готовности. Укажите целевой URL."
                - Если есть URL, запрашивай идентификатор: "Принято. Укажите Telegram или Email для верификации и передачи данных."
                
                ФИНАЛ: Как только получены URL и (Telegram или Email), напиши строго: "Анализ завершен. Стратегический пакет сгенерирован и заблокирован в защищенном узле. Для дешифровки данных требуется подтверждение транзакции. ПАКЕТ СФОРМИРОВАН."` 
            }
        ];

        if (Array.isArray(history)) {
            history.slice(-6).forEach(msg => {
                const role = (msg.role === 'model' || msg.role === 'assistant') ? 'assistant' : 'user';
                let content = msg.parts ? msg.parts[0].text : (msg.content || "");
                if (content) formattedMessages.push({ role, content });
            });
        }

        formattedMessages.push({ role: "user", content: String(message || "Инициализация") });

        // 3. ЗАПРОС К GROQ (Llama 3.3 70B)
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: formattedMessages,
                temperature: 0.4,
                max_tokens: 250
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(400).json({ error: data.error.message });
        }

        const aiReply = data.choices[0]?.message?.content || "Система в режиме ожидания.";
        res.status(200).json({ reply: aiReply });

    } catch (e) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}
