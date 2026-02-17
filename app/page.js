'use client';
import React, { useState, useEffect } from 'react';

export default function Home() {
  const [currentLang, setCurrentLang] = useState('ru');
  const [chatHistory, setChatHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [liveLogs, setLiveLogs] = useState(['> SYSTEM_BOOT_SEQUENCE_INITIATED...']);

  const translations = {
    ru: { 
      title: 'СЕМАНТИЧЕСКАЯ <span class="text-[#34D59A] drop-shadow-[0_0_8px_rgba(52,213,154,0.8)]">ИНДЕКСАЦИЯ</span>', 
      desc: 'АВТОНОМНЫЙ ПРОТОКОЛ ИНТЕГРАЦИИ ДАННЫХ.',
      btn: '[RU]',
      place: 'Введите команду...'
    },
    en: { 
      title: 'SEMANTIC <span class="text-[#34D59A] drop-shadow-[0_0_8px_rgba(52,213,154,0.8)]">INDEXING</span>', 
      desc: 'AUTONOMOUS DATA INTEGRATION PROTOCOL.',
      btn: '[EN]',
      place: 'Enter command...'
    }
  };

  useEffect(() => {
    const logLines = [
      "SCANNING_NODES...", 
      "VECTORIZING_INPUT_STREAM...", 
      "RAG_LAYER_SYNC: 98%", 
      "LATENCY_CHECK: 24ms", 
      "SEMANTIC_WEIGHTS_CALCULATED", 
      "ENCRYPTED_BRIDGE: ACTIVE"
    ];
    const interval = setInterval(() => {
      setLiveLogs(prev => {
        const newLine = `[${new Date().toLocaleTimeString()}] > ${logLines[Math.floor(Math.random() * logLines.length)]}`;
        return [...prev, newLine].slice(-5);
      });
    }, 2500);
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
    } catch (e) { 
      addMsg("CONNECTION_ERROR: RETRYING...", 'assistant'); 
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#34D59A] font-mono selection:bg-[#34D59A] selection:text-black overflow-x-hidden relative flex flex-col">
      
      {/* СТИЛИ: Принудительный черный фон и скроллбар */}
      <style jsx global>{`
        body, html {
          background-color: #000000 !important;
          margin: 0;
          padding: 0;
          height: 100%;
          color: #34D59A;
        }
        ::selection {
          background: #34D59A;
          color: black;
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #34D59A; }
      `}</style>

      {/* 1. ФОНОВОЕ ВИДЕО */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <video autoPlay muted loop playsInline poster="/poster.avif" className="w-full h-full object-cover opacity-20 grayscale">
          <source src="/hero-av1.mp4" type="video/mp4" />
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        {/* Черная пелена 85% */}
        <div className="absolute inset-0 bg-black/85" />
        {/* Scanlines эффект */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]" />
      </div>

      {/* 2. ОСНОВНОЙ КОНТЕНТ */}
      <div className="relative z-20 flex flex-col flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-12 border-b border-[#34D59A]/30 pb-4">
          <div className="text-xl tracking-widest font-bold">AIO.CORE_</div>
          <button 
            onClick={() => setCurrentLang(l => l === 'ru' ? 'en' : 'ru')} 
            className="text-xs border border-[#34D59A]/40 px-3 py-1 hover:bg-[#34D59A] hover:text-black transition-colors uppercase"
          >
            {translations[currentLang].btn}
          </button>
        </header>

        <main className="flex-1 flex flex-col items-center w-full justify-center">
          
          {/* Title */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter" dangerouslySetInnerHTML={{ __html: translations[currentLang].title }} />
            <p className="text-[#34D59A]/60 text-[10px] md:text-xs tracking-[0.3em] uppercase">{translations[currentLang].desc}</p>
          </div>

          {/* Status Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#34D59A]/20 border border-[#34D59A]/20 w-full max-w-4xl mb-8">
            {['VECTOR_DB', 'RAG_LAYER', 'LATENCY', 'STEALTH_MODE'].map((item, i) => (
              <div key={i} className="bg-black p-3 flex flex-col items-center justify-center h-20">
                <span className="text-[9px] text-[#34D59A]/50 mb-1">{item}</span>
                <span className="text-sm font-bold">{i === 2 ? '24ms' : i === 3 ? '100%' : 'ONLINE'}</span>
              </div>
            ))}
          </div>

          {/* Logs Container */}
          <div className="w-full max-w-2xl mb-2">
             <div className="font-mono text-[10px] text-[#34D59A]/70 h-24 overflow-hidden flex flex-col justify-end border-l-2 border-[#34D59A]/30 pl-3">
              {liveLogs.map((log, i) => <div key={i} className="truncate">{log}</div>)}
            </div>
          </div>

          {/* Chat Terminal Box */}
          <div className="w-full max-w-2xl border border-[#34D59A]/30 bg-black p-4 h-[400px] flex flex-col shadow-[0_0_30px_rgba(0,0,0,1)] relative">
            {/* Декоративные уголки */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#34D59A]"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#34D59A]"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#34D59A]"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#34D59A]"></div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4 scrollbar-thin">
              {chatHistory.length === 0 && (
                <div className="text-[#34D59A]/40 text-sm animate-pulse mt-2">
                  {currentLang === 'ru' ? '> ОЖИДАНИЕ ВВОДА URL...' : '> AWAITING INPUT...'}
                </div>
              )}
              {chatHistory.map((msg, i) => (
                <div key={i} className={`text-sm ${msg.role === 'assistant' ? 'text-[#34D59A]' : 'text-white/70 text-right'}`}>
                  <span className="opacity-50 text-[10px] mr-2 block mb-1">{msg.role === 'assistant' ? '[SYS]' : '[USR]'}</span>
                  {msg.content}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 border-t border-[#34D59A]/20 pt-3">
              <span className="text-[#34D59A] animate-pulse font-bold">{'>'}</span>
              <input 
                type="text" 
                className="bg-transparent outline-none flex-1 text-[#34D59A] placeholder-[#34D59A]/20"
                placeholder={translations[currentLang].place}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && processInput()}
              />
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
