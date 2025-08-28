import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import '../amazon-like.css';

const sujetsPopulaires = [
  { icon: 'bi bi-box-seam', titre: 'Suivre ma commande', desc: 'Consultez le statut de vos commandes et livraisons.', lien: '/commandes' },
  { icon: 'bi bi-arrow-repeat', titre: 'Retourner un article', desc: 'Démarrez une procédure de retour ou d\'échange.', lien: '/commandes#retours' },
  { icon: 'bi bi-cash-coin', titre: 'Remboursements', desc: 'Vérifiez le statut de vos remboursements.', lien: '/commandes#remboursements' },
  { icon: 'bi bi-truck', titre: 'Problème de livraison', desc: 'Signalez un retard ou un colis non reçu.', lien: '/commandes#livraison' },
  { icon: 'bi bi-credit-card', titre: 'Paiement', desc: 'Gérez vos moyens de paiement et factures.', lien: '/paiement' },
  { icon: 'bi bi-person', titre: 'Mon compte', desc: 'Modifiez vos informations personnelles et adresses.', lien: '/profil' },
];

const baseConnaissances = [
  {
    categorie: 'Commandes',
    articles: [
      { titre: 'Comment suivre ma commande ?', contenu: 'Rendez-vous dans votre espace client, section "Mes commandes" pour voir le statut en temps réel de vos commandes.' },
      { titre: 'Comment annuler une commande ?', contenu: 'Vous pouvez annuler une commande tant qu\'elle n\'a pas été expédiée, depuis votre espace client.' },
      { titre: 'Modifier l\'adresse de livraison', contenu: 'Vous pouvez modifier votre adresse de livraison tant que la commande n\'est pas expédiée.' },
      { titre: 'Problème avec ma commande', contenu: 'Contactez notre service client pour toute question concernant votre commande.' }
    ]
  },
  {
    categorie: 'Retours & Remboursements',
    articles: [
      { titre: 'Comment retourner un article ?', contenu: 'Cliquez sur "Retourner un article" dans votre espace client et suivez les instructions.' },
      { titre: 'Délai de remboursement', contenu: 'Le remboursement est effectué sous 3 à 5 jours après réception du retour.' },
      { titre: 'Articles non remboursables', contenu: 'Certains articles comme les produits personnalisés ne peuvent pas être retournés.' },
      { titre: 'Échange d\'article', contenu: 'Vous pouvez demander un échange en contactant notre service client.' }
    ]
  },
  {
    categorie: 'Livraison',
    articles: [
      { titre: 'Délais de livraison', contenu: 'Les délais varient selon votre localisation et le mode de livraison choisi.' },
      { titre: 'Colis en retard', contenu: 'Vérifiez le suivi et contactez le service client si le retard dépasse les délais annoncés.' },
      { titre: 'Colis non reçu', contenu: 'Si votre colis n\'arrive pas, contactez immédiatement notre service client.' },
      { titre: 'Livraison à l\'étranger', contenu: 'Nous livrons dans 15 pays. Les frais de douane peuvent s\'appliquer.' }
    ]
  },
  {
    categorie: 'Compte & Paiement',
    articles: [
      { titre: 'Changer mon mot de passe', contenu: 'Allez dans "Mon compte" puis "Sécurité" pour modifier votre mot de passe.' },
      { titre: 'Ajouter une carte bancaire', contenu: 'Rendez-vous dans "Paiement" puis "Ajouter un moyen de paiement".' },
      { titre: 'Paiement sécurisé', contenu: 'Tous nos paiements sont sécurisés par cryptage SSL.' },
      { titre: 'Factures et reçus', contenu: 'Vos factures sont disponibles dans votre espace client.' }
    ]
  }
];

const problemesCourants = [
  { probleme: 'Ma commande n\'arrive pas', solution: 'Vérifiez le suivi de livraison et contactez-nous si nécessaire.' },
  { probleme: 'Je ne peux pas me connecter', solution: 'Vérifiez vos identifiants ou utilisez la récupération de mot de passe.' },
  { probleme: 'Paiement refusé', solution: 'Vérifiez les informations de votre carte ou essayez un autre moyen de paiement.' },
  { probleme: 'Article défectueux', solution: 'Contactez-nous immédiatement pour organiser un retour et remboursement.' },
  { probleme: 'Erreur sur le site', solution: 'Actualisez la page ou contactez notre support technique.' },
];

