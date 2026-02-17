'use client';
import React, { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [view, setView] = useState('chat'); 
  const [currentLang, setCurrentLang] = useState('ru');
  const [chatHistory, setChatHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [price, setPrice] = useState(100);
  const [isSearchingTx, setIsSearchingTx] = useState(false);

  const translations = {
    ru: { title: 'СЕМАНТИЧЕСКАЯ ИНДЕКСАЦИЯ', desc: 'Автономный протокол интеграции данных.', place: 'Сообщение...', login: 'Войти', logout: 'Выйти', authBtn: 'Соединить', cabinet: 'DASHBOARD', payTon: 'Tonkeeper Pay', capture: 'ОБЛАСТЬ ЗАХВАТА GPT' },
    en: { title: 'SEMANTIC INDEXING', desc: 'Autonomous data integration protocol.', place: 'Message...', login: 'Login', logout: 'Logout', authBtn: 'Connect', cabinet: 'DASHBOARD', payTon: 'Tonkeeper Pay', capture: 'GPT CAPTURE AREA' }
  };
  const t = translations[currentLang];

  // Ссылка на оплату
  const handleTonkeeperPay = () => {
    const link = `ton://transfer/UQAVTMHfwYcMn7ttJNXiJVaoA-jjRTeJHc2sjpkAVzc84oSY?amount=${price * 1000000000}&text=Index-Alpha`;
    window.location.href = link;
    setIsSearchingTx(true);
  };

  return (
    <div className="min-h-screen text-white bg-[#020202] font-['Space_Grotesk'] overflow-x-hidden">
      <style jsx global>{`
        .neural-world {
          perspective: 800px;
          overflow: hidden;
          background: radial-gradient(circle at 50% 50%, #1a1a1a 0%, #020202 100%);
        }
        .grid-3d {
          width: 200%;
          height: 200%;
          position: absolute;
          bottom: -50%;
          left: -50%;
          background-image: 
            linear-gradient(rgba(52, 213, 154, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(52, 213, 154, 0.2) 1px, transparent 1px);
          background-size: 40px 40px;
          transform: rotateX(65deg);
          animation: move-grid 4s linear infinite;
        }
        @keyframes move-grid {
          0% { transform: rotateX(65deg) translateY(0); }
          100% { transform: rotateX(65deg) translateY(40px); }
        }
        .capture-dome {
          position: absolute;
          bottom: 20%;
          left: 50%;
          transform: translateX(-50%);
          background: radial-gradient(50% 50% at 50% 50%, rgba(52, 213, 154, 0.2) 0%, transparent 100%);
          border-radius: 50%;
          border: 1px solid #34D59A;
          box-shadow: 0 0 50px rgba(52, 213, 154, 0.3);
          transition: all 0.3s ease;
        }
        .scanner-line {
          position: absolute;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #34D59A, transparent);
          animation: scan 3s ease-in-out infinite;
        }
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        input[type='range'] { -webkit-appearance: none; background: #333; height: 4px; border-radius: 2px; }
        input[type='range']::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; background: #34D59A; border-radius: 50%; box-shadow: 0 0 10px #34D59A; cursor: pointer; }
      `}</style>

      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 p-6 flex justify-between items-center bg-black/80 backdrop-blur-md border-b border-white/5">
        <div className="font-bold tracking-tighter text-xl uppercase" onClick={() => setView('chat')}>
          AIO<span className="text-[#34D59A]">.CORE</span>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setView('auth')} className="text-[10px] uppercase font-bold text-gray-400">[{t.login}]</button>
          <button onClick={() => setCurrentLang(l => l === 'ru' ? 'en' : 'ru')} className="text-[10px] uppercase font-bold border border-white/20 px-3 py-1 rounded-full">{currentLang === 'ru' ? 'EN' : 'RU'}</button>
        </div>
      </header>

      {/* CHAT VIEW */}
      {view === 'chat' && (
        <main className="pt-32 px-4 flex flex-col items-center">
          <h1 className="text-5xl md:text-8xl font-black text-center mb-10 tracking-tighter leading-none">{t.title}</h1>
          <div className="w-full max-w-2xl bg-[#0f0f0f] border border-white/5 rounded-[2rem] p-8 h-[400px] flex flex-col relative overflow-hidden">
             <div className="flex-1 text-[#34D59A] font-mono text-sm opacity-80">
                {'>'} SYSTEM READY...<br/>
                {'>'} WAITING FOR URL INJECTION...
             </div>
             <div className="flex gap-4 border-t border-white/10 pt-4">
                <input className="bg-transparent flex-1 outline-none text-[#34D59A] font-mono" placeholder={t.place} onKeyDown={(e) => e.key === 'Enter' && setView('auth')} />
                <button onClick={() => setView('auth')}>➤</button>
             </div>
          </div>
        </main>
      )}

      {/* AUTH VIEW */}
      {view === 'auth' && (
        <main className="min-h-screen flex items-center justify-center p-6">
          <div className="bg-[#111] border border-white/10 p-10 rounded-[3rem] w-full max-w-md shadow-2xl">
             <h2 className="text-2xl font-black mb-6 italic uppercase">Identity Check</h2>
             <input className="w-full bg-white text-black p-4 rounded-xl mb-4 font-bold outline-none" placeholder="EMAIL" />
             <input className="w-full bg-white text-black p-4 rounded-xl mb-6 font-bold outline-none" type="password" placeholder="TOKEN" />
             <button onClick={() => setView('dashboard')} className="w-full bg-[#34D59A] text-black py-4 rounded-xl font-black uppercase">{t.authBtn}</button>
          </div>
        </main>
      )}

      {/* DASHBOARD VIEW (ВИЗУАЛИЗАЦИЯ ТУТ) */}
      {view === 'dashboard' && (
        <main className="pt-24 pb-10 px-4 max-w-[1200px] mx-auto flex flex-col gap-6">
          
          <div className="flex justify-between items-end">
            <h2 className="text-4xl font-black italic">{t.cabinet}</h2>
            <div className="text-red-500 font-black text-2xl">0.00 <span className="text-xs text-white/20">USDT</span></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* 3D VISUALIZER BOX */}
            <div className="lg:col-span-2 h-[400px] md:h-[500px] bg-[#050505] rounded-[3rem] border border-[#34D59A]/30 relative overflow-hidden neural-world">
               <div className="grid-3d"></div>
               
               {/* Тот самый купол захвата */}
               <div className="capture-dome" style={{ 
                 width: `${price * 1.5}px`, 
                 height: `${price * 1.2}px`,
                 opacity: price / 500 
               }}></div>

               <div className="scanner-line"></div>

               <div className="absolute top-8 left-8 z-20">
                 <div className="text-[10px] font-bold text-[#34D59A] tracking-[0.4em] uppercase">{t.capture}</div>
                 <div className="text-4xl font-black italic mt-2">{(price * 1.8).toFixed(0)}m²</div>
               </div>

               <div className="absolute bottom-8 left-8 z-20 flex gap-4">
                  <div className="bg-black/80 p-3 rounded-lg border border-white/10">
                    <div className="text-[8px] text-gray-500 uppercase">Power</div>
                    <div className="text-xs font-bold text-[#34D59A]">{price}lv</div>
                  </div>
                  <div className="bg-black/80 p-3 rounded-lg border border-white/10">
                    <div className="text-[8px] text-gray-500 uppercase">Status</div>
                    <div className="text-xs font-bold text-blue-400">Capturing...</div>
                  </div>
               </div>
            </div>

            {/* CONTROLS */}
            <div className="flex flex-col gap-6">
              <div className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5">
                <div className="flex justify-between mb-4">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Scale Injection</span>
                  <span className="text-[#34D59A] font-bold">${price}</span>
                </div>
                <input type="range" min="100" max="499" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full mb-6" />
                
                <div className="space-y-4">
                  <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                    <span className="text-gray-500">GPT Impact</span>
                    <span className="text-white">{(price / 5).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                    <span className="text-gray-500">Nodes Allocated</span>
                    <span className="text-white">{price * 12}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#111] p-8 rounded-[2.5rem] border border-blue-500/20">
                <button onClick={handleTonkeeperPay} className="w-full bg-blue-500 py-6 rounded-2xl font-black uppercase text-[11px] flex items-center justify-center gap-2 hover:scale-105 transition-all">
                   <img src="https://ton.org/download/ton_symbol.svg" className="w-5 h-5 brightness-200" alt="ton" />
                   {t.payTon}
                </button>
                {isSearchingTx && (
                   <div className="mt-4 text-[9px] text-[#34D59A] font-bold uppercase text-center animate-pulse">
                     Waiting for Blockchain Confirmation...
                   </div>
                )}
              </div>
            </div>

          </div>

          <div className="bg-black border border-white/5 p-4 rounded-xl font-mono text-[10px] text-[#34D59A]/40">
             [LOG]: Injection point identified at 0x412... Volume: {price} units. 
          </div>

        </main>
      )}
    </div>
  );
}
