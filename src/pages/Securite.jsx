import React, { useState } from "react";
import { Button, Form, Card, Alert } from "react-bootstrap";
import { BsShieldLock, BsKey, BsShieldCheck, BsShieldX } from "react-icons/bs";

const Securite = () => {
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [twoFA, setTwoFA] = useState(false);

  const handlePwdChange = (e) => {
    e.preventDefault();
    setError("");
    if (newPwd.length < 6) {
      setError("Le nouveau mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (newPwd !== confirmPwd) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setMessage("Mot de passe modifié avec succès !");
    setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
    setTimeout(() => setMessage(""), 2000);
  };

  const handle2FA = () => {
    setTwoFA(!twoFA);
    setMessage(twoFA ? "Authentification à deux facteurs désactivée." : "Authentification à deux facteurs activée (simulation)");
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="container my-4" style={{maxWidth:500}}>
      <h2 className="mb-3"><BsShieldLock className="me-2 text-primary" size={32}/> Paramètres de sécurité</h2>
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title className="mb-3"><BsKey className="me-2 text-secondary"/>Changer le mot de passe</Card.Title>
          <Form onSubmit={handlePwdChange}>
            <Form.Group className="mb-2">
              <Form.Label>Mot de passe actuel</Form.Label>
              <Form.Control type="password" value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Nouveau mot de passe</Form.Label>
              <Form.Control type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Confirmer le nouveau mot de passe</Form.Label>
              <Form.Control type="password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} required />
            </Form.Group>
            <Button variant="primary" type="submit">Enregistrer</Button>
          </Form>
          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        </Card.Body>
      </Card>
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title className="mb-3"><BsShieldCheck className="me-2 text-success"/>Authentification à deux facteurs (2FA)</Card.Title>
          <p>Protégez votre compte avec une sécurité renforcée.</p>
          <Button variant={twoFA ? "danger" : "success"} onClick={handle2FA} className="d-flex align-items-center">
            {twoFA ? <BsShieldX className="me-2"/> : <BsShieldCheck className="me-2"/>}
            {twoFA ? "Désactiver la 2FA" : "Activer la 2FA"}
          </Button>
        </Card.Body>
      </Card>
      {message && <Alert variant="success" className="mt-3">{message}</Alert>}
    </div>
  );
};

export default Securite; 