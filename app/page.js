'use client';
import React, { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [view, setView] = useState('chat'); // 'chat', 'auth', 'dashboard'
  const [currentLang, setCurrentLang] = useState('ru');
  const [chatHistory, setChatHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [orderId, setOrderId] = useState('');
  
  // Данные для логина/регистрации
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Live Logs для атмосферы
  const [liveLogs, setLiveLogs] = useState([{ time: new Date().toLocaleTimeString(), text: "System initialized..." }]);

  const chatEndRef = useRef(null);

  const translations = {
    ru: { 
      title: 'СЕМАНТИЧЕСКАЯ <span class="glow-text italic">ИНДЕКСАЦИЯ</span>', 
      desc: 'Автономный протокол интеграции данных в нейросети.', 
      place: 'Введите сообщение...', login: 'ВХОД', regTitle: 'РЕГИСТРАЦИЯ',
      cabinet: 'ПАНЕЛЬ УПРАВЛЕНИЯ', timerTitle: 'ПРОГНОЗ РЕЗУЛЬТАТА',
      copy: 'Копировать адрес', authBtn: 'ПОДТВЕРДИТЬ'
    },
    en: { 
      title: 'SEMANTIC <span class="glow-text italic">INDEXING</span>', 
      desc: 'Autonomous protocol for data integration.', 
      place: 'Type a message...', login: 'LOGIN', regTitle: 'REGISTRATION',
      cabinet: 'CONTROL PANEL', timerTitle: 'RESULT FORECAST',
      copy: 'Copy address', authBtn: 'CONFIRM'
    }
  };

  // Интервал для Live-логов
  useEffect(() => {
    const logLines = ["Scanning neural nodes...", "Vectorizing stream...", "RAG sync: 98%", "Latency: 24ms", "Weights adjusted", "Context optimized"];
    const interval = setInterval(() => {
      setLiveLogs(prev => {
        const newLog = { time: new Date().toLocaleTimeString(), text: logLines[Math.floor(Math.random() * logLines.length)] };
        return [...prev, newLog].slice(-3);
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatHistory]);

  const processInput = async () => {
    if (!inputValue.trim()) return;
    const userMsg = inputValue;
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setInputValue('');

    // Вытягиваем email из чата для упрощения входа
    const emailMatch = userMsg.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) setUserEmail(emailMatch[0]);

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
        setTimeout(() => setView('auth'), 2000);
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
    <div className="min-h-screen text-white relative bg-[#050505]">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;700&display=swap');
        body { font-family: 'Space Grotesk', sans-serif; background: #050505; }
        .glow-text { color: #34D59A; text-shadow: 0 0 15px rgba(52, 213, 154, 0.5); }
        .glass-card { background: rgba(10, 10, 10, 0.6); border: 1px solid rgba(52, 213, 154, 0.15); backdrop-filter: blur(20px); }
        .bot-msg { color: #34D59A; font-family: monospace; font-size: 13px; margin-bottom: 12px; border-left: 2px solid #34D59A; padding-left: 10px; }
        .user-msg { color: #fff; font-family: monospace; font-size: 13px; opacity: 0.6; margin-bottom: 12px; text-align: right; border-right: 2px solid rgba(255,255,255,0.2); padding-right: 10px; }
      `}</style>

      {/* HEADER */}
      <header className="fixed top-0 w-full z-[300] p-6 flex justify-between items-center bg-black/50 backdrop-blur-md border-b border-white/5">
        <div className="text-xl font-bold tracking-tighter uppercase cursor-pointer" onClick={() => setView('chat')}>
          AIO<span className="glow-text">.CORE</span>
        </div>
        <div className="flex gap-6 items-center">
          {view === 'chat' && (
            <button onClick={() => { setIsRegistering(false); setView('auth'); }} className="text-[10px] tracking-widest text-gray-400 hover:text-[#34D59A] transition-colors uppercase font-bold">
              {translations[currentLang].login}
            </button>
          )}
          <button onClick={() => setCurrentLang(l => l === 'ru' ? 'en' : 'ru')} className="text-[10px] border border-white/10 px-4 py-1 rounded-full uppercase">
            {currentLang}
          </button>
        </div>
      </header>

      {view === 'chat' && (
        <div className="min-h-screen flex flex-col pt-24">
          <main className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
            <section className="text-center mb-12">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 uppercase tracking-tighter" dangerouslySetInnerHTML={{ __html: translations[currentLang].title }} />
              <p className="text-gray-500 text-sm max-w-xl mx-auto font-light">{translations[currentLang].desc}</p>
            </section>

            <section className="w-full max-w-2xl">
              <div className="glass-card p-8 rounded-[3rem] h-[450px] flex flex-col shadow-2xl relative">
                {/* LIVE LOGS OVERLAY */}
                <div className="absolute top-4 right-8 text-[8px] font-mono opacity-30 text-right hidden sm:block">
                  {liveLogs.map((log, i) => <div key={i}>[{log.time}] {log.text}</div>)}
                </div>

                <div className="flex-1 overflow-y-auto mb-4 pr-2">
                  {chatHistory.length === 0 && <div className="bot-msg">{'>'} ARIA v3.3 Online. Укажите URL проекта.</div>}
                  {chatHistory.map((msg, i) => (
                    <div key={i} className={msg.role === 'assistant' ? 'bot-msg' : 'user-msg'}>
                      {msg.role === 'assistant' ? '> ' : ''}{msg.content}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center gap-4">
                  <input className="bg-transparent border-none border-b border-[#34D59A]/20 outline-none text-[#34D59A] flex-1 font-mono text-sm py-2"
                    placeholder={translations[currentLang].place} value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && processInput()} />
                  <button onClick={processInput} className="text-[#34D59A] text-xl">➤</button>
                </div>
              </div>
            </section>
          </main>
        </div>
      )}

      {view === 'auth' && (
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="max-w-md w-full glass-card p-10 rounded-[3rem] animate-in zoom-in-95 duration-500">
            <h2 className="text-2xl font-bold mb-8 tracking-tighter uppercase italic text-center">
              {isRegistering ? translations[currentLang].regTitle : translations[currentLang].login}
            </h2>
            <div className="space-y-6">
              <div>
                <label className="text-[9px] uppercase text-gray-500 ml-4 mb-2 block tracking-widest font-bold">Email</label>
                <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#34D59A]/50 transition-colors font-mono text-sm text-[#34D59A]" />
              </div>
              <div>
                <label className="text-[9px] uppercase text-gray-500 ml-4 mb-2 block tracking-widest font-bold">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#34D59A]/50 transition-colors font-mono text-sm" placeholder="••••••••" />
              </div>
              <button onClick={() => setView('dashboard')} className="w-full py-5 bg-[#34D59A] text-black font-black rounded-2xl text-[10px] uppercase shadow-lg shadow-[#34D59A]/10 hover:scale-[1.02] transition-all">
                {translations[currentLang].authBtn}
              </button>
              <button onClick={() => setIsRegistering(!isRegistering)} className="w-full text-[9px] text-gray-500 uppercase hover:text-white transition-colors text-center">
                {isRegistering ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Регистрация'}
              </button>
            </div>
          </div>
        </div>
      )}

      {view === 'dashboard' && (
        <div className="min-h-screen pt-32 pb-20 px-6 animate-in fade-in duration-1000">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-end mb-12">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">{translations[currentLang].cabinet}</h2>
              <div className="text-right hidden sm:block">
                <div className="text-[9px] uppercase text-gray-500 font-bold mb-1">Status: Active</div>
                <div className="text-xl font-bold text-red-500 italic">0.00 USDT</div>
              </div>
            </div>

            <div className="grid md:grid-cols-12 gap-8">
              {/* ПЛАНЫ ТРАФИКА */}
              <div className="md:col-span-8 space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: 1, name: 'BASE TRAFFIC', price: 100, desc: 'Начальный пролив (1000 узлов)' },
                    { id: 2, name: 'SEMANTIC PRO', price: 499, desc: 'Приоритет в LLM выдаче' },
                    { id: 3, name: 'GLOBAL DOM', price: 999, desc: 'Полный захват контекста' }
                  ].map((plan) => (
                    <div key={plan.id} onClick={() => setSelectedPlan(plan)}
                      className={`glass-card p-8 rounded-[2.5rem] cursor-pointer transition-all border-2 ${selectedPlan?.id === plan.id ? 'border-[#34D59A] bg-[#34D59A]/5' : 'border-transparent hover:border-white/10'}`}>
                      <div className="text-[10px] font-bold text-[#34D59A] mb-2 uppercase tracking-widest">{plan.name}</div>
                      <div className="text-4xl font-bold mb-2 tracking-tighter">${plan.price}</div>
                      <p className="text-[10px] text-gray-500 uppercase italic">{plan.desc}</p>
                    </div>
                  ))}
                </div>

                {/* ТАЙМЕРЫ */}
                <div className="glass-card p-10 rounded-[3rem] grid sm:grid-cols-2 gap-10">
                   <div>
                      <h4 className="text-[10px] font-bold uppercase text-gray-400 mb-4 tracking-widest">{translations[currentLang].timerTitle}</h4>
                      <div className="text-4xl font-mono text-[#34D59A]">72:00:00</div>
                      <p className="text-[9px] text-gray-500 mt-2 uppercase">Время на векторизацию в базах ИИ.</p>
                   </div>
                   <div className="sm:border-l border-white/5 sm:pl-10">
                      <h4 className="text-[10px] font-bold uppercase text-gray-400 mb-4 tracking-widest">СРОК РАБОТЫ</h4>
                      <div className="text-4xl font-mono">365 ДНЕЙ</div>
                      <p className="text-[9px] text-gray-500 mt-2 uppercase">Гарантия удержания весов.</p>
                   </div>
                </div>
              </div>

              {/* ПЛАТЕЖКА */}
              <div className="md:col-span-4">
                <div className="glass-card p-8 rounded-[3rem] sticky top-32 border-[#34D59A]/20">
                  {selectedPlan ? (
                    <div className="animate-in fade-in">
                      <div className="text-center mb-6">
                        <div className="text-[9px] text-gray-500 uppercase mb-1">To Pay (TRC20)</div>
                        <div className="text-4xl font-bold italic tracking-tighter">{selectedPlan.price} USDT</div>
                      </div>
                      <div className="bg-black/60 p-4 rounded-xl border border-white/5 mb-6 group cursor-pointer" onClick={copyWallet}>
                        <code className="text-[9px] text-[#34D59A] break-all block text-center font-mono">UQAVTMHfwYcMn7ttJNXiJVaoA-jjRTeJHc2sjpkAVzc84oSY</code>
                      </div>
                      <button onClick={copyWallet} className="w-full py-4 bg-[#34D59A] text-black font-black rounded-xl text-[10px] uppercase transition-all hover:scale-105">Я ОПЛАТИЛ</button>
                    </div>
                  ) : (
                    <div className="py-20 text-center opacity-30 text-[9px] uppercase font-bold tracking-widest italic">Выберите тариф</div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
