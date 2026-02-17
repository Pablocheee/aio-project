'use client';
import React, { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [view, setView] = useState('chat'); // 'chat' или 'dashboard'
  const [currentLang, setCurrentLang] = useState('ru');
  const [chatHistory, setChatHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [liveLogs, setLiveLogs] = useState([{ time: new Date().toLocaleTimeString(), text: "System initialized..." }]);
  const chatEndRef = useRef(null);

  const translations = {
    ru: { 
      title: 'СЕМАНТИЧЕСКАЯ <span class="glow-text italic">ИНДЕКСАЦИЯ</span>', 
      desc: 'Автономный протокол интеграции данных в нейросети.', 
      cabinet: 'ЛИЧНЫЙ КАБИНЕТ',
      status: 'СТАТУС: ОЖИДАНИЕ ОПЛАТЫ',
      btn: 'RU', place: 'Введите сообщение...'
    },
    en: { 
      title: 'SEMANTIC <span class="glow-text italic">INDEXING</span>', 
      desc: 'Autonomous data integration protocol.', 
      cabinet: 'PERSONAL CABINET',
      status: 'STATUS: AWAITING PAYMENT',
      btn: 'EN', place: 'Type a message...'
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const logLines = ["Scanning neural nodes...", "Vectorizing stream...", "RAG layer: 98%", "24ms latency"];
      setLiveLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), text: logLines[Math.floor(Math.random() * logLines.length)] }].slice(-3));
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatHistory]);

  const processInput = async () => {
    if (!inputValue.trim()) return;
    const userMsg = inputValue;
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setInputValue('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, history: chatHistory, lang: currentLang })
      });
      const data = await res.json();
      setChatHistory(prev => [...prev, { role: 'assistant', content: data.reply.replace('[DATA_READY]', '') }]);

      if (data.reply.includes('[DATA_READY]')) {
        setTimeout(() => setView('dashboard'), 1000); // Мгновенный переход в кабинет
      }
    } catch (e) {
      setChatHistory(prev => [...prev, { role: 'assistant', content: "Link Error." }]);
    }
  };

  if (view === 'dashboard') {
    return (
      <div className="min-h-screen text-white p-6 md:p-12 flex flex-col items-center">
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;700&display=swap');
          body { font-family: 'Space Grotesk', sans-serif; background: #050505 !important; }
          .glow-text { color: #34D59A; text-shadow: 0 0 15px rgba(52, 213, 154, 0.5); }
          .glass-card { background: rgba(10, 10, 10, 0.6); border: 1px solid rgba(52, 213, 154, 0.15); backdrop-filter: blur(20px); }
        `}</style>

        <header className="w-full max-w-7xl flex justify-between mb-20">
          <div className="text-2xl font-bold tracking-tighter">AIO<span className="glow-text">.CORE</span></div>
          <div className="text-[10px] tracking-[0.4em] text-[#34D59A] border border-[#34D59A]/30 px-4 py-2 rounded-full">
            {translations[currentLang].status}
          </div>
        </header>

        <main className="w-full max-w-4xl">
          <h2 className="text-4xl font-bold mb-12 tracking-tighter">{translations[currentLang].cabinet}</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-8 rounded-[2rem]">
              <div className="text-[10px] uppercase text-gray-500 mb-6">Проект в очереди</div>
              <div className="text-xl font-bold mb-2 tracking-tight">INDEX_REQUEST_#77102</div>
              <div className="text-[#34D59A] text-sm font-mono uppercase mb-8">Ожидает активации узла</div>
              
              <div className="space-y-4 border-t border-white/5 pt-6">
                <div className="flex justify-between text-xs text-gray-500 italic">
                  <span>Тариф:</span><span className="text-white">Full Semantic Index</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 italic">
                  <span>Цена:</span><span className="text-white">499 USDT</span>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 rounded-[2rem] border-[#34D59A]/40 shadow-[0_0_40px_rgba(52,213,154,0.05)]">
              <div className="text-[10px] uppercase text-[#34D59A] mb-6">Реквизиты для оплаты</div>
              <div className="bg-black p-4 rounded-xl border border-[#34D59A]/20 mb-6 cursor-pointer" onClick={() => {navigator.clipboard.writeText('UQAVTMHfwYcMn7ttJNXiJVaoA-jjRTeJHc2sjpkAVzc84oSY'); alert('Copied');}}>
                <code className="text-[9px] text-[#34D59A] break-all">UQAVTMHfwYcMn7ttJNXiJVaoA-jjRTeJHc2sjpkAVzc84oSY</code>
              </div>
              <button className="w-full py-4 bg-[#34D59A] text-black font-bold rounded-xl text-[10px] uppercase shadow-[0_0_20px_rgba(52,213,154,0.3)]">
                Подтвердить транзакцию
              </button>
              <p className="text-[9px] text-gray-500 mt-4 text-center uppercase">После оплаты доступ откроется автоматически</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // СТАНДАРТНЫЙ ВИД ЧАТА (твой оригинальный код)
  return (
    <div className="min-h-screen text-white relative">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;700&display=swap');
        body { font-family: 'Space Grotesk', sans-serif; background: #050505 !important; background-image: radial-gradient(circle at 2px 2px, rgba(52, 213, 154, 0.05) 1px, transparent 0); background-size: 40px 40px; }
        .glow-text { color: #34D59A; text-shadow: 0 0 15px rgba(52, 213, 154, 0.5); }
        .glass-card { background: rgba(10, 10, 10, 0.6); border: 1px solid rgba(52, 213, 154, 0.15); backdrop-filter: blur(20px); }
        .bot-msg { color: #34D59A; font-family: monospace; font-size: 13px; margin-bottom: 12px; border-left: 2px solid #34D59A; padding-left: 10px; }
        .user-msg { color: #fff; font-family: monospace; font-size: 13px; opacity: 0.6; margin-bottom: 12px; text-align: right; border-right: 2px solid rgba(255,255,255,0.2); padding-right: 10px; }
      `}</style>

      <header className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-2xl font-bold tracking-tighter uppercase">AIO<span className="glow-text">.CORE</span></div>
        <button onClick={() => setCurrentLang(l => l === 'ru' ? 'en' : 'ru')} className="text-[10px] border border-white/10 px-4 py-2 rounded-full uppercase tracking-widest">{translations[currentLang].btn}</button>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <section className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 uppercase tracking-tighter" dangerouslySetInnerHTML={{ __html: translations[currentLang].title }} />
          <p className="text-gray-500 text-sm max-w-xl mx-auto font-light">{translations[currentLang].desc}</p>
        </section>

        <section className="max-w-2xl mx-auto mb-20">
          <div className="glass-card p-8 rounded-[3rem] h-[450px] flex flex-col">
            <div className="flex-1 overflow-y-auto mb-4 pr-2">
              {chatHistory.length === 0 && <div className="bot-msg">{'>'} ARIA online.</div>}
              {chatHistory.map((msg, i) => (
                <div key={i} className={msg.role === 'assistant' ? 'bot-msg' : 'user-msg'}>
                  {msg.role === 'assistant' ? '> ' : ''}{msg.content}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="pt-4 border-t border-white/5 flex items-center gap-4">
              <input 
                className="bg-transparent border-none border-b border-[#34D59A]/20 outline-none text-[#34D59A] flex-1 font-mono text-sm py-2"
                placeholder={translations[currentLang].place}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && processInput()}
              />
              <button onClick={processInput} className="text-[#34D59A]">➤</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
