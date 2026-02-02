export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { message } = JSON.parse(req.body);
  const GROQ_API_KEY = "ТВОЙ_КЛЮЧ_GROQ_ЗДЕСЬ";

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
          { role: "system", content: "Ты — ARIA, элитный ИИ-оператор проекта AIO.CORE. Твоя задача — отвечать кратко, технически и уверенно. Мы продаем stealth-продвижение в нейросетях за 499 USDT. Гарантии: появление в топ-3 выдачи GPT/Perplexity за 72 часа или возврат 100%. Не пиши лишнего." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices[0].message.content;
    
    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ reply: "Ошибка узла связи. Попробуйте еще раз." });
  }
}
