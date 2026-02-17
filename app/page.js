'use client';
import React, { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [view, setView] = useState('chat'); 
  const [currentLang, setCurrentLang] = useState('ru');
  const [chatHistory, setChatHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [orderId, setOrderId] = useState('772109');
  
  // Состояния для тарифа
  const [price, setPrice] = useState(100);
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSearchingTx, setIsSearchingTx] = useState(false);

  // Консоль
  const [liveLogs, setLiveLogs] = useState([
    { time: new Date().toLocaleTimeString(), text: "System bridge established..." },
    { time: new Date().toLocaleTimeString(), text: "Neural core: Standby" }
  ]);

  const chatEndRef = useRef(null);

  const translations = {
    ru: { 
      title: 'СЕМАНТИЧЕСКАЯ <span class="glow-text italic">ИНДЕКСАЦИЯ</span>', 
      desc: 'Автономный протокол интеграции данных в нейросети.', 
      place: 'Введите сообщение...',
      login: 'Войти',
      logout: 'Выйти',
      authBtn: 'Установить соединение',
      cabinet: 'Панель управления',
      payTon: 'Оплатить через Tonkeeper',
      status: 'Статус транзакции',
      nodes: 'Активных узлов'
    },
    en: { 
      title: 'SEMANTIC <span class="glow-text italic">INDEXING</span>', 
      desc: 'Autonomous protocol for data integration into LLM contexts.', 
      place: 'Type a message...',
      login: 'Login',
      logout: 'Logout',
      authBtn: 'Establish Connection',
      cabinet: 'Control Panel',
      payTon: 'Pay via Tonkeeper',
      status: 'Transaction Status',
      nodes: 'Active Nodes'
    }
  };

  const t = translations[currentLang];

  useEffect(() => {
    const lines = ["Vectorizing node #412...", "RAG Sync: 99.2%", "LLM Context optimization...", "Semantic weight adjusted", "TRC20 Gateway: Ready"];
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
      setChatHistory(prev => [...prev, { role: 'assistant', content: "Анализ завершен. Пакет данных сформирован. Перейдите в кабинет для активации. [DATA_READY]" }]);
      setTimeout(() => setView('auth'), 1500);
    }, 1000);
  };

  const handleTonkeeperPay = () => {
    const address = "UQAVTMHfwYcMn7ttJNXiJVaoA-jjRTeJHc2sjpkAVzc84oSY";
    const amountInNanotons = (price * 1000000000).toString(); // Примерная конвертация
    const link = `ton://transfer/${address}?amount=${amountInNanotons}&text=Index-${orderId}`;
    window.location.assign(link);
    setIsSearchingTx(true);
  };

  return (
    <div className="min-h-screen text-white bg-[#050505] selection:bg-[#34D59A] selection:text-black">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&display=swap');
        body { font-family: 'Space Grotesk', sans-serif; background: #050505; }
        .glow-text { color: #34D59A; text-shadow: 0 0 15px rgba(52, 213, 154, 0.4); }
        .glass-card { background: rgba(15, 15, 15, 0.7); border: 1px solid rgba(52, 213, 154, 0.1); backdrop-filter: blur(20px); }
        .bot-msg { color: #34D59A; font-family: monospace; font-size: 13px; margin-bottom: 16px; border-left: 2px solid #34D59A; padding-left: 14px; }
        .user-msg { color: #fff; font-family: monospace; font-size: 13px; opacity: 0.5; margin-bottom: 16px; text-align: right; border-right: 2px solid rgba(255,255,255,0.1); padding-right: 14px; }
        input[type='range'] { -webkit-appearance: none; background: rgba(255,255,255,0.1); border-radius: 10px; height: 6px; }
        input[type='range']::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; background: #34D59A; border-radius: 50%; cursor: pointer; box-shadow: 0 0 10px #34D59A; }
      `}</style>

      {/* HEADER */}
      <header className="fixed top-0 w-full z-[1000] p-6 flex justify-between items-center bg-black/60 backdrop-blur-xl border-b border-white/5">
        <div className="text-xl font-bold tracking-tighter uppercase cursor-pointer" onClick={() => setView('chat')}>
          AIO<span className="glow-text">.CORE</span>
        </div>
        <div className="flex gap-6 items-center">
          <button onClick={() => setView(view === 'dashboard' ? 'chat' : 'auth')} className="text-[10px] tracking-widest text-gray-400 hover:text-[#34D59A] uppercase font-bold">
            [ {view === 'dashboard' ? t.logout : t.login} ]
          </button>
          <button onClick={() => setCurrentLang(l => l === 'ru' ? 'en' : 'ru')} className="text-[10px] border border-white/10 px-4 py-1.5 rounded-full uppercase hover:bg-white hover:text-black transition-all font-bold">
            {currentLang === 'ru' ? 'EN' : 'RU'}
          </button>
        </div>
      </header>

      {/* VIEW: CHAT */}
      {view === 'chat' && (
        <main className="pt-32 pb-20 px-6 flex flex-col items-center min-h-screen">
          <div className="max-w-3xl w-full">
            <div className="text-center mb-10">
              <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter uppercase leading-[0.9]" dangerouslySetInnerHTML={{ __html: t.title }} />
              <p className="text-gray-500 text-sm tracking-widest uppercase font-light">{t.desc}</p>
            </div>

            {/* КОНСОЛЬ НАД ЧАТОМ */}
            <div className="w-full mb-4 glass-card p-4 rounded-3xl bg-black/40 border-[#34D59A]/20">
              <div className="flex justify-between items-center mb-2 px-2">
                <span className="text-[9px] uppercase text-[#34D59A] font-bold tracking-widest">Live Engine Console</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
                </span>
              </div>
              <div className="font-mono text-[10px] text-[#34D59A]/60 flex flex-col gap-1">
                {liveLogs.map((log, i) => <div key={i}>[{log.time}] {log.text}</div>)}
              </div>
            </div>

            {/* ОКНО ЧАТА */}
            <div className="glass-card p-10 rounded-[3.5rem] h-[450px] flex flex-col relative overflow-hidden">
              <div className="flex-1 overflow-y-auto mb-6 pr-4 space-y-2 scrollbar-hide">
                {chatHistory.length === 0 && <div className="bot-msg">{'>'} ARIA v4.0.0-STABLE. Waiting for project link...</div>}
                {chatHistory.map((msg, i) => (
                  <div key={i} className={msg.role === 'assistant' ? 'bot-msg' : 'user-msg'}>{msg.content}</div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div className="flex gap-6 items-center pt-2">
                <input 
                  className="bg-transparent outline-none text-[#34D59A] flex-1 font-mono text-sm placeholder:text-gray-700"
                  placeholder={t.place}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && processInput()}
                />
                <button onClick={processInput} className="text-[#34D59A] text-2xl hover:scale-110">➤</button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* VIEW: AUTH */}
      {view === 'auth' && (
        <main className="min-h-screen flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-500">
          <div className="max-w-md w-full glass-card p-12 rounded-[4rem]">
            <h2 className="text-3xl font-black mb-10 tracking-tighter uppercase italic text-center">Node Login</h2>
            <div className="space-y-6">
              <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)}
                className="w-full bg-white rounded-2xl px-6 py-4 outline-none font-mono text-sm text-black" placeholder="EMAIL" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white rounded-2xl px-6 py-4 outline-none font-mono text-sm text-black" placeholder="PASSWORD" />
              <button onClick={() => setView('dashboard')} className="w-full py-6 bg-[#34D59A] text-black font-black rounded-2xl text-[11px] uppercase shadow-2xl">
                {t.authBtn}
              </button>
            </div>
          </div>
        </main>
      )}

      {/* VIEW: DASHBOARD */}
      {view === 'dashboard' && (
        <main className="pt-28 pb-20 px-8 flex gap-8 max-w-[1400px] mx-auto animate-in slide-in-from-bottom-5 duration-700">
          {/* SIDEBAR */}
          <div className="hidden lg:flex flex-col w-64 space-y-4">
            <div className="glass-card p-6 rounded-[2rem] border-[#34D59A]/30">
              <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Network Load</div>
              <div className="text-2xl font-black italic">14.2K <span className="text-[10px] glow-text underline">NODES</span></div>
            </div>
            {['Terminal', 'Semantic Map', 'Billing'].map((m, i) => (
              <div key={i} className={`p-4 rounded-xl text-[10px] uppercase font-bold tracking-widest cursor-pointer ${i===0 ? 'bg-[#34D59A] text-black' : 'text-gray-500 hover:bg-white/5'}`}>{m}</div>
            ))}
          </div>

          <div className="flex-1 space-y-8">
            <header className="flex justify-between items-end">
              <div>
                <h2 className="text-5xl font-black tracking-tighter uppercase italic">{t.cabinet}</h2>
                <div className="text-[10px] text-gray-500 font-mono mt-1 uppercase">NODE_ID: {orderId}-ALPHA</div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-black text-red-500">0.00 <span className="text-sm text-white/20 font-normal">USDT</span></div>
              </div>
            </header>

            <div className="grid md:grid-cols-2 gap-10">
              {/* СЛАЙДЕР ВЫБОРА ТАРИФА */}
              <div className="glass-card p-10 rounded-[3.5rem] space-y-8">
                <div className="flex justify-between items-center">
                  <h4 className="text-[11px] uppercase font-bold text-gray-400 tracking-[0.2em]">Select Package Power</h4>
                  <span className="text-[#34D59A] font-mono text-sm">${price}</span>
                </div>
                
                <input 
                  type="range" min="100" max="499" step="1" 
                  value={price} onChange={(e) => setPrice(e.target.value)}
                  className="w-full cursor-pointer"
                />

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                    <div className="text-[9px] text-gray-500 uppercase mb-1">{t.nodes}</div>
                    <div className="text-xl font-bold italic">{Math.floor(price * 12)}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                    <div className="text-[9px] text-gray-500 uppercase mb-1">Retention</div>
                    <div className="text-xl font-bold italic">365D</div>
                  </div>
                </div>
              </div>

              {/* ОПЛАТА */}
              <div className="glass-card p-10 rounded-[3.5rem] border-[#34D59A]/30">
                <div className="text-center mb-8">
                  <div className="text-[10px] text-gray-500 uppercase font-bold mb-2 tracking-widest">Inbound Amount</div>
                  <div className="text-5xl font-black italic">{price} <span className="text-lg opacity-20">USDT</span></div>
                </div>

                <div className="space-y-4">
                  <button onClick={handleTonkeeperPay} className="w-full py-6 bg-blue-500 text-white font-black rounded-2xl text-[11px] uppercase flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform">
                    <img src="https://ton.org/download/ton_symbol.svg" className="w-5 h-5 brightness-200" alt="ton" />
                    {t.payTon}
                  </button>
                  <button onClick={() => setIsSearchingTx(true)} className="w-full py-4 text-[9px] uppercase font-bold text-gray-500 tracking-widest hover:text-white transition-colors">
                    Check Transaction Status
                  </button>
                </div>

                {isSearchingTx && (
                  <div className="mt-6 p-4 bg-black/50 border border-[#34D59A]/20 rounded-2xl flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-[#34D59A] animate-ping"></div>
                    <div className="text-[9px] uppercase text-[#34D59A] font-bold tracking-widest">
                      {t.status}: Indexing Blockchain...
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
