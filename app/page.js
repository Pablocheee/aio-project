'use client';
import React, { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [view, setView] = useState('chat'); 
  const [currentLang, setCurrentLang] = useState('ru');
  const [chatHistory, setChatHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [orderId, setOrderId] = useState('772109');
  
  const [price, setPrice] = useState(100);
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSearchingTx, setIsSearchingTx] = useState(false);

  const [liveLogs, setLiveLogs] = useState([
    { time: new Date().toLocaleTimeString(), text: "System bridge established..." },
    { time: new Date().toLocaleTimeString(), text: "Neural core: Standby" }
  ]);

  const chatEndRef = useRef(null);

  const translations = {
    ru: { 
      title: 'СЕМАНТИЧЕСКАЯ <span class="glow-text italic">ИНДЕКСАЦИЯ</span>', 
      desc: 'Автономный протокол интеграции данных в нейросети.', 
      place: 'Сообщение...',
      login: 'Войти',
      logout: 'Выйти',
      authBtn: 'Установить соединение',
      cabinet: 'КАБИНЕТ',
      payTon: 'Tonkeeper',
      status: 'Статус',
      nodes: 'Узлы'
    },
    en: { 
      title: 'SEMANTIC <span class="glow-text italic">INDEXING</span>', 
      desc: 'Autonomous protocol for data integration.', 
      place: 'Message...',
      login: 'Login',
      logout: 'Logout',
      authBtn: 'Establish Connection',
      cabinet: 'CABINET',
      payTon: 'Tonkeeper',
      status: 'Status',
      nodes: 'Nodes'
    }
  };

  const t = translations[currentLang];

  useEffect(() => {
    const lines = ["Vectorizing node #412...", "RAG Sync: 99.2%", "LLM Context sync...", "Weights adjusted", "Gateway: Ready"];
    const interval = setInterval(() => {
      setLiveLogs(prev => {
        const next = { time: new Date().toLocaleTimeString(), text: lines[Math.floor(Math.random() * lines.length)] };
        return [...prev, next].slice(-3);
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatHistory]);

  const processInput = () => {
    if (!inputValue.trim()) return;
    setChatHistory(prev => [...prev, { role: 'user', content: inputValue }]);
    setInputValue('');
    setTimeout(() => {
      setChatHistory(prev => [...prev, { role: 'assistant', content: "Анализ завершен. Пакет данных сформирован. Перейдите в кабинет. [DATA_READY]" }]);
      setTimeout(() => setView('auth'), 1500);
    }, 1000);
  };

  const handleTonkeeperPay = () => {
    const address = "UQAVTMHfwYcMn7ttJNXiJVaoA-jjRTeJHc2sjpkAVzc84oSY";
    const amountInNanotons = (price * 1000000000).toString();
    const link = `ton://transfer/${address}?amount=${amountInNanotons}&text=Index-${orderId}`;
    window.location.assign(link);
    setIsSearchingTx(true);
  };

  return (
    <div className="min-h-screen text-white bg-[#050505] selection:bg-[#34D59A] selection:text-black overflow-x-hidden">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&display=swap');
        body { font-family: 'Space Grotesk', sans-serif; background: #050505; }
        .glow-text { color: #34D59A; text-shadow: 0 0 15px rgba(52, 213, 154, 0.4); }
        .glass-card { background: rgba(15, 15, 15, 0.8); border: 1px solid rgba(52, 213, 154, 0.1); backdrop-filter: blur(10px); }
        .bot-msg { color: #34D59A; font-family: monospace; font-size: 12px; margin-bottom: 12px; border-left: 2px solid #34D59A; padding-left: 10px; }
        .user-msg { color: #fff; font-family: monospace; font-size: 12px; opacity: 0.5; margin-bottom: 12px; text-align: right; border-right: 2px solid rgba(255,255,255,0.1); padding-right: 10px; }
        input[type='range'] { -webkit-appearance: none; background: rgba(255,255,255,0.1); border-radius: 10px; height: 6px; width: 100%; }
        input[type='range']::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; background: #34D59A; border-radius: 50%; cursor: pointer; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>

      {/* HEADER */}
      <header className="fixed top-0 w-full z-[1000] px-4 py-4 md:p-6 flex justify-between items-center bg-black/60 backdrop-blur-xl border-b border-white/5">
        <div className="text-lg md:text-xl font-bold tracking-tighter uppercase cursor-pointer" onClick={() => setView('chat')}>
          AIO<span className="glow-text">.CORE</span>
        </div>
        <div className="flex gap-3 md:gap-6 items-center">
          <button onClick={() => setView(view === 'dashboard' ? 'chat' : 'auth')} className="text-[9px] md:text-[10px] tracking-widest text-gray-400 hover:text-[#34D59A] uppercase font-bold">
            [{view === 'dashboard' ? t.logout : t.login}]
          </button>
          <button onClick={() => setCurrentLang(l => l === 'ru' ? 'en' : 'ru')} className="text-[9px] md:text-[10px] border border-white/10 px-3 py-1 md:px-4 md:py-1.5 rounded-full uppercase font-bold">
            {currentLang === 'ru' ? 'EN' : 'RU'}
          </button>
        </div>
      </header>

      {/* VIEW: CHAT */}
      {view === 'chat' && (
        <main className="pt-24 md:pt-32 pb-10 px-4 flex flex-col items-center min-h-screen">
          <div className="max-w-3xl w-full flex flex-col h-full">
            <div className="text-center mb-8 md:mb-12">
              <h1 className="text-4xl md:text-8xl font-black mb-4 tracking-tighter uppercase leading-tight" dangerouslySetInnerHTML={{ __html: t.title }} />
              <p className="text-gray-500 text-[10px] md:text-sm tracking-widest uppercase font-light px-4">{t.desc}</p>
            </div>

            {/* CONSOLE */}
            <div className="w-full mb-4 glass-card p-3 md:p-4 rounded-2xl md:rounded-3xl bg-black/40 border-[#34D59A]/20">
              <div className="font-mono text-[9px] md:text-[10px] text-[#34D59A]/60 flex flex-col gap-1">
                {liveLogs.map((log, i) => <div key={i} className="truncate">[{log.time}] {log.text}</div>)}
              </div>
            </div>

            {/* CHAT WINDOW */}
            <div className="glass-card p-6 md:p-10 rounded-[2rem] md:rounded-[3.5rem] flex flex-col relative overflow-hidden flex-1 min-h-[400px] max-h-[60vh]">
              <div className="flex-1 overflow-y-auto mb-4 space-y-2 scrollbar-hide">
                {chatHistory.length === 0 && <div className="bot-msg">{'>'} ARIA v4.0 READY. URL?</div>}
                {chatHistory.map((msg, i) => (
                  <div key={i} className={msg.role === 'assistant' ? 'bot-msg' : 'user-msg'}>{msg.content}</div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div className="flex gap-4 items-center border-t border-white/5 pt-4">
                <input 
                  className="bg-transparent outline-none text-[#34D59A] flex-1 font-mono text-sm placeholder:text-gray-700 w-full"
                  placeholder={t.place}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && processInput()}
                />
                <button onClick={processInput} className="text-[#34D59A] text-xl">➤</button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* VIEW: AUTH */}
      {view === 'auth' && (
        <main className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-card p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] animate-in fade-in zoom-in-95">
            <h2 className="text-2xl md:text-3xl font-black mb-8 tracking-tighter uppercase italic text-center">Identity</h2>
            <div className="space-y-4">
              <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)}
                className="w-full bg-white rounded-xl md:rounded-2xl px-5 py-3 md:py-4 outline-none font-mono text-sm text-black" placeholder="EMAIL" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white rounded-xl md:rounded-2xl px-5 py-3 md:py-4 outline-none font-mono text-sm text-black" placeholder="PASSWORD" />
              <button onClick={() => setView('dashboard')} className="w-full py-4 md:py-6 bg-[#34D59A] text-black font-black rounded-xl md:rounded-2xl text-[10px] md:text-[11px] uppercase shadow-xl">
                {t.authBtn}
              </button>
            </div>
          </div>
        </main>
      )}

      {/* VIEW: DASHBOARD */}
      {view === 'dashboard' && (
        <main className="pt-24 md:pt-32 pb-10 px-4 max-w-[1200px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 md:gap-10">
            
            {/* MOBILE HEADER (только для малых экранов) */}
            <div className="lg:hidden flex justify-between items-end mb-4 px-2">
                <h2 className="text-3xl font-black tracking-tighter uppercase italic">{t.cabinet}</h2>
                <div className="text-2xl font-black text-red-500">0.00 <span className="text-[10px] text-white/40">USDT</span></div>
            </div>

            {/* SIDEBAR (Desktop only) */}
            <div className="hidden lg:flex flex-col w-64 space-y-4">
              <div className="glass-card p-6 rounded-[2rem] border-[#34D59A]/30">
                <div className="text-[10px] text-gray-500 uppercase font-bold mb-2">Network</div>
                <div className="text-2xl font-black italic">14.2K <span className="text-[10px] text-[#34D59A]">NODES</span></div>
              </div>
              <div className="p-4 rounded-xl text-[10px] uppercase font-bold bg-[#34D59A] text-black">Terminal</div>
              <div className="p-4 rounded-xl text-[10px] uppercase font-bold text-gray-500">Billing</div>
            </div>

            <div className="flex-1 space-y-6 md:space-y-8">
              <header className="hidden lg:flex justify-between items-end">
                <div>
                  <h2 className="text-5xl font-black tracking-tighter uppercase italic">{t.cabinet}</h2>
                  <div className="text-[10px] text-gray-500 font-mono mt-1">ID: {orderId}-ALPHA</div>
                </div>
                <div className="text-4xl font-black text-red-500">0.00 <span className="text-sm text-white/20">USDT</span></div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* SLIDER */}
                <div className="glass-card p-6 md:p-10 rounded-[2rem] md:rounded-[3.5rem] space-y-6 md:space-y-8">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[10px] md:text-[11px] uppercase font-bold text-gray-400 tracking-widest">Power Scale</h4>
                    <span className="text-[#34D59A] font-mono text-sm md:text-lg font-bold">${price}</span>
                  </div>
                  <input type="range" min="100" max="499" value={price} onChange={(e) => setPrice(e.target.value)} />
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <div className="p-3 md:p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                      <div className="text-[8px] md:text-[9px] text-gray-500 uppercase mb-1">{t.nodes}</div>
                      <div className="text-lg md:text-xl font-bold italic">{Math.floor(price * 12)}</div>
                    </div>
                    <div className="p-3 md:p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                      <div className="text-[8px] md:text-[9px] text-gray-500 uppercase mb-1">Time</div>
                      <div className="text-lg md:text-xl font-bold italic">365D</div>
                    </div>
                  </div>
                </div>

                {/* PAYMENT */}
                <div className="glass-card p-6 md:p-10 rounded-[2rem] md:rounded-[3.5rem] border-[#34D59A]/30 flex flex-col justify-center">
                  <div className="text-center mb-6">
                    <div className="text-[10px] text-gray-500 uppercase font-bold mb-1 italic">Total Due</div>
                    <div className="text-4xl md:text-5xl font-black italic">{price} <span className="text-lg opacity-20 text-white">USDT</span></div>
                  </div>
                  <button onClick={handleTonkeeperPay} className="w-full py-4 md:py-6 bg-blue-500 text-white font-black rounded-xl md:rounded-2xl text-[10px] md:text-[11px] uppercase flex items-center justify-center gap-3">
                    <img src="https://ton.org/download/ton_symbol.svg" className="w-4 h-4 md:w-5 md:h-5 brightness-200" alt="ton" />
                    {t.payTon}
                  </button>
                  {isSearchingTx && (
                    <div className="mt-4 p-3 bg-black/50 border border-[#34D59A]/20 rounded-xl flex items-center gap-3 animate-pulse">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#34D59A]"></div>
                      <div className="text-[8px] md:text-[9px] uppercase text-[#34D59A] font-bold tracking-widest leading-none">Scanning Network...</div>
                    </div>
                  )}
                </div>
              </div>

              {/* DASHBOARD LOGS */}
              <div className="glass-card p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] h-32 bg-black/40 font-mono text-[9px] text-[#34D59A]/40 overflow-hidden">
                  {liveLogs.map((log, i) => <div key={i} className="truncate">[{log.time}] {log.text}</div>)}
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
