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
    { time: new Date().toLocaleTimeString(), text: "Neural bridge established..." },
    { time: new Date().toLocaleTimeString(), text: "Ready for injection" }
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
      nodes: 'Узлы',
      capture: 'ЗАХВАТ ОБЛАСТИ GPT'
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
      nodes: 'Nodes',
      capture: 'GPT CONTEXT CAPTURE'
    }
  };

  const t = translations[currentLang];

  useEffect(() => {
    const lines = ["Scanning GPT vectors...", "RAG sync: active", "Context injection: 12%", "Mapping nodes...", "Neural link stable"];
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
        body { font-family: 'Space Grotesk', sans-serif; background: #050505; margin: 0; }
        .glow-text { color: #34D59A; text-shadow: 0 0 15px rgba(52, 213, 154, 0.4); }
        .glass-card { background: rgba(15, 15, 15, 0.85); border: 1px solid rgba(52, 213, 154, 0.1); backdrop-filter: blur(12px); }
        .bot-msg { color: #34D59A; font-family: monospace; font-size: 12px; margin-bottom: 12px; border-left: 2px solid #34D59A; padding-left: 10px; }
        .user-msg { color: #fff; font-family: monospace; font-size: 12px; opacity: 0.5; margin-bottom: 12px; text-align: right; border-right: 2px solid rgba(255,255,255,0.1); padding-right: 10px; }
        
        /* 3D Visualizer */
        .neural-world { perspective: 1000px; overflow: hidden; background: radial-gradient(circle at 50% 50%, #111 0%, #050505 100%); }
        .grid-3d {
          width: 200%; height: 200%; position: absolute; bottom: -50%; left: -50%;
          background-image: linear-gradient(rgba(52, 213, 154, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(52, 213, 154, 0.1) 1px, transparent 1px);
          background-size: 40px 40px; transform: rotateX(65deg); animation: grid-move 5s linear infinite;
        }
        @keyframes grid-move { 0% { transform: rotateX(65deg) translateY(0); } 100% { transform: rotateX(65deg) translateY(40px); } }
        
        .capture-dome {
          position: absolute; bottom: 15%; left: 50%; transform: translateX(-50%);
          background: radial-gradient(50% 50% at 50% 50%, rgba(52, 213, 154, 0.15) 0%, transparent 100%);
          border-radius: 50%; border: 1px solid rgba(52, 213, 154, 0.4);
          box-shadow: 0 0 40px rgba(52, 213, 154, 0.2); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        input[type='range'] { -webkit-appearance: none; background: rgba(255,255,255,0.1); border-radius: 10px; height: 6px; width: 100%; }
        input[type='range']::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; background: #34D59A; border-radius: 50%; cursor: pointer; border: 2px solid #050505; }
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
          <div className="max-w-3xl w-full">
            <div className="text-center mb-8">
              <h1 className="text-5xl md:text-8xl font-black mb-4 tracking-tighter uppercase leading-tight" dangerouslySetInnerHTML={{ __html: t.title }} />
              <p className="text-gray-500 text-[10px] md:text-sm tracking-widest uppercase font-light">{t.desc}</p>
            </div>
            {/* CONSOLE ABOVE CHAT */}
            <div className="w-full mb-4 glass-card p-3 md:p-4 rounded-2xl bg-black/40 border-[#34D59A]/20">
              <div className="font-mono text-[9px] md:text-[10px] text-[#34D59A]/60 flex flex-col gap-1">
                {liveLogs.map((log, i) => <div key={i}>[{log.time}] {log.text}</div>)}
              </div>
            </div>
            {/* CHAT WINDOW */}
            <div className="glass-card p-6 md:p-10 rounded-[2rem] md:rounded-[3.5rem] h-[400px] flex flex-col relative overflow-hidden">
              <div className="flex-1 overflow-y-auto mb-4 space-y-2 scrollbar-hide">
                {chatHistory.length === 0 && <div className="bot-msg">{'>'} ARIA v4.2. Waiting for link...</div>}
                {chatHistory.map((msg, i) => (
                  <div key={i} className={msg.role === 'assistant' ? 'bot-msg' : 'user-msg'}>{msg.content}</div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div className="flex gap-4 items-center border-t border-white/5 pt-4">
                <input className="bg-transparent outline-none text-[#34D59A] flex-1 font-mono text-sm placeholder:text-gray-700 w-full"
                  placeholder={t.place} value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && processInput()} />
                <button onClick={processInput} className="text-[#34D59A] text-xl">➤</button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* VIEW: DASHBOARD */}
      {view === 'dashboard' && (
        <main className="pt-24 md:pt-32 pb-10 px-4 max-w-[1200px] mx-auto animate-in slide-in-from-bottom-5 duration-700">
          <div className="flex flex-col gap-6">
            
            <div className="flex justify-between items-end bg-white/5 p-6 rounded-[2rem] border border-white/5">
              <div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic leading-none">{t.cabinet}</h2>
                <div className="text-[10px] text-[#34D59A] font-mono mt-2 uppercase tracking-widest animate-pulse">Connection: Active</div>
              </div>
              <div className="text-right">
                <div className="text-2xl md:text-4xl font-black text-red-500 italic">0.00 <span className="text-xs text-white opacity-20">USDT</span></div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* 3D VISUALIZATION BLOCK (LEFT) */}
              <div className="lg:col-span-2 glass-card rounded-[2.5rem] overflow-hidden relative h-[350px] md:h-[500px] neural-world">
                <div className="absolute top-8 left-8 z-20">
                  <h4 className="text-[11px] font-bold text-white tracking-[0.3em] uppercase mb-1">{t.capture}</h4>
                  <div className="text-4xl font-black italic">{(price * 1.8).toFixed(0)}m²</div>
                </div>

                <div className="grid-3d"></div>
                
                {/* DYNAMIC DOME */}
                <div className="capture-dome" style={{ 
                  width: `${price * 1.4}px`, 
                  height: `${price * 0.9}px`,
                  opacity: price / 550
                }}></div>

                <div className="absolute bottom-8 right-8 z-20 bg-black/60 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
                   <div className="text-[9px] text-gray-500 uppercase mb-2 font-bold tracking-widest">Context Mapping</div>
                   <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#34D59A] transition-all duration-1000" style={{ width: '70%' }}></div>
                   </div>
                </div>
              </div>

              {/* CONTROLS (RIGHT) */}
              <div className="space-y-6">
                <div className="glass-card p-8 rounded-[2.5rem] border-[#34D59A]/20">
                  <div className="flex justify-between mb-6">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Node Power</span>
                    <span className="text-[#34D59A] font-mono font-bold text-lg">${price}</span>
                  </div>
                  <input type="range" min="100" max="499" value={price} onChange={(e) => setPrice(e.target.value)} className="mb-8" />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <div className="text-[8px] text-gray-500 uppercase mb-1">{t.nodes}</div>
                      <div className="text-xl font-bold italic">{Math.floor(price * 12.5)}</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <div className="text-[8px] text-gray-500 uppercase mb-1">Impact</div>
                      <div className="text-xl font-bold italic">{(price / 5).toFixed(1)}%</div>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-8 rounded-[2.5rem] border-blue-500/20 bg-blue-600/[0.03]">
                  <div className="text-center mb-6">
                    <div className="text-[9px] text-gray-500 uppercase font-bold tracking-[0.2em] mb-2 italic">Ready to Bridge</div>
                    <div className="text-4xl font-black italic">{price} <span className="text-sm opacity-20">USDT</span></div>
                  </div>
                  <button onClick={handleTonkeeperPay} className="w-full py-5 bg-blue-500 text-white font-black rounded-2xl text-[10px] uppercase flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20 hover:scale-[1.03] transition-transform">
                    <img src="https://ton.org/download/ton_symbol.svg" className="w-5 h-5 brightness-200" alt="ton" />
                    {t.payTon}
                  </button>
                </div>
              </div>

            </div>

            <div className="glass-card p-6 rounded-[2rem] bg-black/40 font-mono text-[9px] text-[#34D59A]/40 overflow-hidden flex flex-col gap-1">
                {liveLogs.map((log, i) => <div key={i} className="truncate">[{log.time}] {log.text} — NODE: ACTIVE — CAPTURE_POWER: {price}lv</div>)}
            </div>
          </div>
        </main>
      )}

      {/* VIEW: AUTH (MINIMAL) */}
      {view === 'auth' && (
        <main className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-card p-10 rounded-[3rem] animate-in fade-in zoom-in-95">
            <h2 className="text-2xl font-black mb-8 tracking-tighter uppercase text-center italic">Node Connect</h2>
            <div className="space-y-4">
              <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)}
                className="w-full bg-white rounded-xl px-5 py-3 outline-none font-mono text-sm text-black" placeholder="EMAIL" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white rounded-xl px-5 py-3 outline-none font-mono text-sm text-black" placeholder="PASSWORD" />
              <button onClick={() => setView('dashboard')} className="w-full py-5 bg-[#34D59A] text-black font-black rounded-xl text-[10px] uppercase">
                {t.authBtn}
              </button>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
