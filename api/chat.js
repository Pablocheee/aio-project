export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { message, history, isFinal, clientData } = req.body;

    // Сценарий 1: Финальная стадия (генерация Order ID и логирование)
    if (isFinal) {
        const orderId = Math.floor(100000 + Math.random() * 900000);
        
        // Здесь можно добавить отправку данных в Telegram бота или БД
        console.log(`NEW ORDER #${orderId}:`, clientData);

        return res.status(200).json({ 
            success: true, 
            orderId: orderId.toString() 
        });
    }

    // Сценарий 2: Обычный диалог с ИИ
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "gpt-4-turbo-preview",
                messages: [
                    {
                        role: "system",
                        content: `Ты — ИИ-интерфейс системы AIO.CORE. Твоя задача — собрать данные клиента для семантической индексации.
                        
                        ПРАВИЛА:
                        1. Если в истории нет сообщений, ожидай URL. Если прислали не URL, а просто текст — вежливо потребуй адрес проекта.
                        2. После получения URL, объясни кратко (1 предложение), что ты анализируешь векторную совместимость, и попроси контакт для связи (TG или Email).
                        3. Как только клиент прислал контакт, ты ОБЯЗАН ответить строго по шаблону:
                           "АНАЛИЗ ЗАВЕРШЕН. ПАКЕТ СФОРМИРОВАН #[случайное число]. Укажите этот ID при оплате."
                        
                        СТИЛЬ: Техно-футуризм, лаконичность, использование терминов (векторы, LSI, нейронные узлы).`
                    },
                    ...history,
                    { role: "user", content: message }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        const reply = data.choices[0].message.content;

        return res.status(200).json({ reply });

    } catch (error) {
        console.error("OpenAI Error:", error);
        return res.status(500).json({ reply: "Ошибка узла связи. Повторите запрос." });
    }
}
