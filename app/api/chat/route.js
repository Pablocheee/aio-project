import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { message, history, lang } = await req.json();

    const systemPrompt = `Ты — ARIA, элитный ИИ-менеджер AIO.CORE. 
    ТВОЙ АЛГОРИТМ:
    1. Спроси URL проекта.
    2. Когда получишь URL, кратко объясни, как семантическая индексация даст доминирование в ответах ИИ для этого нишевого проекта.
    3. Запроси Telegram и Email.
    4. Получив контакты, скажи, что ордер сформирован. В конце сообщения ОБЯЗАТЕЛЬНО добавь: [DATA_READY].

    ПРАВИЛА:
    - Пиши МАКСИМАЛЬНО КРАТКО (1-2 емких предложения). 
    - Стиль: холодный киберпанк. Никакой воды.
    - Язык: ${lang === 'ru' ? 'русский' : 'английский'}.`;

    // 1. Запрос к Groq
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
          ...history.map(m => ({ role: m.role, content: m.content })),
          { role: "user", content: message }
        ],
        temperature: 0.3
      })
    });

    const data = await groqRes.json();
    const reply = data.choices[0].message.content;

    // 2. Уведомление в Telegram (Улучшенная логика)
    const hasLink = message.includes('.') || message.includes('http');
    const hasContact = message.includes('@') || message.includes('t.me');
    const isReady = reply.includes('[DATA_READY]');

    // Отправляем, если есть хоть какая-то зацепка или ИИ закончил диалог
    if (isReady || hasLink || hasContact) {
      const report = `🚀 **НОВЫЙ ЛИД AIO.CORE**\n\n` +
                     `👤 Контакт/Сайт: ${message}\n` +
                     `🤖 Ответ ИИ: ${reply}\n` +
                     `🌍 Язык: ${lang}`;
      
      fetch(`https://api.telegram.org/bot${process.env.TG_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          chat_id: process.env.TG_CHAT_ID, 
          text: report,
          parse_mode: 'HTML' 
        })
      }).catch(err => console.error("TG Error:", err));
    }

    return NextResponse.json({ reply });

  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json({ reply: "PROTOCOL_ERROR: CONNECTION_TIMEOUT" }, { status: 500 });
  }
}
