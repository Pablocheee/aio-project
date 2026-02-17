'use client';
import React, { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [view, setView] = useState('chat'); // 'chat', 'auth', 'dashboard'
  const [currentLang, setCurrentLang] = useState('ru');
  const [chatHistory, setChatHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');
  
  // Данные пользователя
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const chatEndRef = useRef(null);

  const translations = {
    ru: { 
      title: 'СЕМАНТИЧЕСКАЯ <span class="glow-text italic">ИНДЕКСАЦИЯ</span>', 
      desc: 'Автономный протокол интеграции данных в нейросети.', 
      place: 'Введите сообщение...', login: 'ВХОД', regTitle: 'РЕГИСТРАЦИЯ',
      cabinet: 'ПАНЕЛЬ УПРАВЛЕНИЯ', timerTitle: 'ПРОГНОЗ АКТИВАЦИИ',
      copy: 'Копировать адрес', authBtn: 'ПОДТВЕРДИТЬ', back: 'Назад'
    },
    en: { 
      title: 'SEMANTIC <span class="glow-text italic">INDEXING</span>', 
      desc: 'Autonomous protocol for data integration.', 
      place: 'Type a message...', login: 'LOGIN', regTitle: 'REGISTRATION',
      cabinet: 'CONTROL PANEL', timerTitle: 'ACTIVATION FORECAST',
      copy: 'Copy address', authBtn: 'CONFIRM', back: 'Back'
    }
  };

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatHistory]);

  const processInput = async () => {
    if (!inputValue.trim()) return;
    const userMsg = inputValue;
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setInputValue('');

    // АВТОЗАПОЛНЕНИЕ EMAIL: ищем почту в тексте пользователя
    const emailMatch = userMsg.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) setUserEmail(emailMatch[0]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, history: chatHistory, lang: currentLang })
      });
      const data = await res.json();
      
      const cleanReply = data.reply.replace('[DATA_READY]', '');
      setChatHistory(prev => [...prev, { role: 'assistant', content: cleanReply }]);

      if (data.reply.includes('[DATA_READY]')) {
        setTimeout(() => setView('auth'), 2000); // Переход к регистрации через 2 сек
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
    <div className="min-h-screen text-white bg-[#050505] overflow-x-hidden">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;700&display=swap');
        body { font-family: 'Space Grotesk', sans-serif; background: #050505; }
        .glow-text { color: #34D59A; text-shadow: 0 0 15px rgba(52, 213, 154, 0.5); }
        .glass-card { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); }
        .bot-msg { color: #34D59A; font-family: monospace; font-size: 13px; margin-bottom: 15px; border-left: 2px solid #34D59A; padding-left: 12px; }
        .user-msg { color: #fff; font-family: monospace; font-size: 13px; opacity: 0.5; margin-bottom: 15px; text-align: right; border-right: 2px solid rgba(255,255,255,0.1); padding-right: 12px; }
      `}</style>

      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 p-6 flex justify-between items-center bg-black/50 backdrop-blur-md border-b border-white/5">
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

      <main className="pt-32 pb-20 px-6">
        {/* VIEW 1: CHAT */}
        {view === 'chat' && (
          <div className="max-w-2xl mx-auto animate-in fade-in duration-700">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter text-center uppercase" dangerouslySetInnerHTML={{ __html: translations[currentLang].title }} />
            <p className="text-gray-500 text-sm text-center mb-12 max-w-md mx-auto">{translations[currentLang].desc}</p>
            <div className="glass-card p-8 rounded-[3rem] h-[450px] flex flex-col shadow-2xl">
              <div className="flex-1 overflow-y-auto mb-4 space-y-2 pr-2">
                {chatHistory.length === 0 && <div className="bot-msg">{'>'} ARIA v3.3 Online. Specify project context.</div>}
                {chatHistory.map((msg, i) => (
                  <div key={i} className={msg.role === 'assistant' ? 'bot-msg' : 'user-msg'}>
                    {msg.role === 'assistant' ? '> ' : ''}{msg.content}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div className="flex gap-4 border-t border-white/5 pt-4">
                <input 
                  className="bg-transparent outline-none text-[#34D59A] flex-1 font-mono text-sm"
                  placeholder={translations[currentLang].place}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && processInput()}
                />
                <button onClick={processInput} className="text-[#34D59A] font-bold">➤</button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: AUTH (Registration/Login) */}
        {view === 'auth' && (
          <div className="max-w-md mx-auto animate-in zoom-in-95 duration-500">
             <div className="glass-card p-10 rounded-[3rem]">
                <h2 className="text-2xl font-bold mb-8 tracking-tighter uppercase italic text-center">
                  {isRegistering ? translations[currentLang].regTitle : translations[currentLang].login}
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="text-[9px] uppercase text-gray-500 ml-4 mb-2 block tracking-widest font-bold">Email</label>
                    <input 
                      type="email" 
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#34D59A]/50 transition-colors font-mono text-sm text-[#34D59A]"
                      placeholder="name@mail.com"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase text-gray-500 ml-4 mb-2 block tracking-widest font-bold">Password</label>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#34D59A]/50 transition-colors font-mono text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                  <button 
                    onClick={() => setView('dashboard')}
                    className="w-full py-5 bg-[#34D59A] text-black font-black rounded-2xl text-[10px] uppercase shadow-lg shadow-[#34D59A]/10 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    {translations[currentLang].authBtn}
                  </button>
                  <div className="flex justify-between px-2">
                    <button onClick={() => setIsRegistering(!isRegistering)} className="text-[9px] text-gray-500 uppercase hover:text-white transition-colors">
                      {isRegistering ? 'Уже есть доступ?' : 'Создать аккаунт'}
                    </button>
                    <button onClick={() => setView('chat')} className="text-[9px] text-gray-500 uppercase hover:text-white transition-colors">
                      {translations[currentLang].back}
                    </button>
                  </div>
                </div>
             </div>
          </div>
        )}

        {/* VIEW 3: DASHBOARD */}
        {view === 'dashboard' && (
          <div className="max-w-6xl mx-auto animate-in fade-in duration-1000">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
              <div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">{translations[currentLang].cabinet}</h2>
                <p className="text-[#34D59A] text-[10px] font-mono mt-2 uppercase tracking-widest">Active session for: {userEmail || 'guest_user'}</p>
              </div>
              <div className="bg-white/5 border border-white/10 px-8 py-5 rounded-[2rem]">
                <div className="text-[9px] uppercase text-gray-500 font-bold mb-1 tracking-widest text-right">Balance</div>
                <div className="text-3xl font-bold italic">0.00 <span className="text-sm font-normal opacity-30">USDT</span></div>
              </div>
            </div>

            <div className="grid md:grid-cols-12 gap-8">
              {/* ТАРИФЫ */}
              <div className="md:col-span-8 space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: 1, name: 'LITE START', price: 100, desc: 'Базовая индексация проекта', time: '72h' },
                    { id: 2, name: 'SEMANTIC PRO', price: 499, desc: 'Приоритет в выдаче ИИ', time: '24h' },
                    { id: 3, name: 'NETWORK DOM', price: 999, desc: 'Сеть из 3-х проектов', time: '12h' },
                    { id: 4, name: 'ENTERPRISE', price: 2500, desc: 'Захват ниши + Мониторинг', time: '6h' },
                  ].map((plan) => (
                    <div 
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan)}
                      className={`glass-card p-8 rounded-[2.5rem] cursor-pointer transition-all border-2 ${selectedPlan?.id === plan.id ? 'border-[#34D59A] bg-[#34D59A]/5' : 'border-transparent hover:border-white/10'}`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="text-[10px] font-bold text-[#34D59A] uppercase tracking-widest">{plan.name}</div>
                        <div className="text-[9px] bg-white/5 px-2 py-1 rounded font-mono italic">{plan.time}</div>
                      </div>
                      <div className="text-4xl font-bold mb-4 tracking-tighter italic">${plan.price}</div>
                      <p className="text-[10px] text-gray-500 leading-relaxed uppercase">{plan.desc}</p>
                    </div>
                  ))}
                </div>

                {/* ЧЕСТНЫЕ ДАННЫЕ */}
                <div className="glass-card p-10 rounded-[3rem] grid md:grid-cols-2 gap-10">
                   <div>
                      <h4 className="text-[10px] font-bold uppercase text-gray-400 mb-6 tracking-[0.2em]">{translations[currentLang].timerTitle}</h4>
                      <div className="text-4xl font-mono text-[#34D59A] mb-2 tracking-tighter">72:00:00</div>
                      <p className="text-[10px] text-gray-500 uppercase leading-relaxed italic">Среднее время векторизации и обновления контекстных слоев в ChatGPT/Perplexity.</p>
                   </div>
                   <div className="border-l border-white/5 pl-10">
                      <h4 className="text-[10px] font-bold uppercase text-gray-400 mb-6 tracking-[0.2em]">СРОК ЭФФЕКТА</h4>
                      <div className="text-4xl font-mono mb-2 tracking-tighter">365 ДНЕЙ</div>
                      <p className="text-[10px] text-gray-500 uppercase leading-relaxed italic">Гарантированное удержание семантических весов в базе данных нейросетей.</p>
                   </div>
                </div>
              </div>

              {/* ПЛАТЕЖНЫЙ МОДУЛЬ */}
              <div className="md:col-span-4">
                <div className="glass-card p-8 rounded-[3rem] sticky top-32 border-[#34D59A]/20 bg-[#34D59A]/[0.01]">
                   {!selectedPlan ? (
                     <div className="py-20 text-center opacity-30 text-[9px] uppercase font-bold tracking-[0.3em]">Выберите тариф</div>
                   ) : (
                     <div className="animate-in fade-in duration-500">
                        <div className="text-center mb-8">
                           <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-2 font-bold">Activation Fee</div>
                           <div className="text-5xl font-bold italic tracking-tighter">{selectedPlan.price} <span className="text-sm opacity-30">USDT</span></div>
                        </div>
                        <div className="bg-black/60 p-5 rounded-2xl border border-white/5 mb-6 group cursor-pointer relative overflow-hidden" onClick={copyWallet}>
                           <div className="text-[7px] text-gray-500 uppercase mb-3 text-center">TRC20 Address (Click to copy)</div>
                           <code className="text-[10px] text-[#34D59A] break-all block text-center font-mono leading-relaxed">UQAVTMHfwYcMn7ttJNXiJVaoA-jjRTeJHc2sjpkAVzc84oSY</code>
                        </div>
                        <button onClick={copyWallet} className="w-full py-5 bg-[#34D59A] text-black font-black rounded-2xl text-[10px] uppercase shadow-[0_10px_40px_rgba(52,213,154,0.1)] hover:scale-[1.02] active:scale-95 transition-all italic">
                          Я ОПЛАТИЛ
                        </button>
                        <div className="mt-8 text-[8px] text-gray-600 uppercase text-center italic space-y-2">
                           <p>• 1 подтверждение сети</p>
                           <p>• Автоматический запуск узла</p>
                        </div>
                     </div>
                   )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </main>
    </div>
  );
}
