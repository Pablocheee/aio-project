'use client';
import React, { useState, useEffect } from 'react';

export default function Home() {
  const [currentLang, setCurrentLang] = useState('ru');
  const [chatHistory, setChatHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [liveLogs, setLiveLogs] = useState(['> System initialized...']);

  const translations = {
    ru: { 
      title: 'СЕМАНТИЧЕСКАЯ <span class="glow-text italic">ИНДЕКСАЦИЯ</span>', 
      desc: 'Автономный протокол интеграции данных в нейросети.',
      place: 'Введите сообщение...',
      btn: 'RU'
    },
    en: { 
      title: 'SEMANTIC <span class="glow-text italic">INDEXING</span>', 
      desc: 'Autonomous protocol for data integration into LLM contexts.',
      place: 'Type a message...',
      btn: 'EN'
    }
  };

  useEffect(() => {
    const logLines = ["Scanning neural nodes...", "Vectorizing input stream...", "RAG layer synchronization: 98%", "Latency check: 24ms", "Semantic weights adjusted", "Encrypted TRC20 bridge: Ready"];
    const interval = setInterval(() => {
      setLiveLogs(prev => {
        const next = [...prev, `[${new Date().toLocaleTimeString()}] > ${logLines[Math.floor(Math.random() * logLines.length)]}`];
        return next.slice(-3);
      });
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const addMsg = (txt, role = 'assistant') => {
    setChatHistory(prev => [...prev, { role, content: txt }]);
  };

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

      if (data.reply.includes('[DATA_READY]')) {
        const projectUrl = chatHistory.length > 0 ? chatHistory[0].content : userMsg;
        localStorage.setItem('aio_project_url', projectUrl);
        setTimeout(() => { window.location.href = '/dashboard'; }, 2500);
      }
    } catch (e) {
      addMsg("Connection Error.");
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-emerald-500/30">
      {/* ВИДЕО ФОН (из твоих файлов) */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
<video 
  autoPlay 
  muted 
  loop 
  playsInline 
  poster="/poster.avif" // Проверь, чтобы в public был именно poster.avif, а не poster_002.avif
  className="w-full h-full object-cover"
>
  <source src="/hero-av1.mp4" type="video/mp4" />
  <source src="/hero.mp4" type="video/mp4" />
</video>
        {/* Градиент поверх видео для читаемости */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
      </div>

      <style jsx global>{`
        .glow-text { color: #34D59A; text-shadow: 0 0 15px rgba(52, 213, 154, 0.5); }
        .glass-card { background: rgba(10, 10, 10, 0.7); border: 1px solid rgba(52, 213, 154, 0.15); backdrop-filter: blur(25px); }
        .status-pulse { width: 8px; height: 8px; background: #34D59A; border-radius: 50%; display: inline-block; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(52, 213, 154, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(52, 213, 154, 0); } 100% { box-shadow: 0 0 0 0 rgba(52, 213, 154, 0); } }
        
        /* Декоративные паттерны из твоих картинок */
        .bg-pattern-left { background-image: url('/left-pattern.png'); background-size: contain; background-repeat: no-repeat; }
        .bg-pattern-right { background-image: url('/right-pattern.png'); background-size: contain; background-repeat: no-repeat; }
      `}</style>

      {/* Контент поверх видео */}
      <div className="relative z-10">
        <header className="p-6 flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-8">
            <div className="text-2xl font-bold tracking-tighter uppercase">AIO<span className="glow-text">.CORE</span></div>
            <div className="hidden md:flex gap-6 text-[10px] uppercase tracking-widest text-gray-500">
              <div className="flex items-center"><span className="status-pulse mr-2"></span> System: Online</div>
            </div>
          </div>
          <button onClick={() => setCurrentLang(l => l === 'ru' ? 'en' : 'ru')} className="text-[10px] border border-white/10 px-4 py-2 rounded-full uppercase transition hover:bg-white/5 backdrop-blur-md">
            {translations[currentLang].btn}
          </button>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-12">
          <section className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 uppercase tracking-tighter" dangerouslySetInnerHTML={{ __html: translations[currentLang].title }} />
            <p className="text-gray-500 text-sm max-w-xl mx-auto font-light">{translations[currentLang].desc}</p>
          </section>

          <section className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 px-4">
            {['Vector DB', 'RAG Layer', 'Latency', 'Stealth'].map((item, i) => (
              <div key={i} className="glass-card p-4 rounded-2xl text-center">
                <div className="text-[9px] uppercase text-gray-500 mb-1">{item}</div>
                <div className="text-xs font-mono text-[#34D59A]">{i === 2 ? '24ms' : i === 3 ? '100%' : 'READY'}</div>
              </div>
            ))}
          </section>

          <div className="max-w-2xl mx-auto mb-6 px-4">
            <div className="glass-card rounded-2xl p-4 font-mono text-[10px] text-gray-500 h-[80px] relative overflow-hidden">
              <div className="space-y-1 flex flex-col justify-end h-full">
                {liveLogs.map((log, i) => <div key={i} className="text-[#34D59A]/60">{log}</div>)}
              </div>
            </div>
          </div>

          <section className="max-w-2xl mx-auto mb-20 relative">
            {/* Паттерны по бокам чата */}
            <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-16 h-64 bg-pattern-left opacity-20 hidden lg:block" />
            <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-16 h-64 bg-pattern-right opacity-20 hidden lg:block" />

            <div className="glass-card p-8 rounded-[3rem] h-[450px] flex flex-col shadow-2xl relative z-20">
              <div className="flex-1 overflow-y-auto mb-4 pr-2 space-y-4">
                {chatHistory.length === 0 && <div className="text-[#34D59A] font-mono text-sm">{currentLang === 'ru' ? '> ARIA онлайн. Укажите URL проекта.' : '> ARIA online. Specify project URL.'}</div>}
                {chatHistory.map((msg, i) => (
                  <div key={i} className={msg.role === 'assistant' ? "text-[#34D59A] font-mono text-sm border-l-2 border-[#34D59A] pl-3" : "text-white opacity-60 text-right text-sm pr-3"}>
                    {msg.role === 'assistant' ? '> ' : ''}{msg.content.replace('[DATA_READY]', '')}
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-white/5 flex items-center gap-4 w-full">
                <input 
                  type="text" 
                  className="bg-transparent border-b border-emerald-500/20 outline-none flex-1 text-[#34D59A] font-mono py-2"
                  placeholder=">>>"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && processInput()}
                />
                <button onClick={processInput} className="text-[#34D59A] text-xl transition hover:scale-110">➤</button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
