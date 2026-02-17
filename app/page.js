'use client';
import React, { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [view, setView] = useState('chat'); // 'chat', 'auth', 'dashboard'
  const [currentLang, setCurrentLang] = useState('ru');
  const [chatHistory, setChatHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [orderId, setOrderId] = useState('');
  
  // Данные пользователя
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Live Logs (та самая тема, показывающая работу)
  const [liveLogs, setLiveLogs] = useState([
    { time: new Date().toLocaleTimeString(), text: "System bridge established..." },
    { time: new Date().toLocaleTimeString(), text: "Neural core: Standby" }
  ]);

  const chatEndRef = useRef(null);

  // Имитация "работы" системы в фоне
  useEffect(() => {
    const lines = [
      "Vectorizing node #412...", "RAG Sync: 99.2%", "LLM Context optimization...", 
      "Semantic weight adjusted", "TRC20 Gateway: Ready", "Scanning metadata..."
    ];
    const interval = setInterval(() => {
      setLiveLogs(prev => {
        const next = { time: new Date().toLocaleTimeString(), text: lines[Math.floor(Math.random() * lines.length)] };
        return [...prev, next].slice(-4);
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatHistory]);

  const processInput = async () => {
    if (!inputValue.trim()) return;
    const userMsg = inputValue;
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setInputValue('');

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
        setTimeout(() => setView('auth'), 1500);
      }
    } catch (e) {
      setChatHistory(prev => [...prev, { role: 'assistant', content: "Network error. Reconnecting..." }]);
    }
  };

  const copyWallet = () => {
    navigator.clipboard.writeText('UQAVTMHfwYcMn7ttJNXiJVaoA-jjRTeJHc2sjpkAVzc84oSY');
    alert('Wallet copied');
  };

  return (
    <div className="min-h-screen text-white bg-[#050505] selection:bg-[#34D59A] selection:text-black">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&display=swap');
        body { font-family: 'Space Grotesk', sans-serif; background: #050505; }
        .glow-text { color: #34D59A; text-shadow: 0 0 15px rgba(52, 213, 154, 0.4); }
        .glass-card { background: rgba(15, 15, 15, 0.7); border: 1px solid rgba(52, 213, 154, 0.1); backdrop-filter: blur(20px); }
        .bot-msg { color: #34D59A; font-family: monospace; font-size: 13px; margin-bottom: 16px; border-left: 2px solid #34D59A; padding-left: 14px; line-height: 1.6; }
        .user-msg { color: #fff; font-family: monospace; font-size: 13px; opacity: 0.5; margin-bottom: 16px; text-align: right; border-right: 2px solid rgba(255,255,255,0.1); padding-right: 14px; }
        .fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px) scale(0.98); filter: blur(10px); }
          to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
      `}</style>

      {/* HEADER */}
      <header className="fixed top-0 w-full z-[1000] p-6 flex justify-between items-center bg-black/60 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-12">
          <div className="text-xl font-bold tracking-tighter uppercase cursor-pointer" onClick={() => setView('chat')}>
            AIO<span className="glow-text">.CORE</span>
          </div>
          {view === 'dashboard' && (
            <nav className="hidden md:flex gap-6 text-[10px] uppercase font-bold tracking-widest text-gray-500">
              <span className="text-[#34D59A] cursor-pointer">Terminal</span>
              <span className="hover:text-white cursor-pointer transition-colors">Nodes</span>
              <span className="hover:text-white cursor-pointer transition-colors">API</span>
            </nav>
          )}
        </div>
        <div className="flex gap-4">
          {view === 'chat' && (
            <button onClick={() => { setIsRegistering(false); setView('auth'); }} className="text-[10px] tracking-[0.2em] text-gray-400 hover:text-[#34D59A] transition-all uppercase font-bold">
              [ LOGIN ]
            </button>
          )}
          <button onClick={() => setCurrentLang(l => l === 'ru' ? 'en' : 'ru')} className="text-[10px] border border-white/10 px-4 py-1.5 rounded-full uppercase hover:bg-white hover:text-black transition-all font-bold">
            {currentLang}
          </button>
        </div>
      </header>

      {/* VIEW: CHAT */}
      {view === 'chat' && (
        <main className="pt-32 pb-20 px-6 flex flex-col items-center min-h-screen">
          <div className="max-w-3xl w-full">
            <div className="text-center mb-16">
              <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter uppercase leading-[0.9]" dangerouslySetInnerHTML={{ __html: translations[currentLang].title }} />
              <p className="text-gray-500 text-sm tracking-widest uppercase font-light">{translations[currentLang].desc}</p>
            </div>

            <div className="glass-card p-10 rounded-[3.5rem] h-[500px] flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.5)] relative">
              {/* LIVE LOGS OVERLAY */}
              <div className="absolute top-6 right-10 text-[7px] font-mono text-[#34D59A]/40 text-right leading-tight uppercase
