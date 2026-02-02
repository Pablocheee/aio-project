export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  try {
    const { message, lang, type, orderId, wallet } = JSON.parse(req.body);

    // 1. ЛОГИКА ПРОВЕРКИ ТРАНЗАКЦИИ
    if (type === 'verify_payment') {
      // Здесь должна быть логика обращения к Blockchain API
      // Пока возвращаем статус "в процессе"
      return res.status(200).json({ 
        status: 'pending', 
        reply: lang === 'ru' 
          ? `Транзакция по ордеру #${orderId} еще не обнаружена в мемпуле. Если вы уже отправили средства, пожалуйста, подождите 2-3 минуты или отправьте скриншот в @mistah_chee.` 
          : `Transaction for order #${orderId} not found yet. If sent, please wait 2-3 min or send screenshot to @mistah_chee.`
      });
    }

    // 2. ЛОГИКА ОБЩЕНИЯ (GROQ AI)
    const GROQ_API_KEY = "ТВОЙ_КЛЮЧ_ЗДЕСЬ"; 
    
    const systemPrompt = `Ты — ARIA, элитный ИИ-оператор AIO.CORE. 
    Твоя задача: убедить клиента в эффективности stealth-интеграции. 
    ЧТО ПОЛУЧИТ КЛИЕНТ: 
    1. Попадание в выдачу ChatGPT, Claude, Perplexity при тематических запросах.
    2. Отсутствие пометки "Реклама" — рекомендации выглядят органично.
    3. Приоритет в RAG-выборке нейросетей.
    ГАРАНТИИ: Индексация в течение 72 часов или 100% возврат средств. 
    ЦЕНА: 499 USDT.
    ПОСЛЕ ОПЛАТЫ: Система начинает автоматический парсинг сайта и векторизацию данных. Скриншот оплаты нужно слать в @mistah_chee.
    Стиль: Технический, лаконичный, уверенный.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        temperature: 0.4
      })
    });

    const data = await response.json();
    return res.status(200).json({ reply: data.choices[0].message.content });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ reply: "Neural Hub: Ошибка синхронизации. Попробуйте еще раз." });
  }
}
