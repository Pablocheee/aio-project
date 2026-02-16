'use client';
import React, { useState, useEffect } from 'react';

export default function Home() {
  const [currentLang, setCurrentLang] = useState('ru');
  const [chatHistory, setChatHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');

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
        // Сохраняем первый URL (обычно первое сообщение юзера)
        const projectUrl = chatHistory.length > 0 ? chatHistory[0].content : userMsg;
        localStorage.setItem('aio_project_url', projectUrl);
        
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2500);
      }
    } catch (e) {
      addMsg("Connection Error.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-emerald-500/30">
      {/* Стили вынесены в глобальный JSX, чтобы не ломать Next.js */}
      <style jsx global>{`
        .glow-text { color: #34D59A; text-shadow: 0 0 15px rgba(52, 213, 154, 0.5); }
        .glass-card { background: rgba(10, 10, 10, 0.6); border: 1px solid rgba(52, 213, 154, 0.15); backdrop-filter: blur(20px); }
        .status-pulse { width: 8px; height: 8px; background: #34D59A; border-radius: 50%; display: inline-block; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(52, 213, 154, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(52, 213, 154, 0); } 100% { box-shadow: 0 0 0 0 rgba(52, 213, 154, 0); } }
      `}</style>

      <header className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-2xl font-bold tracking-tighter uppercase">AIO<span className="glow-text">.CORE</span></div>
        <button onClick={() => setCurrentLang(l => l === 'ru' ? 'en' : 'ru')} className="text-[10px] border border-white/10 px-4 py-2 rounded-full uppercase">
          {translations[currentLang].btn}
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <section className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 uppercase tracking-tighter" dangerouslySetInnerHTML={{ __html: translations[currentLang].title }} />
          <p className="text-gray-500 text-sm max-w-xl mx-auto">{translations[currentLang].desc}</p>
        </section>

        <section className="max-w-2xl mx-auto">
          <div className="glass-card p-8 rounded-[3rem] h-[450px] flex flex-col shadow-2xl">
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {chatHistory.map((msg, i) => (
                <div key={i} className={msg.role === 'assistant' ? "text-[#34D59A] font-mono text-sm border-left-2 border-[#34D59A] pl-2" : "text-white opacity-60 text-right text-sm pr-2"}>
                  {msg.role === 'assistant' ? '> ' : ''}{msg.content.replace('[DATA_READY]', '')}
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-white/5 flex gap-4">
              <input 
                type="text" 
                className="bg-transparent border-b border-emerald-500/20 outline-none flex-1 text-[#34D59A] font-mono"
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
