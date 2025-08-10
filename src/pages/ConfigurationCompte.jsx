import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  const [activeTab, setActiveTab] = useState('bancaire');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    // Informations bancaires
    banque: 'Société Générale',
    iban: 'FR76 3000 1000 0000 0000 0000 000',
    bic: 'SOGEFRPP',
    titulaire: 'Jean Dupont',
    
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
    smsUrgent: false
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Ici on pourrait ajouter une API call pour sauvegarder
    alert('Configuration sauvegardée avec succès !');
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
                Configuration du compte
              </h1>
              <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                Gérez vos paramètres de compte vendeur
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
                  IBAN
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
            </div>
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