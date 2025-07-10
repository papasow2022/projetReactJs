import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../amazon-like.css';

const designs = [
  { id: 1, label: 'Anniversaire', icon: 'bi-gift' },
  { id: 2, label: 'Merci', icon: 'bi-emoji-smile' },
  { id: 3, label: 'Félicitations', icon: 'bi-star' },
  { id: 4, label: 'Noël', icon: 'bi-tree' },
  { id: 5, label: 'Classique', icon: 'bi-card-text' },
];

const faqs = [
  { q: 'Comment utiliser une carte cadeau ?', a: 'Saisissez le code de votre carte cadeau dans la section "Ajouter une carte cadeau à mon compte".' },
  { q: 'Où puis-je consulter mon solde ?', a: 'Votre solde s’affiche dans la section "Solde de mes cartes cadeaux".' },
  { q: 'Les cartes cadeaux expirent-elles ?', a: 'Non, les cartes cadeaux n’ont pas de date d’expiration.' },
  { q: 'Puis-je offrir une carte cadeau par email ?', a: 'Oui, choisissez l’option "Envoyer par email" et saisissez l’adresse du destinataire.' },
];

export default function CartesCadeaux() {
  const [type, setType] = useState('email');
  const [design, setDesign] = useState(designs[0].id);
  const [montant, setMontant] = useState(50);
  const [message, setMessage] = useState('');
  const [expediteur, setExpediteur] = useState('');
  const [destinataire, setDestinataire] = useState('');
  const [code, setCode] = useState('');
  const [solde, setSolde] = useState(120);
  const [faqOpen, setFaqOpen] = useState(null);
  const [confirmation, setConfirmation] = useState('');

  function handleAchat(e) {
    e.preventDefault();
    setConfirmation('Votre carte cadeau a été créée/envoyée (simulation).');
  }
  function handleAjoutCode(e) {
    e.preventDefault();
    setConfirmation('Carte cadeau ajoutée à votre compte (simulation).');
    setSolde(s => s + Number(montant));
  }

  return (
    <>
      <Header />
      <div className="container-fluid py-4">
        <h1 className="mb-3 text-warning fw-bold" style={{fontSize: '2.2rem'}}>Cartes cadeaux</h1>
        {/* Offres spéciales */}
        <div className="alert alert-info mb-4" style={{fontSize: '1.1rem'}}>
          <i className="bi bi-gift me-2"></i>
          <b>Offre spéciale :</b> Recevez 5€ offerts pour l’achat d’une carte cadeau de 50€ ou plus !
        </div>
        {/* Choix du type */}
        <div className="card p-4 mb-4">
          <h4 className="fw-bold mb-3">Acheter une carte cadeau</h4>
          <div className="mb-3 d-flex gap-3 flex-wrap">
            <button className={`btn btn-outline-primary${type==='email'?' active':''}`} onClick={()=>setType('email')}>Envoyer par email</button>
            <button className={`btn btn-outline-primary${type==='imprimable'?' active':''}`} onClick={()=>setType('imprimable')}>Imprimer chez moi</button>
            <button className={`btn btn-outline-primary${type==='physique'?' active':''}`} onClick={()=>setType('physique')}>Carte physique</button>
          </div>
          <form className="row g-3 align-items-end" onSubmit={handleAchat}>
            <div className="col-md-3">
              <label className="form-label">Occasion / Design</label>
              <div className="d-flex gap-2 flex-wrap">
                {designs.map(d => (
                  <div
                    key={d.id}
                    onClick={()=>setDesign(d.id)}
                    style={{
                      width: 54,
                      height: 54,
                      borderRadius: 8,
                      border: design===d.id?'2px solid #ffd814':'1px solid #ccc',
                      cursor:'pointer',
                      background:'#fff',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#232f3e',
                      boxShadow: design===d.id ? '0 0 0 2px #ffd81455' : 'none',
                      transition: 'border 0.2s, box-shadow 0.2s'
                    }}
                    title={d.label}
                  >
                    <i className={`bi ${d.icon}`} style={{fontSize: 22, marginBottom: 2}}></i>
                    <span style={{fontSize: 11, textAlign: 'center', lineHeight: '1.1'}}>{d.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-md-2">
              <label className="form-label">Montant</label>
              <input type="number" min={5} max={500} className="form-control" value={montant} onChange={e=>setMontant(e.target.value)} required />
            </div>
            <div className="col-md-3">
              <label className="form-label">Message (optionnel)</label>
              <input type="text" className="form-control" value={message} onChange={e=>setMessage(e.target.value)} maxLength={120} />
            </div>
            {type!=='physique' && (
              <div className="col-md-2">
                <label className="form-label">Expéditeur</label>
                <input type="text" className="form-control" value={expediteur} onChange={e=>setExpediteur(e.target.value)} required={type!=='physique'} />
              </div>
            )}
            {type!=='physique' && (
              <div className="col-md-2">
                <label className="form-label">Destinataire</label>
                <input type="email" className="form-control" value={destinataire} onChange={e=>setDestinataire(e.target.value)} required={type==='email'} />
              </div>
            )}
            <div className="col-md-12 mt-3">
              <button className="btn btn-warning btn-lg px-4" type="submit">Acheter la carte cadeau</button>
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