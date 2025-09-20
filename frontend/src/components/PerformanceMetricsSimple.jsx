// src/components/PerformanceMetricsSimple.jsx
import React from 'react';

const PerformanceMetricsSimple = ({ period = '7j' }) => {
  return (
    <div style={{ 
      padding: '1.5rem', 
      backgroundColor: 'white', 
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '1rem'
    }}>
      <h4 style={{ margin: '0 0 1rem 0' }}>Métriques de Performance</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>95%</div>
          <div style={{ color: '#666' }}>Performance</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#007bff' }}>4.8/5</div>
          <div style={{ color: '#666' }}>Satisfaction</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffc107' }}>2.3s</div>
          <div style={{ color: '#666' }}>Temps réponse</div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetricsSimple;