<!DOCTYPE html>
<html lang="ru" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AIO.CORE — Autonomous LLM Integration</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Space Grotesk', sans-serif; background: #050505; color: #fff; scroll-behavior: smooth; }
        .glow-text { color: #34D59A; text-shadow: 0 0 20px rgba(52, 213, 154, 0.4); }
        .glass-card { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.08); backdrop-filter: blur(12px); }
        .input-premium { background: #000; border: 1px solid rgba(52, 213, 154, 0.2); border-radius: 16px; padding: 1.2rem; width: 100%; outline: none; transition: 0.4s; color: #fff; }
        .input-premium:focus { border-color: #34D59A; box-shadow: 0 0 15px rgba(52, 213, 154, 0.1); }
        .btn-main { background: #34D59A; color: #000; font-weight: 700; transition: 0.4s; }
        .btn-main:hover { transform: scale(1.02); box-shadow: 0 10px 30px rgba(52, 213, 154, 0.3); }
        .lang-hide { display: none; }
        #aiChat::-webkit-scrollbar { width: 4px; }
        #aiChat::-webkit-scrollbar-thumb { background: #34D59A; border-radius: 10px; }
        .btn-back { color: rgba(255,255,255,0.4); font-size: 10px; text-transform: uppercase; margin-top: 20px; transition: 0.3s; }
        .btn-back:hover { color: #34D59A; }
    </style>
</head>
<body>

    <header class="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div class="text-2xl font-bold tracking-tighter">AIO<span class="glow-text">.CORE</span></div>
        <div class="flex gap-4">
            <button onclick="checkStatus()" class="text-[10px] uppercase tracking-widest border border-white/5 px-4 py-2 rounded-full hover:bg-white/10 transition">Status</button>
            <button onclick="toggleLang()" class="text-[10px] uppercase tracking-widest border border-white/10 px-4 py-2 rounded-full hover:bg-white/5 transition">EN/RU</button>
        </div>
    </header>

    <main class="max-w-5xl mx-auto px-6 py-12">
        <section class="max-w-2xl mx-auto mb-20">
            <div class="glass-card p-10 rounded-[3rem] border-[#34D59A]/20">
                <h3 class="text-xl font-bold mb-6 uppercase text-center">Diagnostic Tool</h3>
                <div class="flex gap-4">
                    <input type="text" id="analyzeUrl" placeholder="domain.com" class="input-premium py-3 text-sm">
                    <button id="scanBtn" onclick="runAnalysis()" class="btn-main px-8 rounded-xl text-[10px] uppercase">Scan</button>
                </div>
                <div id="analysisResult" class="hidden mt-8 space-y-4 font-mono text-[11px]">
                    <div class="flex justify-between items-center border-b border-white/5 pb-2">
                        <span class="text-gray-500">Semantic Authority:</span>
                        <span id="semScore" class="text-[#34D59A] font-bold">0%</span>
                    </div>
                    <div id="aiAdvice" class="p-4 bg-black/50 rounded-2xl text-[#34D59A]/80 italic">// Awaiting target...</div>
                </div>
            </div>
        </section>

        <section id="order" class="max-w-2xl mx-auto relative mb-20">
            <div class="glass-card p-10 rounded-[3rem] border-white/10 relative z-10">
                <h2 class="text-2xl font-bold mb-8 text-center uppercase tracking-tighter glow-text">AI Activation</h2>
                <div id="aiChat" class="space-y-4 mb-6 h-[250px] overflow-y-auto p-4 border border-white/5 rounded-2xl bg-black/20 font-mono text-[11px]">
                    <div class="text-[#34D59A]">> System: Система AIO.CORE в режиме готовности. Укажите URL проекта.</div>
                </div>
                <div class="flex gap-2">
                    <input type="text" id="chatInput" placeholder="Введите ответ..." class="input-premium py-3 text-sm" onkeypress="if(event.key==='Enter') handleChat()">
                    <button onclick="handleChat()" class="btn-main px-6 rounded-xl text-[10px]">Send</button>
                </div>
            </div>
        </section>
    </main>

    <div id="paymentModal" class="fixed inset-0 bg-black/98 hidden flex items-center justify-center p-6 z-[100] backdrop-blur-2xl">
        <div class="bg-zinc-900 border border-white/10 p-10 rounded-[3rem] max-w-md w-full text-center">
            <span class="text-[#34D59A] text-[10px] uppercase tracking-widest">Order ID: <span id="displayOrderId">---</span></span>
            <h3 class="text-2xl font-bold my-4 italic">499 USDT TRC20</h3>
            <div class="bg-black p-5 rounded-2xl mb-6 border border-[#34D59A]/20 cursor-pointer" onclick="copyWallet()">
                <code id="wallet" class="text-[10px] text-[#34D59A] break-all">UQAVTMHfwYcMn7ttJNXiJVaoA-jjRTeJHc2sjpkAVzc84oSY</code>
            </div>
            <button onclick="verifyPay(this)" class="w-full py-4 text-[10px] font-bold text-white bg-white/5 rounded-xl uppercase">Verify</button>
            <button onclick="closeModal()" class="btn-back block w-full text-center mt-6">← Вернуться в чат</button>
            <div id="payStatus" class="mt-4 text-[9px] text-gray-600 font-mono uppercase"></div>
        </div>
    </div>

    <script>
let chatHistory = [];

function closeModal() { document.getElementById('paymentModal').classList.add('hidden'); }

async function runAnalysis(externalUrl = null) {
    const urlInput = externalUrl || document.getElementById('analyzeUrl').value;
    if(!urlInput) return;
    document.getElementById('analyzeUrl').value = urlInput;
    
    // Имитация анализа
    document.getElementById('analysisResult').classList.remove('hidden');
    animateValue("semScore", 0, Math.floor(Math.random() * 40 + 10), 1000);
    document.getElementById('aiAdvice').innerText = "> Векторы обнаружены. Анализ структуры завершен.";
}

async function handleChat() {
    const input = document.getElementById('chatInput');
    const chat = document.getElementById('aiChat');
    const userMsg = input.value.trim();
    if(!userMsg) return;

    // Если в сообщении есть точка, запускаем сканер сверху
    if(userMsg.includes('.')) runAnalysis(userMsg);

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
        
        chatHistory.push({ role: "user", content: userMsg });
        chatHistory.push({ role: "assistant", content: data.reply });

        chat.innerHTML += `<div class="text-[#34D59A] mt-2">> AI: ${data.reply}</div>`;
        chat.scrollTop = chat.scrollHeight;

        if (data.reply.includes("ПАКЕТ СФОРМИРОВАН")) {
            setTimeout(() => {
                chat.innerHTML += `<div class="text-white/40 mt-2 italic font-bold">> System: Генерация защищенного узла связи...</div>`;
                chat.scrollTop = chat.scrollHeight;
                setTimeout(async () => {
                    const finalResp = await fetch('/api/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ isFinal: true, clientData: { url: chatHistory[0]?.content, contact: userMsg } })
                    });
                    const finalData = await finalResp.json();
                    document.getElementById('displayOrderId').innerText = finalData.orderId;
                    document.getElementById('paymentModal').classList.remove('hidden');
                }, 4000);
            }, 1500);
        }
    } catch (e) { console.error(e); }
}

function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerText = Math.floor(progress * (end - start) + start) + "%";
        if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
}

function copyWallet() { navigator.clipboard.writeText(document.getElementById('wallet').innerText); alert('Copied'); }
    </script>
</body>
</html>
