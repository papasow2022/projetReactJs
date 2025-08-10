import React from 'react';
import { Link } from 'react-router-dom';

const faqVendeur = [
  { q: 'Comment créer mon compte vendeur ?', r: 'Cliquez sur "Devenir vendeur" depuis la page d\'accueil et suivez les étapes d\'inscription. Vous devrez fournir vos informations personnelles et professionnelles.' },
  { q: 'Quels documents sont requis ?', r: 'Pièce d\'identité, justificatif d\'adresse, et documents commerciaux selon votre activité (registre de commerce, etc.).' },
  { q: 'Comment ajouter mes produits ?', r: 'Une fois connecté à votre espace vendeur, utilisez l\'outil "Ajouter un produit" avec photos, descriptions et prix.' },
  { q: 'Quels sont les frais de commission ?', r: 'Les commissions varient selon la catégorie de produit, généralement entre 5% et 15% du prix de vente.' },
  { q: 'Comment sont gérés les paiements ?', r: 'Les paiements sont sécurisés et versés sur votre compte bancaire selon le calendrier défini (généralement 15 jours après livraison).' },
  { q: 'Que faire en cas de litige client ?', r: 'Notre équipe support vendeur vous accompagne dans la résolution des litiges. Contactez-nous rapidement.' },
];

const ressources = [
  { icon: 'bi-book', title: 'Guide du vendeur', desc: 'Tutoriels et bonnes pratiques pour optimiser vos ventes.' },
  { icon: 'bi-graph-up', title: 'Analytics', desc: 'Suivez vos performances et analysez vos données de vente.' },
  { icon: 'bi-tools', title: 'Outils marketing', desc: 'Promotions, publicités et outils pour booster vos ventes.' },
  { icon: 'bi-people', title: 'Communauté', desc: 'Échangez avec d\'autres vendeurs et partagez vos expériences.' },
];

const contacts = [
  { type: 'Support technique', email: 'support-vendeur@papasow.com', tel: '+224 123 456 789' },
  { type: 'Comptabilité', email: 'comptabilite@papasow.com', tel: '+224 123 456 790' },
  { type: 'Marketing', email: 'marketing@papasow.com', tel: '+224 123 456 791' },
];

export default function SupportVendeur() {
  return (
    <div style={{ background: '#f6f7fa', minHeight: '100vh', paddingBottom: 40 }}>
      {/* Bannière d'accroche */}
      <section style={{ background: '#232f3e', color: '#fff', padding: '48px 0 32px 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: 38, fontWeight: 900, marginBottom: 12 }}>Support Vendeur</h1>
        <p style={{ fontSize: 20, marginBottom: 28 }}>Nous sommes là pour vous accompagner dans votre réussite sur papasow.</p>
        <Link to="/vendeur" style={{ background: '#ffd814', color: '#232f3e', fontWeight: 700, fontSize: 18, padding: '12px 32px', borderRadius: 8, textDecoration: 'none', border: '2px solid #e47911', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
          Devenir vendeur
        </Link>
      </section>

      {/* Contact rapide */}
      <section style={{ maxWidth: 900, margin: '40px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: 32 }}>
        <h2 style={{ textAlign: 'center', fontSize: 26, fontWeight: 800, color: '#232f3e', marginBottom: 24 }}>Contactez notre équipe vendeur</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
          {contacts.map((c, i) => (
            <div key={i} style={{ background: '#f8f9fa', borderRadius: 8, padding: 20, minWidth: 200, flex: '1 1 200px' }}>
              <div style={{ fontWeight: 700, color: '#e47911', fontSize: 16, marginBottom: 8 }}>{c.type}</div>
              <div style={{ fontSize: 14, color: '#333', marginBottom: 4 }}>Email : {c.email}</div>
              <div style={{ fontSize: 14, color: '#333' }}>Tél : {c.tel}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Vendeur */}
      <section style={{ maxWidth: 900, margin: '0 auto 40px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: 32 }}>
        <h2 style={{ textAlign: 'center', fontSize: 22, fontWeight: 800, color: '#232f3e', marginBottom: 24 }}>Questions fréquentes vendeur</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {faqVendeur.map((f, i) => (
            <div key={i} style={{ borderBottom: '1px solid #eee', paddingBottom: 16 }}>
              <div style={{ fontWeight: 700, color: '#e47911', fontSize: 16, marginBottom: 6 }}>{f.q}</div>
              <div style={{ color: '#333', fontSize: 15, lineHeight: 1.5 }}>{f.r}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Ressources vendeur */}
      <section style={{ maxWidth: 900, margin: '0 auto 40px auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 800, color: '#232f3e', marginBottom: 24 }}>Ressources pour vendeurs</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
          {ressources.map((r, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: 24, minWidth: 200, maxWidth: 220, textAlign: 'center', flex: '1 1 200px' }}>
              <i className={`bi ${r.icon}`} style={{ fontSize: 32, color: '#e47911', marginBottom: 8 }}></i>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#232f3e', marginBottom: 6 }}>{r.title}</div>
              <div style={{ fontSize: 14, color: '#555' }}>{r.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Horaires et disponibilité */}
      <section style={{ maxWidth: 900, margin: '0 auto 40px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: 32 }}>
        <h2 style={{ textAlign: 'center', fontSize: 22, fontWeight: 800, color: '#232f3e', marginBottom: 24 }}>Horaires de support</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 700, color: '#e47911', fontSize: 16, marginBottom: 4 }}>Support téléphonique</div>
            <div style={{ color: '#333', fontSize: 15 }}>Lun-Ven : 8h-18h</div>
            <div style={{ color: '#333', fontSize: 15 }}>Sam : 9h-16h</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 700, color: '#e47911', fontSize: 16, marginBottom: 4 }}>Support email</div>
            <div style={{ color: '#333', fontSize: 15 }}>Réponse sous 24h</div>
            <div style={{ color: '#333', fontSize: 15 }}>7j/7</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 700, color: '#e47911', fontSize: 16, marginBottom: 4 }}>Chat en ligne</div>
            <div style={{ color: '#333', fontSize: 15 }}>Lun-Ven : 9h-17h</div>
            <div style={{ color: '#333', fontSize: 15 }}>Temps réel</div>
          </div>
        </div>
      </section>

      {/* Bouton retour */}
      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <Link to="/vendeur" style={{ color: '#007185', fontWeight: 700, fontSize: 17, textDecoration: 'underline', marginRight: 20 }}>
          ← Retour à l'espace vendeur
        </Link>
        <Link to="/service-client" style={{ color: '#007185', fontWeight: 700, fontSize: 17, textDecoration: 'underline' }}>
          Support client général
        </Link>
      </div>
    </div>
  );
} 