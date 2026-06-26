import React from 'react';
import { Link, useParams } from 'react-router-dom';

const PAGES = {
  cgv: {
    title: 'Conditions Générales de Vente',
    sections: [
      { h: 'Article 1 — Objet', p: 'Les présentes CGV régissent les ventes effectuées par FlashShop auprès de ses clients via le site web flash-shop.onrender.com. Toute commande implique l\'acceptation pleine et entière des présentes CGV.' },
      { h: 'Article 2 — Prix', p: 'Les prix sont indiqués en euros TTC. FlashShop se réserve le droit de modifier ses prix à tout moment, mais s\'engage à appliquer les tarifs en vigueur lors de la commande.' },
      { h: 'Article 3 — Commandes', p: 'Les commandes sont passées via le site web. Après validation du paiement, un email de confirmation vous est adressé dans les 24h. Toute commande passée implique acceptation des CGV.' },
      { h: 'Article 4 — Livraison', p: 'Les commandes sont expédiées sous 24h ouvrés. Délais de livraison : 3 à 7 jours ouvrés en France, 5 à 10 jours pour l\'Europe (Belgique, Suisse, Luxembourg). La livraison est offerte dès 50€ d\'achat.' },
      { h: 'Article 5 — Droit de rétractation', p: 'Conformément à la loi, vous disposez de 30 jours après réception pour retourner un article. Contactez-nous à flashshop.contact@gmail.com pour initier un retour.' },
      { h: 'Article 6 — Paiement', p: 'Les paiements sont traités par Stripe via SSL. FlashShop ne stocke aucune donnée bancaire. Modes acceptés : carte bancaire (Visa, Mastercard, CB).' },
    ],
  },
  mentions: {
    title: 'Mentions Légales',
    sections: [
      { h: 'Éditeur du site', p: 'Le site FlashShop est édité par un particulier domicilié en France. Contact : flashshop.contact@gmail.com' },
      { h: 'Hébergement', p: 'Le site est hébergé par Render.com (San Francisco, CA, USA). Le code source est disponible sur GitHub.' },
      { h: 'Propriété intellectuelle', p: 'L\'ensemble du contenu du site (textes, images, logo) est la propriété exclusive de FlashShop. Toute reproduction est interdite sans autorisation écrite.' },
      { h: 'Données personnelles', p: 'FlashShop collecte uniquement les données nécessaires au traitement des commandes (nom, email, adresse). Ces données ne sont pas vendues ou partagées avec des tiers, sauf nécessité légale.' },
      { h: 'Cookies', p: 'Ce site utilise uniquement des cookies techniques nécessaires au fonctionnement (panier). Aucun cookie publicitaire n\'est utilisé.' },
    ],
  },
};

export default function Legal() {
  const { page } = useParams();
  const data = PAGES[page];

  if (!data) {
    return (
      <div className="container" style={{ padding: '80px 16px', textAlign: 'center' }}>
        <h1>Page introuvable</h1>
        <Link to="/" className="btn btn-primary" style={{ marginTop: 24 }}>Retour à l'accueil</Link>
      </div>
    );
  }

  return (
    <div className="legal-page">
      <div className="legal-hero">
        <div className="container">
          <Link to="/" className="legal-back">← Retour</Link>
          <h1 className="anim-fade-up">{data.title}</h1>
        </div>
      </div>
      <div className="container legal-body">
        {data.sections.map((s, i) => (
          <div key={i} className="legal-section reveal" style={{ transitionDelay: `${i * 0.06}s` }}>
            <h2>{s.h}</h2>
            <p>{s.p}</p>
          </div>
        ))}
        <div className="legal-footer">
          <p>Dernière mise à jour : juin 2026</p>
          <Link to="/aide" className="btn btn-primary">Questions ? Contactez-nous →</Link>
        </div>
      </div>

      <style>{`
        .legal-page { padding-bottom: 80px; }
        .legal-hero {
          background: var(--bg-gray); border-bottom: 1px solid var(--border);
          padding: 40px 0 32px;
        }
        .legal-back {
          display: inline-block; color: var(--text-muted); font-size: 13px;
          font-weight: 600; margin-bottom: 16px; transition: color 0.2s;
        }
        .legal-back:hover { color: var(--primary); }
        .legal-hero h1 { font-size: 30px; font-weight: 900; }
        .legal-body { padding-top: 40px; max-width: 720px; }
        .legal-section {
          padding: 24px 0; border-bottom: 1px solid var(--border);
        }
        .legal-section h2 { font-size: 15px; font-weight: 800; margin-bottom: 10px; }
        .legal-section p { font-size: 14px; color: var(--text-muted); line-height: 1.75; }
        .legal-footer { padding-top: 32px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
        .legal-footer p { font-size: 13px; color: var(--text-light); }
      `}</style>
    </div>
  );
}
