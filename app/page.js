'use client';
import React, { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [view, setView] = useState('chat'); // 'chat' или 'dashboard'
  const [currentLang, setCurrentLang] = useState('ru');
  const [chatHistory, setChatHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [liveLogs, setLiveLogs] = useState([{ time: new Date().toLocaleTimeString(), text: "System initialized..." }]);
  const [orderId, setOrderId] = useState('');
  const chatEndRef = useRef(null);

  const translations = {
    ru: { 
      title: 'СЕМАНТИЧЕСКАЯ <span class="glow-text italic">ИНДЕКСАЦИЯ</span>', 
      desc: 'Автономный протокол интеграции данных в нейросети.', 
      place: 'Введите сообщение...',
      btn: 'RU',
      cabinetTitle: 'ЛИЧНЫЙ КАБИНЕТ',
      status: 'СТАТУС: ОЖИДАНИЕ ОПЛАТЫ',
      copy: 'Копировать адрес'
    },
    en: { 
      title: 'SEMANTIC <span class="glow-text italic">INDEXING</span>', 
      desc: 'Autonomous protocol for data integration into LLM contexts.', 
      place: 'Type a message...',
      btn: 'EN',
      cabinetTitle: 'PERSONAL CABINET',
      status: 'STATUS: AWAITING PAYMENT',
      copy: 'Copy address'
    }
  };

  useEffect(() => {
    const logLines = ["Scanning neural nodes...", "Vectorizing input stream...", "RAG layer synchronization: 98%", "Latency check: 24ms", "Semantic weights adjusted", "LLM context window optimized", "Encrypted TRC20 bridge: Ready"];
    const interval = setInterval(() => {
      setLiveLogs(prev => {
        const newLog = { time: new Date().toLocaleTimeString(), text: logLines[Math.floor(Math.random() * logLines.length)] };
        return [...prev, newLog].slice(-3);
      });
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
        setOrderId(Math.floor(100000 + Math.random() * 900000));
        setTimeout(() => setView('dashboard'), 1500); // Переход вместо модалки
      }
    } catch (e) {
      setChatHistory(prev => [...prev, { role: 'assistant', content: "Link Error." }]);
    }
  };

  const copyWallet = () => {
    navigator.clipboard.writeText('UQAVTMHfwYcMn7ttJNXiJVaoA-jjRTeJHc2sjpkAVzc84oSY');
    alert('Copied');
  };

  return (
    <div className="min-h-screen text-white relative overflow-x-hidden pb-20">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;700&display=swap');
        body { 
          font-family: 'Space Grotesk', sans-serif; 
          background: #050505 !important;
          background-image: radial-gradient(circle at 2px 2px, rgba(52, 213, 154, 0.05) 1px, transparent 0);
          background-size: 40px 40px;
        }
        .glow-text { color: #34D59A; text-shadow: 0 0 15px rgba(52, 213, 154, 0.5); }
        .glass-card { 
          background: rgba(10, 10, 10, 0.6); 
          border: 1px solid rgba(52, 213, 154, 0.15); 
          backdrop-filter: blur(20px); 
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }
        .bot-msg { color: #34D59A; font-family: monospace; font-size: 13px; margin-bottom: 12px; border-left: 2px solid #34D59A; padding-left: 10px; }
        .user-msg { color: #fff; font-family: monospace; font-size: 13px; opacity: 0.6; margin-bottom: 12px; text-align: right; border-right: 2px solid rgba(255,255,255,0.2); padding-right: 10px; }
        .status-pulse { width: 8px; height: 8px; background: #34D59A; border-radius: 50%; display: inline-block; margin-right: 6px; animation: pulse 2s infinite; }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(52, 213, 154, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(52, 213, 154, 0); }
          100% { box-shadow: 0 0 0 0 rgba(52, 213, 154, 0); }
        }
      `}</style>

      {/* HEADER */}
      <header className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
          <div className="text-2xl font-bold tracking-tighter uppercase">AIO<span className="glow-text">.CORE</span></div>
          {view === 'chat' && (
            <div className="hidden md:flex gap-6 text-[10px] uppercase tracking-widest text-gray-500">
              <div className="flex items-center"><span className="status-pulse"></span> System: Online</div>
              <div className="flex items-center gap-2"><span className="w-1 h-1 bg-white/20 rounded-full"></span> Nodes: 12/12</div>
            </div>
          )}
        </div>
        <button onClick={() => setCurrentLang(l => l === 'ru' ? 'en' : 'ru')} className="text-[10px] border border-white/10 px-4 py-2 rounded-full hover:bg-white/5 transition uppercase">
          {translations[currentLang].btn}
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-12">
        {view === 'chat' ? (
          <>
            <section className="text-center mb-16">
              <h1 className="text-5xl md:text-7xl font-bold mb-8 uppercase tracking-tighter" dangerouslySetInnerHTML={{ __html: translations[currentLang].title }} />
              <p className="text-gray-500 text-sm max-w-xl mx-auto font-light tracking-wide">{translations[currentLang].desc}</p>
            </section>

            <section className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {['Vector DB', 'RAG Layer', 'Latency', 'Stealth'].map((item, i) => (
                <div key={i} className="glass-card p-4 rounded-2xl text-center">
                  <div className="text-[9px] uppercase text-gray-500 mb-1">{item}</div>
                  <div className="text-xs font-mono text-[#34D59A] uppercase">{i === 0 ? 'Synced' : i === 1 ? 'Ready' : i === 2 ? '24ms' : '100%'}</div>
                </div>
              ))}
            </section>

            <div className="max-w-2xl mx-auto mb-6 px-4">
              <div className="glass-card rounded-2xl p-4 font-mono text-[10px] text-gray-500 h-[80px] relative overflow-hidden">
                <div className="space-y-1 flex flex-col justify-end h-full">
                  {liveLogs.map((log, i) => (
                    <div key={i}><span className="opacity-30">[{log.time}]</span> {'>'} {log.text}</div>
                  ))}
                </div>
                <div className="absolute top-2 right-4 text-[8px] uppercase tracking-widest text-[#34D59A]/40 font-bold">Neural Engine v3.3</div>
              </div>
            </div>

            <section className="max-w-2xl mx-auto">
              <div className="glass-card p-8 rounded-[3rem] h-[450px] flex flex-col shadow-2xl">
                <div className="flex-1 overflow-y-auto mb-4 pr-2">
                  {chatHistory.length === 0 && (
                    <div className="bot-msg">{'>'} {currentLang === 'ru' ? "ARIA онлайн. Укажите URL вашего проекта." : "ARIA online. Specify your project URL."}</div>
                  )}
                  {chatHistory.map((msg, i) => (
                    <div key={i} className={msg.role === 'assistant' ? 'bot-msg' : 'user-msg'}>
                      {msg.role === 'assistant' ? '> ' : ''}{msg.content}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center gap-4 w-full">
                  <input 
                    className="bg-transparent border-none border-b border-[#34D59A]/20 outline-none text-[#34D59A] flex-1 font-mono text-sm py-2"
                    placeholder={translations[currentLang].place}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && processInput()}
                  />
                  <button onClick={processInput} className="text-[#34D59A] text-xl hover:scale-110 transition-transform">➤</button>
                </div>
              </div>
            </section>
          </>
        ) : (
          /* DASHBOARD VIEW */
          <section className="max-w-4xl mx-auto animate-in fade-in duration-700">
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-4">
                <span className="status-pulse"></span>
                <span className="text-[#34D59A] text-[10px] uppercase tracking-[0.3em] font-bold">{translations[currentLang].status}</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase italic">{translations[currentLang].cabinetTitle}</h2>
            </div>

            <div className="grid md:grid-cols-5 gap-6">
              <div className="md:col-span-3 glass-card p-8 rounded-[2.5rem]">
                <div className="text-[10px] uppercase text-gray-500 mb-8 tracking-widest">Active Order Info</div>
                <div className="space-y-6">
                  <div>
                    <div className="text-[9px] uppercase text-[#34D59A] mb-1">ID Транзакции</div>
                    <div className="text-xl font-mono">#ORD-{orderId}</div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase text-gray-500 mb-1">Выбранный протокол</div>
                    <div className="text-lg italic">Full Semantic Indexing (Priority)</div>
                  </div>
                  <div className="pt-6 border-t border-white/5 flex justify-between items-end">
                    <div>
                      <div className="text-[9px] uppercase text-gray-500">Сумма к оплате</div>
                      <div className="text-3xl font-bold">499 USDT</div>
                    </div>
                    <div className="text-[10px] text-gray-500 italic font-mono text-right leading-tight">
                      Network: TRC20<br/>Fee: Included
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 glass-card p-8 rounded-[2.5rem] border-[#34D59A]/30">
                <div className="text-[10px] uppercase text-[#34D59A] mb-8 tracking-widest text-center">Payment Terminal</div>
                <div className="bg-black/50 p-4 rounded-xl border border-[#34D59A]/10 mb-6 group hover:border-[#34D59A]/40 transition-colors cursor-pointer" onClick={copyWallet}>
                  <div className="text-[8px] uppercase text-gray-500 mb-2 text-center">Wallet Address (TRC20)</div>
                  <code className="text-[10px] text-[#34D59A] break-all block text-center leading-relaxed">UQAVTMHfwYcMn7ttJNXiJVaoA-jjRTeJHc2sjpkAVzc84oSY</code>
                </div>
                <button onClick={copyWallet} className="w-full py-4 bg-[#34D59A] text-black font-bold rounded-xl text-[10px] uppercase shadow-[0_0_25px_rgba(52,213,154,0.2)] hover:scale-[1.02] transition-transform">
                  {translations[currentLang].copy}
                </button>
                <p className="text-[9px] text-gray-500 mt-6 text-center uppercase leading-relaxed opacity-60">
                  Система активирует <br/> индексацию автоматически <br/> после 1 подтверждения сети.
                </p>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
