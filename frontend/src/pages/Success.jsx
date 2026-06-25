import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

export default function Success() {
  const [params] = useSearchParams();
  const orderId = params.get('order_id');

  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-icon">✅</div>
        <h1 className="success-title">Commande confirmée !</h1>
        <p className="success-text">
          Merci pour votre achat. Vous allez recevoir un email de confirmation.
        </p>
        {orderId && (
          <p className="order-ref">
            Référence : <strong>#{orderId.toUpperCase()}</strong>
          </p>
        )}
        <div className="success-steps">
          <div className="step">
            <span className="step-icon">📧</span>
            <div>
              <strong>Email de confirmation</strong>
              <p>Vous recevrez un récapitulatif de votre commande.</p>
            </div>
          </div>
          <div className="step">
            <span className="step-icon">📦</span>
            <div>
              <strong>Préparation</strong>
              <p>Votre commande est prise en charge sous 24–48h.</p>
            </div>
          </div>
          <div className="step">
            <span className="step-icon">🚚</span>
            <div>
              <strong>Livraison</strong>
              <p>Expédition avec numéro de suivi fourni par email.</p>
            </div>
          </div>
        </div>
        <Link to="/" className="btn btn-primary home-btn">
          Retour à l'accueil
        </Link>
        <Link to="/catalogue" className="btn btn-ghost catalog-btn">
          Continuer mes achats
        </Link>
      </div>

      <style>{`
        .success-page {
          min-height: calc(100vh - 60px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 16px;
          background: linear-gradient(135deg, #fff5f5, #fff);
        }
        .success-card {
          background: white;
          border-radius: 20px;
          padding: 48px;
          max-width: 520px;
          width: 100%;
          text-align: center;
          box-shadow: var(--shadow-hover);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }
        .success-icon { font-size: 64px; animation: pop 0.5s ease; }
        @keyframes pop {
          0% { transform: scale(0); }
          80% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .success-title { font-size: 28px; font-weight: 900; }
        .success-text { color: var(--text-muted); line-height: 1.6; }
        .order-ref {
          background: var(--bg-gray);
          border-radius: 8px;
          padding: 10px 20px;
          font-size: 14px;
          color: var(--text-muted);
        }
        .success-steps {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 14px;
          text-align: left;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 20px;
        }
        .step {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }
        .step-icon { font-size: 24px; flex-shrink: 0; }
        .step strong { display: block; font-size: 14px; margin-bottom: 2px; }
        .step p { font-size: 13px; color: var(--text-muted); }
        .home-btn { width: 100%; padding: 14px; font-size: 15px; }
        .catalog-btn { width: 100%; font-size: 14px; color: var(--text-muted); }
      `}</style>
    </div>
  );
}
