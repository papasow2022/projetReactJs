import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table, Badge } from 'react-bootstrap';
import { BiCheck, BiX, BiPackage } from 'react-icons/bi';
import { useNotifications } from '../contexts/NotificationContext';
import { useAuth } from '../hooks/useAuth.jsx';

const EchangeModal = ({ show, onHide, retour, onEchangeComplete }) => {
  const [produitsDisponibles, setProduitsDisponibles] = useState([]);
  const [produitSelectionne, setProduitSelectionne] = useState(null);
  const [quantite, setQuantite] = useState(1);
  const [commentaire, setCommentaire] = useState('');
  const { addNotification } = useNotifications();
  const { user } = useAuth();

  // Simuler des produits disponibles (en réalité, cela viendrait de votre catalogue)
  useEffect(() => {
    if (show) {
      // Produits fictifs pour la démonstration
      const produits = [
        {
          id: 1,
          nom: 'Smartphone Samsung Galaxy S23',
          prix: 899000,
          stock: 15,
          categorie: 'Électronique',
          image: '/assets/placeholder-product.svg'
        },
        {
          id: 2,
          nom: 'Ordinateur portable HP Pavilion',
          prix: 1200000,
          stock: 8,
          categorie: 'Informatique',
          image: '/assets/placeholder-product.svg'
        },
        {
          id: 3,
          nom: 'Casque Bluetooth Sony WH-1000XM4',
          prix: 450000,
          stock: 25,
          categorie: 'Audio',
          image: '/assets/placeholder-product.svg'
        },
        {
          id: 4,
          nom: 'Montre connectée Apple Watch Series 8',
          prix: 650000,
          stock: 12,
          categorie: 'Accessoires',
          image: '/assets/placeholder-product.svg'
        },
        {
          id: 5,
          nom: 'Tablette iPad Air 5ème génération',
          prix: 850000,
          stock: 18,
          categorie: 'Tablettes',
          image: '/assets/placeholder-product.svg'
        }
      ];
      setProduitsDisponibles(produits);
    }
  }, [show]);

  const handleEchange = () => {
    if (!produitSelectionne) {
      alert('Veuillez sélectionner un produit d\'échange');
      return;
    }

    const echange = {
      id: 'ECH-' + Math.floor(100000 + Math.random() * 900000),
      retourId: retour.id,
      commandeId: retour.commandeId,
      produitRetourne: retour.produits[0], // Simplifié pour un seul produit
      produitEchange: {
        ...produitSelectionne,
        quantite: quantite
      },
      dateEchange: new Date().toISOString(),
      commentaire: commentaire,
      statut: 'En attente de validation client'
    };

    // Trouver l'email du client qui a fait le retour
    let clientEmail = null;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('retours_')) {
        try {
          const userRetours = JSON.parse(localStorage.getItem(key));
          if (Array.isArray(userRetours)) {
            const retourClient = userRetours.find(r => r.id === retour.id);
            if (retourClient) {
              clientEmail = key.replace('retours_', '');
              break;
            }
          }
        } catch (error) {
          console.error('Erreur lors de la recherche:', error);
        }
      }
    }

    if (!clientEmail) {
      alert('Erreur: Impossible de trouver le client');
      return;
    }

    const clientKeyEchanges = `echanges_${clientEmail}`;
    const clientKeyRetours = `retours_${clientEmail}`;

    // Sauvegarder l'échange dans le localStorage du client
    const echanges = JSON.parse(localStorage.getItem(clientKeyEchanges) || '[]');
    echanges.push(echange);
    localStorage.setItem(clientKeyEchanges, JSON.stringify(echanges));

    // Mettre à jour le statut du retour dans le localStorage du client
    const retours = JSON.parse(localStorage.getItem(clientKeyRetours) || '[]');
    const retoursMisAJour = retours.map(r => 
      r.id === retour.id ? { ...r, statut: 'En attente de validation client', echangeId: echange.id } : r
    );
    localStorage.setItem(clientKeyRetours, JSON.stringify(retoursMisAJour));

    // Notification pour le client
    addNotification(
      `Un produit d'échange vous a été envoyé !`,
      'info',
      {
        details: `Veuillez valider l'échange #${echange.id} - ${produitSelectionne.nom}`
      }
    );

    onEchangeComplete(echange);
    onHide();
  };

  const getPrixTotal = () => {
    if (!produitSelectionne) return 0;
    return produitSelectionne.prix * quantite;
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <BiPackage className="me-2" />
          Gestion de l'échange - Retour #{retour?.id}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {retour && (
          <div className="mb-4">
            <h6>Produit retourné :</h6>
            <div className="card p-3 bg-light">
              <div className="d-flex align-items-center">
                <img 
                                          src={retour.produits[0]?.image || '/assets/placeholder-product.svg'} 
                  alt="Produit" 
                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                  className="me-3"
                />
                <div>
                  <strong>{retour.produits[0]?.nom || 'Produit'}</strong>
                  <br />
                  <small className="text-muted">
                    Prix original : {retour.produits[0]?.prix?.toLocaleString('fr-FR')} GNF
                  </small>
                </div>
              </div>
            </div>
          </div>
        )}

        <h6>Sélectionner le produit d'échange :</h6>
        <div className="mb-3">
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Prix</th>
                <th>Stock</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {produitsDisponibles.map(produit => (
                <tr key={produit.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <img 
                        src={produit.image} 
                        alt={produit.nom}
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                        className="me-2"
                      />
                      <div>
                        <div><strong>{produit.nom}</strong></div>
                        <small className="text-muted">{produit.categorie}</small>
                      </div>
                    </div>
                  </td>
                  <td>{produit.prix.toLocaleString('fr-FR')} GNF</td>
                  <td>
                    <Badge bg={produit.stock > 0 ? 'success' : 'danger'}>
                      {produit.stock} en stock
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant={produitSelectionne?.id === produit.id ? 'success' : 'outline-primary'}
                      size="sm"
                      disabled={produit.stock === 0}
                      onClick={() => setProduitSelectionne(produit)}
                    >
                      {produitSelectionne?.id === produit.id ? <BiCheck /> : 'Sélectionner'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {produitSelectionne && (
          <div className="card p-3 bg-light mb-3">
            <h6>Détails de l'échange :</h6>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Quantité :</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    max={produitSelectionne.stock}
                    value={quantite}
                    onChange={(e) => setQuantite(parseInt(e.target.value))}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Prix total :</Form.Label>
                  <div className="form-control-plaintext fw-bold">
                    {getPrixTotal().toLocaleString('fr-FR')} GNF
                  </div>
                </Form.Group>
              </div>
            </div>
            
            <Form.Group className="mb-3">
              <Form.Label>Commentaire (optionnel) :</Form.Label>
              <Form.Control
                as="textarea"
                rows="3"
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
                placeholder="Détails sur l'échange..."
              />
            </Form.Group>
          </div>
        )}
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          <BiX /> Annuler
        </Button>
        <Button 
          variant="success" 
          onClick={handleEchange}
          disabled={!produitSelectionne}
        >
          <BiCheck /> Valider l'échange
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EchangeModal; 