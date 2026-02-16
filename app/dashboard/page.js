import React, { useState, useEffect } from 'react';

// Эмуляция данных для кабинета
const MOCK_LOGS = [
  "[SYSTEM] Initializing AIO Protocol v3.3...",
  "[CHECK] Semantic integrity: 12%",
  "[WARN] Low neural visibility detected.",
  "[WAIT] Awaiting activation..."
];

const ACTIVE_LOGS = [
  "[CONNECT] Handshaking with GPT-4o node...",
  "[CONNECT] Ping Claude-3-Opus: 12ms",
  "[UPLOAD] Injecting semantic vectors...",
  "[SUCCESS] Chunk #1492 indexed.",
  "[OPTIMIZE] Reducing token cost...",
  "[SYNC] AIO Database updated."
];

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState(MOCK_LOGS);
  const [accessCode, setAccessCode] = useState('');

  useEffect(() => {
    const savedUrl = localStorage.getItem('aio_project_url');
    if (savedUrl) {
      setAccessCode(savedUrl);
      setIsLoggedIn(true); // Автоматически пускаем в кабинет
    }
  }, []);

  // Логика "Входа" (пока пускает с любым кодом)
  const handleLogin = () => {
    if (accessCode.trim().length > 0) {
      setIsLoggedIn(true);
    }
  };

  // Логика "Оплаты" (Симуляция)
  const handlePayment = () => {
    setHasPaid(true);
    setLogs((prev) => [...prev, "[PAYMENT] Transaction verified.", "[START] Protocol Activated."]);
  };

  // Эффект "Живой индексации" после оплаты
  useEffect(() => {
    if (hasPaid && progress < 100) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + Math.floor(Math.random() * 5);
          return next > 100 ? 100 : next;
        });
        // Добавляем случайный лог
        const randomLog = ACTIVE_LOGS[Math.floor(Math.random() * ACTIVE_LOGS.length)];
        setLogs((prev) => [...prev.slice(-6), `[${new Date().toLocaleTimeString()}] ${randomLog}`]);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [hasPaid, progress]);

  // --- ЭКРАН 1: ВХОД ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black text-cyan-500 font-mono flex flex-col items-center justify-center p-4">
        <div className="border border-cyan-500/30 p-8 w-full max-w-md bg-black shadow-[0_0_20px_rgba(6,182,212,0.1)]">
          <h1 className="text-2xl mb-6 tracking-widest text-center border-b border-cyan-900 pb-2">AIO.CORE // ACCESS</h1>
          <p className="text-xs text-gray-500 mb-4">SECURE ENVIRONMENT. AUTHORIZED PERSONNEL ONLY.</p>
          <input 
            type="text" 
            placeholder="ENTER PROJECT URL OR TOKEN"
            className="w-full bg-gray-900 border border-cyan-800 p-3 mb-4 text-white focus:outline-none focus:border-cyan-400 placeholder-gray-700"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
          />
          <button 
            onClick={handleLogin}
            className="w-full bg-cyan-900/20 hover:bg-cyan-500/20 border border-cyan-500 text-cyan-400 py-3 transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          >
            INITIALIZE SESSION
          </button>
        </div>
      </div>
    );
  }

  // --- ЭКРАН 2: ЛИЧНЫЙ КАБИНЕТ ---
  return (
    <div className="min-h-screen bg-black text-gray-300 font-mono p-4 md:p-8">
      {/* HEADER */}
      <header className="flex justify-between items-center border-b border-gray-800 pb-4 mb-8">
        <div>
          <h1 className="text-xl text-cyan-400 tracking-widest">AIO.CORE // DASHBOARD</h1>
          <p className="text-xs text-gray-600">PROJECT: {accessCode}</p>
        </div>
        <div className="text-right">
          <p className={`text-sm ${hasPaid ? "text-green-500 animate-pulse" : "text-red-500"}`}>
            STATUS: {hasPaid ? "ACTIVE SYNC" : "LIMITED ACCESS"}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: STATS */}
        <div className="md:col-span-1 space-y-6">
          <div className="border border-gray-800 p-4 bg-gray-900/30">
            <h3 className="text-gray-500 text-xs mb-2">NEURAL AUTHORITY SCORE</h3>
            <div className="text-4xl text-white font-bold">{hasPaid ? Math.floor(progress * 0.74) : "12"}/100</div>
            <div className="w-full bg-gray-800 h-1 mt-2">
              <div 
                className="bg-cyan-500 h-1 transition-all duration-500" 
                style={{ width: `${hasPaid ? Math.floor(progress * 0.74) : 12}%` }}
              ></div>
            </div>
          </div>

          <div className="border border-gray-800 p-4 bg-gray-900/30">
            <h3 className="text-gray-500 text-xs mb-2">INDEXED NODES</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>GPT-4o</span>
                <span className={hasPaid ? "text-green-500" : "text-red-500"}>{hasPaid ? "CONNECTED" : "BLOCKED"}</span>
              </li>
              <li className="flex justify-between">
                <span>Claude 3.5</span>
                <span className={hasPaid ? "text-green-500" : "text-yellow-600"}>{hasPaid ? "CONNECTED" : "WAITING"}</span>
              </li>
              <li className="flex justify-between">
                <span>Google Gemini</span>
                <span className={hasPaid ? "text-green-500" : "text-red-500"}>{hasPaid ? "CONNECTED" : "BLOCKED"}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CENTER COLUMN: MAIN ACTION */}
        <div className="md:col-span-2 space-y-6">
          
          {/* LOG WINDOW */}
          <div className="border border-cyan-900/50 bg-black p-4 h-64 overflow-y-auto font-mono text-xs">
            {logs.map((log, i) => (
              <div key={i} className="mb-1 text-cyan-700">
                <span className="text-gray-600 mr-2">{">"}</span>
                {log}
              </div>
            ))}
            {hasPaid && (
              <div className="animate-pulse text-cyan-400 mt-2">_ PROCESSING NEXT BATCH...</div>
            )}
          </div>

          {/* ACTION AREA */}
          {!hasPaid ? (
            <div className="border border-red-900/50 bg-red-900/10 p-6 text-center">
              <h2 className="text-red-400 text-lg mb-2">PROTOCOL ACTIVATION REQUIRED</h2>
              <p className="text-sm text-gray-400 mb-4">
                To enable AIO synchronization and unlock Neural Authority, complete the transfer.
              </p>
              <div className="bg-black p-3 text-xs text-gray-300 mb-4 border border-gray-700">
                USDT (TRC20): T...[ТВОЙ КОШЕЛЕК]...X
              </div>
              <button 
                onClick={handlePayment}
                className="bg-red-600 hover:bg-red-500 text-white px-8 py-2 text-sm uppercase tracking-wider transition-colors"
              >
                I have made the payment
              </button>
            </div>
          ) : (
            <div className="border border-green-900/50 bg-green-900/10 p-6">
              <h2 className="text-green-400 text-lg mb-2">SYNC IN PROGRESS</h2>
              <p className="text-sm text-gray-400 mb-4">Do not close this tab while initial handshake is active.</p>
              <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-green-500 h-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-right text-xs text-green-400 mt-1">{progress}% COMPLETE</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
