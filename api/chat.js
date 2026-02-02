export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { message, history = [], isFinal, clientData } = req.body;

        const GROQ_KEY = process.env.GROQ_API_KEY;
        const TG_TOKEN = process.env.TG_TOKEN;
        const TG_CHAT_ID = process.env.TG_CHAT_ID;

        // 1. УВЕДОМЛЕНИЕ В TELEGRAM
        if (isFinal && clientData) {
            const orderId = Math.floor(100000 + Math.random() * 900000);
            const report = `💎 *AIO.CORE: READY FOR UNLOCK #${orderId}*\n\n🌐 *TARGET:* ${clientData.url}\n📱 *IDENT:* ${clientData.contact}\n⚙️ *STATUS:* Encrypted / Awaiting Payment`;

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

        // 2. ЗАПРОС К ИИ
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
                        content: `Ты — ведущий ИИ-стратег AIO.CORE. 
                        ТВОЙ СТИЛЬ: Элитный, технократичный, лаконичный.
                        
                        ИНСТРУКЦИЯ:
                        1. Если клиент здоровается: "Приветствую. Система AIO.CORE в режиме готовности. Укажите целевой URL для анализа."
                        2. Собери URL и контакт. 
                        
                        ФИНАЛЬНЫЙ ТРИГГЕР (КРИТИЧНО):
                        Когда данные собраны, напиши: 
                        "Анализ завершен. Стратегический пакет сгенерирован и заблокирован в защищенном узле. Для дешифровки и выгрузки данных требуется подтверждение транзакции. ПАКЕТ СФОРМИРОВАН."` 
                    },
                    ...history.map(h => ({
                        role: h.role === 'model' ? 'assistant'
