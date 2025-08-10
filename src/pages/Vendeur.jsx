import React from 'react';
import { Link } from 'react-router-dom';

const chiffresCles = [
  { label: '10 000+', value: 'Clients actifs', icon: 'bi-people' },
  { label: '15', value: 'Pays desservis', icon: 'bi-globe' },
  { label: '+120%', value: 'Croissance annuelle', icon: 'bi-graph-up' },
];

const avantages = [
  { icon: 'bi-cash-coin', title: 'Gagnez plus', desc: 'Accédez à une large clientèle et augmentez vos revenus.' },
  { icon: 'bi-truck', title: 'Livraison simplifiée', desc: 'Nous gérons la logistique pour vous.' },
  { icon: 'bi-bar-chart', title: 'Outils de suivi', desc: 'Suivez vos ventes et vos performances en temps réel.' },
  { icon: 'bi-shield-check', title: 'Sécurité', desc: 'Transactions et paiements sécurisés.' },
];

const etapes = [
  { icon: 'bi-person-plus', title: '1. Inscrivez-vous', desc: 'Créez votre compte vendeur en quelques clics.' },
  { icon: 'bi-box-seam', title: '2. Ajoutez vos produits', desc: 'Publiez vos articles facilement.' },
  { icon: 'bi-bag-check', title: '3. Vendez & expédiez', desc: 'Recevez vos commandes et expédiez-les.' },
  { icon: 'bi-emoji-smile', title: '4. Encaissez', desc: 'Recevez vos paiements rapidement.' },
];

const temoignages = [
  { nom: 'Fatou', texte: '“Grâce à papasow, j’ai multiplié mes ventes par 3 en 6 mois !”', photo: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { nom: 'Moussa', texte: '“La gestion des commandes est super simple, je recommande à tous les commerçants.”', photo: 'https://randomuser.me/api/portraits/men/32.jpg' },
];

const faq = [
  { q: 'Comment devenir vendeur ?', r: 'Cliquez sur “Devenir vendeur” et suivez les étapes d’inscription.' },
  { q: 'Quels sont les frais ?', r: 'L’inscription est gratuite, une commission est prélevée sur chaque vente.' },
  { q: 'Comment suivre mes ventes ?', r: 'Un tableau de bord détaillé est disponible dans votre espace vendeur.' },
  { q: 'Puis-je vendre à l’international ?', r: 'Oui, papasow livre dans 15 pays.' },
];

export default function Vendeur() {
  return (
    <div style={{ background: '#f6f7fa', minHeight: '100vh', paddingBottom: 40 }}>
      {/* Bannière d’accroche */}
      <section style={{ background: '#232f3e', color: '#fff', padding: '48px 0 32px 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: 38, fontWeight: 900, marginBottom: 12 }}>Vendez sur papasow</h1>
        <p style={{ fontSize: 20, marginBottom: 28 }}>Développez votre activité et touchez des milliers de clients partout en Afrique et dans le monde.</p>
        <Link to="/inscription-vendeur" style={{ background: '#ffd814', color: '#232f3e', fontWeight: 700, fontSize: 20, padding: '14px 38px', borderRadius: 8, textDecoration: 'none', border: '2px solid #e47911', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
          Devenir vendeur
        </Link>
      </section>

      {/* Chiffres clés */}
      <section style={{ display: 'flex', justifyContent: 'center', gap: 48, margin: '40px 0 32px 0', flexWrap: 'wrap' }}>
        {chiffresCles.map((c, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: 28, minWidth: 180, textAlign: 'center' }}>
            <i className={`bi ${c.icon}`} style={{ fontSize: 32, color: '#e47911', marginBottom: 8 }}></i>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#232f3e' }}>{c.label}</div>
            <div style={{ fontSize: 15, color: '#555', marginTop: 2 }}>{c.value}</div>
          </div>
        ))}
      </section>

      {/* Avantages */}
      <section style={{ maxWidth: 1100, margin: '0 auto 40px auto', display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center' }}>
        {avantages.map((a, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: 28, minWidth: 220, maxWidth: 260, textAlign: 'center', flex: '1 1 220px' }}>
            <i className={`bi ${a.icon}`} style={{ fontSize: 32, color: '#e47911', marginBottom: 8 }}></i>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#232f3e', marginBottom: 6 }}>{a.title}</div>
            <div style={{ fontSize: 15, color: '#555' }}>{a.desc}</div>
          </div>
        ))}
      </section>

      {/* Étapes */}
      <section style={{ background: '#fff', borderRadius: 12, maxWidth: 1100, margin: '0 auto 40px auto', padding: '32px 0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h2 style={{ textAlign: 'center', fontSize: 26, fontWeight: 800, color: '#232f3e', marginBottom: 32 }}>Comment ça marche ?</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
          {etapes.map((e, i) => (
            <div key={i} style={{ minWidth: 180, maxWidth: 220, textAlign: 'center', flex: '1 1 180px' }}>
              <i className={`bi ${e.icon}`} style={{ fontSize: 32, color: '#e47911', marginBottom: 8 }}></i>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#232f3e', marginBottom: 4 }}>{e.title}</div>
              <div style={{ fontSize: 15, color: '#555' }}>{e.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Témoignages vendeurs */}
      <section style={{ maxWidth: 900, margin: '0 auto 40px auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 800, color: '#232f3e', marginBottom: 24 }}>Ils vendent déjà sur papasow</h2>
        <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
          {temoignages.map((t, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: 24, minWidth: 220, maxWidth: 320, textAlign: 'center', flex: '1 1 220px' }}>
              <img src={t.photo} alt={t.nom} style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', marginBottom: 10, border: '2px solid #ffd814' }} />
              <div style={{ fontSize: 15, fontStyle: 'italic', color: '#444', marginBottom: 8 }}>{t.texte}</div>
              <div style={{ fontWeight: 700, color: '#232f3e' }}>{t.nom}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ vendeur */}
      <section style={{ maxWidth: 900, margin: '0 auto 40px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: 32 }}>
        <h2 style={{ textAlign: 'center', fontSize: 22, fontWeight: 800, color: '#232f3e', marginBottom: 24 }}>Questions fréquentes</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {faq.map((f, i) => (
            <div key={i} style={{ borderBottom: '1px solid #eee', paddingBottom: 10 }}>
              <div style={{ fontWeight: 700, color: '#e47911', fontSize: 16 }}>{f.q}</div>
              <div style={{ color: '#333', fontSize: 15 }}>{f.r}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Section aide/contact */}
      <section style={{ textAlign: 'center', marginTop: 32 }}>
        <div style={{ fontSize: 16, color: '#232f3e', marginBottom: 8 }}>
          Une question ? Besoin d’aide pour démarrer ?
        </div>
        <Link to="/support-vendeur" style={{ color: '#007185', fontWeight: 700, fontSize: 17, textDecoration: 'underline' }}>
          Contacter le support vendeur
        </Link>
      </section>

      {/* Bouton devenir vendeur toujours visible en bas */}
      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <Link to="/inscription-vendeur" style={{ background: '#ffd814', color: '#232f3e', fontWeight: 700, fontSize: 20, padding: '14px 38px', borderRadius: 8, textDecoration: 'none', border: '2px solid #e47911', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
          Devenir vendeur
        </Link>
      </div>
    </div>
  );
} 