// src/components/OrderWorkflowSimple.jsx
import React from 'react';

const OrderWorkflowSimple = () => {
  return (
    <div style={{ 
      padding: '1.5rem', 
      backgroundColor: 'white', 
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '1rem'
    }}>
      <h4 style={{ margin: '0 0 1rem 0' }}>Workflow des Commandes</h4>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '50px', height: '50px', backgroundColor: '#007bff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', margin: '0 auto 0.5rem' }}>5</div>
          <div style={{ fontSize: '0.9rem' }}>En attente</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '50px', height: '50px', backgroundColor: '#ffc107', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', margin: '0 auto 0.5rem' }}>3</div>
          <div style={{ fontSize: '0.9rem' }}>En préparation</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '50px', height: '50px', backgroundColor: '#17a2b8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', margin: '0 auto 0.5rem' }}>8</div>
          <div style={{ fontSize: '0.9rem' }}>Expédiées</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '50px', height: '50px', backgroundColor: '#28a745', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', margin: '0 auto 0.5rem' }}>12</div>
          <div style={{ fontSize: '0.9rem' }}>Livrées</div>
        </div>
      </div>
    </div>
  );
};

export default OrderWorkflowSimple;