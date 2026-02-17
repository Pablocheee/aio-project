'use client';
import React, { useState, useEffect } from 'react';

export default function Home() {
  const [currentLang, setCurrentLang] = useState('ru');
  const [chatHistory, setChatHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [liveLogs, setLiveLogs] = useState(['> SYSTEM_BOOT_SEQUENCE_INITIATED...']);

  // Переводы
  const translations = {
    ru: { 
      title: 'СЕМАНТИЧЕСКАЯ <span class="text-[#34D59A] drop-shadow-[0_0_8px_rgba(52,213,154,0.8)]">ИНДЕКСАЦИЯ</span>', 
      desc: 'АВТОНОМНЫЙ ПРОТОКОЛ ИНТЕГРАЦИИ ДАННЫХ.',
      btn: '[RU]'
    },
    en: { 
      title: 'SEMANTIC <span class="text-[#34D59A] drop-shadow-[0_0_8px_rgba(52,213,154,0.8)]">INDEXING</span>', 
      desc: 'AUTONOMOUS DATA INTEGRATION PROTOCOL.',
      btn: '[EN]'
    }
  };

  // Эмуляция логов
  useEffect(() => {
    const logLines = [
      "SCANNING_NODES...", 
      "VECTORIZING_INPUT_STREAM...", 
      "RAG_LAYER_SYNC: 98%", 
      "LATENCY_CHECK: 24ms", 
      "SEMANTIC_WEIGHTS_CALCULATED", 
      "ENCRYPTED_BRIDGE: ACTIVE"
    ];
    const interval = setInterval(() => {
      setLiveLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] > ${logLines[Math.floor(Math.random() * logLines.length)]}`].slice(-4));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const addMsg = (txt, role = 'assistant') => setChatHistory(prev => [...prev, { role, content: txt }]);

  // Обработка чата
  const processInput = async () => {
    if (!inputValue.trim()) return;
    const userMsg = inputValue;
    addMsg(userMsg, 'user');
    setInputValue('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, history: chatHistory, lang: currentLang })
      });
      const data = await res.json();
      addMsg(data.reply, 'assistant');
    } catch (e) { addMsg("CONNECTION_ERROR: RETRYING..."); }
  };

  return (
    <div className="min-h-screen bg-black text-[#34D59A] font-mono selection:bg-[#34D59A] selection:text-black overflow-hidden relative">
      
      {/* ГЛОБАЛЬНЫЙ СБРОС ЦВЕТОВ (Убивает белый фильтр) */}
      <style jsx global>{`
        body, html {
          background-color: #000000 !important;
          color: #34D59A;
        }
        ::selection {
          background: #34D59A;
          color: black;
        }
        /* Кастомный скроллбар */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #34D59A; }
      `}</style>

      {/* 1. ФОНОВОЕ ВИДЕО (Затемнено на 80%) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <video autoPlay muted loop playsInline poster="/poster.avif" className="w-full h-full object-cover opacity-20 grayscale">
          <source src="/hero-av1.mp4" type="video/mp4" />
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        {/* Слой абсолютной черноты поверх видео */}
        <div className="absolute inset-0 bg-black/80" />
        {/* Сетка поверх видео (Scanlines) */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none" />
      </div>

      {/* 2. ОСНОВНОЙ ИНТЕРФЕЙС */}
      <div className="relative z-20 flex flex-col min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-16 border-b border-[#3