const videosTutoriales = [
  { titre: 'Comment passer une commande', url: '#', duree: '2:30', description: 'Guide complet pour commander sur papasow' },
  { titre: 'Gérer mon compte', url: '#', duree: '3:15', description: 'Modifier vos informations personnelles' },
  { titre: 'Retourner un article', url: '#', duree: '1:45', description: 'Procédure de retour étape par étape' },
  { titre: 'Suivre ma livraison', url: '#', duree: '2:00', description: 'Comment suivre vos commandes' },
];

const contactMethods = [
  {
    icon: 'bi bi-telephone-fill',
    title: 'Téléphone',
    desc: 'Service client disponible 7j/7',
    contact: '+224 123 456 789',
    availability: 'Lun-Ven: 8h-20h | Sam-Dim: 9h-18h',
    color: 'primary',
    action: 'Appeler maintenant'
  },
  {
    icon: 'bi bi-envelope-fill',
    title: 'Email',
    desc: 'Réponse sous 24h',
    contact: 'service-client@papasow.com',
    availability: 'Réponse garantie sous 24h',
    color: 'success',
    action: 'Envoyer un email'
  },
  {
    icon: 'bi bi-chat-dots-fill',
    title: 'Chat en ligne',
    desc: 'Assistance immédiate',
    contact: 'Chat disponible',
    availability: 'Lun-Ven: 9h-19h | Sam: 9h-17h',
    color: 'warning',
    action: 'Démarrer le chat'
  },
  {
    icon: 'bi bi-whatsapp',
    title: 'WhatsApp',
    desc: 'Support via WhatsApp',
    contact: '+224 123 456 789',
    availability: 'Lun-Ven: 9h-18h',
    color: 'success',
    action: 'WhatsApp'
  }
];

