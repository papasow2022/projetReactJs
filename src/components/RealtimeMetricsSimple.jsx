// src/components/RealtimeMetricsSimple.jsx
import React from 'react';

const RealtimeMetricsSimple = ({ compact = false }) => {
  return (
    <div style={{ 
      padding: compact ? '0.5rem' : '1rem', 
      backgroundColor: '#f8f9fa', 
      borderRadius: '8px',
      border: '1px solid #dee2e6'
    }}>
      <h4 style={{ margin: 0, fontSize: compact ? '0.9rem' : '1.1rem' }}>
        Métriques Temps Réel
      </h4>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
        <div>
          <small style={{ color: '#666' }}>Commandes</small>
          <div style={{ fontWeight: 'bold', color: '#28a745' }}>24</div>
        </div>
        <div>
          <small style={{ color: '#666' }}>Revenus</small>
          <div style={{ fontWeight: 'bold', color: '#007bff' }}>€2,450</div>
        </div>
        <div>
          <small style={{ color: '#666' }}>Visiteurs</small>
          <div style={{ fontWeight: 'bold', color: '#ffc107' }}>156</div>
        </div>
      </div>
    </div>
  );
};

export default RealtimeMetricsSimple;