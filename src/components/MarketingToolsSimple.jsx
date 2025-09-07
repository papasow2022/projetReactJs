// src/components/MarketingToolsSimple.jsx
import React from 'react';

const MarketingToolsSimple = () => {
  return (
    <div style={{ 
      padding: '1.5rem', 
      backgroundColor: 'white', 
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '1rem'
    }}>
      <h4 style={{ margin: '0 0 1rem 0' }}>Outils de Marketing</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '6px', textAlign: 'center' }}>
          <h5 style={{ margin: '0 0 0.5rem 0' }}>Campagnes actives</h5>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#007bff' }}>3</div>
        </div>
        <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '6px', textAlign: 'center' }}>
          <h5 style={{ margin: '0 0 0.5rem 0' }}>Taux d'ouverture</h5>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>24%</div>
        </div>
        <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '6px', textAlign: 'center' }}>
          <h5 style={{ margin: '0 0 0.5rem 0' }}>Conversions</h5>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffc107' }}>8.5%</div>
        </div>
      </div>
    </div>
  );
};

export default MarketingToolsSimple;