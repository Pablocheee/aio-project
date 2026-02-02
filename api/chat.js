export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  try {
    const { message, lang } = JSON.parse(req.body);
    const GROQ_API_KEY = "ТВОЙ_КЛЮЧ_GROQ"; // ЗАМЕНИ НА СВОЙ

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { 
            role: "system", 
            content: `Ты — ARIA, элитный ИИ-оператор AIO.CORE. Отвечай на языке: ${lang}. Твой стиль: крайне краткий, профессиональный, холодный. Мы продаем stealth-индексацию в LLM (GPT, Claude, Perplexity) за 499 USDT. Гарантии: топ-3 в ответах за 72 часа. Проект фокусируется на нишевых зонах без конкуренции.` 
          },
          { role: "user", content: message }
        ],
        temperature: 0.5
      })
    });

    const data = await response.json();
    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ reply: "Connection lost. Retry." });
  }
}
