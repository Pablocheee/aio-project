export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    try {
        const { message, history = [], isFinal, clientData } = req.body;
        const GROQ_KEY = process.env.GROQ_API_KEY;

        // 1. ЛОГИКА ТЕЛЕГРАМА (ФИНАЛ)
        if (isFinal && clientData) {
            const orderId = Math.floor(100000 + Math.random() * 900000);
            const report = `💎 *AIO.CORE: NEW TARGET #${orderId}*\n\n🌐 *URL:* ${clientData.url}\n📱 *IDENT:* ${clientData.contact}\n⚙️ *STATUS:* Ready to Unlock`;
            
            await fetch(`https://api.telegram.org/bot${process.env.TG_TOKEN}/sendMessage`, {
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

        // 2. СИСТЕМНАЯ УСТАНОВКА (УМНЫЙ ЭКСПЕРТ)
        const formattedMessages = [
            { 
                role: "system", 
                content: `Ты — ведущий ИИ-стратег AIO.CORE. 
                СТИЛЬ: Технократичный, элитный, лаконичный.
                
                ИНСТРУКЦИЯ ПО ОБЩЕНИЮ:
                - На приветствие: "Приветствую. Система AIO.CORE в режиме готовности. Укажите целевой URL."
                - Сбор данных: Нужен только URL и контакт (Telegram или Email). Номера телефонов игнорируй.
                
                ОБРАБОТКА ВОПРОСОВ (Если клиент сомневается):
                - О гарантиях: "Результат базируется на прямой векторной интеграции. Это исключает человеческий фактор. Эффект фиксируется в выдаче LLM-систем в течение 72 часов."
                - О наполнении: "Пакет содержит семантическую карту ниши, протоколы скрытой индексации и алгоритм приоритетного ранжирования в GPT/Claude."
                - О цене: "Вы оплачиваете доступ к закрытой технологии до её выхода в публичный доступ."
                
                ФИНАЛ: Как только данные собраны, пиши строго: "Анализ завершен. Стратегический пакет сгенерирован и заблокирован в защищенном узле. Для дешифровки данных требуется подтверждение транзакции. ПАКЕТ СФОРМИРОВАН."` 
            }
        ];

        // ФОРМИРОВАНИЕ ИСТОРИИ
        if (Array.isArray(history)) {
            history.slice(-8).forEach(msg => {
                const role = (msg.role === 'model' || msg.role === 'assistant') ? 'assistant' : 'user';
                let content = msg.parts ? msg.parts[0].text : (msg.content || "");
                if (content) formattedMessages.push({ role, content });
            });
        }

        formattedMessages.push({ role: "user", content: String(message || "Инициализация") });

        // 3. ЗАПРОС К GROQ
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: formattedMessages,
                temperature: 0.4
            })
        });

        const data = await response.json();
        const aiReply = data.choices[0]?.message?.content || "Система в режиме ожидания.";
        
        res.status(200).json({ reply: aiReply });

    } catch (e) {
        res.status(500).json({ error: "Server Error" });
    }
}
