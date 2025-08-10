import React from 'react';

const IconTest = () => {
  return (
    <div className="container mt-4">
      <h3>Test des icônes Bootstrap</h3>
      <div className="row">
        <div className="col-md-3 mb-3">
          <div className="card">
            <div className="card-body text-center">
              <i className="bi bi-percent fs-1 text-danger"></i>
              <p className="mt-2">Icône pourcentage</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card">
            <div className="card-body text-center">
              <i className="bi bi-lightning fs-1 text-warning"></i>
              <p className="mt-2">Icône éclair</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card">
            <div className="card-body text-center">
              <i className="bi bi-clock fs-1 text-info"></i>
              <p className="mt-2">Icône horloge</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card">
            <div className="card-body text-center">
              <i className="bi bi-clock-history fs-1 text-secondary"></i>
              <p className="mt-2">Icône historique</p>
            </div>
          </div>
        </div>
      </div>
      
      <h3 className="mt-4">Test des chiffres</h3>
      <div className="row">
        <div className="col-md-3 mb-3">
          <div className="card">
            <div className="card-body text-center">
              <h2 className="fw-bold text-primary">98%</h2>
              <p className="mt-2">Pourcentage test</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card">
            <div className="card-body text-center">
              <h2 className="fw-bold text-success">25%</h2>
              <p className="mt-2">Réduction test</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card">
            <div className="card-body text-center">
              <h2 className="fw-bold text-danger">-40%</h2>
              <p className="mt-2">Promotion test</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card">
            <div className="card-body text-center">
              <h2 className="fw-bold text-warning">15</h2>
              <p className="mt-2">Nombre test</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconTest; 