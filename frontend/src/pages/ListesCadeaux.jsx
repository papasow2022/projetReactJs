import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Form, Alert, Badge } from "react-bootstrap";
import { BsGiftFill, BsPlusCircle, BsTrash, BsCalendarHeart } from "react-icons/bs";

const defaultCadeaux = [
  { id: 1, nom: "Anniversaire Mamadou", evenement: "Anniversaire", produits: 3 },
  { id: 2, nom: "Naissance Emma", evenement: "Naissance", produits: 2 }
];

const ListesCadeaux = () => {
  const [cadeaux, setCadeaux] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nom: "", evenement: "Anniversaire", produits: 1 });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("cadeaux");
    if (stored) setCadeaux(JSON.parse(stored));
    else setCadeaux(defaultCadeaux);
  }, []);

  useEffect(() => {
    localStorage.setItem("cadeaux", JSON.stringify(cadeaux));
  }, [cadeaux]);

  const handleShow = () => {
    setForm({ nom: "", evenement: "Anniversaire", produits: 1 });
    setShowModal(true);
  };
  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCadeaux([...cadeaux, { ...form, id: Date.now() }]);
    setMessage("Liste cadeau ajoutée !");
    handleClose();
    setTimeout(() => setMessage(""), 2000);
  };

  const handleDelete = (idx) => {
    if (window.confirm("Supprimer cette liste cadeau ?")) {
      setCadeaux(cadeaux.filter((_, i) => i !== idx));
      setMessage("Liste supprimée.");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  return (
    <div className="container my-4" style={{maxWidth:900}}>
      <h2 className="mb-3"><BsGiftFill className="me-2 text-success" size={28}/> Listes cadeaux</h2>
      <p>Créez des listes dédiées à des événements spéciaux.</p>
      <Button variant="success" className="mb-3 d-flex align-items-center" onClick={handleShow}>
        <BsPlusCircle className="me-2"/> Créer une liste cadeau
      </Button>
      {message && <Alert variant="info">{message}</Alert>}
      <div className="row">
        {cadeaux.length === 0 && <p>Aucune liste cadeau enregistrée.</p>}
        {cadeaux.map((item, idx) => (
          <div className="col-md-4 mb-3" key={item.id}>
            <Card className="shadow-sm h-100">
              <Card.Body>
                <Card.Title className="d-flex align-items-center">
                  <BsCalendarHeart className="me-2 text-primary"/> {item.nom}
                </Card.Title>
                <div className="mb-2">
                  <Badge bg="info" className="me-2">{item.evenement}</Badge>
                  <Badge bg="secondary">{item.produits} produit{item.produits>1 && "s"}</Badge>
                </div>
                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(idx)}><BsTrash className="me-1"/>Supprimer</Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
      {/* Modal ajout */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Créer une liste cadeau</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-2">
              <Form.Label>Nom de la liste</Form.Label>
              <Form.Control name="nom" value={form.nom} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Événement</Form.Label>
              <Form.Select name="evenement" value={form.evenement} onChange={handleChange}>
                <option>Anniversaire</option>
                <option>Naissance</option>
                <option>Mariage</option>
                <option>Noël</option>
                <option>Autre</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Nombre de produits</Form.Label>
              <Form.Control name="produits" type="number" min={1} value={form.produits} onChange={handleChange} required />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Annuler</Button>
            <Button variant="primary" type="submit">Créer</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ListesCadeaux; 