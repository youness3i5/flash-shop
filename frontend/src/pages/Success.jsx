import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const CONFETTI_COLORS = ['#FF3B5C','#FF6B35','#00C9B1','#F59E0B','#8B5CF6','#3B82F6'];

function Confetti() {
  const [pieces] = useState(() =>
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 1.5,
      dur: 2.5 + Math.random() * 1.5,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: 6 + Math.random() * 8,
      rot: Math.random() * 360,
    }))
  );

  return (
    <div className="confetti-wrap" aria-hidden>
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            background: p.color,
            width: p.size,
            height: p.size * 0.6,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            transform: `rotate(${p.rot}deg)`,
          }}
        />
      ))}
      <style>{`
        .confetti-wrap {
          position: fixed; inset: 0; pointer-events: none; z-index: 9999; overflow: hidden;
        }
        .confetti-piece {
          position: absolute;
          top: -20px;
          border-radius: 2px;
          animation: fall linear both;
          opacity: 0.9;
        }
        @keyframes fall {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default function Success() {
  const [params] = useSearchParams();
  const orderId = params.get('order_id');
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="success-page">
      {showConfetti && <Confetti />}

      <div className="success-card anim-scale-in">
        <div className="success-check">
          <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="26" cy="26" r="26" fill="url(#sg)" />
            <path d="M14 26l8 8 16-16" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ strokeDasharray: 40, strokeDashoffset: 40, animation: 'drawCheck 0.5s 0.3s ease forwards' }}
            />
            <defs>
              <linearGradient id="sg" x1="0" y1="0" x2="52" y2="52">
                <stop stopColor="#FF3B5C"/><stop offset="1" stopColor="#FF6B35"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        <h1 className="success-h1">Commande confirmée ! 🎉</h1>
        <p className="success-p">
          Merci pour ton achat. Un email de confirmation t'a été envoyé avec tous les détails.
        </p>

        {orderId && (
          <div className="order-ref">
            <span>Référence commande</span>
            <strong>#{orderId.slice(0, 10).toUpperCase()}</strong>
          </div>
        )}

        <div className="success-steps">
          <div className="step">
            <div className="step-dot done">✓</div>
            <div className="step-line" />
            <div className="step-content">
              <strong>Paiement confirmé</strong>
              <p>Ta commande a bien été reçue</p>
            </div>
          </div>
          <div className="step">
            <div className="step-dot current">2</div>
            <div className="step-line" />
            <div className="step-content">
              <strong>Préparation en cours</strong>
              <p>Ton colis est préparé sous 24–48h</p>
            </div>
          </div>
          <div className="step">
            <div className="step-dot">3</div>
            <div className="step-content">
              <strong>Livraison</strong>
              <p>Suivi par email avec ton numéro de colis</p>
            </div>
          </div>
        </div>

        <div className="success-btns">
          <Link to="/catalogue" className="btn btn-primary">
            Continuer mes achats →
          </Link>
          <Link to="/" className="btn btn-ghost">Retour à l'accueil</Link>
        </div>
      </div>

      <style>{`
        .success-page {
          min-height: calc(100vh - 64px);
          display: flex; align-items: center; justify-content: center;
          padding: 40px 16px;
          background: linear-gradient(160deg, #0d0d0d 0%, #1a1a2e 100%);
          position: relative;
        }
        .success-card {
          background: white; border-radius: 24px;
          padding: 52px 44px; max-width: 520px; width: 100%;
          text-align: center; box-shadow: 0 32px 80px rgba(0,0,0,0.3);
          display: flex; flex-direction: column; align-items: center; gap: 22px;
        }
        .success-check {
          width: 72px; height: 72px;
          animation: popIn 0.5s ease both;
        }
        @keyframes popIn { 0%{transform:scale(0)} 80%{transform:scale(1.1)} 100%{transform:scale(1)} }
        @keyframes drawCheck { to { stroke-dashoffset: 0; } }

        .success-h1 { font-size: 26px; font-weight: 900; letter-spacing: -0.5px; }
        .success-p { color: var(--text-muted); font-size: 14.5px; line-height: 1.7; max-width: 360px; }

        .order-ref {
          background: var(--bg-gray); border: 1px solid var(--border);
          border-radius: var(--radius-sm); padding: 14px 20px;
          display: flex; align-items: center; justify-content: space-between;
          width: 100%; font-size: 13px;
        }
        .order-ref span { color: var(--text-muted); font-weight: 500; }
        .order-ref strong { font-size: 14px; font-family: monospace; color: var(--primary); }

        .success-steps {
          width: 100%; background: var(--bg-gray); border-radius: var(--radius);
          padding: 20px 18px; display: flex; flex-direction: column; gap: 0; text-align: left;
        }
        .step {
          display: grid; grid-template-columns: 32px auto 1fr; gap: 12px; align-items: start;
        }
        .step-dot {
          width: 32px; height: 32px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 800; background: var(--border);
          color: var(--text-muted); flex-shrink: 0;
        }
        .step-dot.done { background: var(--gradient); color: white; }
        .step-dot.current { background: var(--gradient); color: white; animation: pulse 1.5s ease-in-out infinite; }
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(255,59,92,0.4)} 50%{box-shadow:0 0 0 8px rgba(255,59,92,0)} }
        .step-line {
          width: 2px; height: 100%; background: var(--border);
          min-height: 32px; margin: 0 auto; grid-column: 1; grid-row: 1; align-self: stretch;
          margin-top: 32px;
        }
        .step-content { padding: 5px 0 20px; }
        .step:last-child .step-content { padding-bottom: 4px; }
        .step-content strong { display: block; font-size: 14px; font-weight: 700; margin-bottom: 2px; }
        .step-content p { font-size: 12.5px; color: var(--text-muted); }

        .success-btns { display: flex; flex-direction: column; gap: 10px; width: 100%; }
        .success-btns .btn { width: 100%; padding: 14px; font-size: 14.5px; }

        @media (max-width: 480px) {
          .success-card { padding: 36px 24px; }
        }
      `}</style>
    </div>
  );
}
