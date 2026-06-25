import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQS = [
  {
    q: 'Comment passer une commande ?',
    a: 'C\'est simple ! Parcours notre catalogue, ajoute les produits que tu veux dans ton panier, puis clique sur "Commander". Tu seras redirigé vers notre page de paiement sécurisée Stripe. Remplis tes informations et c\'est parti !'
  },
  {
    q: 'Quels sont les délais de livraison ?',
    a: 'Les commandes sont expédiées sous 24h (jours ouvrés). Le délai de livraison en France est de 3 à 7 jours ouvrés. Pour l\'Europe (Belgique, Suisse, Luxembourg), comptez 5 à 10 jours ouvrés.'
  },
  {
    q: 'Est-ce que la livraison est gratuite ?',
    a: 'La livraison est GRATUITE dès 50€ d\'achat ! En dessous de 50€, les frais de port sont de 4,99€ pour la France métropolitaine.'
  },
  {
    q: 'Comment suivre ma commande ?',
    a: 'Dès que ta commande est expédiée, tu reçois un email avec ton numéro de suivi. Tu peux suivre ton colis directement sur le site du transporteur.'
  },
  {
    q: 'Puis-je retourner un article ?',
    a: 'Oui ! Tu as 30 jours après réception pour retourner un article non utilisé dans son emballage d\'origine. Contacte-nous par email et on s\'occupe de tout.'
  },
  {
    q: 'Le paiement est-il sécurisé ?',
    a: 'Absolument. Tous les paiements sont traités par Stripe, leader mondial du paiement en ligne. Tes données bancaires ne nous sont jamais communiquées — tout passe directement par Stripe avec chiffrement SSL.'
  },
  {
    q: 'Les produits correspondent-ils aux photos ?',
    a: 'On fait de notre mieux pour que les photos soient représentatives. Les couleurs peuvent légèrement varier selon les écrans. En cas de doute, contacte-nous avant de commander !'
  },
  {
    q: 'Comment vous contacter ?',
    a: 'Tu peux nous écrire à flashshop.contact@gmail.com. On répond dans les 12h en semaine et 24h le week-end. Tu peux aussi nous contacter via WhatsApp en cliquant sur le bouton vert en bas à droite !'
  },
];

