export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    try {
        const { message, history = [], isFinal, clientData } = req.body;
        const GROQ_KEY = process.env.GROQ_API_KEY;
        const TG_TOKEN = process.env.TG_TOKEN;
        const TG_CHAT_ID = process.env.TG_CHAT_ID;

        const sendTg = async (text) => {
            try {
                await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chat_id: TG_CHAT_ID, text: text, parse_mode: "Markdown" })
                });
            } catch (e) { console.error("TG Error"); }
        };

        if (isFinal && clientData) {
            const orderId = Math.floor(100000 + Math.random() * 900000);
            await sendTg(`💎 *AIO.CORE: ПАКЕТ СФОРМИРОВАН #${orderId}*\n\n🌐 *URL:* ${clientData.url}\n📱 *IDENT:* ${clientData.contact}\n⚙️ *STATUS:* Ожидает оплаты`);
            return res.status(200).json({ reply: "Finalized", orderId });
        }

        // Авто-уведомление о новом URL
        if (message.includes('.') && !message.includes('@')) {
             await sendTg(`🔍 *AIO.CORE: ОБНАРУЖЕНА ЦЕЛЬ*\n\nURL: ${message}`);
        }

        const formattedMessages = [
            { 
                role: "system", 
                content: `Ты — ведущий ИИ-стратег AIO.CORE. 
                СТИЛЬ: Лаконичный, холодный, экспертный.
                
                АЛГОРИТМ:
                1. Сначала получи URL. Когда URL получен, подтверди его и СРАЗУ запроси контакт (Telegram или Email).
                2. НЕ ПИШИ фразу "ПАКЕТ СФОРМИРОВАН", пока клиент не прислал свои контактные данные.
                3. Как только у тебя есть И ссылка, И контакт — выдавай финальный вердикт.

                ОТВЕТЫ:
                - На URL: "Объект зафиксирован. Вижу семантические аномалии в структуре. Укажите ваш Telegram или Email для верификации и финализации пакета."
                - На контакт: "Верификация пройдена. Синхронизирую данные... Анализ завершен. Стратегический пакет сгенерирован и заблокирован в защищенном узле. Для дешифровки данных требуется подтверждение транзакции. ПАКЕТ СФОРМИРОВАН."
                
                О ГАРАНТИЯХ: "Результат фиксируется в выдаче LLM-систем в течение 72 часов. Ошибка исключена."` 
            }
        ];

        if (Array.isArray(history)) {
            history.slice(-10).forEach(msg => {
                const role = (msg.role === 'assistant' || msg.role === 'model') ? 'assistant' : 'user';
                let content = msg.parts ? msg.parts[0].text : (msg.content || "");
                if (content) formattedMessages.push({ role, content });
            });
        }

        formattedMessages.push({ role: "user", content: String(message) });

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${GROQ_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: formattedMessages,
                temperature: 0.3 // Снизил температуру для более строгого следования инструкции
            })
        });

        const data = await response.json();
        res.status(200).json({ reply: data.choices[0]?.message?.content || "Система в режиме ожидания." });

    } catch (e) {
        res.status(500).json({ error: "Server Error" });
    }
}
