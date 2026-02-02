export default async function handler(req, res) {
  // Добавляем заголовки, чтобы избежать ошибок CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const { message, lang, type } = req.body;

    // ЗАМЕНИ НА СВОЙ КЛЮЧ GROQ
    const GROQ_API_KEY = "gsk_xxxx...."; 

    const systemPrompt = `Ты — ARIA, оператор AIO.CORE. 
    Твоя цель: продать услугу семантической индексации за 499 USDT.
    Преимущества: попадание в ChatGPT/Perplexity, 100% stealth.
    После оплаты: скриншот в @mistah_chee. 
    Пиши кратко (1-2 предложения), в стиле киберпанк.`;

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
        temperature: 0.5
      })
    });

    const data = await response.json();
    
    if (data.choices && data.choices[0]) {
      return res.status(200).json({ reply: data.choices[0].message.content });
    } else {
      throw new Error("Invalid response from Groq");
    }

  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ reply: "Ошибка узла связи. Повторите запрос через 10 секунд." });
  }
}
