import React, { useState, useEffect } from 'react';

const PercentTest = () => {
  const [testData, setTestData] = useState({
    percent1: 25,
    percent2: 50,
    percent3: 75,
    percent4: 100
  });

  useEffect(() => {
    // Simuler un changement de données
    const interval = setInterval(() => {
      setTestData(prev => ({
        percent1: Math.floor(Math.random() * 100),
        percent2: Math.floor(Math.random() * 100),
        percent3: Math.floor(Math.random() * 100),
        percent4: Math.floor(Math.random() * 100)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">Test d'affichage des pourcentages</h3>
      
      <div className="row">
        <div className="col-md-3 mb-3">
          <div className="card border-primary">
            <div className="card-body text-center">
              <i className="bi bi-percent fs-1 text-danger mb-2"></i>
              <h2 className="fw-bold text-primary">{testData.percent1}%</h2>
              <p className="text-muted">Test 1</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card border-success">
            <div className="card-body text-center">
              <i className="bi bi-lightning fs-1 text-warning mb-2"></i>
              <h2 className="fw-bold text-success">{testData.percent2}%</h2>
              <p className="text-muted">Test 2</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card border-warning">
            <div className="card-body text-center">
              <i className="bi bi-clock fs-1 text-info mb-2"></i>
              <h2 className="fw-bold text-warning">{testData.percent3}%</h2>
              <p className="text-muted">Test 3</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card border-danger">
            <div className="card-body text-center">
              <i className="bi bi-clock-history fs-1 text-secondary mb-2"></i>
              <h2 className="fw-bold text-danger">{testData.percent4}%</h2>
              <p className="text-muted">Test 4</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row mt-4">
        <div className="col-12">
          <div className="alert alert-info">
            <h5>Instructions de test :</h5>
            <ul>
              <li>Vérifiez que les pourcentages s'affichent correctement</li>
              <li>Les chiffres changent toutes les 3 secondes</li>
              <li>Vérifiez que les icônes Bootstrap s'affichent</li>
              <li>Vérifiez que les couleurs sont correctes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PercentTest; 