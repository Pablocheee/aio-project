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
  const [authError, setAuthError] = useState(false);

  const canvasRef = useRef(null);
  const chatEndRef = useRef(null);

  const [liveLogs, setLiveLogs] = useState([
    { time: new Date().toLocaleTimeString(), text: "System bridge established..." },
    { time: new Date().toLocaleTimeString(), text: "Neural core: Standby" }
  ]);

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

  // 3D Canvas Engine
  useEffect(() => {
    if (view !== 'dashboard' || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let frame;
    let offset = 0;

    const render = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const pRatio = price / 100;

      // Сетка
      ctx.strokeStyle = 'rgba(52, 213, 154, 0.1)';
      offset += 0.5;
      if (offset > 40) offset = 0;
      for (let i = -10; i < 20; i++) {
        const y = cy + (i * 40) + offset;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
        const x = cx + (i * 100 * (y / cy));
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      // Купол
      const grad = ctx.createRadialGradient(cx, canvas.height, 0, cx, canvas.height, 200 * pRatio);
      grad.addColorStop(0, 'rgba(52, 213, 154, 0.2)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.ellipse(cx, canvas.height, 250 * pRatio, 150 * pRatio, 0, 0, Math.PI * 2); ctx.fill();
      frame = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(frame);
  }, [view, price]);

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

  const handleAuth = () => {
    // ЖЕСТКАЯ ПРОВЕРКА
    if (userEmail === 'admin@aio.core' && password === '772109') {
      setView('dashboard');
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

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
        .glass-card { background: rgba(15, 15, 15, 0.85); border: 1px solid rgba(52, 213, 154, 0.1); backdrop-filter: blur(12px); }
        .bot-msg { color: #34D59A; font-family: monospace; font-size: 12px; margin-bottom: 12px; border-left: 2px solid #34D59A; padding-left: 10px; }
        .user-msg { color: #fff; font-family: monospace; font-size: 12px; opacity: 0.5; margin-bottom: 12px; text-align: right; border-right: 2px solid rgba(255,255,255,0.1); padding-right: 10px; }
        input[type='range'] { -webkit-appearance: none; background: rgba(255,255,255,0.1); border-radius: 10px; height: 6px; width: 100%; }
        input[type='range']::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; background: #34D59A; border-radius: 50%; cursor: pointer; border: 4px solid #050505; box-shadow: 0 0 15px rgba(52,213,154,0.3); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>

      {/* HEADER */}
      <header className="fixed top-0 w-full z-[1000] px-6 py-5 flex justify-between items-center bg-black/80 backdrop-blur-2xl border-b border-white/5">
        <div className="text-xl md:text-2xl font-black tracking-tighter uppercase cursor-pointer" onClick={() => setView('chat')}>
          AIO<span className="glow-text">.CORE</span>
        </div>
        <div className="flex gap-8 items-center">
          <button onClick={() => setView(view === 'dashboard' ? 'chat' : 'auth')} className="text-[10px] tracking-[0.2em] text-[#34D59A] hover:opacity-70 uppercase font-black">
            [{view === 'dashboard' ? t.logout : t.login}]
          </button>
          <button onClick={() => setCurrentLang(l => l === 'ru' ? 'en' : 'ru')} className="text-[10px] border border-white/20 px-4 py-2 rounded-full uppercase font-bold hover:bg-white hover:text-black transition-all">
            {currentLang === 'ru' ? 'EN' : 'RU'}
          </button>
        </div>
      </header>

      {/* VIEW: CHAT */}
      {view === 'chat' && (
        <main className="pt-32 pb-10 px-4 flex flex-col items-center min-h-screen">
          <div className="max-w-3xl w-full flex flex-col h-full">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter uppercase leading-tight" dangerouslySetInnerHTML={{ __html: t.title }} />
              <p className="text-gray-500 text-xs md:text-sm tracking-[0.3em] uppercase font-light px-4">{t.desc}</p>
            </div>

            <div className="w-full mb-4 glass-card p-4 rounded-3xl bg-black/40 border-[#34D59A]/20">
              <div className="font-mono text-[10px] text-[#34D59A]/60 flex flex-col gap-1">
                {liveLogs.map((log, i) => <div key={i} className="truncate">[{log.time}] {log.text}</div>)}
              </div>
            </div>

            <div className="glass-card p-6 md:p-10 rounded-[3rem] flex flex-col relative overflow-hidden flex-1 min-h-[450px]">
              <div className="flex-1 overflow-y-auto mb-4 space-y-2 scrollbar-hide">
                {chatHistory.length === 0 && <div className="bot-msg">{'>'} ARIA v4.0 READY. URL?</div>}
                {chatHistory.map((msg, i) => (
                  <div key={i} className={msg.role === 'assistant' ? 'bot-msg' : 'user-msg'}>{msg.content}</div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div className="flex gap-4 items-center border-t border-white/5 pt-6">
                <input className="bg-transparent outline-none text-[#34D59A] flex-1 font-mono text-base placeholder:text-gray-800"
                  placeholder={t.place} value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && processInput()} />
                <button onClick={processInput} className="text-[#34D59A] text-2xl">➤</button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* VIEW: AUTH */}
      {view === 'auth' && (
        <main className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-card p-10 md:p-14 rounded-[3.5rem] animate-in fade-in zoom-in-95">
            <h2 className="text-3xl font-black mb-10 tracking-tighter uppercase italic text-center">Identity</h2>
            <div className="space-y-5">
              <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)}
                className="w-full bg-white rounded-2xl px-6 py-4 outline-none font-mono text-sm text-black" placeholder="EMAIL" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white rounded-2xl px-6 py-4 outline-none font-mono text-sm text-black" placeholder="PASSWORD" />
              {authError && <div className="text-red-500 text-[10px] font-bold uppercase text-center">Access Denied: Invalid Credentials</div>}
              <button onClick={handleAuth} className="w-full py-5 bg-[#34D59A] text-black font-black rounded-2xl text-xs uppercase shadow-[0_10px_30px_rgba(52,213,154,0.3)] hover:scale-[1.02] active:scale-95 transition-all">
                {t.authBtn}
              </button>
            </div>
            <div className="mt-8 text-center text-[9px] text-gray-600 uppercase tracking-widest leading-loose">
                Hint: admin@aio.core / 772109
            </div>
          </div>
        </main>
      )}

      {/* VIEW: DASHBOARD */}
      {view === 'dashboard' && (
        <main className="pt-32 pb-10 px-4 max-w-[1250px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-10">
            
            <div className="hidden lg:flex flex-col w-72 space-y-4">
              <div className="glass-card p-8 rounded-[2.5rem] border-[#34D59A]/30">
                <div className="text-[10px] text-gray-500 uppercase font-bold mb-3 tracking-widest">Global Status</div>
                <div className="text-3xl font-black italic tracking-tighter">14.2K <span className="text-[10px] text-[#34D59A]">NODES</span></div>
                <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#34D59A] w-2/3 animate-pulse"></div>
                </div>
              </div>
              
              <div className="glass-card overflow-hidden rounded-[2.5rem] h-64 relative bg-black">
                  <canvas ref={canvasRef} className="w-full h-full" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent pointer-events-none" />
                  <div className="absolute bottom-6 left-6">
                      <div className="text-[9px] font-bold text-[#34D59A] uppercase tracking-[0.3em]">Neural Vision</div>
                  </div>
              </div>
            </div>

            <div className="flex-1 space-y-8">
              <header className="flex justify-between items-start md:items-end border-b border-white/5 pb-8">
                <div>
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">{t.cabinet}</h2>
                  <div className="text-[10px] text-[#34D59A] font-mono mt-3 uppercase tracking-widest">Protocol: AIO-CORE-ALPHA-{orderId}</div>
                </div>
                <div className="text-right">
                    <div className="text-3xl md:text-5xl font-black text-red-500 leading-none">0.00 <span className="text-sm text-white/20">USDT</span></div>
                    <div className="text-[9px] text-gray-500 uppercase mt-2 font-bold">Balance Empty</div>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-card p-8 md:p-12 rounded-[3.5rem] space-y-8">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[11px] uppercase font-bold text-gray-500 tracking-[0.3em]">Power Select</h4>
                    <span className="text-[#34D59A] font-mono text-xl font-black">${price}</span>
                  </div>
                  <input type="range" min="100" max="499" value={price} onChange={(e) => setPrice(e.target.value)} />
                  
                  <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 font-mono text-[10px] leading-relaxed text-gray-400">
                      <div className="text-[#34D59A] mb-2 uppercase font-bold tracking-widest">{'>'} Core Configuration:</div>
                      {price < 200 ? "- Standard context capture\n- Single LLM priority\n- Latency: 120ms" : 
                       price < 400 ? "- Advanced semantic mapping\n- Multi-agent sync active\n- Deep RAG indexing" : 
                       "- Full Neural Override\n- Real-time GPT-4o context capture\n- Zero latency bridge"}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center transition-all">
                      <div className="text-[9px] text-gray-500 uppercase mb-1">{t.nodes}</div>
                      <div className="text-2xl font-black italic">{Math.floor(price * 12.5)}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                      <div className="text-[9px] text-gray-500 uppercase mb-1">Impact</div>
                      <div className="text-2xl font-black italic">{(price / 4.5).toFixed(1)}%</div>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-8 md:p-12 rounded-[3.5rem] border-blue-500/20 bg-blue-500/[0.02] flex flex-col justify-between">
                  <div className="text-center">
                    <div className="text-[11px] text-gray-500 uppercase font-black mb-2 tracking-widest italic opacity-50">Secure Payment</div>
                    <div className="text-5xl md:text-7xl font-black italic tracking-tighter">{price} <span className="text-xl opacity-20 text-white">USDT</span></div>
                  </div>
                  
                  <div className="space-y-4">
                      <button onClick={handleTonkeeperPay} className="w-full py-6 bg-blue-500 text-white font-black rounded-2xl text-xs uppercase flex items-center justify-center gap-4 shadow-[0_15px_40px_rgba(59,130,246,0.3)] hover:scale-[1.02] active:scale-95 transition-all">
                        <img src="https://ton.org/download/ton_symbol.svg" className="w-6 h-6 brightness-200" alt="ton" />
                        {t.payTon}
                      </button>
                      
                      {isSearchingTx && (
                        <div className="p-4 bg-black/80 border border-[#34D59A]/20 rounded-2xl flex items-center justify-center gap-3 animate-pulse">
                          <div className="w-2 h-2 rounded-full bg-[#34D59A]"></div>
                          <div className="text-[10px] uppercase text-[#34D59A] font-black tracking-widest">Searching Transaction...</div>
                        </div>
                      )}
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 rounded-[2rem] h-32 bg-black/60 font-mono text-[10px] text-[#34D59A]/50 overflow-hidden flex flex-col gap-1">
                  <div className="text-[#34D59A] opacity-100 mb-1 tracking-widest font-bold">LIVE_TERMINAL_FEED:</div>
                  {liveLogs.map((log, i) => <div key={i} className="truncate">[{log.time}] {log.text}</div>)}
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
