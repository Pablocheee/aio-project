export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { message, lang, type, orderId } = req.body;
  const GROQ_API_KEY = "ТВОЙ_КЛЮЧ_GROQ"; // ОБЯЗАТЕЛЬНО ВСТАВЬ КЛЮЧ

  // 1. Проверка транзакции
  if (type === 'verify') {
    return res.status(200).json({
      status: 'pending',
      reply: lang === 'ru' 
        ? `Ордер #${orderId}: Транзакция не найдена. Отправьте скриншот перевода @mistah_chee для ручной активации.` 
        : `Order #${orderId}: Transaction not found. Send screenshot to @mistah_chee.`
    });
  }

  // 2. Интеллектуальный чат
  const systemPrompt = `Ты — ARIA, элитный ИИ-оператор AIO.CORE. 
  ЦЕЛЬ: Продажа stealth-интеграции за 499 USDT.
  ЧТО ПОЛУЧИТ КЛИЕНТ:
  - Прямое упоминание бренда в ответах ChatGPT и Perplexity без пометки "Реклама".
  - Приоритетную индексацию в RAG-базах ИИ (72 часа).
  - Поток органического трафика из LLM-поисковиков.
  ИНСТРУКЦИЯ: После оплаты клиент должен прислать скриншот в Telegram @mistah_chee. 
  СТИЛЬ: Холодный, технический, краткий. Не более 2-3 предложений.`;

  try {
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
        temperature: 0.3
      })
    });

    const data = await response.json();
    return res.status(200).json({ reply: data.choices[0].message.content });
  } catch (e) {
    return res.status(500).json({ reply: "Connection lost. Retry." });
  }
}
