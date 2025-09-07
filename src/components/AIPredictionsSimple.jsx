// src/components/AIPredictionsSimple.jsx
import React from 'react';

const AIPredictionsSimple = ({ period = '7j' }) => {
  return (
    <div style={{ 
      padding: '1.5rem', 
      backgroundColor: 'white', 
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '1rem'
    }}>
      <h4 style={{ margin: '0 0 1rem 0' }}>Prédictions IA</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
          <h5 style={{ margin: '0 0 0.5rem 0', color: '#007bff' }}>Ventes prévues</h5>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>€3,200</div>
          <div style={{ color: '#28a745', fontSize: '0.9rem' }}>+15% vs période précédente</div>
        </div>
        <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
          <h5 style={{ margin: '0 0 0.5rem 0', color: '#28a745' }}>Nouveaux clients</h5>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>28</div>
          <div style={{ color: '#007bff', fontSize: '0.9rem' }}>+12% vs période précédente</div>
        </div>
      </div>
    </div>
  );
};

export default AIPredictionsSimple;