import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { useVendor } from '../contexts/VendorContext';
import { 
  BiArrowBack, 
  BiEdit, 
  BiCheck,
  BiX,
  BiCreditCard,
  BiBuilding,
  BiCar,
  BiUser,
  BiShield,
  BiBell
} from 'react-icons/bi';

const ConfigurationCompte = () => {
  const { user } = useAuth();
  const { updateVendor, addVendorNotification } = useVendor();
  const [activeTab, setActiveTab] = useState('bancaire');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    // Informations bancaires
    payoutMethod: 'bank', // 'bank' | 'mobile'
    banque: 'Société Générale',
    iban: 'FR76 3000 1000 0000 0000 0000 000',
    bic: 'SOGEFRPP',
    titulaire: 'Jean Dupont',
    justificatifRib: null,
    
    // Informations fiscales
    siret: '123 456 789 00012',
    tva: 'FR12345678901',
    regimeFiscal: 'Micro-entreprise',
    
    // Informations de contact
    email: 'jean.dupont@email.com',
    telephone: '+33 6 12 34 56 78',
    adresse: '123 Rue de la Paix',
    ville: 'Paris',
    codePostal: '75001',
    pays: 'France',
    
    // Préférences de livraison
    livraisonStandard: true,
    livraisonExpress: true,
    livraisonGratuite: false,
    seuilLivraisonGratuite: 50,
    
    // Notifications
    emailCommandes: true,
    emailStocks: true,
    emailEvaluations: true,
    smsUrgent: false,

    // Mobile Money
    mmNumero: '',
    mmOperateur: '',
    mmJustificatif: null
  });

  // Charger les données réelles du vendeur pour préremplir
  React.useEffect(() => {
    try {
      const vendorId = user?.vendorId;
      if (!vendorId) return;
      const vendors = JSON.parse(localStorage.getItem('vendors') || '{}');
      const v = vendors[vendorId];
      if (!v) return;
      const infos = v.informations || {};
      const ent = infos.entreprise || {};
      const payout = v.payout || {};

      setFormData(prev => ({
        ...prev,
        // Bancaire / Mobile
        payoutMethod: payout.method || (payout.mobileMoney ? 'mobile' : 'bank'),
        banque: payout.banqueNom || prev.banque,
        iban: payout.iban || prev.iban,
        bic: payout.bic || prev.bic,
        titulaire: payout.titulaireCompte || prev.titulaire,
        justificatifRib: payout.justificatifRib || null,
        mmNumero: payout.mobileMoney?.numero || '',
        mmOperateur: payout.mobileMoney?.operateur || '',
        mmJustificatif: payout.mobileMoney?.justificatif || null,
        // Fiscal
        siret: ent.siret || prev.siret,
        tva: infos.numeroTaxe || prev.tva,
        regimeFiscal: ent.regimeFiscal || prev.regimeFiscal,
        // Contact
        email: infos.email || prev.email,
        telephone: infos.telephone || prev.telephone,
        adresse: infos.adresse || prev.adresse,
        ville: infos.ville || prev.ville,
        codePostal: infos.codePostal || prev.codePostal,
        pays: infos.pays || prev.pays
      }));
    } catch (_) {}
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = async (field, file) => {
    if (!file) {
      setFormData(prev => ({ ...prev, [field]: null }));
      return;
    }
    const maxBytes = 5 * 1024 * 1024;
    const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
    if (file.size > maxBytes || (file.type && !allowed.includes(file.type))) {
      alert('Fichier invalide (PDF/JPG/PNG, max 5MB).');
      return;
    }
    try {
      const reader = new FileReader();
      const dataUrl = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      setFormData(prev => ({ ...prev, [field]: { name: file.name, type: file.type, size: file.size, dataUrl } }));
    } catch (_) {
      setFormData(prev => ({ ...prev, [field]: { name: file.name, type: file.type, size: file.size } }));
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    try {
      const vendorId = user?.vendorId;
      if (vendorId) {
        const vendors = JSON.parse(localStorage.getItem('vendors') || '{}');
        const current = vendors[vendorId] || {};
        const newPayout = formData.payoutMethod === 'bank' ? {
          method: 'bank',
          titulaireCompte: formData.titulaire,
          iban: formData.iban,
          bic: formData.bic,
          banqueNom: formData.banque,
          banquePays: current?.payout?.banquePays || 'Guinée',
          justificatifRib: formData.justificatifRib || current?.payout?.justificatifRib || null,
          mobileMoney: null
        } : {
          method: 'mobile',
          titulaireCompte: formData.titulaire || current?.payout?.titulaireCompte || '',
          iban: '',
          bic: '',
          banqueNom: '',
          banquePays: current?.payout?.banquePays || '',
          justificatifRib: null,
          mobileMoney: {
            numero: formData.mmNumero,
            operateur: formData.mmOperateur,
            justificatif: formData.mmJustificatif || current?.payout?.mobileMoney?.justificatif || null
          }
        };

        const updatedVerification = {
          ...(current.verification || {}),
          bank: {
            status: 'needs_more_info',
            updatedAt: new Date().toISOString(),
            actor: user?.email || 'vendeur',
            notes: 'Changement des coordonnées via Paramètres de la boutique'
          },
          tax: {
            status: 'needs_more_info',
            updatedAt: new Date().toISOString(),
            actor: user?.email || 'vendeur',
            notes: 'Mise à jour des informations fiscales via Paramètres de la boutique'
          }
        };

        const updatedInformations = {
          ...(current.informations || {}),
          email: formData.email || current.informations?.email,
          telephone: formData.telephone || current.informations?.telephone,
          adresse: formData.adresse || current.informations?.adresse,
          ville: formData.ville || current.informations?.ville,
          codePostal: formData.codePostal || current.informations?.codePostal,
          pays: formData.pays || current.informations?.pays,
          numeroTaxe: formData.tva || current.informations?.numeroTaxe,
          entreprise: {
            ...(current.informations?.entreprise || {}),
            siret: formData.siret || current.informations?.entreprise?.siret,
            regimeFiscal: formData.regimeFiscal || current.informations?.entreprise?.regimeFiscal,
            nom: current.informations?.entreprise?.nom || ''
          }
        };

        updateVendor(vendorId, { payout: newPayout, verification: updatedVerification, informations: updatedInformations });
        addVendorNotification(vendorId, {
          type: 'status',
          title: 'Mise à jour des coordonnées de versement',
          message: 'Vos nouvelles coordonnées ont été soumises. En attente de revalidation.'
        });
        addVendorNotification(vendorId, {
          type: 'status',
          title: 'Mise à jour des informations fiscales',
          message: 'Vos informations fiscales ont été mises à jour. En attente de revalidation.'
        });
      }
      alert('Configuration sauvegardée. En attente de revalidation Bancaire.');
    } catch (_) {
      alert('Erreur lors de la sauvegarde.');
    }
  };

  const tabs = [
    { id: 'bancaire', label: 'Informations bancaires', icon: BiCreditCard },
    { id: 'fiscal', label: 'Informations fiscales', icon: BiBuilding },
    { id: 'contact', label: 'Informations de contact', icon: BiUser },
    { id: 'livraison', label: 'Préférences de livraison', icon: BiCar },
    { id: 'notifications', label: 'Notifications', icon: BiBell }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e0e0e0', padding: '1rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/vendeur/dashboard" style={{ textDecoration: 'none', color: '#666' }}>
              <BiArrowBack style={{ fontSize: '1.5rem' }} />
            </Link>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '600', color: '#232f3e' }}>
                Paramètres de la boutique
              </h1>
              <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                Logo, bannières, politiques, livraison et notifications
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 0' }}>
        {/* Onglets */}
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          marginBottom: '2rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                border: 'none',
                backgroundColor: activeTab === tab.id ? '#232f3e' : 'white',
                color: activeTab === tab.id ? 'white' : '#666',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500',
                whiteSpace: 'nowrap',
                boxShadow: activeTab === tab.id ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              <tab.icon style={{ fontSize: '1.1rem' }} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenu des onglets */}
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          {/* Header de la section */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
              {tabs.find(tab => tab.id === activeTab)?.label}
            </h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    <BiCheck />
                    Sauvegarder
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      backgroundColor: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    <BiX />
                    Annuler
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  <BiEdit />
                  Modifier
                </button>
              )}
            </div>
          </div>

          {/* Informations bancaires */}
          {activeTab === 'bancaire' && (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontWeight: 600 }}>Mode de versement</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="radio" name="payoutMethod" checked={formData.payoutMethod === 'bank'} onChange={() => isEditing && handleInputChange('payoutMethod', 'bank')} />
                    Virement bancaire
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="radio" name="payoutMethod" checked={formData.payoutMethod === 'mobile'} onChange={() => isEditing && handleInputChange('payoutMethod', 'mobile')} />
                    Mobile Money
                  </label>
                </div>
                <small className="text-muted">Tout changement de mode peut nécessiter une revalidation par l'admin.</small>
              </div>

              {formData.payoutMethod === 'bank' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                      Nom de la banque
                    </label>
                    <input
                      type="text"
                      value={formData.banque}
                      onChange={(e) => handleInputChange('banque', e.target.value)}
                      disabled={!isEditing}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        backgroundColor: isEditing ? 'white' : '#f8f9fa'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                      IBAN / RIB
                    </label>
                    <input
                      type="text"
                      value={formData.iban}
                      onChange={(e) => handleInputChange('iban', e.target.value)}
                      disabled={!isEditing}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        backgroundColor: isEditing ? 'white' : '#f8f9fa'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                      BIC/SWIFT
                    </label>
                    <input
                      type="text"
                      value={formData.bic}
                      onChange={(e) => handleInputChange('bic', e.target.value)}
                      disabled={!isEditing}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        backgroundColor: isEditing ? 'white' : '#f8f9fa'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                      Titulaire du compte
                    </label>
                    <input
                      type="text"
                      value={formData.titulaire}
                      onChange={(e) => handleInputChange('titulaire', e.target.value)}
                      disabled={!isEditing}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        backgroundColor: isEditing ? 'white' : '#f8f9fa'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Justificatif (RIB/attestation)</label>
                    <input type="file" disabled={!isEditing} onChange={(e)=> handleFileChange('justificatifRib', e.target.files && e.target.files[0])} />
                    {formData.justificatifRib?.name && <small className="text-muted" style={{ display:'block' }}>{formData.justificatifRib.name}</small>}
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Numéro Mobile Money</label>
                    <input type="text" value={formData.mmNumero} onChange={(e)=> handleInputChange('mmNumero', e.target.value)} disabled={!isEditing} style={{ width:'100%', padding:'0.75rem', border:'1px solid #ddd', borderRadius:4, backgroundColor: isEditing ? 'white' : '#f8f9fa' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Opérateur</label>
                    <select value={formData.mmOperateur} onChange={(e)=> handleInputChange('mmOperateur', e.target.value)} disabled={!isEditing} style={{ width:'100%', padding:'0.75rem', border:'1px solid #ddd', borderRadius:4, backgroundColor: isEditing ? 'white' : '#f8f9fa' }}>
                      <option value="">Sélectionner</option>
                      <option value="Orange Money">Orange Money</option>
                      <option value="MTN Mobile Money">MTN Mobile Money</option>
                      <option value="Moov">Moov</option>
                      <option value="Wave">Wave</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Justificatif Mobile Money</label>
                    <input type="file" disabled={!isEditing} onChange={(e)=> handleFileChange('mmJustificatif', e.target.files && e.target.files[0])} />
                    {formData.mmJustificatif?.name && <small className="text-muted" style={{ display:'block' }}>{formData.mmJustificatif.name}</small>}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Informations fiscales */}
          {activeTab === 'fiscal' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Numéro SIRET
                </label>
                <input
                  type="text"
                  value={formData.siret}
                  onChange={(e) => handleInputChange('siret', e.target.value)}
                  disabled={!isEditing}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: isEditing ? 'white' : '#f8f9fa'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Numéro de TVA
                </label>
                <input
                  type="text"
                  value={formData.tva}
                  onChange={(e) => handleInputChange('tva', e.target.value)}
                  disabled={!isEditing}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: isEditing ? 'white' : '#f8f9fa'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Régime fiscal
                </label>
                <select
                  value={formData.regimeFiscal}
                  onChange={(e) => handleInputChange('regimeFiscal', e.target.value)}
                  disabled={!isEditing}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: isEditing ? 'white' : '#f8f9fa'
                  }}
                >
                  <option value="Micro-entreprise">Micro-entreprise</option>
                  <option value="EI">Entreprise Individuelle</option>
                  <option value="EIRL">EIRL</option>
                  <option value="EURL">EURL</option>
                  <option value="SARL">SARL</option>
                  <option value="SAS">SAS</option>
                </select>
              </div>
            </div>
          )}

          {/* Informations de contact */}
          {activeTab === 'contact' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: isEditing ? 'white' : '#f8f9fa'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => handleInputChange('telephone', e.target.value)}
                  disabled={!isEditing}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: isEditing ? 'white' : '#f8f9fa'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Adresse
                </label>
                <input
                  type="text"
                  value={formData.adresse}
                  onChange={(e) => handleInputChange('adresse', e.target.value)}
                  disabled={!isEditing}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: isEditing ? 'white' : '#f8f9fa'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Ville
                </label>
                <input
                  type="text"
                  value={formData.ville}
                  onChange={(e) => handleInputChange('ville', e.target.value)}
                  disabled={!isEditing}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: isEditing ? 'white' : '#f8f9fa'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Code postal
                </label>
                <input
                  type="text"
                  value={formData.codePostal}
                  onChange={(e) => handleInputChange('codePostal', e.target.value)}
                  disabled={!isEditing}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: isEditing ? 'white' : '#f8f9fa'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Pays
                </label>
                <input
                  type="text"
                  value={formData.pays}
                  onChange={(e) => handleInputChange('pays', e.target.value)}
                  disabled={!isEditing}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: isEditing ? 'white' : '#f8f9fa'
                  }}
                />
              </div>
            </div>
          )}

          {/* Préférences de livraison */}
          {activeTab === 'livraison' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem', fontWeight: '600' }}>
                  Options de livraison proposées
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.livraisonStandard}
                      onChange={(e) => handleInputChange('livraisonStandard', e.target.checked)}
                      disabled={!isEditing}
                    />
                    <span>Livraison standard (3-5 jours ouvrés)</span>
                  </label>
                  
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.livraisonExpress}
                      onChange={(e) => handleInputChange('livraisonExpress', e.target.checked)}
                      disabled={!isEditing}
                    />
                    <span>Livraison express (1-2 jours ouvrés)</span>
                  </label>
                  
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.livraisonGratuite}
                      onChange={(e) => handleInputChange('livraisonGratuite', e.target.checked)}
                      disabled={!isEditing}
                    />
                    <span>Proposer la livraison gratuite</span>
                  </label>
                </div>
              </div>
              
              {formData.livraisonGratuite && (
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Seuil pour la livraison gratuite (€)
                  </label>
                  <input
                    type="number"
                    value={formData.seuilLivraisonGratuite}
                    onChange={(e) => handleInputChange('seuilLivraisonGratuite', e.target.value)}
                    disabled={!isEditing}
                    style={{
                      width: '200px',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      backgroundColor: isEditing ? 'white' : '#f8f9fa'
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem', fontWeight: '600' }}>
                  Notifications par email
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.emailCommandes}
                      onChange={(e) => handleInputChange('emailCommandes', e.target.checked)}
                      disabled={!isEditing}
                    />
                    <span>Nouvelles commandes</span>
                  </label>
                  
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.emailStocks}
                      onChange={(e) => handleInputChange('emailStocks', e.target.checked)}
                      disabled={!isEditing}
                    />
                    <span>Alerte stock faible</span>
                  </label>
                  
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.emailEvaluations}
                      onChange={(e) => handleInputChange('emailEvaluations', e.target.checked)}
                      disabled={!isEditing}
                    />
                    <span>Nouvelles évaluations clients</span>
                  </label>
                </div>
              </div>
              
              <div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem', fontWeight: '600' }}>
                  Notifications SMS
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.smsUrgent}
                      onChange={(e) => handleInputChange('smsUrgent', e.target.checked)}
                      disabled={!isEditing}
                    />
                    <span>Alertes urgentes (rupture de stock, problèmes techniques)</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfigurationCompte; 