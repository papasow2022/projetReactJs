import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../amazon-like.css';

const sujets = [
  { icon: 'bi bi-box-seam', titre: 'Suivre ma commande', desc: 'Consultez le statut de vos commandes et livraisons.' },
  { icon: 'bi bi-arrow-repeat', titre: 'Retourner un article', desc: 'Démarrez une procédure de retour ou d’échange.' },
  { icon: 'bi bi-cash-coin', titre: 'Remboursements', desc: 'Vérifiez le statut de vos remboursements.' },
  { icon: 'bi bi-truck', titre: 'Problème de livraison', desc: 'Signalez un retard ou un colis non reçu.' },
  { icon: 'bi bi-credit-card', titre: 'Paiement', desc: 'Gérez vos moyens de paiement et factures.' },
  { icon: 'bi bi-person', titre: 'Mon compte', desc: 'Modifiez vos informations personnelles et adresses.' },
];

const faqs = [
  {
    theme: 'Commandes',
    questions: [
      { q: 'Comment suivre ma commande ?', a: 'Rendez-vous dans la rubrique "Suivre ma commande" pour voir le statut en temps réel.' },
      { q: 'Comment annuler une commande ?', a: 'Vous pouvez annuler une commande tant qu’elle n’a pas été expédiée, depuis votre espace client.' },
    ]
  },
  {
    theme: 'Retours & Remboursements',
    questions: [
      { q: 'Comment retourner un article ?', a: 'Cliquez sur "Retourner un article" et suivez les instructions.' },
      { q: 'Quand vais-je recevoir mon remboursement ?', a: 'Le remboursement est effectué sous 3 à 5 jours après réception du retour.' },
    ]
  },
  {
    theme: 'Livraison',
    questions: [
      { q: 'Que faire si mon colis est en retard ?', a: 'Vérifiez le suivi et contactez le service client si besoin.' },
      { q: 'Puis-je modifier mon adresse de livraison ?', a: 'Oui, tant que la commande n’est pas expédiée.' },
    ]
  },
  {
    theme: 'Compte & Paiement',
    questions: [
      { q: 'Comment changer mon mot de passe ?', a: 'Allez dans "Mon compte" puis "Sécurité".' },
      { q: 'Comment ajouter une carte bancaire ?', a: 'Rendez-vous dans "Paiement" puis "Ajouter un moyen de paiement".' },
    ]
  },
];

export default function ServiceClient() {
  const [search, setSearch] = useState('');
  const [faqOpen, setFaqOpen] = useState(null);

  const faqsFiltres = search
    ? faqs.map(faq => ({
        ...faq,
        questions: faq.questions.filter(q =>
          q.q.toLowerCase().includes(search.toLowerCase()) ||
          q.a.toLowerCase().includes(search.toLowerCase())
        )
      })).filter(faq => faq.questions.length > 0)
    : faqs;

  return (
    <>
      <Header />
      <div className="container-fluid py-4">
        <h1 className="mb-4 text-warning fw-bold" style={{fontSize: '2.2rem'}}>Service Client</h1>
        <div className="mb-4">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Rechercher une question, un problème..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{maxWidth: 500}}
          />
        </div>
        <div className="row g-4 mb-5">
          {sujets.map((s, i) => (
            <div className="col-12 col-md-4" key={i}>
              <div className="card h-100 shadow-sm d-flex flex-row align-items-center gap-3 p-3">
                <div className="bg-warning rounded-circle d-flex align-items-center justify-content-center" style={{width: 54, height: 54}}>
                  <i className={s.icon + " text-dark fs-2"}></i>
                </div>
                <div>
                  <div className="fw-bold mb-1" style={{fontSize: '1.1rem'}}>{s.titre}</div>
                  <div className="text-muted small">{s.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <h3 className="mb-3 mt-5 text-primary fw-bold">Questions fréquentes</h3>
        <div className="accordion" id="faqAccordion">
          {faqsFiltres.map((faq, idx) => (
            <div className="accordion-item mb-2" key={faq.theme}>
              <h2 className="accordion-header">
                <button
                  className={"accordion-button fw-bold " + (faqOpen === idx ? '' : 'collapsed')}
                  type="button"
                  onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                  style={{fontSize: '1.1rem'}}
                >
                  {faq.theme}
                </button>
              </h2>
              <div className={"accordion-collapse collapse " + (faqOpen === idx ? 'show' : '')}>
                <div className="accordion-body">
                  {faq.questions.map((q, i) => (
                    <div key={i} className="mb-3">
                      <div className="fw-bold mb-1">{q.q}</div>
                      <div className="text-muted small">{q.a}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {faqsFiltres.length === 0 && (
            <div className="text-muted text-center py-5">Aucun résultat pour votre recherche.</div>
          )}
        </div>
        <div className="text-center mt-5">
          <button className="btn btn-warning btn-lg px-5 py-3 fw-bold" style={{fontSize: '1.2rem'}}>
            <i className="bi bi-headset me-2"></i>
            Contacter le service client
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
} 