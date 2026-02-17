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
    <div className="min-h-screen text-white relative overflow-x-hidden">
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

      {view === 'chat' ? (
        /* ЭКРАН ЧАТА */
        <div className="min-h-screen flex flex-col">
          <header className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-8">
              <div className="text-2xl font-bold tracking-tighter uppercase">AIO<span className="glow-text">.CORE</span></div>
            </div>
            <button onClick={() => setCurrentLang(l => l === 'ru' ? 'en' : 'ru')} className="text-[10px] border border-white/10 px-4 py-2 rounded-full uppercase">
              {translations[currentLang].btn}
            </button>
          </header>

          <main className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
            <section className="text-center mb-12">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 uppercase tracking-tighter" dangerouslySetInnerHTML={{ __html: translations[currentLang].title }} />
              <p className="text-gray-500 text-sm max-w-xl mx-auto font-light">{translations[currentLang].desc}</p>
            </section>

            <section className="w-full max-w-2xl">
              <div className="glass-card p-8 rounded-[3rem] h-[450px] flex flex-col shadow-2xl">
                <div className="flex-1 overflow-y-auto mb-4 pr-2">
                  {chatHistory.length === 0 && (
                    <div className="bot-msg">{'>'} ARIA онлайн. Укажите URL проекта.</div>
                  )}
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
                  <button onClick={processInput} className="text-[#34D59A] text-xl">➤</button>
                </div>
              </div>
            </section>
          </main>
        </div>
      ) : (
        /* ЭКРАН ЛИЧНОГО КАБИНЕТА (ПОЛНОЭКРАННЫЙ) */
        <div className="fixed inset-0 bg-[#020202] z-[200] flex animate-in fade-in duration-500">
          {/* САЙДБАР */}
          <div className="w-64 border-r border-white/5 bg-black/50 backdrop-blur-xl flex flex-col p-6 hidden md:flex">
            <div className="text-xl font-bold tracking-tighter mb-12 italic">AIO<span className="glow-text">.CORE</span></div>
            <nav className="flex-1 space-y-2">
              <div className="text-[9px] uppercase text-gray-600 mb-4 tracking-[0.2em]">Main Menu</div>
              {['Overview', 'Neural Nodes', 'Semantic Map', 'Settings'].map((item, i) => (
                <div key={i} className={`text-[10px] uppercase p-3 rounded-lg border transition-all ${i === 0 ? 'border-[#34D59A]/50 text-[#34D59A] bg-[#34D59A]/5' : 'border-transparent text-gray-500'}`}>
                  {item}
                </div>
              ))}
            </nav>
            <div className="pt-6 border-t border-white/5">
              <div className="text-[9px] uppercase text-orange-500 mb-2 font-bold italic">Billing Required</div>
              <div className="text-[10px] text-gray-500 leading-tight italic">Protocol: Halted</div>
            </div>
          </div>

          {/* КОНТЕНТ */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/20">
              <div className="flex items-center gap-4">
                <span className="status-pulse"></span>
                <span className="text-[9px] uppercase tracking-widest text-gray-400">Node Status: <span className="text-white italic">Standby</span></span>
              </div>
              <div className="text-[9px] uppercase text-gray-500 font-mono italic">UID: {orderId}-ALPHA</div>
            </header>

            <main className="p-8 max-w-5xl w-full mx-auto">
              <div className="flex justify-between items-end mb-12">
                <h2 className="text-4xl font-bold tracking-tighter uppercase italic">Control Panel</h2>
                <div className="text-right">
                  <div className="text-[10px] uppercase text-gray-500 mb-1 font-bold">Balance</div>
                  <div className="text-2xl font-bold text-red-500">0.00 USDT</div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* МОНИТОРИНГ */}
                <div className="md:col-span-2 space-y-6">
                  <div className="glass-card p-8 rounded-[2.5rem]">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-[11px] uppercase font-bold text-gray-400">Neural Indexing Progress</h4>
                      <span className="text-[9px] text-red-500 font-mono animate-pulse uppercase font-bold tracking-widest">Waiting for activation</span>
                    </div>
                    <div className="h-32 border border-dashed border-white/10 rounded-2xl flex items-center justify-center bg-black/20">
                      <span className="text-[10px] text-gray-600 uppercase italic">Connect Wallet to Begin Vectorization</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="glass-card p-6 rounded-2xl border-l-2 border-blue-500/50">
                      <div className="text-[9px] text-gray-500 uppercase mb-2">Sync Speed</div>
                      <div className="text-xl font-bold italic">0 KB/S</div>
                    </div>
                    <div className="glass-card p-6 rounded-2xl border-l-2 border-purple-500/50">
                      <div className="text-[9px] text-gray-500 uppercase mb-2">AI Visibility</div>
                      <div className="text-xl font-bold italic">INACTIVE</div>
                    </div>
                  </div>
                </div>

                {/* БИЛЛИНГ */}
                <div className="glass-card p-8 rounded-[2.5rem] border-[#34D59A]/30">
                  <div className="text-[10px] font-bold text-[#34D59A] uppercase mb-8 tracking-widest text-center">Billing Terminal</div>
                  <div className="space-y-6">
                    <div>
                      <div className="text-[8px] uppercase text-gray-500 mb-1">Payment Amount:</div>
                      <div className="text-3xl font-bold">499 <span className="text-sm opacity-30">USDT</span></div>
                    </div>
                    <div className="bg-black/60 p-4 rounded-xl border border-white/5 cursor-pointer group" onClick={copyWallet}>
                      <div className="text-[7px] text-gray-500 uppercase mb-2">TRC20 Address</div>
                      <code className="text-[9px] text-[#34D59A] break-all block leading-relaxed mb-2 font-mono">UQAVTMHfwYcMn7ttJNXiJVaoA-jjRTeJHc2sjpkAVzc84oSY</code>
                      <div className="text-[8px] text-white/20 text-center uppercase group-hover:text-[#34D59A] transition-colors">Click to copy</div>
                    </div>
                    <button onClick={copyWallet} className="w-full py-4 bg-[#34D59A] text-black font-black rounded-xl text-[10px] uppercase shadow-lg shadow-[#34D59A]/10 transition-all hover:scale-[1.02]">
                      Verify Activation
                    </button>
                    <p className="text-[8px] text-gray-600 text-center uppercase leading-relaxed">System awaits 1 network confirmation</p>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
