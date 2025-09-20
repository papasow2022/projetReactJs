import React, { useState, useEffect } from "react";
import { Card, Form, Alert } from "react-bootstrap";
import { BsEnvelopeFill, BsBellFill, BsGiftFill, BsCheckCircleFill } from "react-icons/bs";

const defaultPrefs = {
  email: true,
  sms: false,
  promos: true,
  newsletter: true
};

const Preferences = () => {
  const [prefs, setPrefs] = useState(defaultPrefs);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("preferences");
    if (stored) setPrefs(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("preferences", JSON.stringify(prefs));
  }, [prefs]);

  const handleChange = (e) => {
    setPrefs({ ...prefs, [e.target.name]: e.target.checked });
    setMessage("Préférences mises à jour !");
    setTimeout(() => setMessage(""), 1500);
  };

  return (
    <div className="container my-4" style={{maxWidth:500}}>
      <h2 className="mb-3"><BsBellFill className="me-2 text-primary" size={28}/> Préférences de communication</h2>
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title className="mb-3"><BsEnvelopeFill className="me-2 text-secondary"/>Notifications et messages</Card.Title>
          <Form>
            <Form.Check
              type="switch"
              id="notif-email"
              name="email"
              label={<span><BsEnvelopeFill className="me-2 text-info"/>Recevoir les notifications par email</span>}
              checked={prefs.email}
              onChange={handleChange}
              className="mb-2"
            />
            <Form.Check
              type="switch"
              id="notif-sms"
              name="sms"
              label={<span><BsBellFill className="me-2 text-warning"/>Recevoir les notifications par SMS</span>}
              checked={prefs.sms}
              onChange={handleChange}
              className="mb-2"
            />
            <Form.Check
              type="switch"
              id="notif-promos"
              name="promos"
              label={<span><BsGiftFill className="me-2 text-success"/>Recevoir les offres promotionnelles</span>}
              checked={prefs.promos}
              onChange={handleChange}
              className="mb-2"
            />
            <Form.Check
              type="switch"
              id="notif-newsletter"
              name="newsletter"
              label={<span><BsCheckCircleFill className="me-2 text-primary"/>Recevoir la newsletter</span>}
              checked={prefs.newsletter}
              onChange={handleChange}
              className="mb-2"
            />
          </Form>
        </Card.Body>
      </Card>
      {message && <Alert variant="success">{message}</Alert>}
    </div>
  );
};

export default Preferences; 