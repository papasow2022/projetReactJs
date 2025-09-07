import React, { useEffect, useMemo, useState } from 'react';
import { BiSearch, BiX } from 'react-icons/bi';
import { useProducts } from '../contexts/ProductsContext';
import { useVendor } from '../contexts/VendorContext';
import { useNavigate } from 'react-router-dom';

export default function GlobalSearchOverlay() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const { products } = useProducts();
  const { vendors } = useVendor();
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmd = isMac ? e.metaKey : e.ctrlKey;
      if (cmd && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    const prodRes = (products || []).filter(p =>
      p.name?.toLowerCase().includes(term) || p.brand?.toLowerCase().includes(term) || String(p.id || '').toLowerCase().includes(term)
    ).slice(0, 5).map(p => ({ type: 'product', id: p.id, title: p.name, subtitle: p.brand, to: `/product/${p.slug || p.id}` }));
    const vendRes = Object.values(vendors || {}).filter(v =>
      v.informations?.email?.toLowerCase().includes(term) || v.businessName?.toLowerCase().includes(term) || String(v.id || '').toLowerCase().includes(term)
    ).slice(0, 5).map(v => ({ type: 'vendor', id: v.id, title: v.businessName || `${v.informations?.prenom || ''} ${v.informations?.nom || ''}`.trim(), subtitle: v.informations?.email, to: `/admin/vendors` }));
    return [...vendRes, ...prodRes];
  }, [q, products, vendors]);

  if (!open) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000 }} onClick={() => setOpen(false)}>
      <div className="container" onClick={(e) => e.stopPropagation()}>
        <div className="row justify-content-center mt-5">
          <div className="col-lg-8">
            <div className="card shadow">
              <div className="card-body">
                <div className="input-group mb-3">
                  <span className="input-group-text"><BiSearch/></span>
                  <input autoFocus className="form-control" placeholder="Rechercher produits, vendeurs... (Ctrl/Cmd+K pour ouvrir)" value={q} onChange={e=>setQ(e.target.value)} />
                  <button className="btn btn-outline-secondary" onClick={()=>setOpen(false)}><BiX/></button>
                </div>
                <ul className="list-group list-group-flush">
                  {results.map(r => (
                    <li key={`${r.type}-${r.id}`} className="list-group-item list-group-item-action" style={{ cursor: 'pointer' }} onClick={()=>{ setOpen(false); navigate(r.to); }}>
                      <div className="d-flex justify-content-between">
                        <div>
                          <strong>{r.title}</strong>
                          <div className="text-muted small">{r.type} • {r.subtitle}</div>
                        </div>
                        <div className="text-muted">{r.id}</div>
                      </div>
                    </li>
                  ))}
                  {results.length === 0 && (
                    <li className="list-group-item text-muted">Tape pour rechercher...</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

