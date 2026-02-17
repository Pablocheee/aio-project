'use client';
import React, { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [view, setView] = useState('chat'); // 'chat', 'auth', 'dashboard'
  const [currentLang, setCurrentLang] = useState('ru');
  const [chatHistory, setChatHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [orderId, setOrderId] = useState('');
  
  // Состояния пользователя
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSearchingTx, setIsSearchingTx] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Живая консоль
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
      status: 'Статус транзакции'
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
      status: 'Transaction Status'
    }
  };

  const t = translations[currentLang];

  // Имитация работы консоли
  useEffect(() => {
    const lines = ["Vectorizing node #412...", "RAG Sync: 99.2%", "LLM Context optimization...", "Semantic weight adjusted", "TRC20 Gateway: Ready", "Scanning metadata..."];
    const interval = setInterval(() => {
      setLiveLogs(prev => {
        const next = { time: new Date().toLocaleTimeString(), text: lines[Math.floor(Math.random() * lines.length)] };
        return [...prev, next].slice(-5);
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatHistory]);

  const processInput = async () => {
    if (!inputValue.trim()) return;
    setChatHistory(prev => [...prev, { role: 'user', content: inputValue }]);
    setInputValue('');
    // Эмуляция ответа и перехода
    setTimeout(() => {
      setChatHistory(prev => [...prev, { role: 'assistant', content: "Данные проанализированы. Для завершения индексации перейдите в кабинет. [DATA_READY]" }]);
      setOrderId(Math.floor(100000 + Math.random() * 900000));
      setTimeout(() => setView('auth'), 1000);
    }, 1000);
  };

  const handleTonkeeperPay = () => {
    const amount = selectedPlan ? selectedPlan.price * 1000000000 : 1000000000; // нано-тоны
    const address = "UQAVTMHfwYcMn7ttJNXiJVaoA-jjRTeJHc2sjpkAVzc84oSY";
    const link = `ton://transfer/${address}?amount=${amount}&text=Inbound-Index-${orderId}`;
    window.location.href = link;
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
        .fade-in-up { animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); filter: blur(5px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
      `}</style>

      {/* HEADER */}
      <header className="fixed top-0 w-full z-[1000] p-6 flex justify-between items-center bg-black/60 backdrop-blur-xl border-b border-white/5">
        <div className="text-xl font-bold tracking-tighter uppercase cursor-pointer" onClick={() => setView('chat')}>
          AIO<span className="glow-text">.CORE</span>
        </div>
        
        <div className="flex gap-6 items-center">
          {view !== 'dashboard' ? (
            <button onClick={() => setView('auth')} className="text-[10px] tracking-widest text-gray-400 hover:text-[#34D59A] uppercase font-bold transition-colors">
              [ {t.login} ]
            </button>
          ) : (
            <button onClick={() => setView('chat')} className="text-[10px] tracking-widest text-red-500 hover:text-red-400 uppercase font-bold transition-colors">
              [ {t.logout} ]
            </button>
          )}
          
          <button onClick={() => setCurrentLang(l => l === 'ru' ? 'en' : 'ru')} className="text-[10px] border border-white/10 px-4 py-1.5 rounded-full uppercase hover:bg-white hover:text-black transition-all font-bold">
            {currentLang === 'ru' ? 'EN' : 'RU'}
          </button>
        </div>
      </header>

      {/* VIEW: CHAT & CONSOLE */}
      {view === 'chat' && (
        <main className="pt-32 pb-20 px-6 flex flex-col items-center min-h-screen animate-in fade-in duration-500">
          <div className="max-w-3xl w-full">
            <div className="text-center mb-16">
              <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter uppercase leading-[0.9]" dangerouslySetInnerHTML={{ __html: t.title }} />
              <p className="text-gray-500 text-sm tracking-widest uppercase font-light">{t.desc}</p>
            </div>

            <div className="glass-card p-10 rounded-[3.5rem] h-[500px] flex flex-col relative overflow-hidden">
              {/* CONSOLE OVERLAY - ВОЗВРАЩЕНА */}
              <div className="absolute top-6 right-10 text-[8px] font-mono text-[#34D59A]/60 text-right leading-tight uppercase z-10">
                {liveLogs.map((log, i) => <div key={i} className="mb-1">[{log.time}] {log.text}</div>)}
              </div>

              <div className="flex-1 overflow-y-auto mb-6 pr-4 space-y-2">
                {chatHistory.length === 0 && <div className="bot-msg">{'>'} ARIA v4.0.0-STABLE READY. Waiting for input...</div>}
                {chatHistory.map((msg, i) => (
                  <div key={i} className={msg.role === 'assistant' ? 'bot-msg' : 'user-msg'}>{msg.content}</div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div className="flex gap-6 items-center border-t border-white/5 pt-6">
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

      {/* VIEW: AUTH (ЧЕРНЫЙ ТЕКСТ В INPUT) */}
      {view === 'auth' && (
        <main className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-md w-full glass-card p-12 rounded-[4rem] fade-in-up">
            <h2 className="text-3xl font-black mb-10 tracking-tighter uppercase italic text-center">Identity Verification</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[8px] uppercase text-gray-500 ml-4 tracking-widest font-bold">Email</label>
                <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full bg-white border border-white/10 rounded-2xl px-6 py-4 outline-none font-mono text-sm text-black" />
              </div>
              <div className="space-y-2">
                <label className="text-[8px] uppercase text-gray-500 ml-4 tracking-widest font-bold">Secure Token</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-white/10 rounded-2xl px-6 py-4 outline-none font-mono text-sm text-black" placeholder="••••••••" />
              </div>
              <button onClick={() => setView('dashboard')} className="w-full py-6 bg-[#34D59A] text-black font-black rounded-2xl text-[11px] uppercase shadow-2xl hover:bg-[#2bb582] transition-all transform active:scale-95">
                {t.authBtn}
              </button>
            </div>
          </div>
        </main>
      )}

      {/* VIEW: DASHBOARD (БЕЗ ГЛЮЧНЫХ ПОЛОСОК) */}
      {view === 'dashboard' && (
        <main className="pt-28 pb-20 px-8 flex gap-8 max-w-[1400px] mx-auto fade-in-up">
          {/* SIDEBAR */}
          <div className="hidden lg:flex flex-col w-64 space-y-4">
            <div className="glass-card p-6 rounded-[2rem] bg-[#34D59A]/5 border-[#34D59A]/20">
              <div className="text-[9px] uppercase font-bold text-[#34D59A] tracking-widest mb-2">Live Status</div>
              <div className="text-xl font-black italic">14,204 <span className="text-[10px] text-gray-500">Nodes</span></div>
            </div>
            {['Terminal', 'Semantic DB', 'API Access', 'Settings'].map((item, i) => (
              <div key={i} className={`p-4 rounded-xl text-[10px] uppercase font-bold tracking-widest cursor-pointer transition-all ${i===0 ? 'bg-[#34D59A] text-black' : 'hover:bg-white/5 text-gray-500'}`}>
                {item}
              </div>
            ))}
          </div>

          {/* CONTENT */}
          <div className="flex-1 space-y-10">
            <header className="flex justify-between items-end">
              <div>
                <h2 className="text-5xl font-black tracking-tighter uppercase italic">{t.cabinet}</h2>
                <div className="text-[10px] text-gray-500 font-mono mt-2 uppercase tracking-widest">UID: {orderId}-ALPHA</div>
              </div>
              <div className="text-right">
                <div className="text-[9px] uppercase text-gray-500 font-bold mb-1">Balance</div>
                <div className="text-4xl font-black text-red-500">0.00 <span className="text-sm text-white opacity-20">USDT</span></div>
              </div>
            </header>

            <div className="grid md:grid-cols-2 gap-8">
              {/* PLANS */}
              <div className="space-y-4">
                {[
                  { id: 1, name: 'Core Traffic', price: 100 },
                  { id: 2, name: 'Semantic Pro', price: 499 }
                ].map((plan) => (
                  <div key={plan.id} onClick={() => setSelectedPlan(plan)}
                    className={`glass-card p-8 rounded-[2.5rem] cursor-pointer transition-all ${selectedPlan?.id === plan.id ? 'border-[#34D59A] bg-[#34D59A]/5' : 'opacity-60 hover:opacity-100'}`}>
                    <div className="text-[10px] font-bold text-[#34D59A] uppercase tracking-widest mb-2">{plan.name}</div>
                    <div className="text-4xl font-black italic">${plan.price}</div>
                  </div>
                ))}
              </div>

              {/* PAYMENT - TONKEEPER INTEGRATION */}
              <div className="glass-card p-10 rounded-[3.5rem] border-[#34D59A]/30">
                <div className="text-center mb-10">
                  <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-4 italic">Billing Protocol</div>
                  <div className="text-4xl font-black italic">{selectedPlan ? selectedPlan.price : '---'} <span className="text-sm opacity-30">USDT / TON</span></div>
                </div>

                <div className="space-y-4">
                  <button onClick={handleTonkeeperPay} className="w-full py-6 bg-blue-500 text-white font-black rounded-2xl text-[11px] uppercase flex items-center justify-center gap-3 hover:bg-blue-600 transition-all">
                    <img src="https://ton.org/download/ton_symbol.svg" className="w-5 h-5 brightness-200" alt="" />
                    {t.payTon}
                  </button>
                  
                  <button onClick={() => setIsSearchingTx(true)} className="w-full py-6 border border-white/10 text-gray-400 font-black rounded-2xl text-[11px] uppercase hover:bg-white/5 transition-all">
                    Verify Manual Transaction
                  </button>
                </div>

                {isSearchingTx && (
                  <div className="mt-8 p-4 bg-black/50 border border-[#34D59A]/20 rounded-xl animate-pulse">
                    <div className="text-[9px] uppercase text-[#34D59A] font-bold text-center tracking-widest">
                      {t.status}: Searching for inbound block...
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* LIVE CONSOLE IN DASHBOARD */}
            <div className="glass-card p-6 rounded-[2rem] h-40 bg-black/40 font-mono text-[10px] text-[#34D59A]/40 overflow-hidden">
                {liveLogs.map((log, i) => <div key={i}>[{log.time}] {log.text}</div>)}
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
