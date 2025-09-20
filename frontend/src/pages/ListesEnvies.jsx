import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Form, Alert } from "react-bootstrap";
import { BsHeartFill, BsPlusCircle, BsTrash, BsBoxSeam } from "react-icons/bs";

const defaultEnvies = [
  { id: 1, nom: "Baskets Nike Air Max", image: "/assets/nike-air-max.jpg", note: 5 },
  { id: 2, nom: "Chaussures Adidas Superstar", image: "/assets/adidas-superstar.jpg", note: 4 }
];

const ListesEnvies = () => {
  const [envies, setEnvies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nom: "", image: "", note: 3 });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("envies");
    if (stored) setEnvies(JSON.parse(stored));
    else setEnvies(defaultEnvies);
  }, []);

  useEffect(() => {
    localStorage.setItem("envies", JSON.stringify(envies));
  }, [envies]);

  const handleShow = () => {
    setForm({ nom: "", image: "", note: 3 });
    setShowModal(true);
  };
  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEnvies([...envies, { ...form, id: Date.now() }]);
    setMessage("Article ajouté à la liste d'envies !");
    handleClose();
    setTimeout(() => setMessage(""), 2000);
  };

  const handleDelete = (idx) => {
    if (window.confirm("Supprimer cet article de la liste d'envies ?")) {
      setEnvies(envies.filter((_, i) => i !== idx));
      setMessage("Article supprimé.");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  return (
    <div className="container my-4" style={{maxWidth:900}}>
      <h2 className="mb-3"><BsHeartFill className="me-2 text-danger" size={28}/> Listes d'envies</h2>
      <p>Sauvegardez vos articles préférés pour un achat futur.</p>
      <Button variant="success" className="mb-3 d-flex align-items-center" onClick={handleShow}>
        <BsPlusCircle className="me-2"/> Ajouter un article
      </Button>
      {message && <Alert variant="info">{message}</Alert>}
      <div className="row">
        {envies.length === 0 && <p>Aucun article dans la liste d'envies.</p>}
        {envies.map((item, idx) => (
          <div className="col-md-4 mb-3" key={item.id}>
            <Card className="shadow-sm h-100">
              <Card.Img variant="top" src={item.image || "/assets/default-shoe.jpg"} style={{objectFit:'cover', height:180}} />
              <Card.Body>
                <Card.Title className="d-flex align-items-center">
                  <BsBoxSeam className="me-2 text-primary"/> {item.nom}
                </Card.Title>
                <div className="mb-2">
                  {Array.from({length: item.note}, (_,i) => <span key={i} style={{color:'#ffc107', fontSize:18}}>★</span>)}
                  {Array.from({length: 5-item.note}, (_,i) => <span key={i} style={{color:'#e4e5e9', fontSize:18}}>★</span>)}
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
          <Modal.Title>Ajouter un article à la liste d'envies</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-2">
              <Form.Label>Nom du produit</Form.Label>
              <Form.Control name="nom" value={form.nom} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Image (URL ou chemin)</Form.Label>
              <Form.Control name="image" value={form.image} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Note</Form.Label>
              <Form.Select name="note" value={form.note} onChange={handleChange}>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} ★</option>)}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Annuler</Button>
            <Button variant="primary" type="submit">Ajouter</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ListesEnvies; 