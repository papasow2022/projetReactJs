import React, { useState } from "react";
import { Button, Modal, Form, Badge, InputGroup, FormControl, Row, Col, Card } from "react-bootstrap";

// Données simulées pour les commandes
const commandes = [
  {
    id: "CMD123456",
    date: "2024-06-01",
    statut: "Livrée",
    montant: 89.99,
    adresse: "12 rue de Paris, 75000 Paris",
    articles: [
      {
        id: "P001",
        nom: "Baskets Nike Air Max",
        image: "/assets/nike-air-max.jpg",
        quantite: 1,
        prix: 89.99,
        statut: "Livré",
        retourPossible: true,
      },
    ],
    suivi: "Colis livré le 3 juin 2024",
  },
  {
    id: "CMD654321",
    date: "2024-05-15",
    statut: "Livrée",
    montant: 59.99,
    adresse: "8 avenue Victor Hugo, 69000 Lyon",
    articles: [
      {
        id: "P002",
        nom: "Chaussures Adidas Superstar",
        image: "/assets/adidas-superstar.jpg",
        quantite: 1,
        prix: 59.99,
        statut: "Livré",
        retourPossible: false,
      },
    ],
    suivi: "Colis livré le 18 mai 2024",
  },
];

const Orders = () => {
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  // Filtrage simple par mot-clé (nom produit ou id commande)
  const commandesFiltrees = commandes.filter((cmd) =>
    cmd.id.toLowerCase().includes(search.toLowerCase()) ||
    cmd.articles.some((a) => a.nom.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="container my-4">
      <h2 className="mb-4">Vos commandes</h2>
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Rechercher par produit ou numéro de commande..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </InputGroup>
      <Row>
        {commandesFiltrees.length === 0 && (
          <Col><p>Aucune commande trouvée.</p></Col>
        )}
        {commandesFiltrees.map((cmd) => (
          <Col md={6} lg={4} key={cmd.id} className="mb-4">
            <Card className="shadow-sm h-100">
              <Card.Body>
                <Card.Title>
                  Commande <span className="text-primary">{cmd.id}</span>
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Passée le {cmd.date}
                </Card.Subtitle>
                <div className="mb-2">
                  <Badge bg="success">{cmd.statut}</Badge>
                </div>
                <div className="mb-2">
                  <strong>Montant :</strong> {cmd.montant.toFixed(2)} €
                </div>
                <div className="mb-2">
                  <strong>Adresse :</strong> {cmd.adresse}
                </div>
                <div className="mb-2">
                  <strong>Articles :</strong>
                  <ul className="list-unstyled mb-0">
                    {cmd.articles.map((a) => (
                      <li key={a.id} className="d-flex align-items-center mb-1">
                        <img src={a.image} alt={a.nom} width={40} height={40} className="me-2 rounded" style={{objectFit:'cover'}} />
                        <span>{a.nom} <span className="text-secondary">x{a.quantite}</span></span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => { setSelectedOrder(cmd); setShowDetail(true); }}
                >
                  Voir le détail
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  disabled
                  title="Bientôt disponible"
                >
                  Imprimer la facture
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {/* Modal détail commande */}
      <Modal show={showDetail} onHide={() => setShowDetail(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Détail de la commande</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <p><strong>Numéro :</strong> {selectedOrder.id}</p>
              <p><strong>Date :</strong> {selectedOrder.date}</p>
              <p><strong>Statut :</strong> <Badge bg="success">{selectedOrder.statut}</Badge></p>
              <p><strong>Montant :</strong> {selectedOrder.montant.toFixed(2)} €</p>
              <p><strong>Adresse de livraison :</strong> {selectedOrder.adresse}</p>
              <p><strong>Suivi :</strong> {selectedOrder.suivi}</p>
              <hr />
              <h5>Articles</h5>
              <ul className="list-unstyled">
                {selectedOrder.articles.map((a) => (
                  <li key={a.id} className="d-flex align-items-center mb-2">
                    <img src={a.image} alt={a.nom} width={50} height={50} className="me-3 rounded" style={{objectFit:'cover'}} />
                    <div>
                      <div><strong>{a.nom}</strong> <span className="text-secondary">x{a.quantite}</span></div>
                      <div>Prix : {a.prix.toFixed(2)} €</div>
                      <div>Statut : <Badge bg="info">{a.statut}</Badge></div>
                      {a.retourPossible && (
                        <Button variant="warning" size="sm" className="mt-1">Retourner l'article</Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-3">
                <Button variant="outline-primary" className="me-2">Suivre le colis</Button>
                <Button variant="outline-success" className="me-2">Racheter</Button>
                <Button variant="outline-secondary" disabled title="Bientôt disponible">Contacter le service client</Button>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Orders; 