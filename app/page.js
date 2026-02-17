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
      place: '>>>',
      btn: 'RU'
    },
    en: { 
      title: 'SEMANTIC <span class="text-[#34D59A] drop-shadow-[0_0_15px_rgba(52,213,154,0.5)] italic">INDEXING</span>', 
      desc: 'Autonomous protocol for data integration into LLM contexts.',
      place: '>>>',
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
    <div className="relative min-h-screen bg-[#050505] text-white font-sans overflow-hidden selection:bg-emerald-500/30">
      
      {/* 1. ВИДЕО ФОН */}
      <div className="fixed inset-0 z-0 opacity-40">
        <video autoPlay muted loop playsInline poster="/poster.avif" className="w-full h-full object-cover">
          <source src="/hero-av1.mp4" type="video/mp4" />
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
      </div>

      <div className="relative z-10">
        {/* 2. HEADER */}
        <header className="p-6 flex justify-between items-center max-w-7xl mx-auto">
          <div className="text-2xl font-bold tracking-tighter uppercase">AIO<span className="text-[#34D59A] drop-shadow-[0_0_10px_rgba(52,213,154,0.5)]">.CORE</span></div>
          <button onClick={() => setCurrentLang(l => l === 'ru' ? 'en' : 'ru')} className="text-[10px] border border-white/10 px-4 py-2 rounded-full hover:bg-white/5 backdrop-blur-md transition-all">
            {translations[currentLang].btn}
          </button>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-12">
          {/* 3. TITLE */}
          <section className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 uppercase tracking-tighter" dangerouslySetInnerHTML={{ __html: translations[currentLang].title }} />
            <p className="text-gray-500 text-sm max-w-xl mx-auto font-light tracking-wide">{translations[currentLang].desc}</p>
          </section>

          {/* 4. СТАТУС-БАРЫ (Грид) */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {['Vector DB', 'RAG Layer', 'Latency', 'Stealth'].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 backdrop-blur-xl p-4 rounded-2xl text-center">
                <div className="text-[9px] uppercase text-gray-500 mb-1">{item}</div>
                <div className="text-xs font-mono text-[#34D59A]">{i === 2 ? '24ms' : i === 3 ? '100%' : 'READY'}</div>
              </div>
            ))}
          </section>

          {/* 5. ЛОГИ */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-black/40 border border-white/5 rounded-2xl p-4 font-mono text-[10px] h-[80px] flex flex-col justify-end">
              {liveLogs.map((log, i) => <div key={i} className="text-[#34D59A]/60">{log}</div>)}
            </div>
          </div>

          {/* 6. ЧАТ */}
          <section className="max-w-2xl mx-auto relative group">
            {/* Декоративные паттерны по бокам (если файлы есть в public) */}
            <div className="absolute -left-24 top-1/2 -translate-y-1/2 w-20 h-80 opacity-20 hidden lg:block bg-[url('/left-pattern-lg.png')] bg-contain bg-no-repeat" />
            <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-20 h-80 opacity-20 hidden lg:block bg-[url('/right-pattern-lg.png')] bg-contain bg-no-repeat" />

            <div className="bg-[#0A0A0A]/80 border border-emerald-500/20 backdrop-blur-3xl p-8 rounded-[2.5rem] h-[450px] flex flex-col shadow-2xl shadow-emerald-500/5">
              <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 custom-scrollbar">
                {chatHistory.length === 0 && <div className="text-[#34D59A] font-mono text-sm animate-pulse">{'> ARIA online. Waiting for protocol...'}</div>}
                {chatHistory.map((msg, i) => (
                  <div key={i} className={msg.role === 'assistant' ? "text-[#34D59A] font-mono text-sm border-l border-[#34D59A]/30 pl-4" : "text-white/50 text-right text-sm"}>
                    {msg.role === 'assistant' ? '> ' : ''}{msg.content}
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-white/5 flex gap-4">
                <input 
                  type="text" 
                  className="bg-transparent border-b border-emerald-500/20 outline-none flex-1 text-[#34D59A] font-mono py-2 focus:border-emerald-500/50 transition-colors"
                  placeholder=">>>"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && processInput()}
                />
                <button onClick={processInput} className="text-[#34D59A] hover:scale-110 transition-transform text-xl">➤</button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
