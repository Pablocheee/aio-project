'use client';
import React, { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [view, setView] = useState('chat'); 
  const [currentLang, setCurrentLang] = useState('ru');
  const [chatHistory, setChatHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [price, setPrice] = useState(100);
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
      capture: 'ЗОНА ЗАХВАТА GPT'
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
      capture: 'GPT CAPTURE ZONE'
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

  const processInput = () => {
    if (!inputValue.trim()) return;
    setChatHistory(prev => [...prev, { role: 'user', content: inputValue }]);
    setInputValue('');
    setTimeout(() => {
      setChatHistory(prev => [...prev, { role: 'assistant', content: "Анализ завершен. Пакет данных сформирован. Перейдите в кабинет. [DATA_READY]" }]);
      setTimeout(() => setView('auth'), 1500);
    }, 1000);
  };

  return (
    <div className="min-h-screen text-white bg-[#050505] font-sans overflow-x-hidden selection:bg-[#34D59A] selection:text-black">
      <style jsx global>{`
        @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } }
        @keyframes pulse-ring { 0% { transform: scale(0.8); opacity: 0.5; } 100% { transform: scale(1.2); opacity: 0; } }
        .glow-text { color: #34D59A; text-shadow: 0 0 15px rgba(52, 213, 154, 0.4); }
        .glass-card { background: rgba(15, 15, 15, 0.85); border: 1px solid rgba(52, 213, 154, 0.1); backdrop-filter: blur(12px); }
        input[type='range'] { -webkit-appearance: none; background: rgba(255,255,255,0.1); border-radius: 10px; height: 6px; }
        input[type='range']::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; background: #34D59A; border-radius: 50%; cursor: pointer; border: 2px solid #050505; box-shadow: 0 0 10px #34D59A; }
      `}</style>

      {/* HEADER */}
      <header className="fixed top-0 w-full z-[1000] px-6 py-4 flex justify-between items-center bg-black/60 backdrop-blur-xl border-b border-white/5">
        <div className="text-xl font-bold tracking-tighter uppercase cursor-pointer" onClick={() => setView('chat')}>
          AIO<span className="glow-text">.CORE</span>
        </div>
        <div className="flex gap-6 items-center">
          <button onClick={() => setView('auth')} className="text-[10px] tracking-widest text-gray-400 hover:text-[#34D59A] uppercase font-bold">[{t.login}]</button>
          <button onClick={() => setCurrentLang(l => l === 'ru' ? 'en' : 'ru')} className="text-[10px] border border-white/10 px-4 py-1.5 rounded-full uppercase font-bold">{currentLang.toUpperCase()}</button>
        </div>
      </header>

      {/* VIEW: CHAT */}
      {view === 'chat' && (
        <main className="pt-32 pb-10 px-4 flex flex-col items-center min-h-screen">
          <div className="max-w-3xl w-full">
            <h1 className="text-5xl md:text-8xl font-black text-center mb-8 tracking-tighter uppercase leading-tight" dangerouslySetInnerHTML={{ __html: t.title }} />
            <div className="glass-card p-6 md:p-10 rounded-[3rem] h-[450px] flex flex-col relative overflow-hidden">
               <div className="flex-1 font-mono text-sm text-[#34D59A] space-y-2 overflow-y-auto pr-2 scrollbar-hide">
                  {liveLogs.map((log, i) => <div key={i} className="opacity-50">[{log.time}] {log.text}</div>)}
                  <div className="pt-4 text-white uppercase font-bold tracking-widest animate-pulse">{'>'} System: Ready to scan...</div>
                  {chatHistory.map((msg, i) => <div key={i} className={msg.role === 'user' ? 'text-right opacity-40 italic' : 'text-[#34D59A]'}>{msg.role === 'user' ? 'USER: ' : 'AI: '}{msg.content}</div>)}
               </div>
               <div className="flex gap-4 border-t border-white/10 pt-6 mt-4">
                  <input className="bg-transparent flex-1 outline-none text-[#34D59A] font-mono text-lg" placeholder={t.place} value={inputValue} onChange={(e)=>setInputValue(e.target.value)} onKeyDown={(e)=>e.key==='Enter' && processInput()} />
                  <button onClick={processInput} className="text-[#34D59A] text-2xl">➤</button>
               </div>
            </div>
          </div>
        </main>
      )}

      {/* VIEW: DASHBOARD (ВИЗУАЛИЗАЦИЯ ЗДЕСЬ) */}
      {view === 'dashboard' && (
        <main className="pt-32 pb-10 px-4 max-w-[1200px] mx-auto">
          <div className="flex flex-col gap-8">
            <div className="flex justify-between items-end">
               <h2 className="text-5xl font-black italic tracking-tighter uppercase">{t.cabinet}</h2>
               <div className="text-3xl font-black text-red-500 italic">0.00 <span className="text-sm text-white/20">USDT</span></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 3D VISUALIZER BOX */}
              <div className="lg:col-span-2 glass-card rounded-[3.5rem] relative overflow-hidden h-[400px] md:h-[550px] bg-black">
                {/* SVG Visual Engine */}
                <div className="absolute inset-0 z-0">
                  <svg width="100%" height="100%" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <radialGradient id="sphereGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#34D59A" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#34D59A" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                    {/* Perspective Grid */}
                    <g opacity="0.2">
                      {[...Array(20)].map((_, i) => (
                        <line key={i} x1="0" y1={i * 40} x2="800" y2={i * 40} stroke="#34D59A" strokeWidth="0.5" />
                      ))}
                      {[...Array(20)].map((_, i) => (
                        <line key={i} x1={i * 40} y1="0" x2={i * 40} y2="600" stroke="#34D59A" strokeWidth="0.5" />
                      ))}
                    </g>
                    {/* Capture Sphere */}
                    <circle cx="400" cy="300" r={price * 0.5} fill="url(#sphereGrad)" className="transition-all duration-500 ease-out" />
                    <circle cx="400" cy="300" r={price * 0.5} stroke="#34D59A" strokeWidth="1" strokeDasharray="10 5" opacity="0.5">
                      <animateTransform attributeName="transform" type="rotate" from="0 400 300" to="360 400 300" dur="20s" repeatCount="indefinite" />
                    </circle>
                    {/* Central Core */}
                    <circle cx="400" cy="300" r="40" fill="#34D59A" opacity="0.1" />
                    <circle cx="400" cy="300" r="2" fill="#34D59A">
                       <animate attributeName="r" values="2;10;2" dur="2s" repeatCount="indefinite" />
                       <animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite" />
                    </circle>
                  </svg>
                </div>

                <div className="absolute top-10 left-10 z-10">
                   <div className="text-[10px] font-bold text-[#34D59A] tracking-[0.5em] mb-2">{t.capture}</div>
                   <div className="text-5xl font-black italic tracking-tighter">{(price * 1.5).toFixed(0)}m²</div>
                </div>

                <div className="absolute bottom-10 left-10 z-10 font-mono text-[9px] text-[#34D59A]/50 bg-black/40 p-4 rounded-2xl backdrop-blur-md border border-white/5">
                   <div>{'>'} COORDS: 42.109 / 88.02</div>
                   <div>{'>'} INJECTION: ACTIVE</div>
                   <div>{'>'} STATUS: MAPPING CONTEXT</div>
                </div>
                
                <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-black to-transparent pointer-events-none"></div>
                <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
              </div>

              {/* CONTROLS */}
              <div className="flex flex-col gap-6">
                <div className="glass-card p-10 rounded-[3rem] border-[#34D59A]/30">
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest italic">Power Level</span>
                    <span className="text-[#34D59A] font-bold text-2xl">${price}</span>
                  </div>
                  <input type="range" min="100" max="499" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full mb-10" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/5 text-center">
                       <div className="text-[8px] text-gray-500 uppercase mb-1 italic">Nodes</div>
                       <div className="text-2xl font-black italic">{Math.floor(price * 11)}</div>
                    </div>
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/5 text-center">
                       <div className="text-[8px] text-gray-500 uppercase mb-1 italic">Impact</div>
                       <div className="text-2xl font-black italic">{(price / 4.8).toFixed(1)}%</div>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-500 py-8 rounded-[2.5rem] font-black uppercase text-[12px] flex items-center justify-center gap-4 transition-all hover:scale-[1.02] shadow-2xl shadow-blue-600/20">
                   <img src="https://ton.org/download/ton_symbol.svg" className="w-6 h-6 brightness-200" alt="ton" />
                   {t.payTon}
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* VIEW: AUTH */}
      {view === 'auth' && (
        <main className="min-h-screen flex items-center justify-center p-6">
          <div className="glass-card p-12 rounded-[3.5rem] w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
             <h2 className="text-3xl font-black mb-10 italic uppercase tracking-tighter text-center">Identity Verification</h2>
             <div className="space-y-4">
                <input className="w-full bg-white text-black p-5 rounded-2xl font-bold outline-none" placeholder="EMAIL" />
                <input className="w-full bg-white text-black p-5 rounded-2xl font-bold outline-none" type="password" placeholder="PASSWORD" />
                <button onClick={() => setView('dashboard')} className="w-full bg-[#34D59A] text-black py-6 rounded-2xl font-black uppercase tracking-widest mt-4">Establish Link</button>
             </div>
          </div>
        </main>
      )}
    </div>
  );
}