export default function ServiceClient() {
  const [search, setSearch] = useState('');
  const [faqOpen, setFaqOpen] = useState(null);
  const [activeTab, setActiveTab] = useState('centre-aide');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Détecter l'ancre dans l'URL au chargement
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && ['centre-aide', 'contact', 'faq', 'base-connaissances'].includes(hash)) {
      setActiveTab(hash);
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  // Fonction de recherche
  const handleSearch = (query) => {
    setSearch(query);
    if (query.length > 2) {
      const results = [];
      baseConnaissances.forEach(cat => {
        cat.articles.forEach(article => {
          if (article.titre.toLowerCase().includes(query.toLowerCase()) ||
              article.contenu.toLowerCase().includes(query.toLowerCase())) {
            results.push({ ...article, categorie: cat.categorie });
          }
        });
      });
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    window.location.hash = tabId;
    setShowSearchResults(false);
  };

  return (
    <>
      <div className="container-fluid py-4" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
        <div className="row">
          <div className="col-12">
            <div className="text-center mb-5">
              <h1 className="mb-3 text-warning fw-bold" style={{fontSize: '2.5rem'}}>
                <i className="bi bi-headset me-3"></i>
                Service Client
              </h1>
              <p className="lead text-muted">Nous sommes là pour vous aider 24h/24 et 7j/7</p>
            </div>
            
            {/* Barre de recherche principale */}
            <div className="row justify-content-center mb-5">
              <div className="col-12 col-lg-8">
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Rechercher dans l'aide..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{ borderRadius: '25px', paddingLeft: '50px', border: '2px solid #e47911' }}
                  />
                  <i className="bi bi-search position-absolute" style={{ left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#e47911' }}></i>
                  
                  {/* Résultats de recherche */}
                  {showSearchResults && searchResults.length > 0 && (
                    <div className="position-absolute w-100 bg-white border rounded shadow-lg" style={{ top: '100%', zIndex: 1000, maxHeight: '400px', overflowY: 'auto' }}>
                      {searchResults.map((result, index) => (
                        <div key={index} className="p-3 border-bottom hover-bg-light" style={{ cursor: 'pointer' }}>
                          <div className="fw-bold text-primary">{result.titre}</div>
                          <div className="small text-muted">{result.categorie}</div>
                          <div className="small">{result.contenu.substring(0, 100)}...</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation par onglets */}
            <ul className="nav nav-tabs mb-4 justify-content-center" id="serviceClientTabs" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'centre-aide' ? 'active' : ''}`}
                  onClick={() => handleTabClick('centre-aide')}
                  style={{fontWeight: 600, fontSize: '1.1rem'}}
                >
                  <i className="bi bi-question-circle me-2"></i>
                  Centre d'aide
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'base-connaissances' ? 'active' : ''}`}
                  onClick={() => handleTabClick('base-connaissances')}
                  style={{fontWeight: 600, fontSize: '1.1rem'}}
                >
                  <i className="bi bi-book me-2"></i>
                  Base de connaissances
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'contact' ? 'active' : ''}`}
                  onClick={() => handleTabClick('contact')}
                  style={{fontWeight: 600, fontSize: '1.1rem'}}
                >
                  <i className="bi bi-headset me-2"></i>
                  Contact
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'faq' ? 'active' : ''}`}
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
              <div className={`tab-pane fade ${activeTab === 'centre-aide' ? 'show active' : ''}`}>
                <div className="row g-4">
                  {sujetsPopulaires.map((s, i) => (
                    <div className="col-12 col-md-4" key={i}>
                      <div className="card h-100 shadow-sm border-0 hover-shadow" style={{ transition: 'transform 0.2s' }}>
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

                {/* Problèmes courants */}
                <div className="mt-5">
                  <h3 className="mb-4 text-center">
                    <i className="bi bi-exclamation-triangle me-2 text-warning"></i>
                    Problèmes courants
                  </h3>
                  <div className="row g-3">
                    {problemesCourants.map((p, i) => (
                      <div className="col-12 col-md-6" key={i}>
                        <div className="card border-warning">
                          <div className="card-body">
                            <h6 className="card-title text-warning fw-bold">{p.probleme}</h6>
                            <p className="card-text small">{p.solution}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Vidéos tutorielles */}
                <div className="mt-5">
                  <h3 className="mb-4 text-center">
                    <i className="bi bi-play-circle me-2 text-primary"></i>
                    Vidéos tutorielles
                  </h3>
                  <div className="row g-4">
                    {videosTutoriales.map((v, i) => (
                      <div className="col-12 col-md-6 col-lg-3" key={i}>
                        <div className="card h-100">
                          <div className="card-body text-center">
                            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: 60, height: 60}}>
                              <i className="bi bi-play-fill text-white fs-4"></i>
                            </div>
                            <h6 className="fw-bold">{v.titre}</h6>
                            <p className="small text-muted">{v.description}</p>
                            <span className="badge bg-secondary">{v.duree}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section Base de connaissances */}
              <div className={`tab-pane fade ${activeTab === 'base-connaissances' ? 'show active' : ''}`}>
                <div className="row">
                  {baseConnaissances.map((categorie, index) => (
                    <div className="col-12 col-lg-6 mb-4" key={index}>
                      <div className="card h-100">
                        <div className="card-header bg-primary text-white">
                          <h5 className="mb-0">
                            <i className="bi bi-folder me-2"></i>
                            {categorie.categorie}
                          </h5>
                        </div>
                        <div className="card-body">
                          <div className="list-group list-group-flush">
                            {categorie.articles.map((article, artIndex) => (
                              <div key={artIndex} className="list-group-item border-0 px-0">
                                <h6 className="fw-bold text-primary mb-2">{article.titre}</h6>
                                <p className="small text-muted mb-0">{article.contenu}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section Contact service client */}
              <div className={`tab-pane fade ${activeTab === 'contact' ? 'show active' : ''}`}>
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
                          <div className="text-muted small mb-3">{method.availability}</div>
                          <button className="btn btn-outline-primary btn-sm">{method.action}</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Formulaire de contact amélioré */}
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
                                <option value="commande">Question sur ma commande</option>
                                <option value="retour">Retour/Remboursement</option>
                                <option value="livraison">Problème de livraison</option>
                                <option value="compte">Problème de compte</option>
                                <option value="paiement">Problème de paiement</option>
                                <option value="autre">Autre</option>
                              </select>
                            </div>
                            <div className="col-12">
                              <label className="form-label fw-bold">Message *</label>
                              <textarea className="form-control" rows="5" required placeholder="Décrivez votre problème en détail..."></textarea>
                            </div>
                            <div className="col-12">
                              <button type="submit" className="btn btn-primary btn-lg w-100">
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
              <div className={`tab-pane fade ${activeTab === 'faq' ? 'show active' : ''}`}>
                <div className="row">
                  <div className="col-12 col-lg-8 mx-auto">
                    <div className="accordion" id="faqAccordion">
                      {baseConnaissances.map((categorie, catIndex) => (
                        <div key={catIndex} className="accordion-item">
                          <h2 className="accordion-header">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${catIndex}`}>
                              <i className="bi bi-question-circle me-2 text-primary"></i>
                              {categorie.categorie}
                            </button>
                          </h2>
                          <div id={`collapse${catIndex}`} className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                            <div className="accordion-body">
                              {categorie.articles.map((article, artIndex) => (
                                <div key={artIndex} className="mb-3">
                                  <h6 className="fw-bold text-primary">{article.titre}</h6>
                                  <p className="small">{article.contenu}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
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