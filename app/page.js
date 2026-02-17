'use client';
import React, { useState, useEffect } from 'react';

export default function Home() {
  const [currentLang, setCurrentLang] = useState('ru');
  const [chatHistory, setChatHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [liveLogs, setLiveLogs] = useState(['> System initialized...']);

  const translations = {
    ru: { 
      title: 'СЕМАНТИЧЕСКАЯ <span class="text-[#34D59A] drop-shadow-[0_0_15px_rgba(52,213,154,0.5)] italic">ИНДЕКСАЦИЯ</span>', 
      desc: 'Автономный протокол интеграции данных в нейросети.',
      btn: 'RU'
    },
    en: { 
      title: 'SEMANTIC <span class="text-[#34D59A] drop-shadow-[0_0_15px_rgba(52,213,154,0.5)] italic">INDEXING</span>', 
      desc: 'Autonomous protocol for data integration into LLM contexts.',
      btn: 'EN'
    }
  };

  useEffect(() => {
    const logLines = ["Scanning nodes...", "Vectorizing stream...", "RAG sync: 98%", "Latency: 24ms", "Weights adjusted", "Bridge: Ready"];
    const interval = setInterval(() => {
      setLiveLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] > ${logLines[Math.floor(Math.random() * logLines.length)]}`].slice(-3));
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const addMsg = (txt, role = 'assistant') => setChatHistory(prev => [...prev, { role, content: txt }]);

  const processInput = async () => {
    if (!inputValue.trim()) return;
    const userMsg = inputValue;
    addMsg(userMsg, 'user');
    setInputValue('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, history: chatHistory, lang: currentLang })
      });
      const data = await res.json();
      addMsg(data.reply, 'assistant');
    } catch (e) { addMsg("Connection Error."); }
  };

  return (
    // Принудительный черный фон без прозрачности сверху
    <div className="relative min-h-screen bg-[#000000] text-white font-mono selection:bg-emerald-500/30">
      
      {/* ВИДЕО ФОН - Уменьшил прозрачность, чтобы не было "белой пелены" */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <video autoPlay muted loop playsInline poster="/poster.avif" className="w-full h-full object-cover">
          <source src="/hero-av1.mp4" type="video/mp4" />
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        {/* Затемняющий слой */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
          <div className="text-xl font-bold tracking-tighter uppercase">AIO<span className="text-[#34D59A]">.CORE</span></div>
          <button onClick={() => setCurrentLang(l => l === 'ru' ? 'en' : 'ru')} className="text-[10px] border border-emerald-500/30 px-4 py-1 rounded hover:bg-emerald-500/10 transition-all">
            {translations[currentLang].btn}
          </button>
        </header>

        <main className="flex-1 max-w-5xl mx-auto px-6 py-8 w-full">
          <section className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 uppercase tracking-tighter leading-none" dangerouslySetInnerHTML={{ __html: translations[currentLang].title }} />
            <p className="text-emerald-500/60 text-[10px] uppercase tracking-[0.2em] max-w-xl mx-auto">{translations[currentLang].desc}</p>
          </section>

          {/* СТАТУС-БАРЫ (Терминальный стиль) */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-10">
            {['Vector DB', 'RAG Layer', 'Latency', 'Stealth'].map((item, i) => (
              <div key={i} className="border border-emerald-500/20 bg-black/40 p-3 text-left">
                <div className="text-[8px] uppercase text-emerald-500/40 mb-1">{item}</div>
                <div className="text-xs text-[#34D59A]">{i === 2 ? '24ms' : i === 3 ? '100%' : 'STABLE'}</div>
              </div>
            ))}
          </section>

          {/* ЛОГИ */}
          <div className="max-w-2xl mx-auto mb-4 border-l border-emerald-500/30 pl-4">
            <div className="font-mono text-[9px] h-[50px] flex flex-col justify-end opacity-50">
              {liveLogs.map((log, i) => <div key={i} className="text-emerald-500">{log}</div>)}
            </div>
          </div>

          {/* ЧАТ */}
          <section className="max-w-2xl mx-auto relative">
            <div className="bg-black border border-emerald-500/30 p-6 h-[400px] flex flex-col shadow-[0_0_30px_rgba(0,0,0,1)]">
              <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 text-sm">
                {chatHistory.length === 0 && <div className="text-emerald-500/40">{'> TERMINAL_READY: AWAITING_URL_'}</div>}
                {chatHistory.map((msg, i) => (
                  <div key={i} className={msg.role === 'assistant' ? "text-[#34D59A] border-l border-emerald-500/50 pl-4" : "text-white/40 text-right italic"}>
                    {msg.role === 'assistant' ? '[ARIA] > ' : '[USER] > '}{msg.content}
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-emerald-500/10 flex gap-4">
                <span className="text-[#34D59A]"> $ </span>
                <input 
                  type="text" 
                  className="bg-transparent outline-none flex-1 text-[#34D59A] caret-emerald-500"
                  placeholder="enter_data..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && processInput()}
                />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
