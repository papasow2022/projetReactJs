import React, { useState, useEffect } from 'react';
import { 
  createGiftCard, 
  checkGiftCardBalance, 
  rechargeGiftCard, 
  getGiftCardHistory,
  getGiftCardAnalytics,
  sendGiftCardEmail,
  scheduleGiftCardDelivery
} from '../utils/giftCards';
import { useCurrency } from '../contexts/CurrencyContext';

import Footer from '../components/Footer';
import { useLanguage } from "../contexts/LanguageContext";
import '../amazon-like.css';

const faqs = [
  { q: 'Comment utiliser une carte cadeau ?', a: 'Saisissez le code de votre carte cadeau dans la section "Ajouter une carte cadeau à mon compte". Elle est utilisable uniquement pour l\'achat de produits sur ce site.' },
  { q: 'Où puis-je consulter mon solde ?', a: 'Votre solde s\'affiche dans la section "Solde de mes cartes cadeaux".' },
  { q: 'Les cartes cadeaux expirent-elles ?', a: 'Oui, les cartes cadeaux expirent après 10 ans. Vous pouvez vérifier la date d\'expiration dans votre compte.' },
  { q: 'Puis-je recharger ma carte cadeau ?', a: 'Oui, vous pouvez recharger votre carte cadeau à tout moment avec le montant de votre choix.' },
  { q: 'Puis-je programmer l\'envoi d\'une carte cadeau ?', a: 'Oui, vous pouvez programmer l\'envoi d\'une carte cadeau pour une date future.' },
  { q: 'Puis-je offrir une carte cadeau ?', a: 'Cette carte cadeau est prévue pour une utilisation sur ce site uniquement.' },
];

