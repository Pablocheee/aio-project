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
          </
