import React, { useState, useEffect } from "react";
import { Button, Form, Alert, Card } from "react-bootstrap";
import { useAuth } from "../hooks/useAuth.jsx";
import { useNavigate } from "react-router-dom";

const Profil = () => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const navigate = useNavigate();
  const [profil, setProfil] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setError("Vous devez être connecté pour accéder à votre profil.");
      return;
    }

    // Initialiser le profil avec les données de l'utilisateur connecté
    setProfil({
      nom: user.nom || "",
      prenom: user.prenom || "",
      email: user.email || "",
      telephone: user.phone || ""
    });
  }, [user, isAuthenticated]);

  const handleChange = (e) => {
    setProfil({ ...profil, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError("Vous devez être connecté pour modifier votre profil.");
      return;
    }

    try {
      // Mettre à jour l'utilisateur via le contexte d'authentification
      updateUser({
        nom: profil.nom,
        prenom: profil.prenom,
        email: profil.email,
        phone: profil.telephone
      });

      setMessage("Profil mis à jour avec succès !");
      setError("");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setError("Erreur lors de la mise à jour du profil.");
      setMessage("");
    }
  };

  // Si l'utilisateur n'est pas connecté, afficher un message et un bouton de connexion
  if (!isAuthenticated) {
    return (
      <div className="container my-4" style={{maxWidth:500}}>
        <Card className="shadow-sm">
          <Card.Body className="text-center">
            <h2 className="mb-3">🔒 Accès restreint</h2>
            <p className="text-muted mb-4">
              Vous devez être connecté pour accéder à votre profil et modifier vos informations personnelles.
            </p>
            <Button 
              variant="primary" 
              onClick={() => navigate('/connexion')}
              className="me-2"
            >
              Se connecter
            </Button>
            <Button 
              variant="outline-primary" 
              onClick={() => navigate('/inscription')}
            >
              Créer un compte
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className="container my-4" style={{maxWidth:500}}>
      <Card className="shadow-sm">
        <Card.Body>
          <h2 className="mb-3">
            <i className="bi bi-person-circle me-2 text-primary"></i>
            Mon profil
          </h2>
          <p className="text-muted mb-4">
            Gérez vos informations personnelles ici. Vos modifications seront sauvegardées automatiquement.
          </p>
          
          {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
          {message && <Alert variant="success" className="mb-3">{message}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nom</Form.Label>
              <Form.Control 
                type="text" 
                name="nom" 
                value={profil.nom} 
                onChange={handleChange} 
                required 
                placeholder="Votre nom"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Prénom</Form.Label>
              <Form.Control 
                type="text" 
                name="prenom" 
                value={profil.prenom} 
                onChange={handleChange} 
                required 
                placeholder="Votre prénom"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                name="email" 
                value={profil.email} 
                onChange={handleChange} 
                required 
                placeholder="votre.email@exemple.com"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Téléphone</Form.Label>
              <Form.Control 
                type="tel" 
                name="telephone" 
                value={profil.telephone} 
                onChange={handleChange} 
                required 
                placeholder="0601020304"
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              <i className="bi bi-check-circle me-2"></i>
              Enregistrer les modifications
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Profil; 