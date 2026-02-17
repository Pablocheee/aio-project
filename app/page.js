'use client';
import React, { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [currentLang, setCurrentLang] = useState('ru');
  const [chatHistory, setChatHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [liveLogs, setLiveLogs] = useState(['> SYSTEM_READY', '> ENCRYPTED_LINK_ESTABLISHED']);
  const chatEndRef = useRef(null);

  const translations = {
    ru: { 
      title: 'СЕМАНТИЧЕСКАЯ <span class="text-[#34D59A] [text-shadow:0_0_12px_rgba(52,213,154,0.6)]">ИНДЕКСАЦИЯ</span>', 
      desc: 'ПРОТОКОЛ АВТОНОМНОГО КАРТИРОВАНИЯ ДАННЫХ',
      btn: 'LANG: RU',
      input: 'команда...'
    },
    en: { 
      title: 'SEMANTIC <span class="text-[#34D59A] [text-shadow:0_0_12px_rgba(52,213,154,0.6)]">INDEXING</span>', 
      desc: 'AUTONOMOUS DATA MAPPING PROTOCOL',
      btn: 'LANG: EN',
      input: 'command...'
    }
  };

  useEffect(() => {
    const lines = ["MEM_ALLOC_OK", "NODE_01: ACTIVE", "VECTOR_SYNC_COMPLETE", "TRC20_BRIDGE_OPEN", "RAG_CORE: 24ms"];
    const interval = setInterval(() => {
      setLiveLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${lines[Math.floor(Math.random() * lines.length)]}`].slice(-6));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatHistory]);

  const processInput = async () => {
    if (!inputValue.trim()) return;
    const msg = inputValue;
    setChatHistory(prev => [...prev, { role: 'user', content: msg }]);
    setInputValue('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history: chatHistory, lang: currentLang })
      });
      const data = await res.json();
      setChatHistory(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (e) {
      setChatHistory(prev => [...prev, { role: 'assistant', content: "ERROR: LINK_LOST" }]);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-[#34D59A] font-mono selection:bg-[#34D59A] selection:text-black overflow-hidden relative">
      
      {/* 1. ГЛОБАЛЬНЫЕ СТИЛИ */}
      <style jsx global>{`
        body { background: #000; margin: 0; }
        .crt-overlay {
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
          background-size: 100% 3px, 3px 100%;
          pointer-events: none;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #34D59A; border-radius: 2px; }
      `}</style>

      {/* 2. ВИЗУАЛЬНЫЕ ЭФФЕКТЫ */}
      <div className="fixed inset-0 z-0 opacity-20 grayscale pointer-events-none">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover">
          <source src="/hero-av1.mp4" type="video/mp4" />
          <source src="/hero.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="fixed inset-0 crt-overlay z-50 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-t from-black via-transparent to-black z-10 pointer-events-none" />

      {/* 3. КОНТЕНТ */}
      <div className="relative z-20 max-w-6xl mx-auto min-h-screen flex flex-col p-6 md:p-12">
        
        {/* Header */}
        <header className="flex justify-between items-start mb-20 border-l-4 border-[#34D59A] pl-4">
          <div>
            <div className="text-2xl font-black tracking-[0.2em]">CORE.AIO_</div>
            <div className="text-[10px] opacity-50 uppercase tracking-widest mt-1">Status: Operational</div>
          </div>
          <button 
            onClick={() => setCurrentLang(l => l === 'ru' ? 'en' : 'ru')}
            className="text-[10px] border border-[#34D59A] px-4 py-2 hover:bg-[#34D59A] hover:text-black transition-all font-bold"
          >
            {translations[currentLang].btn}
          </button>
        </header>

        <main className="flex-1 flex flex-col items-center">
          
          {/* Main Title */}
          <div className="mb-16 text-center">
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-4 uppercase" 
                dangerouslySetInnerHTML={{ __html: translations[currentLang].title }} />
            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#34D59A] to-transparent mb-4 opacity-30" />
            <p className="text-[10px] md:text-xs tracking-[0.4em] opacity-40 font-light uppercase">
              {translations[currentLang].desc}
            </p>
          </div>

          {/* Data Grid */}
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {['UPTIME: 100%', 'NODES: 14', 'SEC_LEVEL: A', 'PING: 12ms'].map((text, i) => (
              <div key={i} className="border border-[#34D59A]/20 bg-black/40 p-3 text-[10px] text-center hover:border-[#34D59A]/50 transition-colors">
                {text}
              </div>
            ))}
          </div>

          {/* Terminal Console */}
          <div className="w-full max-w-3xl border border-[#34D59A]/30 bg-black/80 backdrop-blur-sm p-2 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            {/* Window Bar */}
            <div className="flex justify-between items-center px-4 py-2 border-b border-[#34D59A]/10 mb-4">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-[#34D59A]/20 rounded-full" />
                <div className="w-2 h-2 bg-[#34D59A]/20 rounded-full" />
              </div>
              <div className="text-[9px] opacity-30 tracking-[0.3em]">COMMAND_CENTER_V2</div>
            </div>

            {/* Logs & Chat */}
            <div className="h-[400px] overflow-y-auto px-4 custom-scrollbar flex flex-col">
              <div className="text-[10px] opacity-30 mb-6 space-y-1">
                {liveLogs.map((log, i) => <div key={i}>{log}</div>)}
              </div>

              <div className="flex-1 space-y-6">
                {chatHistory.length === 0 && (
                  <div className="text-xs opacity-20 italic">Awaiting secure protocol...</div>
                )}
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <span className="text-[8px] opacity-40 mb-1 uppercase tracking-widest">
                      {msg.role === 'user' ? 'USR_771' : 'CORE_AI'}
                    </span>
                    <div className={`max-w-[85%] p-3 text-sm leading-relaxed ${
                      msg.role === 'user' ? 'bg-[#34D59A]/10 border-r-2 border-[#34D59A] text-right' : 'border-l-2 border-[#34D59A]'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            </div>

            {/* Input Line */}
            <div className="mt-4 p-4 border-t border-[#34D59A]/10 flex items-center gap-4">
              <span className="text-[#34D59A] animate-pulse font-bold text-lg">{'>'}</span>
              <input 
                type="text" 
                className="bg-transparent outline-none flex-1 text-[#34D59A] placeholder-[#34D59A]/20 text-sm tracking-widest"
                placeholder={translations[currentLang].input}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && processInput()}
              />
              <button onClick={processInput} className="opacity-40 hover:opacity-100 transition-opacity">
                ↵
              </button>
            </div>
          </div>

        </main>

        <footer className="mt-12 text-[8px] text-center opacity-20 tracking-[0.5em] uppercase">
          Autonomous Semantic Engine v4.0.2 // 2026 Core Protocol
        </footer>

      </div>
    </div>
  );
}
