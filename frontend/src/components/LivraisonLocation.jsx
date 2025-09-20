import React, { useState, useEffect } from 'react';

export default function LivraisonLocation({ user }) {
  const [showModal, setShowModal] = useState(false);
  const [location, setLocation] = useState({ city: '', country: '' });
  const [input, setInput] = useState({ city: '', country: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Charger la localisation depuis le localStorage au montage
  useEffect(() => {
    const saved = localStorage.getItem('livraisonLocation');
    if (saved) {
      setLocation(JSON.parse(saved));
    } else {
      setLocation({ city: '', country: '' });
    }
  }, []);

  // Ouvre la modale
  const openModal = () => {
    setInput(location);
    setShowModal(true);
    setError('');
  };

  // Sauvegarde la localisation
  const saveLocation = (city, country) => {
    const loc = { city, country };
    setLocation(loc);
    localStorage.setItem('livraisonLocation', JSON.stringify(loc));
    setShowModal(false);
  };

  // Géolocalisation navigateur + reverse geocoding
  const detectLocation = async () => {
    setLoading(true);
    setError('');
    if (!navigator.geolocation) {
      setError("La géolocalisation n'est pas supportée par ce navigateur.");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        // Appel à Nominatim (OpenStreetMap) pour reverse geocoding
        const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await resp.json();
        const city = data.address.city || data.address.town || data.address.village || '';
        const country = data.address.country || '';
        if (city || country) {
          setInput({ city, country });
        } else {
          setError("Impossible de détecter la ville ou le pays.");
        }
      } catch (e) {
        setError("Erreur lors de la détection de la localisation.");
      }
      setLoading(false);
    }, (err) => {
      setError("Géolocalisation refusée ou indisponible.");
      setLoading(false);
    });
  };

  // Gère la saisie manuelle
  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  // Affichage principal
  return (
    <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={openModal}>
      <i className="bi bi-geo-alt" style={{ fontSize: 20, marginRight: 6, color: '#e47911' }}></i>
      <div style={{ lineHeight: 1 }}>
        <span style={{ fontSize: 11, color: '#ccc' }}>Livrer à</span><br />
        <span style={{ fontWeight: 'bold', color: '#fff', fontSize: 15 }}>
          {user ? user.prenom : ''}{user && location.city ? ' - ' : ''}{location.city || location.country || 'Votre position'}
        </span>
      </div>
      {/* Modale de sélection */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowModal(false)}>
          <div style={{ background: '#fff', borderRadius: 10, padding: 28, minWidth: 320, boxShadow: '0 8px 32px #0002' }} onClick={e => e.stopPropagation()}>
            <h5 style={{ marginBottom: 18 }}>Choisir la localisation de livraison</h5>
            <div className="mb-2">
              <label className="form-label">Ville</label>
              <input type="text" className="form-control" name="city" value={input.city} onChange={handleChange} placeholder="Ville" />
            </div>
            <div className="mb-2">
              <label className="form-label">Pays</label>
              <input type="text" className="form-control" name="country" value={input.country} onChange={handleChange} placeholder="Pays" />
            </div>
            <button className="btn btn-outline-primary mb-2" type="button" onClick={detectLocation} disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Détection en cours...' : 'Utiliser ma position actuelle'}
            </button>
            {error && <div className="alert alert-danger py-1" style={{ fontSize: 13 }}>{error}</div>}
            <div className="d-flex justify-content-end gap-2 mt-2">
              <button className="btn btn-secondary" type="button" onClick={() => setShowModal(false)}>Annuler</button>
              <button className="btn btn-primary" type="button" onClick={() => saveLocation(input.city, input.country)} disabled={!input.city && !input.country}>Valider</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 