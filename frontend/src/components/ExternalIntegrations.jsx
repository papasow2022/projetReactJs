// src/components/ExternalIntegrations.jsx
import React, { useState, useEffect } from 'react';
import { useThemeColors } from '../contexts/ThemeContext';
import { 
  BiLink, 
  BiCheckCircle, 
  BiXCircle, 
  BiRefresh, 
  BiCog, 
  BiShow,
  BiPlay,
  BiPause,
  BiTrash,
  BiPlus,
  BiShield,
  BiDollar,
  BiEnvelope,
  BiBarChart,
  BiCloud,
  BiCreditCard,
  BiCar,
  BiMessage
} from 'react-icons/bi';

const ExternalIntegrations = () => {
  const colors = useThemeColors();
  const [integrations, setIntegrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    // Simuler le chargement des intégrations
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      setIntegrations([
        {
          id: 1,
          name: 'Stripe',
          type: 'payment',
          status: 'connected',
          description: 'Paiements en ligne sécurisés',
          icon: BiCreditCard,
          color: '#635bff',
          lastSync: new Date('2024-01-15T14:30:00'),
          transactions: 1250,
          revenue: 45600,
          apiKey: 'sk_live_...',
          webhookUrl: 'https://papasow.com/webhooks/stripe',
          settings: {
            currency: 'EUR',
            webhookEnabled: true,
            autoCapture: true
          }
        },
        {
          id: 2,
          name: 'Mailchimp',
          type: 'email',
          status: 'connected',
          description: 'Marketing par email automatisé',
          icon: BiEnvelope,
          color: '#ffbe00',
          lastSync: new Date('2024-01-14T09:15:00'),
          subscribers: 2500,
          campaigns: 12,
          apiKey: 'mc_...',
          listId: 'list_123456',
          settings: {
            autoSync: true,
            doubleOptIn: true,
            tags: ['customers', 'newsletter']
          }
        },
        {
          id: 3,
          name: 'Google Analytics',
          type: 'analytics',
          status: 'connected',
          description: 'Analyse du trafic et des conversions',
          icon: BiBarChart,
          color: '#f4b400',
          lastSync: new Date('2024-01-16T11:45:00'),
          pageViews: 45600,
          sessions: 12300,
          trackingId: 'GA-123456789',
          propertyId: 'property_123',
          settings: {
            enhancedEcommerce: true,
            demographics: true,
            interests: true
          }
        },
        {
          id: 4,
          name: 'Shopify',
          type: 'ecommerce',
          status: 'disconnected',
          description: 'Synchronisation des produits et commandes',
          icon: BiCloud,
          color: '#96bf48',
          lastSync: new Date('2024-01-10T16:20:00'),
          products: 0,
          orders: 0,
          apiKey: '',
          shopDomain: '',
          settings: {
            syncProducts: false,
            syncOrders: false,
            syncInventory: false
          }
        },
        {
          id: 5,
          name: 'DHL Express',
          type: 'shipping',
          status: 'connected',
          description: 'Expédition et suivi des colis',
          icon: BiCar,
          color: '#d40511',
          lastSync: new Date('2024-01-16T08:30:00'),
          shipments: 89,
          delivered: 76,
          apiKey: 'dhl_...',
          accountNumber: '123456789',
          settings: {
            autoTracking: true,
            notifications: true,
            insurance: true
          }
        },
        {
          id: 6,
          name: 'Intercom',
          type: 'support',
          status: 'connected',
          description: 'Support client et chat en direct',
          icon: BiMessage,
          color: '#286efa',
          lastSync: new Date('2024-01-15T13:15:00'),
          conversations: 156,
          resolved: 142,
          apiKey: 'intercom_...',
          appId: 'app_123456',
          settings: {
            autoAssign: true,
            tags: ['support', 'sales'],
            workingHours: '9h-18h'
          }
        }
      ]);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getIntegrationTypeInfo = (type) => {
    const typeMap = {
      payment: { label: 'Paiement', color: colors.success },
      email: { label: 'Email', color: colors.info },
      analytics: { label: 'Analytics', color: colors.warning },
      ecommerce: { label: 'E-commerce', color: colors.primary },
      shipping: { label: 'Expédition', color: colors.danger },
      support: { label: 'Support', color: colors.secondary }
    };
    return typeMap[type] || { label: type, color: colors.textSecondary };
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      connected: { 
        label: 'Connecté', 
        color: colors.success,
        icon: BiCheckCircle,
        bgColor: `${colors.success}20`
      },
      disconnected: { 
        label: 'Déconnecté', 
        color: colors.danger,
        icon: BiXCircle,
        bgColor: `${colors.danger}20`
      },
      pending: { 
        label: 'En attente', 
        color: colors.warning,
        icon: BiRefresh,
        bgColor: `${colors.warning}20`
      }
    };
    return statusMap[status] || statusMap.disconnected;
  };

  const toggleIntegration = (integrationId) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { 
            ...integration, 
            status: integration.status === 'connected' ? 'disconnected' : 'connected',
            lastSync: new Date()
          }
        : integration
    ));
  };

  const syncIntegration = (integrationId) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { 
            ...integration, 
            lastSync: new Date()
          }
        : integration
    ));
  };

  const getFilteredIntegrations = () => {
    switch (activeTab) {
      case 'active':
        return integrations.filter(i => i.status === 'connected');
      case 'inactive':
        return integrations.filter(i => i.status === 'disconnected');
      case 'all':
      default:
        return integrations;
    }
  };

  const getIntegrationStats = () => {
    const total = integrations.length;
    const connected = integrations.filter(i => i.status === 'connected').length;
    const totalRevenue = integrations
      .filter(i => i.type === 'payment' && i.status === 'connected')
      .reduce((sum, i) => sum + (i.revenue || 0), 0);
    
    return { total, connected, totalRevenue };
  };

  const stats = getIntegrationStats();

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
            Chargement des intégrations...
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
            <BiLink className="me-2" />
            Intégrations Externes
          </h5>
          <div className="d-flex gap-2">
            <button
              className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveTab('all')}
              style={{
                backgroundColor: activeTab === 'all' ? colors.primary : 'transparent',
                borderColor: colors.primary,
                color: activeTab === 'all' ? 'white' : colors.primary
              }}
            >
              Toutes ({stats.total})
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'active' ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setActiveTab('active')}
              style={{
                backgroundColor: activeTab === 'active' ? colors.success : 'transparent',
                borderColor: colors.success,
                color: activeTab === 'active' ? 'white' : colors.success
              }}
            >
              Actives ({stats.connected})
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'inactive' ? 'btn-danger' : 'btn-outline-danger'}`}
              onClick={() => setActiveTab('inactive')}
              style={{
                backgroundColor: activeTab === 'inactive' ? colors.danger : 'transparent',
                borderColor: colors.danger,
                color: activeTab === 'inactive' ? 'white' : colors.danger
              }}
            >
              Inactives ({stats.total - stats.connected})
            </button>
          </div>
        </div>
      </div>

      <div className="card-body">
        {/* Statistiques rapides */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div 
              className="p-3 rounded text-center"
              style={{ backgroundColor: colors.surface }}
            >
              <div 
                className="fw-bold"
                style={{ 
                  color: colors.text,
                  fontSize: '1.5rem'
                }}
              >
                {stats.connected}/{stats.total}
              </div>
              <div 
                className="small"
                style={{ color: colors.textSecondary }}
              >
                Intégrations actives
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div 
              className="p-3 rounded text-center"
              style={{ backgroundColor: colors.surface }}
            >
              <div 
                className="fw-bold"
                style={{ 
                  color: colors.success,
                  fontSize: '1.5rem'
                }}
              >
                €{stats.totalRevenue.toLocaleString()}
              </div>
              <div 
                className="small"
                style={{ color: colors.textSecondary }}
              >
                Revenus via intégrations
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div 
              className="p-3 rounded text-center"
              style={{ backgroundColor: colors.surface }}
            >
              <div 
                className="fw-bold"
                style={{ 
                  color: colors.info,
                  fontSize: '1.5rem'
                }}
              >
                {Math.round((stats.connected / stats.total) * 100)}%
              </div>
              <div 
                className="small"
                style={{ color: colors.textSecondary }}
              >
                Taux de connexion
              </div>
            </div>
          </div>
        </div>

        {/* Liste des intégrations */}
        <div className="row g-3">
          {getFilteredIntegrations().map(integration => {
            const typeInfo = getIntegrationTypeInfo(integration.type);
            const statusInfo = getStatusInfo(integration.status);
            const IntegrationIcon = integration.icon;
            const StatusIcon = statusInfo.icon;

            return (
              <div key={integration.id} className="col-lg-6">
                <div 
                  className="p-3 rounded"
                  style={{ 
                    backgroundColor: colors.surface,
                    border: `1px solid ${colors.border}`,
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 4px 12px ${colors.shadow}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center gap-3">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: '48px',
                          height: '48px',
                          backgroundColor: integration.color,
                          color: 'white'
                        }}
                      >
                        <IntegrationIcon size={24} />
                      </div>
                      <div>
                        <h6 className="mb-1" style={{ color: colors.text }}>
                          {integration.name}
                        </h6>
                        <div className="d-flex align-items-center gap-2">
                          <span 
                            className="badge"
                            style={{
                              backgroundColor: typeInfo.color,
                              color: 'white',
                              fontSize: '0.7rem'
                            }}
                          >
                            {typeInfo.label}
                          </span>
                          <span 
                            className="badge d-flex align-items-center gap-1"
                            style={{
                              backgroundColor: statusInfo.bgColor,
                              color: statusInfo.color,
                              fontSize: '0.7rem'
                            }}
                          >
                            <StatusIcon size={12} />
                            {statusInfo.label}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="d-flex gap-1">
                      {integration.status === 'connected' && (
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => syncIntegration(integration.id)}
                          style={{
                            borderColor: colors.border,
                            color: colors.text,
                            backgroundColor: 'transparent'
                          }}
                          title="Synchroniser"
                        >
                          <BiRefresh size={14} />
                        </button>
                      )}
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => toggleIntegration(integration.id)}
                        style={{
                          borderColor: colors.border,
                          color: colors.text,
                          backgroundColor: 'transparent'
                        }}
                        title={integration.status === 'connected' ? 'Déconnecter' : 'Connecter'}
                      >
                        {integration.status === 'connected' ? <BiPause size={14} /> : <BiPlay size={14} />}
                      </button>
                      <button
                        className="btn btn-sm btn-outline-info"
                        onClick={() => {
                          // Action pour voir les détails
                          console.log('Voir les détails de', integration.name);
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
                    </div>
                  </div>

                  <p 
                    className="mb-3"
                    style={{ 
                      color: colors.textSecondary,
                      fontSize: '0.9rem'
                    }}
                  >
                    {integration.description}
                  </p>

                  {/* Métriques spécifiques selon le type */}
                  <div className="row g-2 mb-3">
                    {integration.type === 'payment' && (
                      <>
                        <div className="col-6">
                          <div 
                            className="small"
                            style={{ color: colors.textSecondary }}
                          >
                            Transactions
                          </div>
                          <div 
                            className="fw-bold"
                            style={{ color: colors.text }}
                          >
                            {integration.transactions?.toLocaleString() || 0}
                          </div>
                        </div>
                        <div className="col-6">
                          <div 
                            className="small"
                            style={{ color: colors.textSecondary }}
                          >
                            Revenus
                          </div>
                          <div 
                            className="fw-bold"
                            style={{ color: colors.text }}
                          >
                            €{integration.revenue?.toLocaleString() || 0}
                          </div>
                        </div>
                      </>
                    )}
                    
                    {integration.type === 'email' && (
                      <>
                        <div className="col-6">
                          <div 
                            className="small"
                            style={{ color: colors.textSecondary }}
                          >
                            Abonnés
                          </div>
                          <div 
                            className="fw-bold"
                            style={{ color: colors.text }}
                          >
                            {integration.subscribers?.toLocaleString() || 0}
                          </div>
                        </div>
                        <div className="col-6">
                          <div 
                            className="small"
                            style={{ color: colors.textSecondary }}
                          >
                            Campagnes
                          </div>
                          <div 
                            className="fw-bold"
                            style={{ color: colors.text }}
                          >
                            {integration.campaigns || 0}
                          </div>
                        </div>
                      </>
                    )}
                    
                    {integration.type === 'analytics' && (
                      <>
                        <div className="col-6">
                          <div 
                            className="small"
                            style={{ color: colors.textSecondary }}
                          >
                            Pages vues
                          </div>
                          <div 
                            className="fw-bold"
                            style={{ color: colors.text }}
                          >
                            {integration.pageViews?.toLocaleString() || 0}
                          </div>
                        </div>
                        <div className="col-6">
                          <div 
                            className="small"
                            style={{ color: colors.textSecondary }}
                          >
                            Sessions
                          </div>
                          <div 
                            className="fw-bold"
                            style={{ color: colors.text }}
                          >
                            {integration.sessions?.toLocaleString() || 0}
                          </div>
                        </div>
                      </>
                    )}
                    
                    {integration.type === 'shipping' && (
                      <>
                        <div className="col-6">
                          <div 
                            className="small"
                            style={{ color: colors.textSecondary }}
                          >
                            Expéditions
                          </div>
                          <div 
                            className="fw-bold"
                            style={{ color: colors.text }}
                          >
                            {integration.shipments || 0}
                          </div>
                        </div>
                        <div className="col-6">
                          <div 
                            className="small"
                            style={{ color: colors.textSecondary }}
                          >
                            Livrées
                          </div>
                          <div 
                            className="fw-bold"
                            style={{ color: colors.text }}
                          >
                            {integration.delivered || 0}
                          </div>
                        </div>
                      </>
                    )}
                    
                    {integration.type === 'support' && (
                      <>
                        <div className="col-6">
                          <div 
                            className="small"
                            style={{ color: colors.textSecondary }}
                          >
                            Conversations
                          </div>
                          <div 
                            className="fw-bold"
                            style={{ color: colors.text }}
                          >
                            {integration.conversations || 0}
                          </div>
                        </div>
                        <div className="col-6">
                          <div 
                            className="small"
                            style={{ color: colors.textSecondary }}
                          >
                            Résolues
                          </div>
                          <div 
                            className="fw-bold"
                            style={{ color: colors.text }}
                          >
                            {integration.resolved || 0}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <small style={{ color: colors.textSecondary }}>
                      <BiRefresh className="me-1" />
                      Dernière sync: {integration.lastSync.toLocaleString('fr-FR')}
                    </small>
                    <div className="d-flex gap-1">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => {
                          // Action pour configurer
                          console.log('Configurer', integration.name);
                        }}
                        style={{
                          borderColor: colors.border,
                          color: colors.text,
                          backgroundColor: 'transparent',
                          fontSize: '0.7rem'
                        }}
                      >
                        <BiCog className="me-1" />
                        Configurer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bouton ajouter une intégration */}
        <div className="text-center mt-4">
          <button
            className="btn btn-primary"
            onClick={() => {
              // Action pour ajouter une nouvelle intégration
              console.log('Ajouter une nouvelle intégration');
            }}
          >
            <BiPlus className="me-2" />
            Ajouter une intégration
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExternalIntegrations;
import React, { useState, useEffect } from 'react';
import { useThemeColors } from '../contexts/ThemeContext';
import { 
  BiLink, 
  BiCheckCircle, 
  BiXCircle, 
  BiRefresh, 
  BiCog, 
  BiShow,
  BiPlay,
  BiPause,
  BiTrash,
  BiPlus,
  BiShield,
  BiDollar,
  BiEnvelope,
  BiBarChart,
  BiCloud,
  BiCreditCard,
  BiCar,
  BiMessage
} from 'react-icons/bi';

const ExternalIntegrations = () => {
  const colors = useThemeColors();
  const [integrations, setIntegrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    // Simuler le chargement des intégrations
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      setIntegrations([
        {
          id: 1,
          name: 'Stripe',
          type: 'payment',
          status: 'connected',
          description: 'Paiements en ligne sécurisés',
          icon: BiCreditCard,
          color: '#635bff',
          lastSync: new Date('2024-01-15T14:30:00'),
          transactions: 1250,
          revenue: 45600,
          apiKey: 'sk_live_...',
          webhookUrl: 'https://papasow.com/webhooks/stripe',
          settings: {
            currency: 'EUR',
            webhookEnabled: true,
            autoCapture: true
          }
        },
        {
          id: 2,
          name: 'Mailchimp',
          type: 'email',
          status: 'connected',
          description: 'Marketing par email automatisé',
          icon: BiEnvelope,
          color: '#ffbe00',
          lastSync: new Date('2024-01-14T09:15:00'),
          subscribers: 2500,
          campaigns: 12,
          apiKey: 'mc_...',
          listId: 'list_123456',
          settings: {
            autoSync: true,
            doubleOptIn: true,
            tags: ['customers', 'newsletter']
          }
        },
        {
          id: 3,
          name: 'Google Analytics',
          type: 'analytics',
          status: 'connected',
          description: 'Analyse du trafic et des conversions',
          icon: BiBarChart,
          color: '#f4b400',
          lastSync: new Date('2024-01-16T11:45:00'),
          pageViews: 45600,
          sessions: 12300,
          trackingId: 'GA-123456789',
          propertyId: 'property_123',
          settings: {
            enhancedEcommerce: true,
            demographics: true,
            interests: true
          }
        },
        {
          id: 4,
          name: 'Shopify',
          type: 'ecommerce',
          status: 'disconnected',
          description: 'Synchronisation des produits et commandes',
          icon: BiCloud,
          color: '#96bf48',
          lastSync: new Date('2024-01-10T16:20:00'),
          products: 0,
          orders: 0,
          apiKey: '',
          shopDomain: '',
          settings: {
            syncProducts: false,
            syncOrders: false,
            syncInventory: false
          }
        },
        {
          id: 5,
          name: 'DHL Express',
          type: 'shipping',
          status: 'connected',
          description: 'Expédition et suivi des colis',
          icon: BiCar,
          color: '#d40511',
          lastSync: new Date('2024-01-16T08:30:00'),
          shipments: 89,
          delivered: 76,
          apiKey: 'dhl_...',
          accountNumber: '123456789',
          settings: {
            autoTracking: true,
            notifications: true,
            insurance: true
          }
        },
        {
          id: 6,
          name: 'Intercom',
          type: 'support',
          status: 'connected',
          description: 'Support client et chat en direct',
          icon: BiMessage,
          color: '#286efa',
          lastSync: new Date('2024-01-15T13:15:00'),
          conversations: 156,
          resolved: 142,
          apiKey: 'intercom_...',
          appId: 'app_123456',
          settings: {
            autoAssign: true,
            tags: ['support', 'sales'],
            workingHours: '9h-18h'
          }
        }
      ]);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getIntegrationTypeInfo = (type) => {
    const typeMap = {
      payment: { label: 'Paiement', color: colors.success },
      email: { label: 'Email', color: colors.info },
      analytics: { label: 'Analytics', color: colors.warning },
      ecommerce: { label: 'E-commerce', color: colors.primary },
      shipping: { label: 'Expédition', color: colors.danger },
      support: { label: 'Support', color: colors.secondary }
    };
    return typeMap[type] || { label: type, color: colors.textSecondary };
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      connected: { 
        label: 'Connecté', 
        color: colors.success,
        icon: BiCheckCircle,
        bgColor: `${colors.success}20`
      },
      disconnected: { 
        label: 'Déconnecté', 
        color: colors.danger,
        icon: BiXCircle,
        bgColor: `${colors.danger}20`
      },
      pending: { 
        label: 'En attente', 
        color: colors.warning,
        icon: BiRefresh,
        bgColor: `${colors.warning}20`
      }
    };
    return statusMap[status] || statusMap.disconnected;
  };

  const toggleIntegration = (integrationId) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { 
            ...integration, 
            status: integration.status === 'connected' ? 'disconnected' : 'connected',
            lastSync: new Date()
          }
        : integration
    ));
  };

  const syncIntegration = (integrationId) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { 
            ...integration, 
            lastSync: new Date()
          }
        : integration
    ));
  };

  const getFilteredIntegrations = () => {
    switch (activeTab) {
      case 'active':
        return integrations.filter(i => i.status === 'connected');
      case 'inactive':
        return integrations.filter(i => i.status === 'disconnected');
      case 'all':
      default:
        return integrations;
    }
  };

  const getIntegrationStats = () => {
    const total = integrations.length;
    const connected = integrations.filter(i => i.status === 'connected').length;
    const totalRevenue = integrations
      .filter(i => i.type === 'payment' && i.status === 'connected')
      .reduce((sum, i) => sum + (i.revenue || 0), 0);
    
    return { total, connected, totalRevenue };
  };

  const stats = getIntegrationStats();

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
            Chargement des intégrations...
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
            <BiLink className="me-2" />
            Intégrations Externes
          </h5>
          <div className="d-flex gap-2">
            <button
              className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveTab('all')}
              style={{
                backgroundColor: activeTab === 'all' ? colors.primary : 'transparent',
                borderColor: colors.primary,
                color: activeTab === 'all' ? 'white' : colors.primary
              }}
            >
              Toutes ({stats.total})
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'active' ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setActiveTab('active')}
              style={{
                backgroundColor: activeTab === 'active' ? colors.success : 'transparent',
                borderColor: colors.success,
                color: activeTab === 'active' ? 'white' : colors.success
              }}
            >
              Actives ({stats.connected})
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'inactive' ? 'btn-danger' : 'btn-outline-danger'}`}
              onClick={() => setActiveTab('inactive')}
              style={{
                backgroundColor: activeTab === 'inactive' ? colors.danger : 'transparent',
                borderColor: colors.danger,
                color: activeTab === 'inactive' ? 'white' : colors.danger
              }}
            >
              Inactives ({stats.total - stats.connected})
            </button>
          </div>
        </div>
      </div>

      <div className="card-body">
        {/* Statistiques rapides */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div 
              className="p-3 rounded text-center"
              style={{ backgroundColor: colors.surface }}
            >
              <div 
                className="fw-bold"
                style={{ 
                  color: colors.text,
                  fontSize: '1.5rem'
                }}
              >
                {stats.connected}/{stats.total}
              </div>
              <div 
                className="small"
                style={{ color: colors.textSecondary }}
              >
                Intégrations actives
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div 
              className="p-3 rounded text-center"
              style={{ backgroundColor: colors.surface }}
            >
              <div 
                className="fw-bold"
                style={{ 
                  color: colors.success,
                  fontSize: '1.5rem'
                }}
              >
                €{stats.totalRevenue.toLocaleString()}
              </div>
              <div 
                className="small"
                style={{ color: colors.textSecondary }}
              >
                Revenus via intégrations
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div 
              className="p-3 rounded text-center"
              style={{ backgroundColor: colors.surface }}
            >
              <div 
                className="fw-bold"
                style={{ 
                  color: colors.info,
                  fontSize: '1.5rem'
                }}
              >
                {Math.round((stats.connected / stats.total) * 100)}%
              </div>
              <div 
                className="small"
                style={{ color: colors.textSecondary }}
              >
                Taux de connexion
              </div>
            </div>
          </div>
        </div>

        {/* Liste des intégrations */}
        <div className="row g-3">
          {getFilteredIntegrations().map(integration => {
            const typeInfo = getIntegrationTypeInfo(integration.type);
            const statusInfo = getStatusInfo(integration.status);
            const IntegrationIcon = integration.icon;
            const StatusIcon = statusInfo.icon;

            return (
              <div key={integration.id} className="col-lg-6">
                <div 
                  className="p-3 rounded"
                  style={{ 
                    backgroundColor: colors.surface,
                    border: `1px solid ${colors.border}`,
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 4px 12px ${colors.shadow}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center gap-3">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: '48px',
                          height: '48px',
                          backgroundColor: integration.color,
                          color: 'white'
                        }}
                      >
                        <IntegrationIcon size={24} />
                      </div>
                      <div>
                        <h6 className="mb-1" style={{ color: colors.text }}>
                          {integration.name}
                        </h6>
                        <div className="d-flex align-items-center gap-2">
                          <span 
                            className="badge"
                            style={{
                              backgroundColor: typeInfo.color,
                              color: 'white',
                              fontSize: '0.7rem'
                            }}
                          >
                            {typeInfo.label}
                          </span>
                          <span 
                            className="badge d-flex align-items-center gap-1"
                            style={{
                              backgroundColor: statusInfo.bgColor,
                              color: statusInfo.color,
                              fontSize: '0.7rem'
                            }}
                          >
                            <StatusIcon size={12} />
                            {statusInfo.label}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="d-flex gap-1">
                      {integration.status === 'connected' && (
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => syncIntegration(integration.id)}
                          style={{
                            borderColor: colors.border,
                            color: colors.text,
                            backgroundColor: 'transparent'
                          }}
                          title="Synchroniser"
                        >
                          <BiRefresh size={14} />
                        </button>
                      )}
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => toggleIntegration(integration.id)}
                        style={{
                          borderColor: colors.border,
                          color: colors.text,
                          backgroundColor: 'transparent'
                        }}
                        title={integration.status === 'connected' ? 'Déconnecter' : 'Connecter'}
                      >
                        {integration.status === 'connected' ? <BiPause size={14} /> : <BiPlay size={14} />}
                      </button>
                      <button
                        className="btn btn-sm btn-outline-info"
                        onClick={() => {
                          // Action pour voir les détails
                          console.log('Voir les détails de', integration.name);
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
                    </div>
                  </div>

                  <p 
                    className="mb-3"
                    style={{ 
                      color: colors.textSecondary,
                      fontSize: '0.9rem'
                    }}
                  >
                    {integration.description}
                  </p>

                  {/* Métriques spécifiques selon le type */}
                  <div className="row g-2 mb-3">
                    {integration.type === 'payment' && (
                      <>
                        <div className="col-6">
                          <div 
                            className="small"
                            style={{ color: colors.textSecondary }}
                          >
                            Transactions
                          </div>
                          <div 
                            className="fw-bold"
                            style={{ color: colors.text }}
                          >
                            {integration.transactions?.toLocaleString() || 0}
                          </div>
                        </div>
                        <div className="col-6">
                          <div 
                            className="small"
                            style={{ color: colors.textSecondary }}
                          >
                            Revenus
                          </div>
                          <div 
                            className="fw-bold"
                            style={{ color: colors.text }}
                          >
                            €{integration.revenue?.toLocaleString() || 0}
                          </div>
                        </div>
                      </>
                    )}
                    
                    {integration.type === 'email' && (
                      <>
                        <div className="col-6">
                          <div 
                            className="small"
                            style={{ color: colors.textSecondary }}
                          >
                            Abonnés
                          </div>
                          <div 
                            className="fw-bold"
                            style={{ color: colors.text }}
                          >
                            {integration.subscribers?.toLocaleString() || 0}
                          </div>
                        </div>
                        <div className="col-6">
                          <div 
                            className="small"
                            style={{ color: colors.textSecondary }}
                          >
                            Campagnes
                          </div>
                          <div 
                            className="fw-bold"
                            style={{ color: colors.text }}
                          >
                            {integration.campaigns || 0}
                          </div>
                        </div>
                      </>
                    )}
                    
                    {integration.type === 'analytics' && (
                      <>
                        <div className="col-6">
                          <div 
                            className="small"
                            style={{ color: colors.textSecondary }}
                          >
                            Pages vues
                          </div>
                          <div 
                            className="fw-bold"
                            style={{ color: colors.text }}
                          >
                            {integration.pageViews?.toLocaleString() || 0}
                          </div>
                        </div>
                        <div className="col-6">
                          <div 
                            className="small"
                            style={{ color: colors.textSecondary }}
                          >
                            Sessions
                          </div>
                          <div 
                            className="fw-bold"
                            style={{ color: colors.text }}
                          >
                            {integration.sessions?.toLocaleString() || 0}
                          </div>
                        </div>
                      </>
                    )}
                    
                    {integration.type === 'shipping' && (
                      <>
                        <div className="col-6">
                          <div 
                            className="small"
                            style={{ color: colors.textSecondary }}
                          >
                            Expéditions
                          </div>
                          <div 
                            className="fw-bold"
                            style={{ color: colors.text }}
                          >
                            {integration.shipments || 0}
                          </div>
                        </div>
                        <div className="col-6">
                          <div 
                            className="small"
                            style={{ color: colors.textSecondary }}
                          >
                            Livrées
                          </div>
                          <div 
                            className="fw-bold"
                            style={{ color: colors.text }}
                          >
                            {integration.delivered || 0}
                          </div>
                        </div>
                      </>
                    )}
                    
                    {integration.type === 'support' && (
                      <>
                        <div className="col-6">
                          <div 
                            className="small"
                            style={{ color: colors.textSecondary }}
                          >
                            Conversations
                          </div>
                          <div 
                            className="fw-bold"
                            style={{ color: colors.text }}
                          >
                            {integration.conversations || 0}
                          </div>
                        </div>
                        <div className="col-6">
                          <div 
                            className="small"
                            style={{ color: colors.textSecondary }}
                          >
                            Résolues
                          </div>
                          <div 
                            className="fw-bold"
                            style={{ color: colors.text }}
                          >
                            {integration.resolved || 0}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <small style={{ color: colors.textSecondary }}>
                      <BiRefresh className="me-1" />
                      Dernière sync: {integration.lastSync.toLocaleString('fr-FR')}
                    </small>
                    <div className="d-flex gap-1">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => {
                          // Action pour configurer
                          console.log('Configurer', integration.name);
                        }}
                        style={{
                          borderColor: colors.border,
                          color: colors.text,
                          backgroundColor: 'transparent',
                          fontSize: '0.7rem'
                        }}
                      >
                        <BiCog className="me-1" />
                        Configurer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bouton ajouter une intégration */}
        <div className="text-center mt-4">
          <button
            className="btn btn-primary"
            onClick={() => {
              // Action pour ajouter une nouvelle intégration
              console.log('Ajouter une nouvelle intégration');
            }}
          >
            <BiPlus className="me-2" />
            Ajouter une intégration
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExternalIntegrations;
 
 
 
 
 
 
 
 
 