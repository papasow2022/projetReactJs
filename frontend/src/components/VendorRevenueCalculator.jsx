import React, { useState } from 'react';
import { BiCalculator, BiDollar, BiTrendingUp, BiX } from 'react-icons/bi';

const typesVendeur = {
  individuel: { commission: 8, mensuel: 0, nom: 'Vendeur Individuel' },
  professionnel: { commission: 5, mensuel: 29, nom: 'Vendeur Professionnel' },
  artisan: { commission: 6, mensuel: 0, nom: 'Vendeur Artisan' },
  dropshipping: { commission: 10, mensuel: 0, nom: 'Vendeur Dropshipping' }
};

const VendorRevenueCalculator = ({ isOpen, onClose }) => {
  const [calculations, setCalculations] = useState({
    typeVendeur: 'professionnel',
    chiffreAffaires: 10000,
    nombreProduits: 100,
    prixMoyen: 100,
    marge: 30
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCalculations(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const calculateRevenue = () => {
    const { typeVendeur, chiffreAffaires, nombreProduits, prixMoyen, marge } = calculations;
    const config = typesVendeur[typeVendeur];
    
    // Calculs
    const ventesMensuelles = chiffreAffaires / prixMoyen;
    const revenuBrut = chiffreAffaires * (marge / 100);
    const commissionPapasow = chiffreAffaires * (config.commission / 100);
    const fraisMensuels = config.mensuel;
    const revenuNet = revenuBrut - commissionPapasow - fraisMensuels;
    const margeNet = (revenuNet / chiffreAffaires) * 100;
    
    return {
      ventesMensuelles: Math.round(ventesMensuelles),
      revenuBrut: Math.round(revenuBrut),
      commissionPapasow: Math.round(commissionPapasow),
      fraisMensuels,
      revenuNet: Math.round(revenuNet),
      margeNet: Math.round(margeNet * 100) / 100
    };
  };

  const results = calculateRevenue();

  if (!isOpen) return null;

  return (
    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <BiCalculator style={{ marginRight: 8 }} />
              Calculateur de Revenus Vendeur
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-6">
                <h6 className="mb-3">Paramètres de calcul</h6>
                
                <div className="mb-3">
                  <label className="form-label">Type de compte vendeur</label>
                  <select
                    className="form-select"
                    name="typeVendeur"
                    value={calculations.typeVendeur}
                    onChange={handleInputChange}
                  >
                    {Object.entries(typesVendeur).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value.nom} ({value.commission}% commission)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Chiffre d'affaires mensuel (€)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="chiffreAffaires"
                    value={calculations.chiffreAffaires}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Nombre de produits vendus</label>
                  <input
                    type="number"
                    className="form-control"
                    name="nombreProduits"
                    value={calculations.nombreProduits}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Prix moyen par produit (€)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="prixMoyen"
                    value={calculations.prixMoyen}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Marge bénéficiaire (%)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="marge"
                    value={calculations.marge}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div className="col-md-6">
                <h6 className="mb-3">Résultats du calcul</h6>
                
                <div className="card bg-light mb-3">
                  <div className="card-body">
                    <div className="row text-center">
                      <div className="col-6">
                        <div className="h4 text-primary mb-0">{results.ventesMensuelles}</div>
                        <small className="text-muted">Ventes/mois</small>
                      </div>
                      <div className="col-6">
                        <div className="h4 text-success mb-0">{results.revenuNet}€</div>
                        <small className="text-muted">Revenu net</small>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-sm">
                    <tbody>
                      <tr>
                        <td>Chiffre d'affaires</td>
                        <td className="text-end">{calculations.chiffreAffaires}€</td>
                      </tr>
                      <tr>
                        <td>Revenu brut ({calculations.marge}%)</td>
                        <td className="text-end text-success">{results.revenuBrut}€</td>
                      </tr>
                      <tr>
                        <td>Commission Papasow ({typesVendeur[calculations.typeVendeur].commission}%)</td>
                        <td className="text-end text-danger">-{results.commissionPapasow}€</td>
                      </tr>
                      {typesVendeur[calculations.typeVendeur].mensuel > 0 && (
                        <tr>
                          <td>Frais mensuels</td>
                          <td className="text-end text-danger">-{results.fraisMensuels}€</td>
                        </tr>
                      )}
                      <tr className="table-active fw-bold">
                        <td>Revenu net</td>
                        <td className="text-end text-success">{results.revenuNet}€</td>
                      </tr>
                      <tr className="table-active">
                        <td>Marge nette</td>
                        <td className="text-end text-success">{results.margeNet}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="alert alert-info">
                  <BiInfoCircle style={{ marginRight: 8 }} />
                  <strong>Note:</strong> Ces calculs sont des estimations. Les revenus réels peuvent varier selon les conditions du marché et vos stratégies de vente.
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Fermer
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                // Ici on pourrait ajouter une fonction pour sauvegarder ou partager les résultats
                console.log('Résultats du calcul:', results);
              }}
            >
              <BiTrendingUp style={{ marginRight: 8 }} />
              Sauvegarder
            </button>
          </div>
        </div>
      </div>
      
      {/* Overlay */}
      <div 
        className="modal-backdrop fade show"
        onClick={onClose}
      ></div>
    </div>
  );
};

export default VendorRevenueCalculator; 