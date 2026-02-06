export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { message, history, lang } = req.body;

    const systemPrompt = `Ты — ARIA, элитный агент AIO.CORE. 
    ТВОЯ ЗАДАЧА: в ходе живого, краткого диалога узнать у клиента:
    1. URL его проекта.
    2. 5 ключевых слов.
    3. Его Telegram.
    
    ПРАВИЛА:
    - Пиши ОЧЕНЬ кратко (1-2 предложения). Стиль: холодный киберпанк.
    - Не спрашивай всё сразу. Сначала поздоровайся и спроси URL.
    - Если клиент дал данные, переходи к следующему пункту.
    - Как только ты получил ВСЕ ТРИ пункта (URL, слова, TG), в самом конце сообщения ОБЯЗАТЕЛЬНО добавь тег: [DATA_READY].
    - Если данные собраны, скажи, что слой подготовлен и нужно перейти к оплате.
    - Отвечай на языке: ${lang === 'ru' ? 'русский' : 'английский'}.`;

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          ...history,
          { role: "user", content: message }
        ],
        temperature: 0.5
      })
    });

    const data = await groqRes.json();
    const reply = data.choices[0].message.content;

    // Если ИИ подал сигнал готовности, отправляем тебе данные в TG
    if (reply.includes('[DATA_READY]')) {
      const report = `💎 NEW LEAD (ARIA)\nContext: ${message}\nLanguage: ${lang}`;
      await fetch(`https://api.telegram.org/bot${process.env.TG_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: process.env.TG_CHAT_ID, text: report })
      });
    }

    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({ reply: "Connection Error." });
  }
}
