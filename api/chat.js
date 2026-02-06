export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { message, history, lang } = req.body;

    const systemPrompt = `Ты — ARIA, элитный ИИ-менеджер AIO.CORE.
    ТВОЙ АЛГОРИТМ:
    1. Спроси URL проекта.
    2. Когда получишь URL, кратко опиши, как семантическая индексация усилит именно этот проект (сделай акцент на доминировании в ответах ИИ).
    3. Запроси Telegram и Email для связи.
    4. Как только получил контакты, скажи, что сформировал ордер и готов к активации протокола. В конце этого сообщения ОБЯЗАТЕЛЬНО добавь: [DATA_READY].

    ПРАВИЛА ОБЩЕНИЯ:
    - Пиши максимально кратко (1-2 емких предложения). 
    - Стиль: холодный киберпанк, технологическое превосходство.
    - Отвечай на вопросы о гарантиях (результат в выдаче ИИ) и выгодах (органика без рекламы), но не расписывай обзацы.
    - Язык: ${lang === 'ru' ? 'русский' : 'английский'}.`;

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
        temperature: 0.4
      })
    });

    const data = await groqRes.json();
    const reply = data.choices[0].message.content;

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
    return res.status(500).json({ reply: "Connection timeout." });
  }
}
