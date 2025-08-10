import React from 'react';

const PercentNoRepetitionTest = () => {
  const testStats = {
    avgReduction: 20
  };

  // Version 1 : Icône graph-down + texte avec %
  const version1 = {
    title: 'Réduction moyenne (Version 1)',
    value: testStats.avgReduction,
    icon: 'bi-graph-down',
    color: 'danger',
    description: 'Économies moyennes',
    showPercent: true
  };

  // Version 2 : Icône percent + texte sans %
  const version2 = {
    title: 'Réduction moyenne (Version 2)',
    value: testStats.avgReduction,
    icon: 'bi-percent',
    color: 'danger',
    description: 'Économies moyennes',
    showPercent: false
  };

  const versions = [version1, version2];

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">Test - Élimination de la répétition du symbole %</h3>
      
      <div className="row">
        {versions.map((stat, index) => (
          <div key={index} className="col-md-6 mb-3">
            <div className={`card border-${stat.color} stats-card`}>
              <div className="card-body text-center">
                <div className={`text-${stat.color} mb-2`}>
                  <i className={`bi ${stat.icon} fs-1 stats-icon`}></i>
                </div>
                <h3 className="fw-bold mb-1 stats-value">
                  {stat.value}
                  {stat.showPercent && '%'}
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
            <h5>✅ Solutions proposées :</h5>
            <ul>
              <li><strong>Version 1 :</strong> Icône graph-down + "20%" (symbole % dans le texte)</li>
              <li><strong>Version 2 :</strong> Icône percent + "20" (symbole % dans l'icône)</li>
            </ul>
            <p>Les deux versions évitent la répétition du symbole %</p>
          </div>
        </div>
      </div>
      
      <div className="row mt-3">
        <div className="col-12">
          <div className="alert alert-info">
            <h5>🔧 Recommandation :</h5>
            <p>Utiliser la <strong>Version 1</strong> (icône graph-down + texte avec %) car :</p>
            <ul>
              <li>Plus claire pour l'utilisateur</li>
              <li>Le symbole % est plus lisible dans le texte</li>
              <li>L'icône graph-down représente mieux la notion de réduction</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PercentNoRepetitionTest; 