export default function Help() {
  const [open, setOpen] = useState(null);

  return (
    <div className="help-page">
      <div className="help-hero">
        <div className="container help-hero-inner">
          <div>
            <div className="help-eyebrow">Support</div>
            <h1 className="anim-fade-up">Centre d'aide 💬</h1>
            <p className="anim-fade-up anim-d1">Trouve la réponse à ta question ou contacte-nous directement. On répond sous 12h.</p>
          </div>
          <div className="help-hero-trust anim-scale-in anim-d2">
            <div className="help-trust-item"><span>⚡</span>Réponse en 12h</div>
            <div className="help-trust-item"><span>🔒</span>Paiement sécurisé</div>
            <div className="help-trust-item"><span>🔄</span>Retours 30 jours</div>
          </div>
        </div>
      </div>

      <div className="container help-body">

        {/* Contact rapide */}
        <div className="contact-cards">
          <a
            href="https://wa.me/33600000000?text=Bonjour%20FlashShop%2C%20j'ai%20une%20question%20sur%20ma%20commande."
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card whatsapp"
          >
            <span className="contact-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.116 1.532 5.838L.057 23.938a.5.5 0 00.607.607l6.1-1.475A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.655-.487-5.188-1.34l-.372-.214-3.855.933.95-3.745-.232-.386A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
            </span>
            <div>
              <strong>WhatsApp</strong>
              <p>Répond en moins de 30 min</p>
            </div>
          </a>
          <a href="mailto:flashshop.contact@gmail.com" className="contact-card email">
            <span className="contact-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </span>
            <div>
              <strong>Email</strong>
              <p>flashshop.contact@gmail.com</p>
            </div>
          </a>
        </div>

        {/* FAQ */}
        <div id="faq">
          <h2 className="faq-title">Questions fréquentes</h2>
          <div className="faq-list">
            {FAQS.map((faq, i) => (
              <div key={i} className={`faq-item${open === i ? ' open' : ''}`}>
                <button
                  className="faq-q"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                >
                  <span>{faq.q}</span>
                  <svg
                    className="faq-arrow"
                    width="18" height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </button>
                {open === i && <p className="faq-a">{faq.a}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="back-to-shop">
          <Link to="/catalogue" className="btn btn-primary">
            ← Retourner au catalogue
          </Link>
        </div>
      </div>

      <style>{`
        .help-page { padding-bottom: 80px; }
        .help-hero {
          background: linear-gradient(160deg, #0d0d0d 0%, #1a1a2e 100%);
          padding: 64px 0 52px;
          position: relative;
          overflow: hidden;
        }
        .help-hero::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 600px 400px at 80% 50%, rgba(0,201,177,0.1), transparent);
          pointer-events: none;
        }
        .help-hero-inner {
          display: flex; align-items: center;
          justify-content: space-between; gap: 40px;
          position: relative; z-index: 1;
          flex-wrap: wrap;
        }
        .help-eyebrow {
          font-size: 11px; font-weight: 800; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--accent);
          margin-bottom: 12px;
        }
        .help-hero h1 {
          font-size: clamp(28px, 4vw, 46px); font-weight: 900;
          margin-bottom: 12px; color: white; letter-spacing: -1px;
        }
        .help-hero p { color: rgba(255,255,255,0.6); font-size: 15px; max-width: 420px; line-height: 1.7; }
        .help-hero-trust {
          display: flex; flex-direction: column; gap: 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: var(--radius); padding: 20px 24px;
        }
        .help-trust-item {
          display: flex; align-items: center; gap: 10px;
          font-size: 13.5px; font-weight: 700; color: white;
        }
        .help-trust-item span { font-size: 20px; }
        .help-body { padding-top: 48px; max-width: 760px; }

        .contact-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 48px;
        }
        .contact-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px 24px;
          border-radius: var(--radius);
          border: 1.5px solid var(--border);
          transition: all var(--transition);
          text-decoration: none;
          color: var(--text);
        }
        .contact-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-hover); }
        .contact-card.whatsapp { border-color: #25D366; }
        .contact-card.whatsapp:hover { background: #f0fff4; }
        .contact-card.email:hover { background: var(--primary-light); border-color: var(--primary); }
        .contact-icon {
          width: 52px; height: 52px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .contact-card.whatsapp .contact-icon { background: #dcfce7; color: #16a34a; }
        .contact-card.email .contact-icon { background: var(--primary-light); color: var(--primary); }
        .contact-card strong { display: block; font-size: 15px; font-weight: 800; margin-bottom: 3px; }
        .contact-card p { font-size: 13px; color: var(--text-muted); }

        .faq-title { font-size: 22px; font-weight: 900; margin-bottom: 20px; }
        .faq-list { display: flex; flex-direction: column; gap: 0; border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
        .faq-item { border-bottom: 1px solid var(--border); }
        .faq-item:last-child { border-bottom: none; }
        .faq-q {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 18px 20px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 700;
          text-align: left;
          color: var(--text);
          transition: background var(--transition);
          font-family: 'Poppins', sans-serif;
        }
        .faq-q:hover { background: var(--bg-gray); }
        .faq-item.open .faq-q { color: var(--primary); background: var(--primary-light); }
        .faq-arrow { flex-shrink: 0; transition: transform 0.25s; }
        .faq-item.open .faq-arrow { transform: rotate(180deg); }
        .faq-a {
          padding: 0 20px 18px;
          font-size: 14px;
          color: var(--text-muted);
          line-height: 1.7;
        }
        .back-to-shop { margin-top: 48px; }

        @media (max-width: 600px) {
          .contact-cards { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
