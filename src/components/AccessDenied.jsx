import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BiShield, BiLogIn, BiUserPlus, BiArrowBack } from 'react-icons/bi';

const AccessDenied = ({ reason = 'unauthorized' }) => {
  const location = useLocation();

  const getMessage = () => {
    switch (reason) {
      case 'not_authenticated':
        return {
          title: 'Connexion requise',
          message: 'Vous devez être connecté pour accéder à cette page.',
          icon: BiLogIn,
          primaryAction: {
            text: 'Se connecter',
            link: '/connexion',
            color: 'primary'
          },
          secondaryAction: {
            text: 'S\'inscrire',
            link: '/inscription',
            color: 'outline-primary'
          }
        };
      
      case 'not_vendor':
        return {
          title: 'Accès vendeur requis',
          message: 'Cette page est réservée aux vendeurs. Vous devez d\'abord devenir vendeur.',
          icon: BiUserPlus,
          primaryAction: {
            text: 'Devenir vendeur',
            link: '/vendeur/inscription',
            color: 'success'
          },
          secondaryAction: {
            text: 'Retour à l\'accueil',
            link: '/',
            color: 'outline-secondary'
          }
        };
      
      case 'not_validated':
        return {
          title: 'Compte en cours de validation',
          message: 'Votre compte vendeur est en cours de validation. Vous recevrez un email dès qu\'il sera validé.',
          icon: BiShield,
          primaryAction: {
            text: 'Voir le statut',
            link: '/confirmation-vendeur',
            color: 'info'
          },
          secondaryAction: {
            text: 'Retour à l\'accueil',
            link: '/',
            color: 'outline-secondary'
          }
        };
      
      default:
        return {
          title: 'Accès refusé',
          message: 'Vous n\'avez pas les autorisations nécessaires pour accéder à cette page.',
          icon: BiShield,
          primaryAction: {
            text: 'Retour à l\'accueil',
            link: '/',
            color: 'primary'
          },
          secondaryAction: {
            text: 'Se connecter',
            link: '/connexion',
            color: 'outline-primary'
          }
        };
    }
  };

  const messageData = getMessage();
  const IconComponent = messageData.icon;

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '3rem',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%'
      }}>
        {/* Icône */}
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: '#e9ecef',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 2rem auto'
        }}>
          <IconComponent style={{ fontSize: '2.5rem', color: '#6c757d' }} />
        </div>

        {/* Titre */}
        <h1 style={{
          fontSize: '1.8rem',
          fontWeight: '600',
          color: '#232f3e',
          marginBottom: '1rem'
        }}>
          {messageData.title}
        </h1>

        {/* Message */}
        <p style={{
          fontSize: '1.1rem',
          color: '#666',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          {messageData.message}
        </p>

        {/* URL tentée */}
        {location.pathname && (
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            fontSize: '0.9rem',
            color: '#666'
          }}>
            <strong>Page tentée :</strong> {location.pathname}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link 
            to={messageData.primaryAction.link}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: `var(--bs-${messageData.primaryAction.color})`,
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {messageData.primaryAction.text}
          </Link>

          <Link 
            to={messageData.secondaryAction.link}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: 'transparent',
              color: `var(--bs-${messageData.secondaryAction.color.replace('outline-', '')})`,
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '500',
              border: `2px solid var(--bs-${messageData.secondaryAction.color.replace('outline-', '')})`,
              cursor: 'pointer'
            }}
          >
            {messageData.secondaryAction.text}
          </Link>
        </div>

        {/* Retour en arrière */}
        <div style={{ marginTop: '2rem' }}>
          <button 
            onClick={() => window.history.back()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: 'transparent',
              color: '#666',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            <BiArrowBack />
            Retour en arrière
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied; 