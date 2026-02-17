'use client';
import React, { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [view, setView] = useState('chat'); 
  const [currentLang, setCurrentLang] = useState('ru');
  const [chatHistory, setChatHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [price, setPrice] = useState(100);
  const canvasRef = useRef(null);

  const translations = {
    ru: { title: 'СЕМАНТИЧЕСКАЯ <span class="glow-text italic">ИНДЕКСАЦИЯ</span>', desc: 'Автономный протокол интеграции данных.', place: 'Сообщение...', login: 'Войти', cabinet: 'КАБИНЕТ', capture: 'ЗОНА ЗАХВАТА GPT' },
    en: { title: 'SEMANTIC <span class="glow-text italic">INDEXING</span>', desc: 'Autonomous data integration protocol.', place: 'Message...', login: 'Login', cabinet: 'CABINET', capture: 'GPT CAPTURE ZONE' }
  };
  const t = translations[currentLang];

  // Canvas 3D Engine
  useEffect(() => {
    if (view !== 'dashboard' || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let offset = 0;

    const render = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const scale = price / 100;

      // Рисуем сетку (Grid)
      ctx.strokeStyle = 'rgba(52, 213, 154, 0.15)';
      ctx.lineWidth = 1;
      offset += 1;
      if (offset > 40) offset = 0;

      for (let i = -10; i < 20; i++) {
        // Горизонтальные линии (в перспективе)
        const y = centerY + (i * 40) + offset;
        if (y > centerY) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
        // Вертикальные линии
        const x = centerX + (i * 80 * (y/centerY));
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + (i * 1000), canvas.height);
        ctx.stroke();
      }

      // Рисуем купол захвата (Capture Dome)
      const gradient = ctx.createRadialGradient(centerX, canvas.height * 0.7, 0, centerX, canvas.height * 0.7, 150 * scale);
      gradient.addColorStop(0, 'rgba(52, 213, 154, 0.4)');
      gradient.addColorStop(1, 'rgba(52, 213, 154, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.ellipse(centerX, canvas.height * 0.7, 200 * scale, 100 * scale, 0, 0, Math.PI * 2);
      ctx.fill();

      // Ободок купола
      ctx.strokeStyle = '#34D59A';
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      animationFrameId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [view, price]);

  const processInput = () => {
    if (!inputValue.trim()) return;
    setChatHistory([...chatHistory, { role: 'user', content: inputValue }]);
    setInputValue('');
    setTimeout(() => setView('auth'), 1000);
  };

  return (
    <div className="min-h-screen text-white bg-[#050505] font-sans selection:bg-[#34D59A] overflow-x-hidden">
      <style jsx global>{`
        .glow-text { color: #34D59A; text-shadow: 0 0 15px rgba(52, 213, 154, 0.4); }
        .glass-card { background: rgba(15, 15, 15, 0.9); border: 1px solid rgba(52, 213, 154, 0.1); backdrop-filter: blur(10px); }
        input[type='range'] { -webkit-appearance: none; background: #222; height: 4px; border-radius: 2px; width: 100%; }
        input[type='range']::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; background: #34D59A; border-radius: 50%; cursor: pointer; border: 3px solid #050505; }
      `}</style>

      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 p-6 flex justify-between items-center bg-black/50 backdrop-blur-lg border-b border-white/5">
        <div className="text-xl font-black tracking-tighter uppercase cursor-pointer" onClick={() => setView('chat')}>
          AIO<span className="text-[#34D59A]">.CORE</span>
        </div>
        <button onClick={() => setView('auth')} className="text-[10px] font-bold uppercase tracking-widest text-gray-400">[{t.login}]</button>
      </header>

      {/* VIEW: CHAT */}
      {view === 'chat' && (
        <main className="pt-32 flex flex-col items-center px-4">
          <h1 className="text-5xl md:text-8xl font-black text-center mb-10 tracking-tighter" dangerouslySetInnerHTML={{ __html: t.title }} />
          <div className="w-full max-w-2xl glass-card rounded-[2.5rem] p-8 h-[400px] flex flex-col">
            <div className="flex-1 font-mono text-sm text-[#34D59A] opacity-60 overflow-y-auto">
               {'>'} SYSTEM STATUS: ONLINE<br/>
               {'>'} READY FOR CONTEXT INJECTION...
               {chatHistory.map((m, i) => <div key={i} className="text-white mt-2">[{m.role.toUpperCase()}]: {m.content}</div>)}
            </div>
            <div className="flex gap-4 border-t border-white/10 pt-4 mt-4">
              <input className="bg-transparent flex-1 outline-none text-[#34D59A] font-mono" placeholder={t.place} value={inputValue} onChange={e=>setInputValue(e.target.value)} onKeyDown={e=>e.key==='Enter' && processInput()}/>
              <button onClick={processInput} className="text-[#34D59A]">➤</button>
            </div>
          </div>
        </main>
      )}

      {/* VIEW: DASHBOARD */}
      {view === 'dashboard' && (
        <main className="pt-32 pb-10 px-4 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* CANVAS BLOCK */}
            <div className="lg:col-span-2 glass-card rounded-[3rem] relative overflow-hidden h-[400px] md:h-[500px] bg-black">
               <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
               <div className="absolute top-10 left-10 pointer-events-none">
                  <div className="text-[10px] font-bold text-[#34D59A] tracking-[0.4em] uppercase mb-2">{t.capture}</div>
                  <div className="text-5xl font-black italic tracking-tighter">{(price * 1.5).toFixed(0)}m²</div>
               </div>
            </div>

            {/* CONTROLS */}
            <div className="space-y-6">
              <div className="glass-card p-8 rounded-[2.5rem]">
                <div className="flex justify-between mb-6">
                   <span className="text-[10px] font-bold text-gray-500 uppercase">Power Level</span>
                   <span className="text-[#34D59A] font-bold">${price}</span>
                </div>
                <input type="range" min="100" max="499" value={price} onChange={e=>setPrice(e.target.value)} />
                <div className="mt-8 grid grid-cols-2 gap-4">
                   <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <div className="text-[8px] text-gray-500 uppercase">Nodes</div>
                      <div className="text-xl font-black italic">{Math.floor(price * 12)}</div>
                   </div>
                   <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <div className="text-[8px] text-gray-500 uppercase">Impact</div>
                      <div className="text-xl font-black italic">{(price/5).toFixed(1)}%</div>
                   </div>
                </div>
              </div>
              <button className="w-full bg-blue-600 py-6 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl shadow-blue-600/20">
                 Tonkeeper Pay
              </button>
            </div>
          </div>
        </main>
      )}

      {/* VIEW: AUTH */}
      {view === 'auth' && (
        <main className="min-h-screen flex items-center justify-center p-6">
           <div className="glass-card p-10 rounded-[3rem] w-full max-w-sm text-center">
              <h2 className="text-2xl font-black mb-8 italic uppercase">Connection</h2>
              <button onClick={()=>setView('dashboard')} className="w-full bg-[#34D59A] text-black py-4 rounded-xl font-black uppercase tracking-tighter">Enter Dashboard</button>
           </div>
        </main>
      )}
    </div>
  );
}
