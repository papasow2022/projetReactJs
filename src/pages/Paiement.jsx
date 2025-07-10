import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Card, Badge } from "react-bootstrap";
import { BsCreditCard2Front, BsFillCreditCard2BackFill, BsTrash, BsPencilSquare, BsPlusCircle } from "react-icons/bs";

const defaultPaiements = [
  {
    id: 1,
    type: "Carte bancaire",
    titulaire: "Jean Dupont",
    numero: "**** **** **** 1234",
    expiration: "12/26",
    principal: true
  }
];

const Paiement = () => {
  const [paiements, setPaiements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [form, setForm] = useState({ type: "Carte bancaire", titulaire: "", numero: "", expiration: "", principal: false });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("paiements");
    if (stored) setPaiements(JSON.parse(stored));
    else setPaiements(defaultPaiements);
  }, []);

  useEffect(() => {
    localStorage.setItem("paiements", JSON.stringify(paiements));
  }, [paiements]);

  const handleShow = (idx = null) => {
    setEditIndex(idx);
    if (idx !== null) setForm(paiements[idx]);
    else setForm({ type: "Carte bancaire", titulaire: "", numero: "", expiration: "", principal: false });
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditIndex(null);
    setForm({ type: "Carte bancaire", titulaire: "", numero: "", expiration: "", principal: false });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newPaiements = [...paiements];
    if (form.principal) {
      newPaiements = newPaiements.map(p => ({ ...p, principal: false }));
    }
    if (editIndex !== null) {
      newPaiements[editIndex] = { ...form, id: paiements[editIndex].id };
      setPaiements(newPaiements);
      setMessage("Moyen de paiement modifié avec succès !");
    } else {
      newPaiements.push({ ...form, id: Date.now() });
      setPaiements(newPaiements);
      setMessage("Moyen de paiement ajouté avec succès !");
    }
    handleClose();
    setTimeout(() => setMessage(""), 2000);
  };

  const handleDelete = (idx) => {
    if (window.confirm("Supprimer ce moyen de paiement ?")) {
      const updated = paiements.filter((_, i) => i !== idx);
      setPaiements(updated);
      setMessage("Moyen de paiement supprimé.");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  return (
    <div className="container my-4" style={{maxWidth:700}}>
      <h2 className="mb-3"><BsCreditCard2Front className="me-2 text-primary" size={32}/> Mes moyens de paiement</h2>
      <p>Gérez vos cartes bancaires et autres moyens de paiement enregistrés.</p>
      <Button variant="success" className="mb-3 d-flex align-items-center" onClick={() => handleShow()}>
        <BsPlusCircle className="me-2"/> Ajouter un moyen de paiement
      </Button>
      {message && <div className="alert alert-info">{message}</div>}
      <div className="row">
        {paiements.length === 0 && <p>Aucun moyen de paiement enregistré.</p>}
        {paiements.map((p, idx) => (
          <div className="col-md-6 mb-3" key={p.id}>
            <Card className="shadow-sm border-primary" style={{background:'#f8fafc'}}>
              <Card.Body>
                <div className="d-flex align-items-center mb-2">
                  <BsFillCreditCard2BackFill size={28} className="me-2 text-primary"/>
                  <Card.Title className="mb-0">{p.type} {p.principal && <Badge bg="warning" text="dark" className="ms-2">Principal</Badge>}</Card.Title>
                </div>
                <Card.Text>
                  <span className="fw-bold">Titulaire :</span> {p.titulaire}<br/>
                  <span className="fw-bold">Numéro :</span> {p.numero}<br/>
                  <span className="fw-bold">Expiration :</span> {p.expiration}
                </Card.Text>
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShow(idx)}><BsPencilSquare className="me-1"/>Modifier</Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(idx)}><BsTrash className="me-1"/>Supprimer</Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
      {/* Modal ajout/modif */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editIndex !== null ? "Modifier le moyen de paiement" : "Ajouter un moyen de paiement"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-2">
              <Form.Label>Type</Form.Label>
              <Form.Select name="type" value={form.type} onChange={handleChange} required>
                <option>Carte bancaire</option>
                <option>PayPal</option>
                <option>Carte cadeau</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Titulaire</Form.Label>
              <Form.Control name="titulaire" value={form.titulaire} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Numéro (format : **** **** **** 1234)</Form.Label>
              <Form.Control name="numero" value={form.numero} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Date d'expiration</Form.Label>
              <Form.Control name="expiration" value={form.expiration} onChange={handleChange} required placeholder="MM/AA" />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Check type="checkbox" label="Définir comme principal" name="principal" checked={form.principal} onChange={handleChange} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Annuler</Button>
            <Button variant="primary" type="submit">{editIndex !== null ? "Enregistrer" : "Ajouter"}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Paiement; 