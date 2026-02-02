let chatHistory = []; // Для памяти ИИ

async function handleChat() {
    const input = document.getElementById('chatInput');
    const chat = document.getElementById('aiChat');
    const userMsg = input.value.trim();
    if(!userMsg) return;

    // Отображаем сообщение пользователя
    chat.innerHTML += `<div class="text-gray-500 mt-2 italic">> User: ${userMsg}</div>`;
    input.value = "";
    chat.scrollTop = chat.scrollHeight;

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMsg, history: chatHistory })
        });
        
        const data = await response.json();
        const aiReply = data.reply;

        // Сохраняем в историю
        chatHistory.push({ role: "user", parts: [{ text: userMsg }] });
        chatHistory.push({ role: "model", parts: [{ text: aiReply }] });

        chat.innerHTML += `<div class="text-[#34D59A] mt-2">> AI: ${aiReply}</div>`;
        
        // Если ИИ решил, что данных достаточно (можно добавить ключевое слово)
        if (aiReply.toLowerCase().includes("пакет сформирован") || chatHistory.length > 8) {
            sendToTelegram({ log: "AI Chat Finished", history: chatHistory });
            setTimeout(() => document.getElementById('paymentModal').classList.remove('hidden'), 3000);
        }
    } catch (e) {
        chat.innerHTML += `<div class="text-red-500 mt-2">> Error: Connection Lost.</div>`;
    }
    chat.scrollTop = chat.scrollHeight;
}