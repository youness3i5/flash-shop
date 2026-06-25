import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function FloatingHelp() {
  const [open, setOpen] = useState(false);

  return (
    <div className="float-wrap">
      {open && (
        <div className="float-menu">
          <a
            href="https://wa.me/33600000000?text=Bonjour%20FlashShop%20!%20J'ai%20besoin%20d'aide%20pour%20ma%20commande."
            target="_blank"
            rel="noopener noreferrer"
            className="float-item wa"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.116 1.532 5.838L.057 23.938a.5.5 0 00.607.607l6.1-1.475A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.655-.487-5.188-1.34l-.372-.214-3.855.933.95-3.745-.232-.386A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            WhatsApp
          </a>
          <a href="mailto:flashshop.contact@gmail.com" className="float-item email">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <rect width="20" height="16" x="2" y="4" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
            Email
          </a>
          <Link to="/aide" className="float-item faq" onClick={() => setOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <path d="M12 17h.01"/>
            </svg>
            FAQ
          </Link>
        </div>
      )}

      <button
        className={`float-btn${open ? ' active' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Aide"
      >
        {open
          ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="22" height="22"><path d="M18 6 6 18M6 6l12 12"/></svg>
          : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="22" height="22"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        }
        {!open && <span className="float-label">Aide</span>}
      </button>

      <style>{`
        .float-wrap {
          position: fixed;
          bottom: 28px;
          right: 24px;
          z-index: 500;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
        }
        .float-menu {
          display: flex;
          flex-direction: column;
          gap: 8px;
          animation: popIn 0.2s ease;
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.85) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .float-item {
          display: flex;
          align-items: center;
          gap: 10px;
          background: white;
          color: var(--text);
          border-radius: 24px;
          padding: 10px 18px 10px 14px;
          font-size: 13.5px;
          font-weight: 700;
          box-shadow: var(--shadow-hover);
          border: 1px solid var(--border);
          text-decoration: none;
          transition: all var(--transition);
          font-family: 'Poppins', sans-serif;
        }
        .float-item:hover { transform: translateX(-3px); }
        .float-item.wa { color: #16a34a; border-color: #bbf7d0; }
        .float-item.wa:hover { background: #f0fff4; }
        .float-item.email { color: var(--primary); border-color: rgba(255,59,92,0.2); }
        .float-item.email:hover { background: var(--primary-light); }
        .float-item.faq { color: #6366F1; border-color: #e0e7ff; }
        .float-item.faq:hover { background: #eef2ff; }
        .float-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--gradient);
          color: white;
          border: none;
          border-radius: 28px;
          padding: 13px 20px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: var(--shadow-primary);
          transition: all var(--transition);
          font-family: 'Poppins', sans-serif;
        }
        .float-btn:hover { transform: scale(1.05); box-shadow: 0 12px 32px rgba(255,59,92,0.45); }
        .float-btn.active { border-radius: 50%; padding: 13px; }
        .float-label { letter-spacing: 0.02em; }
      `}</style>
    </div>
  );
}
