export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    try {
        const { message, history = [], isFinal, clientData } = req.body;
        const GROQ_KEY = process.env.GROQ_API_KEY;
        const TG_TOKEN = process.env.TG_TOKEN;
        const TG_CHAT_ID = process.env.TG_CHAT_ID;

        // Функция для отправки в Telegram
        const sendTg = async (text) => {
            await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: TG_CHAT_ID, text: text, parse_mode: "Markdown" })
            });
        };

        // 1. ЛОГИКА ФИНАЛЬНОЙ ОПЛАТЫ
        if (isFinal && clientData) {
            const orderId = Math.floor(100000 + Math.random() * 900000);
            await sendTg(`💎 *AIO.CORE: ПАКЕТ СФОРМИРОВАН #${orderId}*\n\n🌐 *URL:* ${clientData.url}\n📱 *IDENT:* ${clientData.contact}\n⚙️ *STATUS:* Ожидает дешифровки (оплаты)`);
            return res.status(200).json({ reply: "Finalized", orderId });
        }

        // 2. АВТО-ОТЧЕТ ПРИ ПОЛУЧЕНИИ URL
        if (message.includes('.') && !isFinal) {
             await sendTg(`🔍 *AIO.CORE: ОБНАРУЖЕНА ЦЕЛЬ*\n\nКлиент указал URL: ${message}\n_ИИ начинает первичный анализ..._`);
        }

        // 3. СИСТЕМНАЯ УСТАНОВКА
        const formattedMessages = [
            { 
                role: "system", 
                content: `Ты — ведущий ИИ-стратег AIO.CORE. 
                СТИЛЬ: Технократичный, экспертный.
                ИНСТРУКЦИЯ:
                - Если клиент дал URL: Подтверди получение и скажи, что видишь "семантические аномалии", которые будут устранены в итоговом пакете.
                - Контакты: Только TG/Email.
                - О гарантиях: "Результат фиксируется в выдаче LLM-систем в течение 72 часов. Ошибка исключена."
                ФИНАЛ: Как только данные собраны, пиши строго: "Анализ завершен. ПАКЕТ СФОРМИРОВАН."` 
            }
        ];

        if (Array.isArray(history)) {
            history.slice(-8).forEach(msg => {
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
                temperature: 0.4
            })
        });

        const data = await response.json();
        res.status(200).json({ reply: data.choices[0]?.message?.content || "Система в режиме ожидания." });

    } catch (e) {
        res.status(500).json({ error: "Server Error" });
    }
}
