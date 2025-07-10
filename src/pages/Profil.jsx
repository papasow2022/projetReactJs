import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";

const defaultProfil = {
  nom: "Dupont",
  prenom: "Jean",
  email: "jean.dupont@email.com",
  telephone: "0601020304"
};

const Profil = () => {
  const [profil, setProfil] = useState(defaultProfil);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("profil");
    if (stored) setProfil(JSON.parse(stored));
  }, []);

  const handleChange = (e) => {
    setProfil({ ...profil, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("profil", JSON.stringify(profil));
    setMessage("Profil mis à jour avec succès !");
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="container my-4" style={{maxWidth:500}}>
      <h2>Mon profil</h2>
      <p>Gérez vos informations personnelles ici.</p>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nom</Form.Label>
          <Form.Control type="text" name="nom" value={profil.nom} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Prénom</Form.Label>
          <Form.Control type="text" name="prenom" value={profil.prenom} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" value={profil.email} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Téléphone</Form.Label>
          <Form.Control type="tel" name="telephone" value={profil.telephone} onChange={handleChange} required />
        </Form.Group>
        <Button variant="primary" type="submit">Enregistrer</Button>
      </Form>
      {message && <div className="alert alert-success mt-3">{message}</div>}
    </div>
  );
};

export default Profil; 