export default function CartesCadeauxAmeliorer() {
  const { selectedCurrency, rates, convert, getCurrencySymbol } = useCurrency();
  const [type, setType] = useState('site');
  const [montant, setMontant] = useState(50);
  const [message, setMessage] = useState('');
  const [expediteur, setExpediteur] = useState('');
  const [destinataire, setDestinataire] = useState('');
  const [code, setCode] = useState('');
  const [solde, setSolde] = useState(120);
  const [faqOpen, setFaqOpen] = useState(null);
  const [confirmation, setConfirmation] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('email');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [giftCardCurrency, setGiftCardCurrency] = useState('GNF');
  
  // Nouvelles fonctionnalités
  const [activeTab, setActiveTab] = useState('buy');
  const [balanceCode, setBalanceCode] = useState('');
  const [balanceResult, setBalanceResult] = useState(null);
  const [rechargeCode, setRechargeCode] = useState('');
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [rechargeDescription, setRechargeDescription] = useState('');
  const [historyCode, setHistoryCode] = useState('');
  const [historyResult, setHistoryResult] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [design, setDesign] = useState('default');
  const [videoMessage, setVideoMessage] = useState('');
  const [expirationYears, setExpirationYears] = useState(10);

  // Charger les analytics au montage du composant
  useEffect(() => {
    const analyticsData = getGiftCardAnalytics();
    setAnalytics(analyticsData);
  }, []);

  function handleAchat(e) {
    e.preventDefault();
    const card = createGiftCard({ 
      amount: montant, 
      message, 
      sender: expediteur, 
      recipient: destinataire,
      currency: giftCardCurrency,
      expirationYears,
      design,
      deliveryDate: deliveryDate || null,
      videoMessage: videoMessage || null
    });
    
    // Envoi programmé ou immédiat
    if (deliveryDate) {
      const result = scheduleGiftCardDelivery(card, deliveryDate, deliveryMethod, deliveryAddress);
      setConfirmation(`${result.message}. Code: ${card.code} (${montant} ${getCurrencySymbol(giftCardCurrency)})`);
    } else {
      // Envoi immédiat
      if (deliveryMethod === 'email' && deliveryAddress) {
        const emailResult = sendGiftCardEmail(card, deliveryAddress);
        setConfirmation(`${emailResult.message}. Code: ${card.code} (${montant} ${getCurrencySymbol(giftCardCurrency)})`);
      } else if (deliveryMethod === 'sms' && deliveryAddress) {
        setConfirmation(`Carte cadeau créée et envoyée par SMS au ${deliveryAddress}. Code: ${card.code} (${montant} ${getCurrencySymbol(giftCardCurrency)})`);
      } else {
        setConfirmation(`Carte cadeau créée. Code: ${card.code} (${montant} ${getCurrencySymbol(giftCardCurrency)}) - à envoyer manuellement`);
      }
    }
    
    // Mettre à jour les analytics
    const updatedAnalytics = getGiftCardAnalytics();
    setAnalytics(updatedAnalytics);
  }

  function handleAjoutCode(e) {
    e.preventDefault();
    setConfirmation('Carte cadeau ajoutée à votre compte (simulation).');
    setSolde(s => s + Number(montant));
  }

  // Nouvelles fonctions pour les fonctionnalités avancées
  function handleCheckBalance(e) {
    e.preventDefault();
    const result = checkGiftCardBalance(balanceCode);
    setBalanceResult(result);
  }

  function handleRecharge(e) {
    e.preventDefault();
    const result = rechargeGiftCard(rechargeCode, Number(rechargeAmount), rechargeDescription);
    if (result.success) {
      setConfirmation(`Carte rechargée avec succès ! Nouveau solde: ${result.newBalance.toLocaleString('fr-FR')} ${result.cardCurrency}`);
      setRechargeCode('');
      setRechargeAmount('');
      setRechargeDescription('');
    } else {
      setConfirmation(`Erreur: ${result.reason}`);
    }
  }

  function handleCheckHistory(e) {
    e.preventDefault();
    const result = getGiftCardHistory(historyCode);
    setHistoryResult(result);
  }

  return (
    <>
      <div className="container-fluid py-4">
        <h1 className="mb-1 text-warning fw-bold" style={{fontSize: '2.2rem'}}>Cartes cadeaux</h1>
        <div className="text-muted mb-3">Utilisables exclusivement pour l'achat de produits sur ce site.</div>
        
        {/* Onglets de navigation */}
        <div className="card mb-4">
          <div className="card-header">
            <ul className="nav nav-tabs card-header-tabs" role="tablist">
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'buy' ? 'active' : ''}`}
                  onClick={() => setActiveTab('buy')}
                >
                  Acheter
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'balance' ? 'active' : ''}`}
                  onClick={() => setActiveTab('balance')}
                >
                  Vérifier le solde
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'recharge' ? 'active' : ''}`}
                  onClick={() => setActiveTab('recharge')}
                >
                  Recharger
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
                  onClick={() => setActiveTab('history')}
                >
                  Historique
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'analytics' ? 'active' : ''}`}
                  onClick={() => setActiveTab('analytics')}
                >
                  Statistiques
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Contenu des onglets */}
        <div className="tab-content">
          {/* Onglet Acheter */}
          {activeTab === 'buy' && (
            <div className="card p-4 mb-4">
              <h4 className="fw-bold mb-3">Acheter une carte cadeau</h4>
              <form onSubmit={handleAchat}>
                <div className="row g-3">
                  <div className="col-md-3">
                    <label className="form-label">Montant</label>
                    <input type="number" min={5} max={10000} className="form-control" value={montant} onChange={e=>setMontant(e.target.value)} required />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Devise</label>
                    <select className="form-select" value={giftCardCurrency} onChange={e=>setGiftCardCurrency(e.target.value)}>
                      <option value="GNF">GNF (G)</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Design</label>
                    <select className="form-select" value={design} onChange={e=>setDesign(e.target.value)}>
                      <option value="default">Classique</option>
                      <option value="birthday">Anniversaire</option>
                      <option value="christmas">Noël</option>
                      <option value="valentine">Saint-Valentin</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Expiration (années)</label>
                    <select className="form-select" value={expirationYears} onChange={e=>setExpirationYears(Number(e.target.value))}>
                      <option value={1}>1 an</option>
                      <option value={5}>5 ans</option>
                      <option value={10}>10 ans</option>
                      <option value={20}>20 ans</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Message personnalisé (optionnel)</label>
                    <input type="text" className="form-control" value={message} onChange={e=>setMessage(e.target.value)} maxLength={500} placeholder="Joyeux anniversaire !" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Message vidéo (optionnel)</label>
                    <input type="url" className="form-control" value={videoMessage} onChange={e=>setVideoMessage(e.target.value)} placeholder="URL de la vidéo" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Expéditeur</label>
                    <input type="text" className="form-control" value={expediteur} onChange={e=>setExpediteur(e.target.value)} placeholder="Votre nom" required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Destinataire</label>
                    <input type="text" className="form-control" value={destinataire} onChange={e=>setDestinataire(e.target.value)} placeholder="Nom du destinataire" required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Méthode d'envoi</label>
                    <select className="form-select" value={deliveryMethod} onChange={e=>setDeliveryMethod(e.target.value)}>
                      <option value="email">Email</option>
                      <option value="sms">SMS</option>
                      <option value="manual">Manuel</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">
                      {deliveryMethod === 'email' ? 'Adresse email' : 
                       deliveryMethod === 'sms' ? 'Numéro de téléphone' : 'Adresse (optionnel)'}
                    </label>
                    <input 
                      type={deliveryMethod === 'email' ? 'email' : 'text'} 
                      className="form-control" 
                      value={deliveryAddress} 
                      onChange={e=>setDeliveryAddress(e.target.value)}
                      placeholder={deliveryMethod === 'email' ? 'exemple@email.com' : 
                                  deliveryMethod === 'sms' ? '+33 6 12 34 56 78' : 'Adresse postale'}
                      required={deliveryMethod !== 'manual'}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Date de livraison (optionnel)</label>
                    <input 
                      type="datetime-local" 
                      className="form-control" 
                      value={deliveryDate} 
                      onChange={e=>setDeliveryDate(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-warning btn-lg px-4">
                      <i className="bi bi-gift me-2"></i>Acheter la carte cadeau
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Onglet Vérifier le solde */}
          {activeTab === 'balance' && (
            <div className="card p-4 mb-4">
              <h4 className="fw-bold mb-3">Vérifier le solde d'une carte cadeau</h4>
              <form onSubmit={handleCheckBalance}>
                <div className="row g-3">
                  <div className="col-md-8">
                    <label className="form-label">Code de la carte cadeau</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={balanceCode} 
                      onChange={e=>setBalanceCode(e.target.value)} 
                      placeholder="XXXX-XXXX-XXXX-XXXX"
                      required 
                    />
                  </div>
                  <div className="col-md-4 d-flex align-items-end">
                    <button type="submit" className="btn btn-primary btn-lg px-4">
                      <i className="bi bi-search me-2"></i>Vérifier le solde
                    </button>
                  </div>
                </div>
              </form>
              
              {balanceResult && (
                <div className={`alert ${balanceResult.success ? 'alert-success' : 'alert-danger'} mt-3`}>
                  {balanceResult.success ? (
                    <div>
                      <h5>Solde de la carte : {balanceResult.balance.toLocaleString('fr-FR')} {balanceResult.currency}</h5>
                      <p className="mb-0">Jours restants avant expiration : {balanceResult.daysUntilExpiration}</p>
                    </div>
                  ) : (
                    <div>
                      <h5>Erreur : {balanceResult.reason}</h5>
                      {balanceResult.balance !== undefined && (
                        <p className="mb-0">Solde actuel : {balanceResult.balance.toLocaleString('fr-FR')} {balanceResult.currency}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Onglet Recharger */}
          {activeTab === 'recharge' && (
            <div className="card p-4 mb-4">
              <h4 className="fw-bold mb-3">Recharger une carte cadeau</h4>
              <form onSubmit={handleRecharge}>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">Code de la carte cadeau</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={rechargeCode} 
                      onChange={e=>setRechargeCode(e.target.value)} 
                      placeholder="XXXX-XXXX-XXXX-XXXX"
                      required 
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Montant à ajouter</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="5000" 
                      className="form-control" 
                      value={rechargeAmount} 
                      onChange={e=>setRechargeAmount(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Description (optionnel)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={rechargeDescription} 
                      onChange={e=>setRechargeDescription(e.target.value)} 
                      placeholder="Recharge de solde"
                    />
                  </div>
                  <div className="col-md-2 d-flex align-items-end">
                    <button type="submit" className="btn btn-success btn-lg px-4">
                      <i className="bi bi-plus-circle me-2"></i>Recharger
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Onglet Historique */}
          {activeTab === 'history' && (
            <div className="card p-4 mb-4">
              <h4 className="fw-bold mb-3">Historique d'une carte cadeau</h4>
              <form onSubmit={handleCheckHistory}>
                <div className="row g-3">
                  <div className="col-md-8">
                    <label className="form-label">Code de la carte cadeau</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={historyCode} 
                      onChange={e=>setHistoryCode(e.target.value)} 
                      placeholder="XXXX-XXXX-XXXX-XXXX"
                      required 
                    />
                  </div>
                  <div className="col-md-4 d-flex align-items-end">
                    <button type="submit" className="btn btn-info btn-lg px-4">
                      <i className="bi bi-clock-history me-2"></i>Voir l'historique
                    </button>
                  </div>
                </div>
              </form>
              
              {historyResult && historyResult.success && (
                <div className="mt-4">
                  <div className="card">
                    <div className="card-header">
                      <h5>Informations de la carte</h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6">
                          <p><strong>Code :</strong> {historyResult.card.code}</p>
                          <p><strong>Montant initial :</strong> {historyResult.card.amount.toLocaleString('fr-FR')} {historyResult.card.currency}</p>
                          <p><strong>Solde actuel :</strong> {historyResult.card.balance.toLocaleString('fr-FR')} {historyResult.card.currency}</p>
                        </div>
                        <div className="col-md-6">
                          <p><strong>Créée le :</strong> {new Date(historyResult.card.createdAt).toLocaleDateString('fr-FR')}</p>
                          <p><strong>Expire le :</strong> {new Date(historyResult.card.expiresAt).toLocaleDateString('fr-FR')}</p>
                          <p><strong>Statut :</strong> {historyResult.card.redeemed ? 'Utilisée' : 'Active'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card mt-3">
                    <div className="card-header">
                      <h5>Historique des transactions</h5>
                    </div>
                    <div className="card-body">
                      {historyResult.transactions.length > 0 ? (
                        <div className="table-responsive">
                          <table className="table table-striped">
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Montant</th>
                                <th>Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              {historyResult.transactions.map((transaction, index) => (
                                <tr key={index}>
                                  <td>{new Date(transaction.date).toLocaleDateString('fr-FR')}</td>
                                  <td>
                                    <span className={`badge ${
                                      transaction.type === 'purchase' ? 'bg-primary' :
                                      transaction.type === 'redemption' ? 'bg-warning' :
                                      transaction.type === 'recharge' ? 'bg-success' : 'bg-info'
                                    }`}>
                                      {transaction.type === 'purchase' ? 'Achat' :
                                       transaction.type === 'redemption' ? 'Utilisation' :
                                       transaction.type === 'recharge' ? 'Recharge' : 'Autre'}
                                    </span>
                                  </td>
                                  <td>{transaction.amount.toLocaleString('fr-FR')} {historyResult.card.currency}</td>
                                  <td>{transaction.description}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-muted">Aucune transaction trouvée.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {historyResult && !historyResult.success && (
                <div className="alert alert-danger mt-3">
                  <h5>Erreur : {historyResult.reason}</h5>
                </div>
              )}
            </div>
          )}

          {/* Onglet Statistiques */}
          {activeTab === 'analytics' && analytics && (
            <div className="card p-4 mb-4">
              <h4 className="fw-bold mb-3">Statistiques des cartes cadeaux</h4>
              <div className="row g-3">
                <div className="col-md-3">
                  <div className="card bg-primary text-white">
                    <div className="card-body text-center">
                      <h3>{analytics.totalIssued}</h3>
                      <p className="mb-0">Cartes émises</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card bg-success text-white">
                    <div className="card-body text-center">
                      <h3>{analytics.totalRedeemed}</h3>
                      <p className="mb-0">Cartes utilisées</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card bg-info text-white">
                    <div className="card-body text-center">
                      <h3>{analytics.totalAmount.toLocaleString('fr-FR')} GNF</h3>
                      <p className="mb-0">Montant total émis</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card bg-warning text-white">
                    <div className="card-body text-center">
                      <h3>{analytics.totalUsed.toLocaleString('fr-FR')} GNF</h3>
                      <p className="mb-0">Montant utilisé</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <h5>Montant moyen par carte</h5>
                      <h3 className="text-primary">{analytics.averageValue.toLocaleString('fr-FR')} GNF</h3>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <h5>Taux d'utilisation</h5>
                      <h3 className="text-success">{analytics.usageRate.toFixed(1)}%</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Confirmation */}
        {confirmation && <div className="alert alert-success text-center">{confirmation}</div>}

        {/* FAQ */}
        <h3 className="mb-3 mt-5 text-primary fw-bold">Questions fréquentes sur les cartes cadeaux</h3>
        <div className="accordion" id="faqAccordion">
          {faqs.map((faq, idx) => (
            <div className="accordion-item mb-2" key={idx}>
              <h2 className="accordion-header">
                <button
                  className={"accordion-button fw-bold " + (faqOpen === idx ? '' : 'collapsed')}
                  type="button"
                  onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                  style={{fontSize: '1.1rem'}}
                >
                  {faq.q}
                </button>
              </h2>
              <div className={"accordion-collapse collapse " + (faqOpen === idx ? 'show' : '')}>
                <div className="accordion-body">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

