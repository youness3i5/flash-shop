import React, { useState, useEffect, useCallback } from 'react';

let addToast = null;

export function useToast() {
  return addToast;
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev.slice(-3), { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span className="toast-icon">
            {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}
          </span>
          {t.message}
        </div>
      ))}
      <style>{`
        .toast-container {
          position: fixed; bottom: 28px; left: 50%;
          transform: translateX(-50%);
          z-index: 9000;
          display: flex; flex-direction: column; gap: 8px;
          pointer-events: none;
          align-items: center;
        }
        .toast {
          background: var(--bg-dark); color: white;
          padding: 13px 20px;
          border-radius: 28px;
          font-size: 13.5px; font-weight: 700;
          display: flex; align-items: center; gap: 10px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          animation: toastIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both;
          white-space: nowrap;
        }
        .toast-success { background: #0f172a; border: 1px solid rgba(52,211,153,0.3); }
        .toast-icon {
          width: 22px; height: 22px;
          background: var(--gradient); color: white;
          border-radius: 50%; display: inline-flex;
          align-items: center; justify-content: center;
          font-size: 11px; flex-shrink: 0;
        }
        .toast-success .toast-icon { background: linear-gradient(135deg, #059669, #10B981); }
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(20px) scale(0.9); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
