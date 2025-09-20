// src/components/ExternalIntegrationsSimple.jsx
import React from 'react';

const ExternalIntegrationsSimple = () => {
  return (
    <div style={{ 
      padding: '1.5rem', 
      backgroundColor: 'white', 
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '1rem'
    }}>
      <h4 style={{ margin: '0 0 1rem 0' }}>Intégrations Externes</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '6px', textAlign: 'center' }}>
          <h5 style={{ margin: '0 0 0.5rem 0' }}>PayPal</h5>
          <div style={{ color: '#28a745', fontWeight: 'bold' }}>✅ Connecté</div>
        </div>
        <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '6px', textAlign: 'center' }}>
          <h5 style={{ margin: '0 0 0.5rem 0' }}>Stripe</h5>
          <div style={{ color: '#28a745', fontWeight: 'bold' }}>✅ Connecté</div>
        </div>
        <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '6px', textAlign: 'center' }}>
          <h5 style={{ margin: '0 0 0.5rem 0' }}>Google Analytics</h5>
          <div style={{ color: '#28a745', fontWeight: 'bold' }}>✅ Connecté</div>
        </div>
      </div>
    </div>
  );
};

export default ExternalIntegrationsSimple;