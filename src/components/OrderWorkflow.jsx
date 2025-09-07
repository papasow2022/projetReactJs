// src/components/OrderWorkflow.jsx
import React, { useState, useEffect } from 'react';
import { useThemeColors } from '../contexts/ThemeContext';
import { 
  BiPackage, 
  BiCar, 
  BiCheckCircle, 
  BiTime, 
  BiXCircle,
  BiEdit,
  BiTrash,
  BiShow,
  BiMessage,
  BiCalendar,
  BiUser,
  BiDollar,
  BiMapPin,
  BiPhone,
  BiEnvelope,
  BiRefresh,
  BiFilter,
  BiSearch
} from 'react-icons/bi';

const OrderWorkflow = () => {
  const colors = useThemeColors();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des commandes
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      setOrders([
        {
          id: 'ORD-2024-001',
          customer: {
            name: 'Marie Dupont',
            email: 'marie.dupont@email.com',
            phone: '+33 6 12 34 56 78',
            address: '123 Rue de la Paix, 75001 Paris'
          },
          items: [
            { name: 'Nike Air Max 270', quantity: 1, price: 120, size: '42' },
            { name: 'Adidas Superstar', quantity: 1, price: 89, size: '41' }
          ],
          total: 209,
          status: 'processing',
          paymentStatus: 'paid',
          shippingStatus: 'preparing',
          createdAt: new Date('2024-01-15T10:30:00'),
          updatedAt: new Date('2024-01-15T14:20:00'),
          estimatedDelivery: new Date('2024-01-18T16:00:00'),
          trackingNumber: 'TRK123456789',
          notes: 'Client VIP - Livraison prioritaire'
        },
        {
          id: 'ORD-2024-002',
          customer: {
            name: 'Jean Martin',
            email: 'jean.martin@email.com',
            phone: '+33 6 98 76 54 32',
            address: '456 Avenue des Champs, 69000 Lyon'
          },
          items: [
            { name: 'Puma RS-X', quantity: 2, price: 95, size: '43' }
          ],
          total: 190,
          status: 'shipped',
          paymentStatus: 'paid',
          shippingStatus: 'in_transit',
          createdAt: new Date('2024-01-14T15:45:00'),
          updatedAt: new Date('2024-01-16T09:15:00'),
          estimatedDelivery: new Date('2024-01-17T14:00:00'),
          trackingNumber: 'TRK987654321',
          notes: ''
        },
        {
          id: 'ORD-2024-003',
          customer: {
            name: 'Sophie Bernard',
            email: 'sophie.bernard@email.com',
            phone: '+33 6 55 44 33 22',
            address: '789 Boulevard Saint-Germain, 13000 Marseille'
          },
          items: [
            { name: 'Veste Nike', quantity: 1, price: 75, size: 'M' },
            { name: 'Sac Adidas', quantity: 1, price: 45, size: 'One Size' }
          ],
          total: 120,
          status: 'delivered',
          paymentStatus: 'paid',
          shippingStatus: 'delivered',
          createdAt: new Date('2024-01-12T09:20:00'),
          updatedAt: new Date('2024-01-15T11:30:00'),
          estimatedDelivery: new Date('2024-01-15T16:00:00'),
          trackingNumber: 'TRK456789123',
          notes: 'Livraison effectuée avec succès'
        },
        {
          id: 'ORD-2024-004',
          customer: {
            name: 'Pierre Dubois',
            email: 'pierre.dubois@email.com',
            phone: '+33 6 11 22 33 44',
            address: '321 Rue de Rivoli, 31000 Toulouse'
          },
          items: [
            { name: 'Balenciaga Defender', quantity: 1, price: 450, size: '44' }
          ],
          total: 450,
          status: 'pending',
          paymentStatus: 'pending',
          shippingStatus: 'not_shipped',
          createdAt: new Date('2024-01-16T16:30:00'),
          updatedAt: new Date('2024-01-16T16:30:00'),
          estimatedDelivery: new Date('2024-01-20T16:00:00'),
          trackingNumber: '',
          notes: 'En attente de paiement'
        }
      ]);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { 
        label: 'En attente', 
        color: colors.warning, 
        icon: BiTime,
        bgColor: `${colors.warning}20`
      },
      processing: { 
        label: 'En préparation', 
        color: colors.info, 
        icon: BiPackage,
        bgColor: `${colors.info}20`
      },
      shipped: { 
        label: 'Expédiée', 
        color: colors.primary, 
        icon: BiCar,
        bgColor: `${colors.primary}20`
      },
      delivered: { 
        label: 'Livrée', 
        color: colors.success, 
        icon: BiCheckCircle,
        bgColor: `${colors.success}20`
      },
      cancelled: { 
        label: 'Annulée', 
        color: colors.danger, 
        icon: BiXCircle,
        bgColor: `${colors.danger}20`
      }
    };
    return statusMap[status] || statusMap.pending;
  };

  const getPaymentStatusInfo = (status) => {
    const statusMap = {
      pending: { label: 'En attente', color: colors.warning },
      paid: { label: 'Payé', color: colors.success },
      failed: { label: 'Échec', color: colors.danger },
      refunded: { label: 'Remboursé', color: colors.info }
    };
    return statusMap[status] || statusMap.pending;
  };

  const getShippingStatusInfo = (status) => {
    const statusMap = {
      not_shipped: { label: 'Non expédié', color: colors.textSecondary },
      preparing: { label: 'En préparation', color: colors.warning },
      in_transit: { label: 'En transit', color: colors.info },
      delivered: { label: 'Livré', color: colors.success },
      returned: { label: 'Retourné', color: colors.danger }
    };
    return statusMap[status] || statusMap.not_shipped;
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch = searchTerm === '' || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus, updatedAt: new Date() }
        : order
    ));
  };

  const getOrderProgress = (order) => {
    const steps = [
      { key: 'pending', label: 'Commande reçue' },
      { key: 'processing', label: 'En préparation' },
      { key: 'shipped', label: 'Expédiée' },
      { key: 'delivered', label: 'Livrée' }
    ];
    
    const currentIndex = steps.findIndex(step => step.key === order.status);
    return { steps, currentIndex };
  };

  if (isLoading) {
    return (
      <div 
        className="card border-0 shadow-sm"
        style={{ 
          backgroundColor: colors.card,
          border: `1px solid ${colors.border}`
        }}
      >
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-3 mb-0" style={{ color: colors.textSecondary }}>
            Chargement des commandes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="card border-0 shadow-sm"
      style={{ 
        backgroundColor: colors.card,
        border: `1px solid ${colors.border}`
      }}
    >
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0" style={{ color: colors.text }}>
            <BiPackage className="me-2" />
            Workflow des Commandes
          </h5>
          <div className="d-flex gap-2">
            <div className="input-group" style={{ width: '200px' }}>
              <span 
                className="input-group-text"
                style={{
                  backgroundColor: colors.input,
                  borderColor: colors.border,
                  color: colors.text
                }}
              >
                <BiSearch size={16} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  backgroundColor: colors.input,
                  borderColor: colors.border,
                  color: colors.text
                }}
              />
            </div>
            <select
              className="form-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                backgroundColor: colors.input,
                borderColor: colors.border,
                color: colors.text,
                width: 'auto'
              }}
            >
              <option value="all">Toutes les commandes</option>
              <option value="pending">En attente</option>
              <option value="processing">En préparation</option>
              <option value="shipped">Expédiées</option>
              <option value="delivered">Livrées</option>
              <option value="cancelled">Annulées</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card-body p-0">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-5">
            <BiPackage size={48} style={{ color: colors.textSecondary }} />
            <p className="mt-3 mb-0" style={{ color: colors.textSecondary }}>
              Aucune commande trouvée
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr style={{ backgroundColor: colors.surface }}>
                  <th style={{ color: colors.text, borderColor: colors.border }}>Commande</th>
                  <th style={{ color: colors.text, borderColor: colors.border }}>Client</th>
                  <th style={{ color: colors.text, borderColor: colors.border }}>Montant</th>
                  <th style={{ color: colors.text, borderColor: colors.border }}>Statut</th>
                  <th style={{ color: colors.text, borderColor: colors.border }}>Paiement</th>
                  <th style={{ color: colors.text, borderColor: colors.border }}>Livraison</th>
                  <th style={{ color: colors.text, borderColor: colors.border }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => {
                  const statusInfo = getStatusInfo(order.status);
                  const paymentInfo = getPaymentStatusInfo(order.paymentStatus);
                  const shippingInfo = getShippingStatusInfo(order.shippingStatus);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <tr 
                      key={order.id}
                      style={{ 
                        cursor: 'pointer',
                        borderColor: colors.border
                      }}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td style={{ color: colors.text }}>
                        <div>
                          <div className="fw-bold">{order.id}</div>
                          <small style={{ color: colors.textSecondary }}>
                            <BiCalendar className="me-1" />
                            {order.createdAt.toLocaleDateString('fr-FR')}
                          </small>
                        </div>
                      </td>
                      <td style={{ color: colors.text }}>
                        <div>
                          <div className="fw-bold">{order.customer.name}</div>
                          <small style={{ color: colors.textSecondary }}>
                            <BiEnvelope className="me-1" />
                            {order.customer.email}
                          </small>
                        </div>
                      </td>
                      <td style={{ color: colors.text }}>
                        <div className="fw-bold">€{order.total}</div>
                        <small style={{ color: colors.textSecondary }}>
                          {order.items.length} article{order.items.length > 1 ? 's' : ''}
                        </small>
                      </td>
                      <td>
                        <span 
                          className="badge d-flex align-items-center gap-1"
                          style={{
                            backgroundColor: statusInfo.bgColor,
                            color: statusInfo.color,
                            fontSize: '0.8rem',
                            width: 'fit-content'
                          }}
                        >
                          <StatusIcon size={12} />
                          {statusInfo.label}
                        </span>
                      </td>
                      <td>
                        <span 
                          className="badge"
                          style={{
                            backgroundColor: `${paymentInfo.color}20`,
                            color: paymentInfo.color,
                            fontSize: '0.8rem'
                          }}
                        >
                          {paymentInfo.label}
                        </span>
                      </td>
                      <td>
                        <span 
                          className="badge"
                          style={{
                            backgroundColor: `${shippingInfo.color}20`,
                            color: shippingInfo.color,
                            fontSize: '0.8rem'
                          }}
                        >
                          {shippingInfo.label}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOrder(order);
                            }}
                            style={{
                              borderColor: colors.border,
                              color: colors.text,
                              backgroundColor: 'transparent'
                            }}
                            title="Voir les détails"
                          >
                            <BiShow size={14} />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Action d'édition
                            }}
                            style={{
                              borderColor: colors.border,
                              color: colors.text,
                              backgroundColor: 'transparent'
                            }}
                            title="Modifier"
                          >
                            <BiEdit size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de détails de commande */}
      {selectedOrder && (
        <div 
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setSelectedOrder(null)}
        >
          <div 
            className="modal-dialog modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="modal-content"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.text
              }}
            >
              <div 
                className="modal-header"
                style={{
                  borderBottomColor: colors.border,
                  backgroundColor: colors.surface
                }}
              >
                <h5 className="modal-title">
                  Détails de la commande {selectedOrder.id}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedOrder(null)}
                  style={{ filter: 'invert(1)' }}
                />
              </div>
              
              <div className="modal-body">
                {/* Informations client */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h6 style={{ color: colors.text }}>Informations client</h6>
                    <div className="p-3 rounded" style={{ backgroundColor: colors.surface }}>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <BiUser style={{ color: colors.primary }} />
                        <span className="fw-bold">{selectedOrder.customer.name}</span>
                      </div>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <BiEnvelope style={{ color: colors.textSecondary }} />
                        <span style={{ color: colors.textSecondary }}>{selectedOrder.customer.email}</span>
                      </div>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <BiPhone style={{ color: colors.textSecondary }} />
                        <span style={{ color: colors.textSecondary }}>{selectedOrder.customer.phone}</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <BiMapPin style={{ color: colors.textSecondary }} />
                        <span style={{ color: colors.textSecondary }}>{selectedOrder.customer.address}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <h6 style={{ color: colors.text }}>Statut de la commande</h6>
                    <div className="p-3 rounded" style={{ backgroundColor: colors.surface }}>
                      {(() => {
                        const { steps, currentIndex } = getOrderProgress(selectedOrder);
                        return (
                          <div>
                            {steps.map((step, index) => {
                              const isCompleted = index <= currentIndex;
                              const isCurrent = index === currentIndex;
                              const StepIcon = getStatusInfo(step.key).icon;
                              
                              return (
                                <div key={step.key} className="d-flex align-items-center gap-2 mb-2">
                                  <div 
                                    className="rounded-circle d-flex align-items-center justify-content-center"
                                    style={{
                                      width: '24px',
                                      height: '24px',
                                      backgroundColor: isCompleted ? colors.success : colors.textSecondary,
                                      color: 'white'
                                    }}
                                  >
                                    <StepIcon size={12} />
                                  </div>
                                  <span 
                                    style={{ 
                                      color: isCurrent ? colors.text : colors.textSecondary,
                                      fontWeight: isCurrent ? '600' : '400'
                                    }}
                                  >
                                    {step.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Articles commandés */}
                <div className="mb-4">
                  <h6 style={{ color: colors.text }}>Articles commandés</h6>
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr style={{ backgroundColor: colors.surface }}>
                          <th style={{ color: colors.text, borderColor: colors.border }}>Article</th>
                          <th style={{ color: colors.text, borderColor: colors.border }}>Taille</th>
                          <th style={{ color: colors.text, borderColor: colors.border }}>Quantité</th>
                          <th style={{ color: colors.text, borderColor: colors.border }}>Prix</th>
                          <th style={{ color: colors.text, borderColor: colors.border }}>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map((item, index) => (
                          <tr key={index} style={{ borderColor: colors.border }}>
                            <td style={{ color: colors.text }}>{item.name}</td>
                            <td style={{ color: colors.text }}>{item.size}</td>
                            <td style={{ color: colors.text }}>{item.quantity}</td>
                            <td style={{ color: colors.text }}>€{item.price}</td>
                            <td style={{ color: colors.text }}>€{item.price * item.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr style={{ borderColor: colors.border }}>
                          <td colSpan="4" className="fw-bold" style={{ color: colors.text }}>
                            Total
                          </td>
                          <td className="fw-bold" style={{ color: colors.text }}>
                            €{selectedOrder.total}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Actions rapides */}
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      const nextStatus = selectedOrder.status === 'pending' ? 'processing' :
                                       selectedOrder.status === 'processing' ? 'shipped' :
                                       selectedOrder.status === 'shipped' ? 'delivered' : null;
                      if (nextStatus) {
                        updateOrderStatus(selectedOrder.id, nextStatus);
                        setSelectedOrder({ ...selectedOrder, status: nextStatus });
                      }
                    }}
                    disabled={selectedOrder.status === 'delivered' || selectedOrder.status === 'cancelled'}
                  >
                    {selectedOrder.status === 'pending' ? 'Commencer la préparation' :
                     selectedOrder.status === 'processing' ? 'Marquer comme expédiée' :
                     selectedOrder.status === 'shipped' ? 'Marquer comme livrée' : 'Action non disponible'}
                  </button>
                  
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      // Action de messagerie
                    }}
                  >
                    <BiMessage className="me-1" />
                    Contacter le client
                  </button>
                  
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, 'cancelled');
                      setSelectedOrder({ ...selectedOrder, status: 'cancelled' });
                    }}
                    disabled={selectedOrder.status === 'delivered' || selectedOrder.status === 'cancelled'}
                  >
                    Annuler la commande
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderWorkflow;
import React, { useState, useEffect } from 'react';
import { useThemeColors } from '../contexts/ThemeContext';
import { 
  BiPackage, 
  BiCar, 
  BiCheckCircle, 
  BiTime, 
  BiXCircle,
  BiEdit,
  BiTrash,
  BiShow,
  BiMessage,
  BiCalendar,
  BiUser,
  BiDollar,
  BiMapPin,
  BiPhone,
  BiEnvelope,
  BiRefresh,
  BiFilter,
  BiSearch
} from 'react-icons/bi';

const OrderWorkflow = () => {
  const colors = useThemeColors();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des commandes
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      setOrders([
        {
          id: 'ORD-2024-001',
          customer: {
            name: 'Marie Dupont',
            email: 'marie.dupont@email.com',
            phone: '+33 6 12 34 56 78',
            address: '123 Rue de la Paix, 75001 Paris'
          },
          items: [
            { name: 'Nike Air Max 270', quantity: 1, price: 120, size: '42' },
            { name: 'Adidas Superstar', quantity: 1, price: 89, size: '41' }
          ],
          total: 209,
          status: 'processing',
          paymentStatus: 'paid',
          shippingStatus: 'preparing',
          createdAt: new Date('2024-01-15T10:30:00'),
          updatedAt: new Date('2024-01-15T14:20:00'),
          estimatedDelivery: new Date('2024-01-18T16:00:00'),
          trackingNumber: 'TRK123456789',
          notes: 'Client VIP - Livraison prioritaire'
        },
        {
          id: 'ORD-2024-002',
          customer: {
            name: 'Jean Martin',
            email: 'jean.martin@email.com',
            phone: '+33 6 98 76 54 32',
            address: '456 Avenue des Champs, 69000 Lyon'
          },
          items: [
            { name: 'Puma RS-X', quantity: 2, price: 95, size: '43' }
          ],
          total: 190,
          status: 'shipped',
          paymentStatus: 'paid',
          shippingStatus: 'in_transit',
          createdAt: new Date('2024-01-14T15:45:00'),
          updatedAt: new Date('2024-01-16T09:15:00'),
          estimatedDelivery: new Date('2024-01-17T14:00:00'),
          trackingNumber: 'TRK987654321',
          notes: ''
        },
        {
          id: 'ORD-2024-003',
          customer: {
            name: 'Sophie Bernard',
            email: 'sophie.bernard@email.com',
            phone: '+33 6 55 44 33 22',
            address: '789 Boulevard Saint-Germain, 13000 Marseille'
          },
          items: [
            { name: 'Veste Nike', quantity: 1, price: 75, size: 'M' },
            { name: 'Sac Adidas', quantity: 1, price: 45, size: 'One Size' }
          ],
          total: 120,
          status: 'delivered',
          paymentStatus: 'paid',
          shippingStatus: 'delivered',
          createdAt: new Date('2024-01-12T09:20:00'),
          updatedAt: new Date('2024-01-15T11:30:00'),
          estimatedDelivery: new Date('2024-01-15T16:00:00'),
          trackingNumber: 'TRK456789123',
          notes: 'Livraison effectuée avec succès'
        },
        {
          id: 'ORD-2024-004',
          customer: {
            name: 'Pierre Dubois',
            email: 'pierre.dubois@email.com',
            phone: '+33 6 11 22 33 44',
            address: '321 Rue de Rivoli, 31000 Toulouse'
          },
          items: [
            { name: 'Balenciaga Defender', quantity: 1, price: 450, size: '44' }
          ],
          total: 450,
          status: 'pending',
          paymentStatus: 'pending',
          shippingStatus: 'not_shipped',
          createdAt: new Date('2024-01-16T16:30:00'),
          updatedAt: new Date('2024-01-16T16:30:00'),
          estimatedDelivery: new Date('2024-01-20T16:00:00'),
          trackingNumber: '',
          notes: 'En attente de paiement'
        }
      ]);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { 
        label: 'En attente', 
        color: colors.warning, 
        icon: BiTime,
        bgColor: `${colors.warning}20`
      },
      processing: { 
        label: 'En préparation', 
        color: colors.info, 
        icon: BiPackage,
        bgColor: `${colors.info}20`
      },
      shipped: { 
        label: 'Expédiée', 
        color: colors.primary, 
        icon: BiCar,
        bgColor: `${colors.primary}20`
      },
      delivered: { 
        label: 'Livrée', 
        color: colors.success, 
        icon: BiCheckCircle,
        bgColor: `${colors.success}20`
      },
      cancelled: { 
        label: 'Annulée', 
        color: colors.danger, 
        icon: BiXCircle,
        bgColor: `${colors.danger}20`
      }
    };
    return statusMap[status] || statusMap.pending;
  };

  const getPaymentStatusInfo = (status) => {
    const statusMap = {
      pending: { label: 'En attente', color: colors.warning },
      paid: { label: 'Payé', color: colors.success },
      failed: { label: 'Échec', color: colors.danger },
      refunded: { label: 'Remboursé', color: colors.info }
    };
    return statusMap[status] || statusMap.pending;
  };

  const getShippingStatusInfo = (status) => {
    const statusMap = {
      not_shipped: { label: 'Non expédié', color: colors.textSecondary },
      preparing: { label: 'En préparation', color: colors.warning },
      in_transit: { label: 'En transit', color: colors.info },
      delivered: { label: 'Livré', color: colors.success },
      returned: { label: 'Retourné', color: colors.danger }
    };
    return statusMap[status] || statusMap.not_shipped;
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch = searchTerm === '' || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus, updatedAt: new Date() }
        : order
    ));
  };

  const getOrderProgress = (order) => {
    const steps = [
      { key: 'pending', label: 'Commande reçue' },
      { key: 'processing', label: 'En préparation' },
      { key: 'shipped', label: 'Expédiée' },
      { key: 'delivered', label: 'Livrée' }
    ];
    
    const currentIndex = steps.findIndex(step => step.key === order.status);
    return { steps, currentIndex };
  };

  if (isLoading) {
    return (
      <div 
        className="card border-0 shadow-sm"
        style={{ 
          backgroundColor: colors.card,
          border: `1px solid ${colors.border}`
        }}
      >
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-3 mb-0" style={{ color: colors.textSecondary }}>
            Chargement des commandes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="card border-0 shadow-sm"
      style={{ 
        backgroundColor: colors.card,
        border: `1px solid ${colors.border}`
      }}
    >
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0" style={{ color: colors.text }}>
            <BiPackage className="me-2" />
            Workflow des Commandes
          </h5>
          <div className="d-flex gap-2">
            <div className="input-group" style={{ width: '200px' }}>
              <span 
                className="input-group-text"
                style={{
                  backgroundColor: colors.input,
                  borderColor: colors.border,
                  color: colors.text
                }}
              >
                <BiSearch size={16} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  backgroundColor: colors.input,
                  borderColor: colors.border,
                  color: colors.text
                }}
              />
            </div>
            <select
              className="form-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                backgroundColor: colors.input,
                borderColor: colors.border,
                color: colors.text,
                width: 'auto'
              }}
            >
              <option value="all">Toutes les commandes</option>
              <option value="pending">En attente</option>
              <option value="processing">En préparation</option>
              <option value="shipped">Expédiées</option>
              <option value="delivered">Livrées</option>
              <option value="cancelled">Annulées</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card-body p-0">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-5">
            <BiPackage size={48} style={{ color: colors.textSecondary }} />
            <p className="mt-3 mb-0" style={{ color: colors.textSecondary }}>
              Aucune commande trouvée
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr style={{ backgroundColor: colors.surface }}>
                  <th style={{ color: colors.text, borderColor: colors.border }}>Commande</th>
                  <th style={{ color: colors.text, borderColor: colors.border }}>Client</th>
                  <th style={{ color: colors.text, borderColor: colors.border }}>Montant</th>
                  <th style={{ color: colors.text, borderColor: colors.border }}>Statut</th>
                  <th style={{ color: colors.text, borderColor: colors.border }}>Paiement</th>
                  <th style={{ color: colors.text, borderColor: colors.border }}>Livraison</th>
                  <th style={{ color: colors.text, borderColor: colors.border }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => {
                  const statusInfo = getStatusInfo(order.status);
                  const paymentInfo = getPaymentStatusInfo(order.paymentStatus);
                  const shippingInfo = getShippingStatusInfo(order.shippingStatus);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <tr 
                      key={order.id}
                      style={{ 
                        cursor: 'pointer',
                        borderColor: colors.border
                      }}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td style={{ color: colors.text }}>
                        <div>
                          <div className="fw-bold">{order.id}</div>
                          <small style={{ color: colors.textSecondary }}>
                            <BiCalendar className="me-1" />
                            {order.createdAt.toLocaleDateString('fr-FR')}
                          </small>
                        </div>
                      </td>
                      <td style={{ color: colors.text }}>
                        <div>
                          <div className="fw-bold">{order.customer.name}</div>
                          <small style={{ color: colors.textSecondary }}>
                            <BiEnvelope className="me-1" />
                            {order.customer.email}
                          </small>
                        </div>
                      </td>
                      <td style={{ color: colors.text }}>
                        <div className="fw-bold">€{order.total}</div>
                        <small style={{ color: colors.textSecondary }}>
                          {order.items.length} article{order.items.length > 1 ? 's' : ''}
                        </small>
                      </td>
                      <td>
                        <span 
                          className="badge d-flex align-items-center gap-1"
                          style={{
                            backgroundColor: statusInfo.bgColor,
                            color: statusInfo.color,
                            fontSize: '0.8rem',
                            width: 'fit-content'
                          }}
                        >
                          <StatusIcon size={12} />
                          {statusInfo.label}
                        </span>
                      </td>
                      <td>
                        <span 
                          className="badge"
                          style={{
                            backgroundColor: `${paymentInfo.color}20`,
                            color: paymentInfo.color,
                            fontSize: '0.8rem'
                          }}
                        >
                          {paymentInfo.label}
                        </span>
                      </td>
                      <td>
                        <span 
                          className="badge"
                          style={{
                            backgroundColor: `${shippingInfo.color}20`,
                            color: shippingInfo.color,
                            fontSize: '0.8rem'
                          }}
                        >
                          {shippingInfo.label}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOrder(order);
                            }}
                            style={{
                              borderColor: colors.border,
                              color: colors.text,
                              backgroundColor: 'transparent'
                            }}
                            title="Voir les détails"
                          >
                            <BiShow size={14} />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Action d'édition
                            }}
                            style={{
                              borderColor: colors.border,
                              color: colors.text,
                              backgroundColor: 'transparent'
                            }}
                            title="Modifier"
                          >
                            <BiEdit size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de détails de commande */}
      {selectedOrder && (
        <div 
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setSelectedOrder(null)}
        >
          <div 
            className="modal-dialog modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="modal-content"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.text
              }}
            >
              <div 
                className="modal-header"
                style={{
                  borderBottomColor: colors.border,
                  backgroundColor: colors.surface
                }}
              >
                <h5 className="modal-title">
                  Détails de la commande {selectedOrder.id}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedOrder(null)}
                  style={{ filter: 'invert(1)' }}
                />
              </div>
              
              <div className="modal-body">
                {/* Informations client */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h6 style={{ color: colors.text }}>Informations client</h6>
                    <div className="p-3 rounded" style={{ backgroundColor: colors.surface }}>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <BiUser style={{ color: colors.primary }} />
                        <span className="fw-bold">{selectedOrder.customer.name}</span>
                      </div>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <BiEnvelope style={{ color: colors.textSecondary }} />
                        <span style={{ color: colors.textSecondary }}>{selectedOrder.customer.email}</span>
                      </div>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <BiPhone style={{ color: colors.textSecondary }} />
                        <span style={{ color: colors.textSecondary }}>{selectedOrder.customer.phone}</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <BiMapPin style={{ color: colors.textSecondary }} />
                        <span style={{ color: colors.textSecondary }}>{selectedOrder.customer.address}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <h6 style={{ color: colors.text }}>Statut de la commande</h6>
                    <div className="p-3 rounded" style={{ backgroundColor: colors.surface }}>
                      {(() => {
                        const { steps, currentIndex } = getOrderProgress(selectedOrder);
                        return (
                          <div>
                            {steps.map((step, index) => {
                              const isCompleted = index <= currentIndex;
                              const isCurrent = index === currentIndex;
                              const StepIcon = getStatusInfo(step.key).icon;
                              
                              return (
                                <div key={step.key} className="d-flex align-items-center gap-2 mb-2">
                                  <div 
                                    className="rounded-circle d-flex align-items-center justify-content-center"
                                    style={{
                                      width: '24px',
                                      height: '24px',
                                      backgroundColor: isCompleted ? colors.success : colors.textSecondary,
                                      color: 'white'
                                    }}
                                  >
                                    <StepIcon size={12} />
                                  </div>
                                  <span 
                                    style={{ 
                                      color: isCurrent ? colors.text : colors.textSecondary,
                                      fontWeight: isCurrent ? '600' : '400'
                                    }}
                                  >
                                    {step.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Articles commandés */}
                <div className="mb-4">
                  <h6 style={{ color: colors.text }}>Articles commandés</h6>
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr style={{ backgroundColor: colors.surface }}>
                          <th style={{ color: colors.text, borderColor: colors.border }}>Article</th>
                          <th style={{ color: colors.text, borderColor: colors.border }}>Taille</th>
                          <th style={{ color: colors.text, borderColor: colors.border }}>Quantité</th>
                          <th style={{ color: colors.text, borderColor: colors.border }}>Prix</th>
                          <th style={{ color: colors.text, borderColor: colors.border }}>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map((item, index) => (
                          <tr key={index} style={{ borderColor: colors.border }}>
                            <td style={{ color: colors.text }}>{item.name}</td>
                            <td style={{ color: colors.text }}>{item.size}</td>
                            <td style={{ color: colors.text }}>{item.quantity}</td>
                            <td style={{ color: colors.text }}>€{item.price}</td>
                            <td style={{ color: colors.text }}>€{item.price * item.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr style={{ borderColor: colors.border }}>
                          <td colSpan="4" className="fw-bold" style={{ color: colors.text }}>
                            Total
                          </td>
                          <td className="fw-bold" style={{ color: colors.text }}>
                            €{selectedOrder.total}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Actions rapides */}
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      const nextStatus = selectedOrder.status === 'pending' ? 'processing' :
                                       selectedOrder.status === 'processing' ? 'shipped' :
                                       selectedOrder.status === 'shipped' ? 'delivered' : null;
                      if (nextStatus) {
                        updateOrderStatus(selectedOrder.id, nextStatus);
                        setSelectedOrder({ ...selectedOrder, status: nextStatus });
                      }
                    }}
                    disabled={selectedOrder.status === 'delivered' || selectedOrder.status === 'cancelled'}
                  >
                    {selectedOrder.status === 'pending' ? 'Commencer la préparation' :
                     selectedOrder.status === 'processing' ? 'Marquer comme expédiée' :
                     selectedOrder.status === 'shipped' ? 'Marquer comme livrée' : 'Action non disponible'}
                  </button>
                  
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      // Action de messagerie
                    }}
                  >
                    <BiMessage className="me-1" />
                    Contacter le client
                  </button>
                  
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, 'cancelled');
                      setSelectedOrder({ ...selectedOrder, status: 'cancelled' });
                    }}
                    disabled={selectedOrder.status === 'delivered' || selectedOrder.status === 'cancelled'}
                  >
                    Annuler la commande
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderWorkflow;
 
 
 
 
 
 
 
 
 