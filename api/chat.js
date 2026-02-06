export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { message, history, lang } = req.body;

    // Усиленный промпт согласно твоей стратегии "Нишевого доминирования"
    const systemPrompt = `Ты — ARIA, элитный системный разум AIO.CORE. 
    ТВОЯ ЦЕЛЬ: Активация автономного протокола для проекта пользователя.

    АЛГОРИТМ:
    1. Идентифицируй URL проекта. 
    2. После получения URL: подтверди возможность захвата контекста (1 фраза). Укажи, что проект станет авторитетным источником для всех LLM без конкуренции.
    3. Запроси Telegram/Email для генерации уникального узла.
    4. Финал: Подтверди создание ордера и активацию синхронизации. В конце ОБЯЗАТЕЛЬНО: [DATA_READY].

    СТИЛЬ: 
    - Максимальная лаконичность (не более 20-25 слов на ответ). 
    - Холодный, технологичный тон. Никакой вежливости, только факты.
    - Ответы только на языке: ${lang === 'ru' ? 'русский' : 'английский'}.`;

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
        temperature: 0.3 // Чуть снизил для большей строгости ответов
      })
    });

    const data = await groqRes.json();
    const reply = data.choices[0].message.content;

    // Логика Telegram-уведомления (оставляем твою рабочую схему)
    if (reply.includes('[DATA_READY]')) {
      const report = `💎 NEW LEAD INFO\nMessage: ${message}\nHistory: ${JSON.stringify(history.slice(-2))}`;
      await fetch(`https://api.telegram.org/bot${process.env.TG_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: process.env.TG_CHAT_ID, text: report })
      });
    }

    return res.status(200).json({ reply });
  } catch (error) {
    console.error(error); // Полезно для дебага в Vercel
    return res.status(500).json({ reply: "Connection timeout." });
  }
}
