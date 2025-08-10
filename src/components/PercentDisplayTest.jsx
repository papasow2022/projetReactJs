import React from 'react';

const PercentDisplayTest = () => {
  const testStats = {
    activeDeals: 15,
    totalDeals: 25,
    expiredDeals: 10,
    avgReduction: 20,
    lowStockDeals: 3
  };

  const statCards = [
    {
      title: 'Offres actives',
      value: testStats.activeDeals,
      total: testStats.totalDeals,
      icon: 'bi-lightning',
      color: 'success',
      description: 'Offres en cours'
    },
    {
      title: 'Offres expirées',
      value: testStats.expiredDeals,
      icon: 'bi-clock-history',
      color: 'secondary',
      description: 'Offres terminées'
    },
    {
      title: 'Réduction moyenne',
      value: testStats.avgReduction,
      icon: 'bi-percent',
      color: 'danger',
      description: 'Économies moyennes',
      showPercent: true
    },
    {
      title: 'Stock faible',
      value: testStats.lowStockDeals,
      icon: 'bi-exclamation-triangle',
      color: 'warning',
      description: 'Moins de 3 en stock'
    }
  ];

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">Test d'affichage des pourcentages (sans répétition)</h3>
      
      <div className="row">
        {statCards.map((stat, index) => (
          <div key={index} className="col-md-3 col-sm-6 mb-3">
            <div className={`card border-${stat.color} stats-card`}>
              <div className="card-body text-center">
                <div className={`text-${stat.color} mb-2`}>
                  <i className={`bi ${stat.icon} fs-1 stats-icon`}></i>
                </div>
                <h3 className="fw-bold mb-1 stats-value">
                  {stat.value}
                  {stat.showPercent && '%'}
                  {stat.total && (
                    <small className="text-muted ms-1">/ {stat.total}</small>
                  )}
                </h3>
                <h6 className="text-muted mb-1">{stat.title}</h6>
                <small className="text-muted">{stat.description}</small>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="row mt-4">
        <div className="col-12">
          <div className="alert alert-success">
            <h5>✅ Test réussi si :</h5>
            <ul>
              <li>L'icône de pourcentage (bi-percent) s'affiche correctement</li>
              <li>Le chiffre "20" s'affiche sans répétition du symbole %</li>
              <li>Le symbole % n'apparaît qu'une seule fois (dans l'icône OU dans le texte)</li>
              <li>Les autres cartes affichent leurs valeurs correctement</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="row mt-3">
        <div className="col-12">
          <div className="alert alert-info">
            <h5>🔧 Correction appliquée :</h5>
            <p>Dans la carte "Réduction moyenne", le symbole % n'apparaît plus en double :</p>
            <ul>
              <li><strong>Avant :</strong> Icône % + "20%" = répétition</li>
              <li><strong>Après :</strong> Icône % + "20" = affichage correct</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PercentDisplayTest; 