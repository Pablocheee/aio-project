'use client';
import React, { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [view, setView] = useState('chat'); // 'chat', 'auth', 'dashboard'
  const [currentLang, setCurrentLang] = useState('ru');
  const [chatHistory, setChatHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [liveLogs, setLiveLogs] = useState([{ time: new Date().toLocaleTimeString(), text: "System initialized..." }]);
  const [orderId, setOrderId] = useState('');
  
  // Новые стейты для Auth и Кабинета
  const [userEmail, setUserEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedPlan, setSelectedPlan] = useState(null);

  const chatEndRef = useRef(null);

  const translations = {
    ru: { 
      title: 'СЕМАНТИЧЕСКАЯ <span class="glow-text italic">ИНДЕКСАЦИЯ</span>', 
      desc: 'Автономный протокол интеграции данных в нейросети.', 
      place: 'Введите сообщение...',
      btn: 'RU',
      login: 'Войти',
      reg: 'Регистрация',
      cabinetTitle: 'CONTROL PANEL',
      status: 'СТАТУС: ОЖИДАНИЕ ОПЛАТЫ',
      copy: 'Копировать адрес'
    },
    en: { 
      title: 'SEMANTIC <span class="glow-text italic">INDEXING</span>', 
      desc: 'Autonomous protocol for data integration into LLM contexts.', 
      place: 'Type a message...',
      btn: 'EN',
      login: 'Login',
      reg: 'Sign Up',
      cabinetTitle: 'CONTROL PANEL',
      status: 'STATUS: AWAITING PAYMENT',
      copy: 'Copy address'
    }
  };

  useEffect(() => {
    const logLines = ["Scanning neural nodes...", "Vectorizing input stream...", "RAG layer synchronization: 98%", "Latency check: 24ms", "Semantic weights adjusted", "LLM context window optimized", "Encrypted TRC20 bridge: Ready"];
    const interval = setInterval(() => {
      setLiveLogs(prev => {
        const newLog = { time: new Date().toLocaleTimeString(), text: logLines[Math.floor(Math.random() * logLines.length)] };
        return [...prev, newLog].slice(-5);
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

    // Авто-подхват email если пользователь его ввел в чате
    const foundEmail = userMsg.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (foundEmail) setUserEmail(foundEmail[0]);

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
        setTimeout(() => setView('auth'), 1500); 
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
    <div className="min-h-screen text-white relative overflow-x-hidden bg-[#050505]">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&display=swap');
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
        .sidebar-item:hover { background: rgba(52, 213, 154, 0.05); color: #34D59A; }
        .active-tab { background: rgba(52, 213, 154, 0.1); color: #34D59A; border-right: 2px solid #34D59A; }
      `}</style>

      {/* HEADER */}
      <header className="fixed top-0 w-full z-[300] p-6 flex justify-between items-center backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-8">
          <div className="text-2xl font-bold tracking-tighter uppercase cursor-pointer" onClick={() => setView('chat')}>
            AIO<span className="glow-text">.CORE</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => setView('auth')} className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-[#34D59A] transition-colors">
            {translations[currentLang].login}
          </button>
          <button onClick={() => setCurrentLang(l => l === 'ru' ? 'en' : 'ru')} className="text-[10px] border border-white/10 px-4 py-2 rounded-full uppercase hover:bg-white hover:text-black transition-all">
            {translations[currentLang].btn}
          </button>
        </div>
      </header>

      {/* VIEW: CHAT & LANDING */}
      {view === 'chat' && (
        <div className="min-h-screen flex flex-col pt-24 animate-in fade-in duration-700">
          <main className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
            <section className="text-center mb-12">
              <h1 className="text-5xl md:text-8xl font-bold mb-6 uppercase tracking-tighter leading-none" 
                  dangerouslySetInnerHTML={{ __html: translations[currentLang].title }} />
              <p className="text-gray-500 text-sm max-w-xl mx-auto font-light tracking-wide">{translations[currentLang].desc}</p>
            </section>

            <section className="w-full max-w-2xl relative">
              {/* LIVE LOGS OVERLAY */}
              <div className="absolute -top-10 right-0 text-[9px] font-mono text-[#34D59A]/40 text-right hidden md:block">
                {liveLogs.map((log, i) => <div key={i}>[{log.time}] {log.text}</div>)}
              </div>
              
              <div className="glass-card p-8 rounded-[3rem] h-[480px] flex flex-col shadow-2xl relative overflow-hidden">
                <div className="flex-1 overflow-y-auto mb-4 pr-2 scrollbar-hide">
                  {chatHistory.length === 0 && (
                    <div className="bot-msg">{'>'} ARIA v2.0 Online. Укажите контекст вашего проекта.</div>
                  )}
                  {chatHistory.map((msg, i) => (
                    <div key={i} className={msg.role === 'assistant' ? 'bot-msg' : 'user-msg'}>
                      {msg.role === 'assistant' ? '● ' : ''}{msg.content}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center gap-4">
                  <input 
                    className="bg-transparent border-none border-b border-[#34D59A]/20 outline-none text-[#34D59A] flex-1 font-mono text-sm py-2 placeholder:text-gray-700"
                    placeholder={translations[currentLang].place}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && processInput()}
                  />
                  <button onClick={processInput} className="text-[#34D59A] text-xl hover:scale-110 transition-transform">➤</button>
                </div>
              </div>
            </section>
          </main>
        </div>
      )}

      {/* VIEW: AUTH (LOGIN/REG) */}
      {view === 'auth' && (
        <div className="min-h-screen flex items-center justify-center p-6 animate-in zoom-in-95 duration-500">
          <div className="glass-card w-full max-w-md p-10 rounded-[3rem] shadow-2xl">
            <h2 className="text-3xl font-bold mb-8 tracking-tighter uppercase italic text-center">Identity <span className="glow-text">Verification</span></h2>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] uppercase text-gray-500 ml-4 mb-2 block tracking-widest font-bold">Project Email</label>
                <input 
                  type="email" 
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#34D59A]/50 transition-colors font-mono text-[#34D59A]"
                  placeholder="name@domain.com"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase text-gray-500 ml-4 mb-2 block tracking-widest font-bold">Access Token</label>
                <input 
                  type="password" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#34D59A]/50 transition-colors font-mono"
                  placeholder="••••••••"
                />
              </div>
              <button 
                onClick={() => { setIsLoggedIn(true); setView('dashboard'); }}
                className="w-full py-5 bg-[#34D59A] text-black font-black rounded-2xl text-[11px] uppercase shadow-lg shadow-[#34D59A]/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Establish Connection
              </button>
              <div className="flex justify-between px-2">
                <button onClick={() => setView('chat')} className="text-[9px] text-gray-500 uppercase hover:text-white transition-colors">Back to Chat</button>
                <span className="text-[9px] text-gray-700 uppercase">Secure AES-256</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: DASHBOARD */}
      {view === 'dashboard' && (
        <div className="fixed inset-0 z-[500] bg-[#020202] flex animate-in slide-in-from-bottom-4 fade-in duration-700">
          {/* SAAS SIDEBAR */}
          <div className="w-72 border-r border-white/5 bg-black/40 backdrop-blur-3xl flex flex-col p-8 hidden lg:flex">
            <div className="text-xl font-bold tracking-tighter mb-16 italic uppercase">AIO<span className="glow-text">.CORE</span></div>
            
            <nav className="flex-1 space-y-1">
              <div className="text-[10px] uppercase text-gray-600 mb-6 tracking-[0.3em] font-bold">Terminal Interface</div>
              {['Overview', 'Neural Nodes', 'Semantic Map', 'Context Bridge', 'Settings'].map((item) => (
                <button 
                  key={item}
                  onClick={() => setActiveTab(item)}
                  className={`w-full text-left text-[11px] uppercase p-4 rounded-xl transition-all font-medium tracking-widest sidebar-item ${activeTab === item ? 'active-tab' : 'text-gray-500'}`}
                >
                  {item}
                </button>
              ))}
            </nav>

            <div className="pt-8 border-t border-white/5">
              <div className="glass-card p-4 rounded-2xl border-orange-500/20">
                <div className="text-[9px] uppercase text-orange-500 mb-2 font-bold tracking-widest">Subscription Required</div>
                <div className="text-[10px] text-gray-400 leading-tight italic">Protocol in standby mode. Indexing halted.</div>
              </div>
            </div>
          </div>

          {/* DASHBOARD CONTENT */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-black/10">
              <div className="flex items-center gap-6">
                <div className="flex items-center">
                  <span className="status-pulse"></span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">Core Status: <span className="text-white italic">Linked</span></span>
                </div>
                <div className="h-4 w-[1px] bg-white/10"></div>
                <div className="text-[10px] text-gray-500 font-mono">UID: {orderId || '772109'}-STABLE</div>
              </div>
              <div className="flex items-center gap-4">
                 <button onClick={() => setView('chat')} className="text-[10px] uppercase text-gray-500 hover:text-white transition-colors">Terminate</button>
                 <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#34D59A] to-emerald-900 flex items-center justify-center text-[10px] font-bold">
                   {userEmail ? userEmail[0].toUpperCase() : 'U'}
                 </div>
              </div>
            </header>

            <main className="p-10 max-w-6xl w-full mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                <div>
                  <h2 className="text-5xl font-bold tracking-tighter uppercase italic">{activeTab}</h2>
                  <p className="text-[#34D59A] text-[10px] font-mono mt-2 uppercase tracking-[0.2em]">Live Data Stream for: {userEmail || 'Anonymous_Node'}</p>
                </div>
                <div className="glass-card px-8 py-6 rounded-[2rem] border-[#34D59A]/30">
                  <div className="text-[10px] uppercase text-gray-500 mb-1 font-bold tracking-widest text-right">Account Balance</div>
                  <div className="text-3xl font-bold italic">0.00 <span className="text-sm font-normal opacity-30 text-white">USDT</span></div>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* МОНИТОРИНГ & ГРАФИКИ */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="glass-card p-8 rounded-[3rem]">
                    <div className="flex justify-between items-center mb-8">
                      <h4 className="text-[12px] uppercase font-bold text-gray-400 tracking-widest">Semantic Weights Distribution</h4>
                      <span className="text-[10px] text-[#34D59A] font-mono">Real-time update</span>
                    </div>
                    {/* Визуализация графика */}
                    <div className="flex items-end gap-2 h-40">
                      {[40, 70, 45, 90, 65, 80, 35, 100, 55, 85].map((h, i) => (
                        <div key={i} className="flex-1 bg-white/5 rounded-t-lg relative group overflow-hidden">
                          <div 
                            className="absolute bottom-0 w-full bg-[#34D59A]/40 transition-all duration-1000" 
                            style={{ height: `${h}%` }}
                          ></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="glass-card p-6 rounded-3xl border-l-4 border-[#34D59A]">
                      <div className="text-[10px] text-gray-500 uppercase mb-2 font-bold tracking-widest">Visibility Score</div>
                      <div className="text-3xl font-bold italic tracking-tighter">0.0%</div>
                    </div>
                    <div className="glass-card p-6 rounded-3xl border-l-4 border-blue-500">
                      <div className="text-[10px] text-gray-500 uppercase mb-2 font-bold tracking-widest">Neural Latency</div>
                      <div className="text-3xl font-bold italic tracking-tighter">14ms</div>
                    </div>
                  </div>
                  
                  {/* ТАБЛИЦА УЗЛОВ */}
                  <div className="glass-card rounded-[2.5rem] overflow-hidden">
                    <div className="p-6 border-b border-white/5 text-[11px] uppercase font-bold text-gray-400 tracking-widest">Active Neural Nodes</div>
                    <div className="p-2">
                      {[
                        { id: 'Node-A1', loc: 'Frankfurt', load: '0%' },
                        { id: 'Node-U5', loc: 'Virginia', load: '0%' },
                        { id: 'Node-S9', loc: 'Singapore', load: '0%' }
                      ].map((node) => (
                        <div key={node.id} className="flex items-center justify-between p-4 hover:bg-white/5 rounded-xl transition-colors">
                          <span className="text-[11px] font-mono text-[#34D59A]">{node.id}</span>
                          <span className="text-[10px] text-gray-500 uppercase">{node.loc}</span>
                          <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest">Halted</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ПЛАТЕЖНЫЙ ТЕРМИНАЛ */}
                <div className="space-y-6">
                  <div className="glass-card p-8 rounded-[3rem] border-[#34D59A]/40 bg-[#34D59A]/[0.02]">
                    <div className="text-[12px] font-bold text-[#34D59A] uppercase mb-8 tracking-[0.3em] text-center">Activation Hub</div>
                    
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 gap-4">
                        {[
                          { id: 'L', name: 'LITE START', price: 100 },
                          { id: 'P', name: 'PRO BRIDGE', price: 499 }
                        ].map(plan => (
                          <div 
                            key={plan.id}
                            onClick={() => setSelectedPlan(plan.id)}
                            className={`p-5 rounded-2xl border cursor-pointer transition-all ${selectedPlan === plan.id ? 'border-[#34D59A] bg-[#34D59A]/10' : 'border-white/10 hover:border-white/30'}`}
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-bold tracking-widest">{plan.name}</span>
                              <span className="text-lg font-bold italic">${plan.price}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4">
                        <div className="text-[9px] uppercase text-gray-500 mb-2 font-bold tracking-widest">Destination Address (TRC20)</div>
                        <div className="bg-black/60 p-4 rounded-xl border border-white/5 cursor-pointer group relative overflow-hidden" onClick={copyWallet}>
                          <code className="text-[10px] text-[#34D59A] break-all block leading-relaxed font-mono">UQAVTMHfwYcMn7ttJNXiJVaoA-jjRTeJHc2sjpkAVzc84oSY</code>
                          <div className="absolute inset-0 bg-[#34D59A] opacity-0 group-hover:opacity-10 transition-opacity"></div>
                        </div>
                      </div>

                      <button onClick={copyWallet} className="w-full py-5 bg-[#34D59A] text-black font-black rounded-2xl text-[11px] uppercase shadow-xl hover:shadow-[#34D59A]/20 transition-all">
                        Verify Transaction
                      </button>
                      <p className="text-[9px] text-gray-600 text-center uppercase tracking-widest font-medium italic">
                        System waits for 1 network confirmation
                      </p>
                    </div>
                  </div>

                  {/* КОНСОЛЬ ЛОГОВ ВНУТРИ КАБИНЕТА */}
                  <div className="glass-card p-6 rounded-[2rem] bg-black/80 border-white/5 h-48 flex flex-col">
                    <div className="text-[9px] uppercase text-gray-600 mb-4 font-bold tracking-widest flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                       Live Console
                    </div>
                    <div className="flex-1 overflow-hidden font-mono text-[9px] space-y-1 opacity-50">
                      {liveLogs.map((log, i) => (
                        <div key={i} className="whitespace-nowrap overflow-hidden text-ellipsis">
                          <span className="text-[#34D59A] mr-2">[{log.time}]</span>
                          {log.text}
                        </div>
                      ))}
                    </div>
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
