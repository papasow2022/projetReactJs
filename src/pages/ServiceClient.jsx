import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../amazon-like.css';

const sujets = [
  { icon: 'bi bi-box-seam', titre: 'Suivre ma commande', desc: 'Consultez le statut de vos commandes et livraisons.' },
  { icon: 'bi bi-arrow-repeat', titre: 'Retourner un article', desc: 'Démarrez une procédure de retour ou d\'échange.' },
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
      { q: 'Comment annuler une commande ?', a: 'Vous pouvez annuler une commande tant qu\'elle n\'a pas été expédiée, depuis votre espace client.' },
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
      { q: 'Puis-je modifier mon adresse de livraison ?', a: 'Oui, tant que la commande n\'est pas expédiée.' },
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

const contactMethods = [
  {
    icon: 'bi bi-telephone-fill',
    title: 'Téléphone',
    desc: 'Service client disponible 7j/7',
    contact: '01 23 45 67 89',
    availability: 'Lun-Ven: 8h-20h | Sam-Dim: 9h-18h',
    color: 'primary'
  },
  {
    icon: 'bi bi-envelope-fill',
    title: 'Email',
    desc: 'Réponse sous 24h',
    contact: 'service-client@ventechaussure.com',
    availability: 'Réponse garantie sous 24h',
    color: 'success'
  },
  {
    icon: 'bi bi-chat-dots-fill',
    title: 'Chat en ligne',
    desc: 'Assistance immédiate',
    contact: 'Chat disponible',
    availability: 'Lun-Ven: 9h-19h | Sam: 9h-17h',
    color: 'warning'
  },
  {
    icon: 'bi bi-whatsapp',
    title: 'WhatsApp',
    desc: 'Support via WhatsApp',
    contact: '+33 1 23 45 67 89',
    availability: 'Lun-Ven: 9h-18h',
    color: 'success'
  }
];

export default function ServiceClient() {
  const [search, setSearch] = useState('');
  const [faqOpen, setFaqOpen] = useState(null);
  const [activeTab, setActiveTab] = useState('centre-aide');

  // Détecter l'ancre dans l'URL au chargement
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && ['centre-aide', 'contact', 'faq'].includes(hash)) {
      setActiveTab(hash);
      // Scroll vers la section après un court délai
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  const faqsFiltres = search
    ? faqs.map(faq => ({
        ...faq,
        questions: faq.questions.filter(q =>
          q.q.toLowerCase().includes(search.toLowerCase()) ||
          q.a.toLowerCase().includes(search.toLowerCase())
        )
      })).filter(faq => faq.questions.length > 0)
    : faqs;

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    window.location.hash = tabId;
  };

  return (
    <>
      <Header />
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            <h1 className="mb-4 text-warning fw-bold" style={{fontSize: '2.2rem'}}>Service Client</h1>
            
            {/* Navigation par onglets */}
            <ul className="nav nav-tabs mb-4" id="serviceClientTabs" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'centre-aide' ? 'active' : ''}`}
                  id="centre-aide-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#centre-aide"
                  type="button"
                  role="tab"
                  onClick={() => handleTabClick('centre-aide')}
                  style={{fontWeight: 600, fontSize: '1.1rem'}}
                >
                  <i className="bi bi-question-circle me-2"></i>
                  Centre d'aide
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'contact' ? 'active' : ''}`}
                  id="contact-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#contact"
                  type="button"
                  role="tab"
                  onClick={() => handleTabClick('contact')}
                  style={{fontWeight: 600, fontSize: '1.1rem'}}
                >
                  <i className="bi bi-headset me-2"></i>
                  Contact service client
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'faq' ? 'active' : ''}`}
                  id="faq-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#faq"
                  type="button"
                  role="tab"
                  onClick={() => handleTabClick('faq')}
                  style={{fontWeight: 600, fontSize: '1.1rem'}}
                >
                  <i className="bi bi-chat-quote me-2"></i>
                  FAQ
                </button>
              </li>
            </ul>

            {/* Contenu des onglets */}
            <div className="tab-content" id="serviceClientTabContent">
              
              {/* Section Centre d'aide */}
              <div 
                className={`tab-pane fade ${activeTab === 'centre-aide' ? 'show active' : ''}`}
                id="centre-aide"
                role="tabpanel"
                aria-labelledby="centre-aide-tab"
              >
                <div className="row g-4">
                  {sujets.map((s, i) => (
                    <div className="col-12 col-md-4" key={i}>
                      <div className="card h-100 shadow-sm border-0 hover-shadow">
                        <div className="card-body d-flex flex-row align-items-center gap-3 p-4">
                          <div className={`bg-${s.icon.includes('box') ? 'primary' : s.icon.includes('arrow') ? 'warning' : s.icon.includes('cash') ? 'success' : s.icon.includes('truck') ? 'info' : s.icon.includes('credit') ? 'danger' : 'secondary'} rounded-circle d-flex align-items-center justify-content-center`} style={{width: 60, height: 60}}>
                            <i className={s.icon + " text-white fs-3"}></i>
                          </div>
                          <div className="flex-grow-1">
                            <h5 className="fw-bold mb-2" style={{fontSize: '1.1rem'}}>{s.titre}</h5>
                            <p className="text-muted mb-0 small">{s.desc}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section Contact service client */}
              <div 
                className={`tab-pane fade ${activeTab === 'contact' ? 'show active' : ''}`}
                id="contact"
                role="tabpanel"
                aria-labelledby="contact-tab"
              >
                <div className="row g-4 mb-5">
                  {contactMethods.map((method, i) => (
                    <div className="col-12 col-md-6 col-lg-3" key={i}>
                      <div className="card h-100 shadow-sm border-0 hover-shadow">
                        <div className="card-body text-center p-4">
                          <div className={`bg-${method.color} rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3`} style={{width: 70, height: 70}}>
                            <i className={method.icon + " text-white fs-2"}></i>
                          </div>
                          <h5 className="fw-bold mb-2">{method.title}</h5>
                          <p className="text-muted small mb-2">{method.desc}</p>
                          <div className="fw-bold text-primary mb-2">{method.contact}</div>
                          <div className="text-muted small">{method.availability}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Formulaire de contact */}
                <div className="row">
                  <div className="col-12 col-lg-8 mx-auto">
                    <div className="card shadow-sm border-0">
                      <div className="card-header bg-primary text-white">
                        <h4 className="mb-0 fw-bold">
                          <i className="bi bi-envelope me-2"></i>
                          Nous contacter
                        </h4>
                      </div>
                      <div className="card-body p-4">
                        <form>
                          <div className="row g-3">
                            <div className="col-md-6">
                              <label className="form-label fw-bold">Prénom *</label>
                              <input type="text" className="form-control" required />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label fw-bold">Nom *</label>
                              <input type="text" className="form-control" required />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label fw-bold">Email *</label>
                              <input type="email" className="form-control" required />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label fw-bold">Téléphone</label>
                              <input type="tel" className="form-control" />
                            </div>
                            <div className="col-12">
                              <label className="form-label fw-bold">Sujet *</label>
                              <select className="form-select" required>
                                <option value="">Choisir un sujet</option>
                                <option value="commande">Question sur une commande</option>
                                <option value="retour">Retour ou échange</option>
                                <option value="livraison">Problème de livraison</option>
                                <option value="paiement">Question de paiement</option>
                                <option value="compte">Problème de compte</option>
                                <option value="autre">Autre</option>
                              </select>
                            </div>
                            <div className="col-12">
                              <label className="form-label fw-bold">Message *</label>
                              <textarea className="form-control" rows="5" placeholder="Décrivez votre problème ou question..." required></textarea>
                            </div>
                            <div className="col-12">
                              <button type="submit" className="btn btn-primary btn-lg px-5 py-3 fw-bold">
                                <i className="bi bi-send me-2"></i>
                                Envoyer le message
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section FAQ */}
              <div 
                className={`tab-pane fade ${activeTab === 'faq' ? 'show active' : ''}`}
                id="faq"
                role="tabpanel"
                aria-labelledby="faq-tab"
              >
                <div className="mb-4">
                  <div className="input-group input-group-lg" style={{maxWidth: 500}}>
                    <span className="input-group-text bg-warning border-warning">
                      <i className="bi bi-search text-dark"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-warning"
                      placeholder="Rechercher dans la FAQ..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="accordion" id="faqAccordion">
                  {faqsFiltres.map((faq, idx) => (
                    <div className="accordion-item mb-3 border-0 shadow-sm" key={faq.theme}>
                      <h2 className="accordion-header">
                        <button
                          className={`accordion-button fw-bold ${faqOpen === idx ? '' : 'collapsed'}`}
                          type="button"
                          onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                          style={{fontSize: '1.1rem'}}
                        >
                          <i className="bi bi-question-circle me-3 text-primary"></i>
                          {faq.theme}
                        </button>
                      </h2>
                      <div className={`accordion-collapse collapse ${faqOpen === idx ? 'show' : ''}`}>
                        <div className="accordion-body bg-light">
                          {faq.questions.map((q, i) => (
                            <div key={i} className="mb-4 p-3 bg-white rounded">
                              <h6 className="fw-bold mb-2 text-primary">{q.q}</h6>
                              <p className="text-muted mb-0">{q.a}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                  {faqsFiltres.length === 0 && (
                    <div className="text-center py-5">
                      <i className="bi bi-search display-1 text-muted mb-3"></i>
                      <h4 className="text-muted">Aucun résultat trouvé</h4>
                      <p className="text-muted">Essayez avec d'autres mots-clés ou contactez directement notre service client.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 