import React, { useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  BiPackage, 
  BiTrendingUp, 
  BiTrendingDown, 
  BiError,
  BiCheckCircle,
  BiXCircle,
  BiSearch,
  BiFilter,
  BiDownload,
  BiUpload,
  BiRefresh
} from 'react-icons/bi';

const InventoryManagement = () => {
  const { user } = useAuth();
  const isFBM = (user?.fulfillmentMode || '').toLowerCase() === 'fbm';
  const [inventoryData] = useState([
    {
      id: 'INV-001',
      product: 'Nike Air Max',
      sku: 'NIKE-AM-001',
      fulfillmentType: 'FBA',
      quantity: 15,
      inbound: 0,
      reserved: 2,
      available: 13,
      status: 'En stock',
      lastUpdated: '2024-01-15'
    },
    {
      id: 'INV-002',
      product: 'Adidas Stan Smith',
      sku: 'ADIDAS-SS-002',
      fulfillmentType: 'FBM',
      quantity: 8,
      inbound: 0,
      reserved: 1,
      available: 7,
      status: 'Stock faible',
      lastUpdated: '2024-01-14'
    },
    {
      id: 'INV-003',
      product: 'Puma Classic',
      sku: 'PUMA-CL-003',
      fulfillmentType: 'FBA',
      quantity: 0,
      inbound: 25,
      reserved: 0,
      available: 0,
      status: 'En transit',
      lastUpdated: '2024-01-13'
    }
  ]);

  const [inventoryMetrics] = useState({
    totalUnits: 48,
    fbaUnits: 40,
    fbmUnits: 8,
    inboundUnits: 25,
    reservedUnits: 3,
    availableUnits: 20,
    lowStockItems: 1,
    outOfStockItems: 0
  });

  const displayedInventory = useMemo(() => {
    return isFBM ? inventoryData.filter(item => item.fulfillmentType !== 'FBA') : inventoryData;
  }, [inventoryData, isFBM]);

  const displayedMetrics = useMemo(() => {
    if (!isFBM) return inventoryMetrics;
    return displayedInventory.reduce((acc, item) => {
      acc.totalUnits += item.quantity;
      acc.fbmUnits += item.quantity;
      acc.inboundUnits += item.inbound;
      acc.reservedUnits += item.reserved;
      acc.availableUnits += item.available;
      if (item.status === 'Stock faible') acc.lowStockItems += 1;
      if (item.status === 'Rupture') acc.outOfStockItems += 1;
      return acc;
    }, { totalUnits: 0, fbaUnits: 0, fbmUnits: 0, inboundUnits: 0, reservedUnits: 0, availableUnits: 0, lowStockItems: 0, outOfStockItems: 0 });
  }, [displayedInventory, inventoryMetrics, isFBM]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          margin: '0 0 0.5rem 0', 
          fontSize: '1.8rem', 
          fontWeight: '400', 
          color: '#232f3e' 
        }}>
          Gestion de l'Inventaire
        </h1>
        <p style={{ 
          margin: 0, 
          color: '#565959', 
          fontSize: '0.9rem' 
        }}>
          {isFBM ? 'Gérez vos stocks FBM (vous expédiez vos commandes)' : 'Gérez vos stocks et expéditions vers Amazon FBA'}
        </p>
      </div>

      {/* Métriques d'inventaire */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #d5d9d9',
          borderRadius: '8px',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <BiPackage style={{ fontSize: '2rem', color: '#0066c0', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#232f3e' }}>
            {displayedMetrics.totalUnits}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#565959' }}>Unités totales</div>
        </div>

        {!isFBM && (
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #d5d9d9',
          borderRadius: '8px',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <BiCheckCircle style={{ fontSize: '2rem', color: '#00a650', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#232f3e' }}>
            {displayedMetrics.fbaUnits}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#565959' }}>FBA</div>
        </div>
        )}

        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #d5d9d9',
          borderRadius: '8px',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <BiPackage style={{ fontSize: '2rem', color: '#ff9900', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#232f3e' }}>
            {displayedMetrics.fbmUnits}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#565959' }}>FBM</div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #d5d9d9',
          borderRadius: '8px',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <BiTrendingUp style={{ fontSize: '2rem', color: '#0066c0', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#232f3e' }}>
            {displayedMetrics.inboundUnits}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#565959' }}>En transit</div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #d5d9d9',
          borderRadius: '8px',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <BiError style={{ fontSize: '2rem', color: '#ff6600', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#232f3e' }}>
            {displayedMetrics.lowStockItems}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#565959' }}>Stock faible</div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #d5d9d9',
          borderRadius: '8px',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <BiXCircle style={{ fontSize: '2rem', color: '#d13212', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#232f3e' }}>
            {displayedMetrics.outOfStockItems}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#565959' }}>Rupture</div>
        </div>
      </div>

      {/* Explication FBA vs FBM */}
      <div style={{ 
        backgroundColor: '#f0f9ff',
        border: '1px solid #bae6fd',
        borderRadius: '8px',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '400', color: '#232f3e' }}>
          📦 Types de Fulfillment
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {!isFBM && (
          <div style={{ padding: '1rem', backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #d5d9d9' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: '600', color: '#0c5460' }}>
              🏪 FBA (Fulfillment by Amazon)
            </h4>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem', color: '#565959' }}>
              <li>Stock stocké dans les entrepôts Amazon</li>
              <li>Amazon s'occupe de l'expédition</li>
              <li>Éligible Prime automatiquement</li>
              <li>Frais de stockage et d'expédition</li>
            </ul>
          </div>
          )}
          <div style={{ padding: '1rem', backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #d5d9d9' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: '600', color: '#856404' }}>
              🚚 FBM (Fulfillment by Merchant)
            </h4>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem', color: '#565959' }}>
              <li>Stock stocké chez le vendeur</li>
              <li>Vendeur s'occupe de l'expédition</li>
              <li>Pas éligible Prime par défaut</li>
              <li>Pas de frais de stockage Amazon</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div style={{ 
        backgroundColor: '#ffffff',
        border: '1px solid #d5d9d9',
        borderRadius: '8px',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '400', color: '#232f3e' }}>
          Actions rapides
        </h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {!isFBM && (
          <button style={{
            backgroundColor: '#00a650',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            padding: '0.75rem 1.5rem',
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <BiUpload style={{ fontSize: '1rem' }} />
            Créer un envoi FBA
          </button>
          )}
          
          <button style={{
            backgroundColor: '#0066c0',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            padding: '0.75rem 1.5rem',
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <BiDownload style={{ fontSize: '1rem' }} />
            Télécharger rapport
          </button>
          
          <button style={{
            backgroundColor: '#ff9900',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            padding: '0.75rem 1.5rem',
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <BiRefresh style={{ fontSize: '1rem' }} />
            Actualiser
          </button>
        </div>
      </div>

      {/* Tableau d'inventaire */}
      <div style={{ 
        backgroundColor: '#ffffff',
        border: '1px solid #d5d9d9',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        <div style={{ 
          padding: '1rem 1.5rem',
          borderBottom: '1px solid #d5d9d9',
          backgroundColor: '#f8f9fa'
        }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '400', color: '#232f3e' }}>
            Inventaire détaillé
          </h3>
          {isFBM && (
            <div style={{ marginTop: '0.75rem' }}>
              <button style={{
                backgroundColor: 'transparent',
                color: '#0066c0',
                border: '1px solid #0066c0',
                borderRadius: '4px',
                padding: '0.25rem 0.75rem',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }} onClick={() => {
                const rows = displayedInventory.map(it => ({ id: it.id, product: it.product, sku: it.sku, type: it.fulfillmentType, qty: it.quantity, available: it.available, status: it.status, lastUpdated: it.lastUpdated }));
                try {
                  const { exportToCsv } = require('../utils/csvExport');
                  exportToCsv('inventaire_fbm.csv', rows);
                } catch (e) {
                  console.error(e);
                }
              }}>Exporter CSV</button>
            </div>
          )}
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600', color: '#232f3e' }}>
                  Produit
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600', color: '#232f3e' }}>
                  SKU
                </th>
                <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: '600', color: '#232f3e' }}>
                  Type
                </th>
                <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: '600', color: '#232f3e' }}>
                  Quantité
                </th>
                <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: '600', color: '#232f3e' }}>
                  En transit
                </th>
                <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: '600', color: '#232f3e' }}>
                  Réservé
                </th>
                <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: '600', color: '#232f3e' }}>
                  Disponible
                </th>
                <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: '600', color: '#232f3e' }}>
                  Statut
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedInventory.map((item, index) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                  <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#232f3e' }}>
                    <div style={{ fontWeight: '600' }}>{item.product}</div>
                    <div style={{ fontSize: '0.8rem', color: '#565959' }}>{item.id}</div>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#232f3e' }}>
                    {item.sku}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      backgroundColor: item.fulfillmentType === 'FBA' ? '#d1ecf1' : '#fff3cd',
                      color: item.fulfillmentType === 'FBA' ? '#0c5460' : '#856404'
                    }}>
                      {item.fulfillmentType}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: '600', color: '#232f3e' }}>
                    {item.quantity}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center', fontSize: '0.9rem', color: '#0066c0' }}>
                    {item.inbound}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center', fontSize: '0.9rem', color: '#ff9900' }}>
                    {item.reserved}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: '600', color: '#00a650' }}>
                    {item.available}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      backgroundColor: item.status === 'En stock' ? '#d4edda' : item.status === 'Stock faible' ? '#fff3cd' : '#d1ecf1',
                      color: item.status === 'En stock' ? '#155724' : item.status === 'Stock faible' ? '#856404' : '#0c5460'
                    }}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;