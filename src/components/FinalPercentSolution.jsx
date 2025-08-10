import React from 'react';

const FinalPercentSolution = () => {
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
      icon: 'bi-graph-down', // Changé de bi-percent à bi-graph-down
      color: 'danger',
      description: 'Économies moyennes',
      showPercent: true // Le % apparaît dans le texte
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
      <h3 className="text-center mb-4">✅ Solution finale - Plus de répétition du symbole %</h3>
      
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
            <h5>🎯 Problème résolu !</h5>
            <p>La carte "Réduction moyenne" affiche maintenant :</p>
            <ul>
              <li>✅ Icône graph-down (représente la réduction)</li>
              <li>✅ Texte "20%" (symbole % dans le texte)</li>
              <li>✅ <strong>Aucune répétition du symbole %</strong></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="row mt-3">
        <div className="col-12">
          <div className="alert alert-info">
            <h5>📋 Changements appliqués :</h5>
            <ul>
              <li><strong>Icône :</strong> <code>bi-percent</code> → <code>bi-graph-down</code></li>
              <li><strong>Texte :</strong> <code>showPercent: true</code> pour afficher le %</li>
              <li><strong>Résultat :</strong> Plus de double affichage du symbole %</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="row mt-3">
        <div className="col-12">
          <div className="alert alert-warning">
            <h5>⚠️ Avant vs Après :</h5>
            <div className="row">
              <div className="col-md-6">
                <h6>❌ Avant (problématique) :</h6>
                <ul>
                  <li>Icône % + "20%"</li>
                  <li>Double répétition du symbole %</li>
                  <li>Confusion visuelle</li>
                </ul>
              </div>
              <div className="col-md-6">
                <h6>✅ Après (corrigé) :</h6>
                <ul>
                  <li>Icône graph-down + "20%"</li>
                  <li>Symbole % affiché une seule fois</li>
                  <li>Affichage clair et professionnel</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalPercentSolution; 