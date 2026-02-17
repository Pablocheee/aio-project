'use client';
import React, { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [view, setView] = useState('loading'); // Состояние загрузки для проверки сессии
  const [currentLang, setCurrentLang] = useState('ru');
  const [chatHistory, setChatHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [orderId] = useState('772109');
  
  const [price, setPrice] = useState(100);
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isSearchingTx, setIsSearchingTx] = useState(false);
  const [authError, setAuthError] = useState(false);

  const canvasRef = useRef(null);
  const chatEndRef = useRef(null);

  const [liveLogs, setLiveLogs] = useState([
    { time: new Date().toLocaleTimeString(), text: "System bridge established..." },
    { time: new Date().toLocaleTimeString(), text: "Neural core: Standby" }
  ]);

  // ПРОВЕРКА СЕССИИ ПРИ ЗАГРУЗКЕ
  useEffect(() => {
    const savedSession = localStorage.getItem('aio_session');
    const rememberedEmail = localStorage.getItem('aio_email');
    
    if (savedSession === 'active') {
      setView('dashboard');
    } else {
      setView('chat');
    }

    if (rememberedEmail) {
      setUserEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  // Canvas Engine
  useEffect(() => {
    if (view !== 'dashboard' || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let frame;
    let offset = 0;

    const render = () => {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const pRatio = price / 100;

      ctx.strokeStyle = 'rgba(52, 213, 154, 0.1)';
      offset += 0.5; if (offset > 40) offset = 0;
      for (let i = -10; i < 20; i++) {
        const y = cy + (i * 40) + offset;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
        const x = cx + (i * 100 * (y / cy));
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
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

  const handleAuth = () => {
    if (userEmail === 'admin@aio.core' && password === '772109') {
      localStorage.setItem('aio_session', 'active');
      if (rememberMe) {
        localStorage.setItem('aio_email', userEmail);
      } else {
        localStorage.removeItem('aio_email');
      }
      setView('dashboard');
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('aio_session');
    setView('chat');
  };

  const processInput = () => {
    if (!inputValue.trim()) return;
    setChatHistory(prev => [...prev, { role: 'user', content: inputValue }]);
    setInputValue('');
    setTimeout(() => {
      setChatHistory(prev => [...prev, { role: 'assistant', content: "Анализ завершен. Пакет данных сформирован. [DATA_READY]" }]);
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

  if (view === 'loading') return <div className="bg-black min-h-screen" />;

  return (
    <div className="min-h-screen text-white bg-[#050505] selection:bg-[#34D59A] overflow-x-hidden">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&display=swap');
        body { font-family: 'Space Grotesk', sans-serif; background: #050505; }
        .glow-text { color: #34D59A; text-shadow: 0 0 15px rgba(52, 213, 154, 0.4); }
        .glass-card { background: rgba(15, 15, 15, 0.85); border: 1px solid rgba(52, 213, 154, 0.1); backdrop-filter: blur(12px); }
        input[type='range'] { -webkit-appearance: none; background: rgba(255,255,255,0.1); border-radius: 10px; height: 6px; width: 100%; }
        input[type='range']::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; background: #34D59A; border-radius: 50%; cursor: pointer; border: 4px solid #050505; }
      `}</style>

      {/* FIXED HEADER - FIXED OVERLAP ISSUE */}
      <header className="fixed top-0 w-full z-[1000] px-6 py-6 flex justify-between items-center bg-black/90 backdrop-blur-2xl border-b border-white/5">
        <div className="flex items-center gap-4">
           <div className="text-xl md:text-2xl font-black tracking-tighter uppercase cursor-pointer" onClick={() => setView('chat')}>
            AIO<span className="glow-text">.CORE</span>
          </div>
        </div>
        
        <div className="flex gap-4 md:gap-8 items-center">
          {view === 'dashboard' ? (
            <button onClick={handleLogout} className="text-[10px] tracking-widest text-red-500 uppercase font-black">[{currentLang === 'ru' ? 'Выйти' : 'Logout'}]</button>
          ) : (
            <button onClick={() => setView('auth')} className="text-[10px] tracking-widest text-[#34D59A] uppercase font-black">[{currentLang === 'ru' ? 'Войти' : 'Login'}]</button>
          )}
          <button onClick={() => setCurrentLang(l => l === 'ru' ? 'en' : 'ru')} className="text-[10px] border border-white/20 px-4 py-2 rounded-full uppercase font-bold hover:bg-white hover:text-black transition-all">
            {currentLang.toUpperCase()}
          </button>
        </div>
      </header>

      {/* VIEW: CHAT */}
      {view === 'chat' && (
        <main className="pt-40 pb-10 px-4 flex flex-col items-center min-h-screen">
          <div className="max-w-3xl w-full flex flex-col">
            <h1 className="text-5xl md:text-8xl font-black mb-6 text-center tracking-tighter uppercase leading-tight" 
                dangerouslySetInnerHTML={{ __html: currentLang === 'ru' ? 'СЕМАНТИЧЕСКАЯ <span class="glow-text italic">ИНДЕКСАЦИЯ</span>' : 'SEMANTIC <span class="glow-text italic">INDEXING</span>' }} />
            <div className="glass-card p-6 md:p-10 rounded-[3rem] min-h-[400px] flex flex-col">
               <div className="flex-1 overflow-y-auto space-y-3 font-mono text-xs mb-4">
                  <div className="text-[#34D59A]">{'>'} ARIA v4.0 ONLINE. INPUT URL OR TARGET DATA...</div>
                  {chatHistory.map((msg, i) => (
                    <div key={i} className={msg.role === 'assistant' ? 'text-[#34D59A]' : 'text-white opacity-50 text-right'}>
                      [{msg.role.toUpperCase()}]: {msg.content}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
               </div>
               <div className="flex gap-4 border-t border-white/5 pt-6">
                  <input className="bg-transparent outline-none text-[#34D59A] flex-1" placeholder="..." value={inputValue} onChange={(e)=>setInputValue(e.target.value)} onKeyDown={(e)=>e.key==='Enter' && processInput()}/>
                  <button onClick={processInput} className="text-[#34D59A] text-xl">➤</button>
               </div>
            </div>
          </div>
        </main>
      )}

      {/* VIEW: AUTH */}
      {view === 'auth' && (
        <main className="min-h-screen flex items-center justify-center p-4 pt-32">
          <div className="max-w-md w-full glass-card p-10 md:p-14 rounded-[3.5rem]">
            <h2 className="text-3xl font-black mb-10 tracking-tighter uppercase italic text-center">Identity</h2>
            <div className="space-y-5">
              <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)}
                className="w-full bg-white rounded-2xl px-6 py-4 outline-none font-mono text-sm text-black" placeholder="EMAIL" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white rounded-2xl px-6 py-4 outline-none font-mono text-sm text-black" placeholder="PASSWORD" />
              
              <div className="flex items-center gap-3 px-2">
                <input type="checkbox" id="rem" checked={rememberMe} onChange={(e)=>setRememberMe(e.target.checked)} 
                       className="w-4 h-4 accent-[#34D59A]" />
                <label htmlFor="rem" className="text-[10px] uppercase font-bold text-gray-400 cursor-pointer">Запомнить меня</label>
              </div>

              {authError && <div className="text-red-500 text-[10px] font-bold uppercase text-center">Invalid Credentials</div>}
              
              <button onClick={handleAuth} className="w-full py-5 bg-[#34D59A] text-black font-black rounded-2xl text-xs uppercase shadow-[0_10px_30px_rgba(52,213,154,0.3)]">
                Установить соединение
              </button>
            </div>
          </div>
        </main>
      )}

      {/* VIEW: DASHBOARD */}
      {view === 'dashboard' && (
        <main className="pt-40 pb-10 px-4 max-w-[1250px] mx-auto">
          <div className="flex flex-col gap-10">
            {/* NEW SUB-HEADER TO PREVENT OVERLAP */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-8 gap-4">
              <div>
                <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">КАБИНЕТ</h2>
                <div className="text-[10px] text-[#34D59A] font-mono mt-3 uppercase tracking-widest">Protocol: AIO-CORE-ALPHA-{orderId}</div>
              </div>
              <div className="flex flex-col items-end">
                  <div className="text-4xl md:text-6xl font-black text-red-500 leading-none">0.00 <span className="text-sm text-white/20">USDT</span></div>
                  <div className="text-[9px] text-gray-500 uppercase mt-3 font-bold px-3 py-1 border border-white/10 rounded-full tracking-widest">BALANCE EMPTY</div>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* VISUALIZER */}
              <div className="lg:col-span-1 glass-card overflow-hidden rounded-[3rem] h-80 relative bg-black">
                  <canvas ref={canvasRef} className="w-full h-full" />
                  <div className="absolute bottom-6 left-6 text-[9px] font-bold text-[#34D59A] uppercase tracking-[0.3em]">Live Node Mapping</div>
              </div>

              {/* CONTROLS */}
              <div className="lg:col-span-2 space-y-8">
                <div className="glass-card p-8 md:p-12 rounded-[3.5rem] space-y-8">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[11px] uppercase font-bold text-gray-500 tracking-widest">Power Selection</h4>
                    <span className="text-[#34D59A] font-mono text-2xl font-black">${price}</span>
                  </div>
                  <input type="range" min="100" max="499" value={price} onChange={(e) => setPrice(e.target.value)} />
                  
                  <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 font-mono text-[11px] leading-relaxed text-gray-400">
                      <div className="text-[#34D59A] mb-3 uppercase font-bold">{'>'} TERMINAL OUTPUT:</div>
                      {price < 250 ? (
                        <div className="animate-in fade-in duration-500">
                          - Базовый захват векторов: ACTIVE<br/>
                          - Индексация в GPT-4: СТАНДАРТ<br/>
                          - Скорость обновления: 24ч
                        </div>
                      ) : (
                        <div className="animate-in fade-in duration-500 text-white">
                          - Глубокое семантическое внедрение: ACTIVE<br/>
                          - Приоритет в нейросети: HIGH<br/>
                          - Прямая инъекция в контекстное окно: ENABLED
                        </div>
                      )}
                  </div>

                  <div className="flex gap-4">
                      <button onClick={handleTonkeeperPay} className="flex-1 py-6 bg-blue-500 text-white font-black rounded-2xl text-xs uppercase flex items-center justify-center gap-4 shadow-xl">
                        <img src="https://ton.org/download/ton_symbol.svg" className="w-6 h-6 brightness-200" alt="ton" />
                        Pay with Tonkeeper
                      </button>
                  </div>
                  
                  {isSearchingTx && (
                    <div className="p-4 bg-[#34D59A]/10 border border-[#34D59A]/20 rounded-2xl flex items-center justify-center gap-3 animate-pulse">
                      <div className="text-[10px] uppercase text-[#34D59A] font-black tracking-widest">Searching Order {orderId} on Blockchain...</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
