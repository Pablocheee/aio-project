export default async function handler(req, res) {
    const { message, history = [] } = req.body;
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "Ты ИИ-сотрудник AIO.CORE. Собери URL и контакт клиента. Если всё есть, скажи: ПАКЕТ СФОРМИРОВАН." },
                ...history.map(h => ({ role: h.role === 'model' ? 'assistant' : 'user', content: h.parts[0].text })),
                { role: "user", content: message }
            ]
        })
    });
    const data = await response.json();
    res.status(200).json({ reply: data.choices[0].message.content });
}
