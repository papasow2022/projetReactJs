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

export default function CartesCadeaux() {
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
        {/* Offres spéciales */}
        {/* Intentionnellement aucune promo externe pour éviter les usages hors site */}
        {/* Choix du type */}
        <div className="card p-4 mb-4">
          <h4 className="fw-bold mb-3">Acheter une carte cadeau</h4>
          <div className="mb-3 d-flex gap-3 flex-wrap">
            <button className={`btn btn-outline-primary active`}>Carte cadeau numérique (usage sur ce site)</button>
          </div>
          <form className="row g-3 align-items-end" onSubmit={handleAchat}>
            <div className="col-md-2">
              <label className="form-label">Montant</label>
              <input type="number" min={5} max={500} className="form-control" value={montant} onChange={e=>setMontant(e.target.value)} required />
            </div>
            <div className="col-md-2">
              <label className="form-label">Devise</label>
              <select className="form-select" value={giftCardCurrency} onChange={e=>setGiftCardCurrency(e.target.value)}>
                <option value="GNF">GNF (G)</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Message (optionnel)</label>
              <input type="text" className="form-control" value={message} onChange={e=>setMessage(e.target.value)} maxLength={120} />
            </div>
            <div className="col-md-12 mt-3">
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label">Méthode d'envoi</label>
                  <select className="form-select" value={deliveryMethod} onChange={e=>setDeliveryMethod(e.target.value)}>
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="manual">Manuel</option>
                  </select>
                </div>
                <div className="col-md-4">
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
                <div className="col-md-5 d-flex align-items-end">
                  <button className="btn btn-warning btn-lg px-4" type="submit">Acheter la carte cadeau</button>
                </div>
              </div>
            </div>
          </form>
        </div>
        {/* Ajout code et solde */}
        <div className="row g-4 mb-4">
          <div className="col-md-6">
            <div className="card p-4">
              <h5 className="fw-bold mb-3">Ajouter une carte cadeau à mon compte</h5>
              <form className="d-flex gap-2" onSubmit={handleAjoutCode}>
                <input type="text" className="form-control" placeholder="Code carte cadeau" value={code} onChange={e=>setCode(e.target.value)} required />
                <button className="btn btn-primary" type="submit">Ajouter</button>
              </form>
              <div className="small text-muted mt-2">Utilisable uniquement lors du paiement sur ce site.</div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card p-4 text-center">
              <h5 className="fw-bold mb-3">Solde de mes cartes cadeaux</h5>
              <div className="display-6 text-success mb-2">{solde} €</div>
              <div className="text-muted small">Utilisez votre solde lors de votre prochain achat</div>
            </div>
          </div>
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