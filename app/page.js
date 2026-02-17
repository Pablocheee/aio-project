'use client';
import React, { useState } from 'react';

export default function Home() {
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState('');

  const processInput = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setChat(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      setChat(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (e) {
      setChat(prev => [...prev, { role: 'assistant', content: "ERROR: NO_SIGNAL" }]);
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#34D59A] font-mono p-6 md:p-12 selection:bg-[#34D59A] selection:text-black">
      
      {/* HEADER */}
      <header className="mb-12 border-b border-[#34D59A]/20 pb-4 flex justify-between">
        <span className="font-bold tracking-tighter">AIO.CORE_v4.1</span>
        <span className="opacity-50 text-xs text-red-500 animate-pulse">● LIVE_NODE</span>
      </header>

      {/* MAIN */}
      <main className="max-w-3xl mx-auto flex flex-col gap-8">
        
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-2">
            Semantic <span className="underline italic">Indexing</span>
          </h1>
          <p className="text-[10px] opacity-40 uppercase tracking-[0.4em]">Autonomous Data Layer</p>
        </div>

        {/* CHAT WINDOW */}
        <div className="border border-[#34D59A] h-[500px] flex flex-col bg-black">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {chat.length === 0 && <div className="opacity-20">{'>'} SYSTEM_READY_AWAITING_INPUT...</div>}
            {chat.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'text-white/60' : 'text-[#34D59A]'}`}>
                <span className="shrink-0">[{msg.role === 'user' ? 'USR' : 'SYS'}]</span>
                <span className="break-words">{msg.content}</span>
              </div>
            ))}
          </div>

          {/* INPUT AREA */}
          <div className="border-t border-[#34D59A] p-4 flex gap-4 items-center">
            <span className="animate-pulse">{'>'}</span>
            <input 
              className="bg-transparent outline-none flex-1 text-[#34D59A] placeholder-[#34D59A]/20"
              placeholder="..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && processInput()}
              autoFocus
            />
          </div>
        </div>
      </main>

      <footer className="mt-12 text-[8px] opacity-20 text-center tracking-widest">
        SECURE_CONNECTION // NO_LOGS_SAVED // 2026
      </footer>
    </div>
  );
}
