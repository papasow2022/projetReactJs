import React, { useState } from 'react';
import { 
  BiDollar, 
  BiTrendingUp, 
  BiTrendingDown, 
  BiRefresh,
  BiSearch,
  BiFilter,
  BiEdit,
  BiSave,
  BiX
} from 'react-icons/bi';

const PricingManagement = () => {
  const [pricingData, setPricingData] = useState([
    {
      id: 'PRICE-001',
      product: 'Nike Air Max',
      sku: 'NIKE-AM-001',
      currentPrice: 89.99,
      competitorPrice: 85.50,
      buyBoxPrice: 89.99,
      minPrice: 75.00,
      maxPrice: 95.00,
      status: 'Buy Box',
      lastUpdated: '2024-01-15'
    },
    {
      id: 'PRICE-002',
      product: 'Adidas Stan Smith',
      sku: 'ADIDAS-SS-002',
      currentPrice: 65.00,
      competitorPrice: 62.00,
      buyBoxPrice: 62.00,
      minPrice: 55.00,
      maxPrice: 70.00,
      status: 'Perdu',
      lastUpdated: '2024-01-14'
    }
  ]);

  const [pricingMetrics] = useState({
    totalProducts: 2,
    buyBoxWinners: 1,
    buyBoxLosers: 1,
    averagePrice: 77.50,
    priceChanges: 3,
    competitiveProducts: 2
  });

  const [editingPrice, setEditingPrice] = useState(null);
  const [newPrice, setNewPrice] = useState('');

  const handleEditPrice = (id, currentPrice) => {
    setEditingPrice(id);
    setNewPrice(currentPrice.toString());
  };

  const handleSavePrice = (id) => {
    setPricingData(prev => prev.map(item => 
      item.id === id 
        ? { ...item, currentPrice: parseFloat(newPrice), lastUpdated: new Date().toISOString().split('T')[0] }
        : item
    ));
    setEditingPrice(null);
    setNewPrice('');
  };

  const handleCancelEdit = () => {
    setEditingPrice(null);
    setNewPrice('');
  };

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
          Gestion des Prix
        </h1>
        <p style={{ 
          margin: 0, 
          color: '#565959', 
          fontSize: '0.9rem' 
        }}>
          Gérez vos prix et restez compétitif sur le marché
        </p>
      </div>

      {/* Métriques de tarification */}
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
          <BiDollar style={{ fontSize: '2rem', color: '#00a650', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#232f3e' }}>
            {pricingMetrics.totalProducts}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#565959' }}>Produits</div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #d5d9d9',
          borderRadius: '8px',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <BiTrendingUp style={{ fontSize: '2rem', color: '#00a650', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#232f3e' }}>
            {pricingMetrics.buyBoxWinners}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#565959' }}>Buy Box</div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #d5d9d9',
          borderRadius: '8px',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <BiTrendingDown style={{ fontSize: '2rem', color: '#d13212', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#232f3e' }}>
            {pricingMetrics.buyBoxLosers}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#565959' }}>Perdus</div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #d5d9d9',
          borderRadius: '8px',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <BiDollar style={{ fontSize: '2rem', color: '#0066c0', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#232f3e' }}>
            €{pricingMetrics.averagePrice}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#565959' }}>Prix moyen</div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #d5d9d9',
          borderRadius: '8px',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <BiRefresh style={{ fontSize: '2rem', color: '#ff9900', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#232f3e' }}>
            {pricingMetrics.priceChanges}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#565959' }}>Changements</div>
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
            {pricingMetrics.competitiveProducts}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#565959' }}>Compétitifs</div>
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
            <BiRefresh style={{ fontSize: '1rem' }} />
            Actualiser tous les prix
          </button>
          
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
            <BiTrendingUp style={{ fontSize: '1rem' }} />
            Analyse concurrentielle
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
            <BiDollar style={{ fontSize: '1rem' }} />
            Règles de prix
          </button>
        </div>
      </div>

      {/* Tableau de tarification */}
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
            Prix des produits
          </h3>
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
                  Mon prix
                </th>
                <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: '600', color: '#232f3e' }}>
                  Prix concurrent
                </th>
                <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: '600', color: '#232f3e' }}>
                  Buy Box
                </th>
                <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: '600', color: '#232f3e' }}>
                  Min/Max
                </th>
                <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: '600', color: '#232f3e' }}>
                  Statut
                </th>
                <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: '600', color: '#232f3e' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {pricingData.map((item, index) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                  <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#232f3e' }}>
                    <div style={{ fontWeight: '600' }}>{item.product}</div>
                    <div style={{ fontSize: '0.8rem', color: '#565959' }}>{item.id}</div>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#232f3e' }}>
                    {item.sku}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center', fontSize: '0.9rem', color: '#232f3e' }}>
                    {editingPrice === item.id ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="number"
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          style={{
                            width: '80px',
                            padding: '0.25rem',
                            border: '1px solid #d5d9d9',
                            borderRadius: '4px',
                            fontSize: '0.9rem'
                          }}
                        />
                        <button
                          onClick={() => handleSavePrice(item.id)}
                          style={{
                            backgroundColor: '#00a650',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '0.25rem',
                            cursor: 'pointer'
                          }}
                        >
                          <BiSave style={{ fontSize: '0.8rem' }} />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          style={{
                            backgroundColor: '#d13212',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '0.25rem',
                            cursor: 'pointer'
                          }}
                        >
                          <BiX style={{ fontSize: '0.8rem' }} />
                        </button>
                      </div>
                    ) : (
                      <div style={{ fontWeight: '600', color: '#232f3e' }}>
                        €{item.currentPrice}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center', fontSize: '0.9rem', color: '#565959' }}>
                    €{item.competitorPrice}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center', fontSize: '0.9rem', color: '#232f3e' }}>
                    €{item.buyBoxPrice}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center', fontSize: '0.9rem', color: '#565959' }}>
                    €{item.minPrice} - €{item.maxPrice}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      backgroundColor: item.status === 'Buy Box' ? '#d4edda' : '#f8d7da',
                      color: item.status === 'Buy Box' ? '#155724' : '#721c24'
                    }}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <button
                      onClick={() => handleEditPrice(item.id, item.currentPrice)}
                      style={{
                        backgroundColor: '#0066c0',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '0.25rem 0.5rem',
                        cursor: 'pointer'
                      }}
                    >
                      <BiEdit style={{ fontSize: '0.8rem' }} />
                    </button>
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

export default PricingManagement;