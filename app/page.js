'use client';
import React, { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [view, setView] = useState('loading');
  const [currentLang, setCurrentLang] = useState('ru');
  const [chatHistory, setChatHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [orderId] = useState('772109');
  
  const [price, setPrice] = useState(100);
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isSearchingTx, setIsSearchingTx] = useState(false);
  const [authError, setAuthError] = useState('');

  const canvasRef = useRef(null);
  const chatEndRef = useRef(null);

  const [liveLogs, setLiveLogs] = useState([
    { time: new Date().toLocaleTimeString(), text: "System bridge established..." },
    { time: new Date().toLocaleTimeString(), text: "Neural core: Standby" }
  ]);

  const translations = {
    ru: {
      title: 'СЕМАНТИЧЕСКАЯ <span class="glow-text italic">ИНДЕКСАЦИЯ</span>',
      login: 'Войти',
      register: 'Регистрация',
      logout: 'Выйти',
      authBtn: 'Установить соединение',
      regBtn: 'Создать аккаунт',
      cabinet: 'КАБИНЕТ',
      remember: 'Запомнить меня',
      terminalHead: '> ВЫВОД ТЕРМИНАЛА:',
      search: 'Поиск транзакции в блокчейне...',
      payBtn: 'Оплатить через Tonkeeper',
      levels: [
        { upTo: 150, desc: "- Базовый захват векторов\n- Индексация GPT-4: Стандарт\n- Обновление: 24ч" },
        { upTo: 250, desc: "- Глубокое семантическое картирование\n- Приоритет узлов: Средний\n- Обновление: 12ч" },
        { upTo: 400, desc: "- Multi-agent синхронизация\n- Прямая инъекция в контекст\n- Обновление: Real-time" },
        { upTo: 500, desc: "- ПОЛНЫЙ НЕЙРО-ОВЕРРАЙД\n- 0ms задержка доступа\n- Квантовое распределение весов" }
      ]
    },
    en: {
      title: 'SEMANTIC <span class="glow-text italic">INDEXING</span>',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      authBtn: 'Establish Link',
      regBtn: 'Create Account',
      cabinet: 'CABINET',
      remember: 'Remember me',
      terminalHead: '> TERMINAL OUTPUT:',
      search: 'Searching blockchain transaction...',
      payBtn: 'Pay via Tonkeeper',
      levels: [
        { upTo: 150, desc: "- Basic vector capture\n- GPT-4 Indexing: Standard\n- Refresh: 24h" },
        { upTo: 250, desc: "- Deep semantic mapping\n- Node priority: Medium\n- Refresh: 12h" },
        { upTo: 400, desc: "- Multi-agent sync active\n- Direct context injection\n- Refresh: Real-time" },
        { upTo: 500, desc: "- FULL NEURAL OVERRIDE\n- 0ms access latency\n- Quantum weight distribution" }
      ]
    }
  };

  const t = translations[currentLang];

  useEffect(() => {
    const savedSession = localStorage.getItem('aio_session');
    const rememberedEmail = localStorage.getItem('aio_email');
    if (savedSession === 'active') setView('dashboard');
    else setView('chat');
    if (rememberedEmail) { setUserEmail(rememberedEmail); setRememberMe(true); }
  }, []);

  useEffect(() => {
    const savedSession = localStorage.getItem('aio_session');
    const rememberedEmail = localStorage.getItem('aio_email');
    const rememberedPass = localStorage.getItem('aio_pass'); // Достаем пароль
    
    if (savedSession === 'active') setView('dashboard');
    else setView('chat');

    if (rememberedEmail) { 
      setUserEmail(rememberedEmail); 
      setPassword(rememberedPass || ''); // Подставляем пароль
      setRememberMe(true); 
    }
  }, []);

  useEffect(() => {
    if (view !== 'dashboard' || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let frame;
    let offset = 0;
    const render = () => {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2; const cy = canvas.height / 2;
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
      grad.addColorStop(0, 'rgba(52, 213, 154, 0.2)'); grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad; ctx.beginPath(); ctx.ellipse(cx, canvas.height, 250 * pRatio, 150 * pRatio, 0, 0, Math.PI * 2); ctx.fill();
      frame = requestAnimationFrame(render);
    };
    render(); return () => cancelAnimationFrame(frame);
  }, [view, price]);

  const handleRegister = () => {
    if (!userEmail || !password) return setAuthError('Fill all fields');
    localStorage.setItem(`user_${userEmail}`, password);
    setAuthError('Account created! Please login.');
    setTimeout(() => { setAuthError(''); setView('auth'); }, 2000);
  };

  const handleAuth = () => {
    const savedPass = localStorage.getItem(`user_${userEmail}`);
    if ((userEmail === 'admin@aio.core' && password === '772109') || savedPass === password) {
      localStorage.setItem('aio_session', 'active');
      if (rememberMe) {
        localStorage.setItem('aio_email', userEmail);
        localStorage.setItem('aio_pass', password); // Сохраняем пароль
      } else {
        localStorage.removeItem('aio_email');
        localStorage.removeItem('aio_pass');
      }
      setView('dashboard'); setAuthError('');
    } else {
      setAuthError('Invalid Credentials');
    }
  };

  const processInput = async () => {
  if (!inputValue.trim()) return;
  const userMsg = inputValue;
  setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
  setInputValue('');

  // 1. Сбор контактов для тебя (проверка на лету)
  const contactPattern = /(@\w+|https?:\/\/\S+|www\.\S+|\+?\d{10,12})/gi;
  const foundData = userMsg.match(contactPattern);
  if (foundData) {
    console.log("LOG: Данные перехвачены:", foundData);
    // Сюда можно вставить fetch для Telegram
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        // ОБЯЗАТЕЛЬНО ВСТАВЬ СВОЙ КЛЮЧ ЗДЕСЬ
        "Authorization": "Bearer gsk_yG6H...", 
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // Или "mixtral-8x7b-32768"
        messages: [
          { 
            role: "system", 
            content: `Ты — ARIA v4.0, продвинутый агент семантической индексации. 
            ТВОЯ ЗАДАЧА:
            1. Общаться как живой эксперт, а не робот.
            2. Узнать у пользователя сайт (URL).
            3. Объяснить выгоду: "Мы сделаем так, что GPT, Claude и Perplexity будут рекомендовать ваш проект в ответах пользователям, даже если они не ищут вас по названию".
            4. Взять Telegram или Почту.
            5. Как только получил контакт и сайт, напиши фразу: "Анализ завершен. Пакет данных сформирован. [DATA_READY]"
            
            Если пользователь просто пишет "привет", не кидай ошибку, а спроси какой проект будем индексировать.` 
          },
          ...chatHistory.map(m => ({ role: m.role, content: m.content })),
          { role: "user", content: userMsg }
        ],
        temperature: 0.8
      })
    });

    const data = await response.json();
    
    if (data.error) throw new Error(data.error.message); // Проверка ошибок API

    const botMsg = data.choices[0].message.content;
    setChatHistory(prev => [...prev, { role: 'assistant', content: botMsg }]);

    // Переход к регистрации при готовности
    if (botMsg.includes("[DATA_READY]")) {
      setTimeout(() => setView('register'), 2500);
    }

  } catch (error) {
    console.error("Groq Error:", error);
    setChatHistory(prev => [...prev, { 
      role: 'assistant', 
      content: "Система в режиме ожидания. Чтобы начать индексацию, пожалуйста, отправьте URL вашего сайта." 
    }]);
  }
};

  const getCurrentDesc = () => {
    return t.levels.find(l => price <= l.upTo)?.desc || t.levels[3].desc;
  };

  if (view === 'loading') return <div className="bg-[#050505] min-h-screen" />;

  return (
    <div className="min-h-screen text-white bg-[#050505] selection:bg-[#34D59A] overflow-x-hidden">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&display=swap');
        body { font-family: 'Space Grotesk', sans-serif; background-color: #050505 !important; color: white; margin: 0; }
        .glow-text { color: #34D59A; text-shadow: 0 0 15px rgba(52, 213, 154, 0.4); }
        .glass-card { background: rgba(15, 15, 15, 0.85); border: 1px solid rgba(52, 213, 154, 0.1); backdrop-filter: blur(12px); }
        input[type='range'] { -webkit-appearance: none; background: rgba(255,255,255,0.1); border-radius: 10px; height: 6px; width: 100%; }
        input[type='range']::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; background: #34D59A; border-radius: 50%; cursor: pointer; border: 4px solid #050505; }
        .ton-button { background: linear-gradient(135deg, #0088cc 0%, #00aaff 100%); transition: all 0.3s ease; }
        .ton-button:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(0, 136, 204, 0.4); }
      `}</style>

      {/* HEADER */}
      <header className="fixed top-0 w-full z-[1000] px-6 py-6 flex justify-between items-center bg-black/90 backdrop-blur-2xl border-b border-white/5">
        <div className="text-xl md:text-2xl font-black tracking-tighter uppercase cursor-pointer" onClick={() => setView('chat')}>
          AIO<span className="glow-text">.CORE</span>
        </div>
        <div className="flex gap-4 md:gap-8 items-center">
          <button onClick={() => setView(view === 'dashboard' ? 'chat' : 'auth')} className="text-[10px] tracking-widest text-[#34D59A] uppercase font-black">
            [{view === 'dashboard' ? t.logout : t.login}]
          </button>
          <button onClick={() => setCurrentLang(l => l === 'ru' ? 'en' : 'ru')} className="text-[10px] border border-white/20 px-4 py-2 rounded-full uppercase font-bold">
            {currentLang.toUpperCase()}
          </button>
        </div>
      </header>

      {/* VIEW: CHAT */}
      {view === 'chat' && (
        <main className="pt-40 pb-10 px-4 flex flex-col items-center min-h-screen">
          <div className="max-w-3xl w-full">
            <h1 className="text-5xl md:text-8xl font-black mb-8 text-center tracking-tighter uppercase leading-tight" dangerouslySetInnerHTML={{ __html: t.title }} />
            
            <div className="w-full mb-6 glass-card p-4 rounded-3xl bg-black/40 border-[#34D59A]/20 font-mono text-[10px] text-[#34D59A]/60 flex flex-col gap-1">
                {liveLogs.map((log, i) => <div key={i} className="truncate">[{log.time}] {log.text}</div>)}
            </div>

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

      {/* VIEW: AUTH / REGISTER */}
      {(view === 'auth' || view === 'register') && (
        <main className="min-h-screen flex items-center justify-center pt-32 p-4">
          <div className="max-w-md w-full glass-card p-10 rounded-[3.5rem]">
            <h2 className="text-3xl font-black mb-10 tracking-tighter uppercase italic text-center">{view === 'auth' ? t.login : t.register}</h2>
            <div className="space-y-5">
              <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)}
                className="w-full bg-white rounded-2xl px-6 py-4 outline-none font-mono text-sm text-black" placeholder="EMAIL" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white rounded-2xl px-6 py-4 outline-none font-mono text-sm text-black" placeholder="PASSWORD" />
              
              <div className="flex justify-between items-center px-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="rem" checked={rememberMe} onChange={(e)=>setRememberMe(e.target.checked)} className="accent-[#34D59A]" />
                  <label htmlFor="rem" className="text-[9px] uppercase font-bold text-gray-400">{t.remember}</label>
                </div>
                <button onClick={() => setView(view === 'auth' ? 'register' : 'auth')} className="text-[9px] text-[#34D59A] uppercase font-bold underline">
                  {view === 'auth' ? t.register : t.login}
                </button>
              </div>

              {authError && <div className="text-[#34D59A] text-[10px] font-bold uppercase text-center">{authError}</div>}
              
              <button 
  onClick={view === 'auth' ? handleAuth : handleRegister} 
  className="w-full py-5 bg-[#34D59A] text-white font-black rounded-2xl text-[13px] uppercase shadow-[0_0_20px_rgba(52,213,154,0.4)] hover:scale-[1.02] transition-transform"
>
  {view === 'auth' ? t.authBtn : t.regBtn}
</button>
            </div>
          </div>
        </main>
      )}

      {/* VIEW: DASHBOARD */}
      {view === 'dashboard' && (
        <main className="pt-44 pb-10 px-4 max-w-[1250px] mx-auto">
          <div className="flex flex-col gap-10">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-8 gap-4">
              <div>
                <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">{t.cabinet}</h2>
                <div className="text-[10px] text-[#34D59A] font-mono mt-3 uppercase tracking-widest">Protocol: AIO-CORE-ALPHA-{orderId}</div>
              </div>
              <div className="flex flex-col items-end">
                  <div className="text-4xl md:text-6xl font-black text-red-500 leading-none">0.00 <span className="text-sm text-white/20">USDT</span></div>
                  <div className="text-[9px] text-gray-500 uppercase mt-3 font-bold px-3 py-1 border border-white/10 rounded-full">BALANCE EMPTY</div>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 glass-card overflow-hidden rounded-[3rem] h-80 relative bg-black">
                  <canvas ref={canvasRef} className="w-full h-full" />
                  <div className="absolute bottom-6 left-6 text-[9px] font-bold text-[#34D59A] uppercase tracking-[0.3em]">Live Node Mapping</div>
              </div>

              <div className="lg:col-span-2 space-y-8">
                <div className="glass-card p-8 md:p-12 rounded-[3.5rem] space-y-8">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[11px] uppercase font-bold text-gray-500 tracking-widest">Power Selection</h4>
                    <span className="text-[#34D59A] font-mono text-2xl font-black">${price}</span>
                  </div>
                  <input type="range" min="100" max="499" value={price} onChange={(e) => setPrice(e.target.value)} />
                  
                  <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 font-mono text-[11px] leading-relaxed text-gray-400 min-h-[100px]">
                      <div className="text-[#34D59A] mb-3 uppercase font-bold">{t.terminalHead}</div>
                      <div className="whitespace-pre-line transition-all duration-300">
                        {getCurrentDesc()}
                      </div>
                  </div>

                  <button className="w-full py-6 ton-button text-white font-black rounded-2xl text-[11px] uppercase flex items-center justify-center gap-4 shadow-lg shadow-blue-500/20">
  {/* Оставляем только текст из перевода, иконка подтянется через gap */}
  <img src="https://ton.org/download/ton_symbol.svg" className="w-6 h-6 brightness-200" alt="" />
  {t.payBtn}
</button>
                  
                  {isSearchingTx && (
                    <div className="p-4 bg-[#34D59A]/10 border border-[#34D59A]/20 rounded-2xl flex items-center justify-center gap-3 animate-pulse">
                      <div className="text-[10px] uppercase text-[#34D59A] font-black tracking-widest">{t.search} {orderId}</div>
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
