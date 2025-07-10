import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Card } from "react-bootstrap";

const defaultAdresses = [
  {
    id: 1,
    nom: "Jean Dupont",
    adresse: "12 rue de Paris, 75000 Paris",
    telephone: "0601020304",
    ville: "Paris",
    codePostal: "75000",
    pays: "France"
  }
];

const Adresses = () => {
  const [adresses, setAdresses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [form, setForm] = useState({ nom: "", adresse: "", telephone: "", ville: "", codePostal: "", pays: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("adresses");
    if (stored) setAdresses(JSON.parse(stored));
    else setAdresses(defaultAdresses);
  }, []);

  useEffect(() => {
    localStorage.setItem("adresses", JSON.stringify(adresses));
  }, [adresses]);

  const handleShow = (idx = null) => {
    setEditIndex(idx);
    if (idx !== null) setForm(adresses[idx]);
    else setForm({ nom: "", adresse: "", telephone: "", ville: "", codePostal: "", pays: "" });
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditIndex(null);
    setForm({ nom: "", adresse: "", telephone: "", ville: "", codePostal: "", pays: "" });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      const updated = [...adresses];
      updated[editIndex] = { ...form, id: adresses[editIndex].id };
      setAdresses(updated);
      setMessage("Adresse modifiée avec succès !");
    } else {
      setAdresses([...adresses, { ...form, id: Date.now() }]);
      setMessage("Adresse ajoutée avec succès !");
    }
    handleClose();
    setTimeout(() => setMessage(""), 2000);
  };

  const handleDelete = (idx) => {
    if (window.confirm("Supprimer cette adresse ?")) {
      const updated = adresses.filter((_, i) => i !== idx);
      setAdresses(updated);
      setMessage("Adresse supprimée.");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  return (
    <div className="container my-4" style={{maxWidth:700}}>
      <h2>Mes adresses</h2>
      <p>Ajoutez, modifiez ou supprimez vos adresses de livraison.</p>
      <Button variant="success" className="mb-3" onClick={() => handleShow()}>Ajouter une adresse</Button>
      {message && <div className="alert alert-info">{message}</div>}
      <div className="row">
        {adresses.length === 0 && <p>Aucune adresse enregistrée.</p>}
        {adresses.map((adr, idx) => (
          <div className="col-md-6 mb-3" key={adr.id}>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>{adr.nom}</Card.Title>
                <Card.Text>
                  {adr.adresse}<br/>
                  {adr.ville}, {adr.codePostal}, {adr.pays}<br/>
                  <span className="text-muted">Tél : {adr.telephone}</span>
                </Card.Text>
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShow(idx)}>Modifier</Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(idx)}>Supprimer</Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
      {/* Modal ajout/modif */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editIndex !== null ? "Modifier l'adresse" : "Ajouter une adresse"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-2">
              <Form.Label>Nom complet</Form.Label>
              <Form.Control name="nom" value={form.nom} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Adresse</Form.Label>
              <Form.Control name="adresse" value={form.adresse} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Ville</Form.Label>
              <Form.Control name="ville" value={form.ville} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Code postal</Form.Label>
              <Form.Control name="codePostal" value={form.codePostal} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Pays</Form.Label>
              <Form.Control name="pays" value={form.pays} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Téléphone</Form.Label>
              <Form.Control name="telephone" value={form.telephone} onChange={handleChange} required />
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

export default Adresses; 