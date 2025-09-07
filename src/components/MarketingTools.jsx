// src/components/MarketingTools.jsx
import React, { useState, useEffect } from 'react';
import { useThemeColors } from '../contexts/ThemeContext';
import { 
  BiEnvelope, 
  BiGift, 
  BiHash, 
  BiBullseye, 
  BiTrendingUp, 
  BiCalendar,
  BiGroup,
  BiBarChart,
  BiPlay,
  BiPause,
  BiEdit,
  BiTrash,
  BiShow,
  BiPlus,
  BiRefresh,
  BiFilter,
  BiSearch
} from 'react-icons/bi';

const MarketingTools = () => {
  const colors = useThemeColors();
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [activeTab, setActiveTab] = useState('campaigns');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des campagnes marketing
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      setCampaigns([
        {
          id: 1,
          name: 'Promotion Nike Air Max',
          type: 'email',
          status: 'active',
          targetAudience: 'clients_actifs',
          subject: 'Nouvelle collection Nike - Jusqu\'à -30%',
          content: 'Découvrez notre nouvelle collection Nike avec des réductions exceptionnelles...',
          sentDate: new Date('2024-01-15T10:00:00'),
          openRate: 24.5,
          clickRate: 8.2,
          conversionRate: 3.1,
          revenue: 1250,
          recipients: 2500,
          opens: 612,
          clicks: 205,
          conversions: 78
        },
        {
          id: 2,
          name: 'Code promo Black Friday',
          type: 'promotion',
          status: 'scheduled',
          targetAudience: 'tous_clients',
          subject: 'Black Friday - Code BLACK20',
          content: 'Profitez de 20% de réduction sur tous vos achats avec le code BLACK20',
          sentDate: new Date('2024-01-20T09:00:00'),
          openRate: 0,
          clickRate: 0,
          conversionRate: 0,
          revenue: 0,
          recipients: 5000,
          opens: 0,
          clicks: 0,
          conversions: 0
        },
        {
          id: 3,
          name: 'Abandon de panier - Chaussures',
          type: 'abandoned_cart',
          status: 'active',
          targetAudience: 'abandon_panier',
          subject: 'Vous avez oublié quelque chose ?',
          content: 'Votre panier vous attend ! Complétez votre achat maintenant...',
          sentDate: new Date('2024-01-14T14:30:00'),
          openRate: 18.7,
          clickRate: 12.3,
          conversionRate: 7.8,
          revenue: 890,
          recipients: 450,
          opens: 84,
          clicks: 55,
          conversions: 35
        },
        {
          id: 4,
          name: 'Bienvenue nouveaux clients',
          type: 'welcome',
          status: 'active',
          targetAudience: 'nouveaux_clients',
          subject: 'Bienvenue chez Papasow !',
          content: 'Merci de nous avoir rejoint. Découvrez nos offres spéciales...',
          sentDate: new Date('2024-01-10T08:00:00'),
          openRate: 32.1,
          clickRate: 15.6,
          conversionRate: 9.2,
          revenue: 2100,
          recipients: 800,
          opens: 257,
          clicks: 125,
          conversions: 74
        }
      ]);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getCampaignTypeInfo = (type) => {
    const typeMap = {
      email: { 
        label: 'Email Marketing', 
        icon: BiEnvelope, 
        color: colors.primary,
        bgColor: `${colors.primary}20`
      },
      promotion: { 
        label: 'Promotion', 
        icon: BiHash, 
        color: colors.warning,
        bgColor: `${colors.warning}20`
      },
      abandoned_cart: { 
        label: 'Panier abandonné', 
        icon: BiBullseye, 
        color: colors.info,
        bgColor: `${colors.info}20`
      },
      welcome: { 
        label: 'Bienvenue', 
        icon: BiGift, 
        color: colors.success,
        bgColor: `${colors.success}20`
      }
    };
    return typeMap[type] || typeMap.email;
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      active: { 
        label: 'Active', 
        color: colors.success,
        bgColor: `${colors.success}20`
      },
      paused: { 
        label: 'En pause', 
        color: colors.warning,
        bgColor: `${colors.warning}20`
      },
      scheduled: { 
        label: 'Programmée', 
        color: colors.info,
        bgColor: `${colors.info}20`
      },
      completed: { 
        label: 'Terminée', 
        color: colors.textSecondary,
        bgColor: `${colors.textSecondary}20`
      }
    };
    return statusMap[status] || statusMap.active;
  };

  const getTargetAudienceInfo = (audience) => {
    const audienceMap = {
      tous_clients: 'Tous les clients',
      clients_actifs: 'Clients actifs',
      abandon_panier: 'Abandon de panier',
      nouveaux_clients: 'Nouveaux clients',
      clients_vip: 'Clients VIP'
    };
    return audienceMap[audience] || audience;
  };

  const toggleCampaignStatus = (campaignId) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === campaignId 
        ? { 
            ...campaign, 
            status: campaign.status === 'active' ? 'paused' : 'active' 
          }
        : campaign
    ));
  };

  const getCampaignStats = () => {
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
    const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0);
    const avgOpenRate = campaigns.reduce((sum, c) => sum + c.openRate, 0) / campaigns.length;
    
    return { totalCampaigns, activeCampaigns, totalRevenue, avgOpenRate };
  };

  const stats = getCampaignStats();

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
            Chargement des outils marketing...
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
            <BiTrendingUp className="me-2" />
            Outils Marketing
          </h5>
          <div className="d-flex gap-2">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setActiveTab('campaigns')}
              style={{
                backgroundColor: activeTab === 'campaigns' ? colors.primary : 'transparent',
                borderColor: colors.primary,
                color: activeTab === 'campaigns' ? 'white' : colors.primary
              }}
            >
              <BiBarChart className="me-1" />
              Campagnes
            </button>
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => setActiveTab('analytics')}
              style={{
                backgroundColor: activeTab === 'analytics' ? colors.primary : 'transparent',
                borderColor: colors.primary,
                color: activeTab === 'analytics' ? 'white' : colors.primary
              }}
            >
              <BiBarChart className="me-1" />
              Analytics
            </button>
          </div>
        </div>
      </div>

      <div className="card-body">
        {activeTab === 'campaigns' ? (
          <>
            {/* Statistiques rapides */}
            <div className="row g-3 mb-4">
              <div className="col-md-3">
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
                    {stats.totalCampaigns}
                  </div>
                  <div 
                    className="small"
                    style={{ color: colors.textSecondary }}
                  >
                    Campagnes totales
                  </div>
                </div>
              </div>
              <div className="col-md-3">
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
                    {stats.activeCampaigns}
                  </div>
                  <div 
                    className="small"
                    style={{ color: colors.textSecondary }}
                  >
                    Campagnes actives
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div 
                  className="p-3 rounded text-center"
                  style={{ backgroundColor: colors.surface }}
                >
                  <div 
                    className="fw-bold"
                    style={{ 
                      color: colors.primary,
                      fontSize: '1.5rem'
                    }}
                  >
                    €{stats.totalRevenue.toLocaleString()}
                  </div>
                  <div 
                    className="small"
                    style={{ color: colors.textSecondary }}
                  >
                    Revenus générés
                  </div>
                </div>
              </div>
              <div className="col-md-3">
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
                    {stats.avgOpenRate.toFixed(1)}%
                  </div>
                  <div 
                    className="small"
                    style={{ color: colors.textSecondary }}
                  >
                    Taux d'ouverture moyen
                  </div>
                </div>
              </div>
            </div>

            {/* Liste des campagnes */}
            <div className="row g-3">
              {campaigns.map(campaign => {
                const typeInfo = getCampaignTypeInfo(campaign.type);
                const statusInfo = getStatusInfo(campaign.status);
                const TypeIcon = typeInfo.icon;

                return (
                  <div key={campaign.id} className="col-lg-6">
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
                        <div className="d-flex align-items-center gap-2">
                          <div 
                            className="rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                              width: '32px',
                              height: '32px',
                              backgroundColor: typeInfo.bgColor,
                              color: typeInfo.color
                            }}
                          >
                            <TypeIcon size={16} />
                          </div>
                          <div>
                            <h6 className="mb-0" style={{ color: colors.text }}>
                              {campaign.name}
                            </h6>
                            <small style={{ color: colors.textSecondary }}>
                              {typeInfo.label}
                            </small>
                          </div>
                        </div>
                        
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => toggleCampaignStatus(campaign.id)}
                            style={{
                              borderColor: colors.border,
                              color: colors.text,
                              backgroundColor: 'transparent'
                            }}
                            title={campaign.status === 'active' ? 'Mettre en pause' : 'Activer'}
                          >
                            {campaign.status === 'active' ? <BiPause size={14} /> : <BiPlay size={14} />}
                          </button>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => setSelectedCampaign(campaign)}
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

                      <div className="mb-3">
                        <div 
                          className="badge me-2"
                          style={{
                            backgroundColor: statusInfo.bgColor,
                            color: statusInfo.color,
                            fontSize: '0.8rem'
                          }}
                        >
                          {statusInfo.label}
                        </div>
                        <div 
                          className="badge"
                          style={{
                            backgroundColor: `${colors.info}20`,
                            color: colors.info,
                            fontSize: '0.8rem'
                          }}
                        >
                          {getTargetAudienceInfo(campaign.targetAudience)}
                        </div>
                      </div>

                      <div className="row g-2 mb-3">
                        <div className="col-6">
                          <div 
                            className="small"
                            style={{ color: colors.textSecondary }}
                          >
                            Taux d'ouverture
                          </div>
                          <div 
                            className="fw-bold"
                            style={{ color: colors.text }}
                          >
                            {campaign.openRate}%
                          </div>
                        </div>
                        <div className="col-6">
                          <div 
                            className="small"
                            style={{ color: colors.textSecondary }}
                          >
                            Taux de clic
                          </div>
                          <div 
                            className="fw-bold"
                            style={{ color: colors.text }}
                          >
                            {campaign.clickRate}%
                          </div>
                        </div>
                        <div className="col-6">
                          <div 
                            className="small"
                            style={{ color: colors.textSecondary }}
                          >
                            Conversions
                          </div>
                          <div 
                            className="fw-bold"
                            style={{ color: colors.text }}
                          >
                            {campaign.conversions}
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
                            €{campaign.revenue}
                          </div>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-center">
                        <small style={{ color: colors.textSecondary }}>
                          <BiCalendar className="me-1" />
                          {campaign.sentDate.toLocaleDateString('fr-FR')}
                        </small>
                        <small style={{ color: colors.textSecondary }}>
                          <BiGroup className="me-1" />
                          {campaign.recipients} destinataires
                        </small>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bouton créer une campagne */}
            <div className="text-center mt-4">
              <button
                className="btn btn-primary"
                onClick={() => {
                  // Action pour créer une nouvelle campagne
                  console.log('Créer une nouvelle campagne');
                }}
              >
                <BiPlus className="me-2" />
                Créer une nouvelle campagne
              </button>
            </div>
          </>
        ) : (
          /* Analytics des campagnes */
          <div>
            <h6 className="mb-3" style={{ color: colors.text }}>
              Analytics des campagnes marketing
            </h6>
            
            <div className="row g-3">
              <div className="col-md-6">
                <div 
                  className="p-3 rounded"
                  style={{ backgroundColor: colors.surface }}
                >
                  <h6 style={{ color: colors.text }}>Performance par type</h6>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span style={{ color: colors.textSecondary }}>Email Marketing</span>
                    <span style={{ color: colors.text }}>€1,250</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span style={{ color: colors.textSecondary }}>Panier abandonné</span>
                    <span style={{ color: colors.text }}>€890</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span style={{ color: colors.textSecondary }}>Bienvenue</span>
                    <span style={{ color: colors.text }}>€2,100</span>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6">
                <div 
                  className="p-3 rounded"
                  style={{ backgroundColor: colors.surface }}
                >
                  <h6 style={{ color: colors.text }}>Métriques clés</h6>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span style={{ color: colors.textSecondary }}>Taux d'ouverture moyen</span>
                    <span style={{ color: colors.success }}>23.8%</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span style={{ color: colors.textSecondary }}>Taux de clic moyen</span>
                    <span style={{ color: colors.info }}>9.0%</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span style={{ color: colors.textSecondary }}>Taux de conversion</span>
                    <span style={{ color: colors.primary }}>5.0%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de détails de campagne */}
      {selectedCampaign && (
        <div 
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setSelectedCampaign(null)}
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
                  Détails de la campagne: {selectedCampaign.name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedCampaign(null)}
                  style={{ filter: 'invert(1)' }}
                />
              </div>
              
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6 style={{ color: colors.text }}>Informations générales</h6>
                    <div className="p-3 rounded" style={{ backgroundColor: colors.surface }}>
                      <div className="mb-2">
                        <strong>Type:</strong> {getCampaignTypeInfo(selectedCampaign.type).label}
                      </div>
                      <div className="mb-2">
                        <strong>Statut:</strong> {getStatusInfo(selectedCampaign.status).label}
                      </div>
                      <div className="mb-2">
                        <strong>Cible:</strong> {getTargetAudienceInfo(selectedCampaign.targetAudience)}
                      </div>
                      <div className="mb-2">
                        <strong>Date d'envoi:</strong> {selectedCampaign.sentDate.toLocaleString('fr-FR')}
                      </div>
                      <div className="mb-2">
                        <strong>Destinataires:</strong> {selectedCampaign.recipients}
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <h6 style={{ color: colors.text }}>Performance</h6>
                    <div className="p-3 rounded" style={{ backgroundColor: colors.surface }}>
                      <div className="row g-2">
                        <div className="col-6">
                          <div className="text-center">
                            <div 
                              className="fw-bold"
                              style={{ color: colors.primary, fontSize: '1.5rem' }}
                            >
                              {selectedCampaign.openRate}%
                            </div>
                            <div 
                              className="small"
                              style={{ color: colors.textSecondary }}
                            >
                              Taux d'ouverture
                            </div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="text-center">
                            <div 
                              className="fw-bold"
                              style={{ color: colors.info, fontSize: '1.5rem' }}
                            >
                              {selectedCampaign.clickRate}%
                            </div>
                            <div 
                              className="small"
                              style={{ color: colors.textSecondary }}
                            >
                              Taux de clic
                            </div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="text-center">
                            <div 
                              className="fw-bold"
                              style={{ color: colors.success, fontSize: '1.5rem' }}
                            >
                              {selectedCampaign.conversionRate}%
                            </div>
                            <div 
                              className="small"
                              style={{ color: colors.textSecondary }}
                            >
                              Conversion
                            </div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="text-center">
                            <div 
                              className="fw-bold"
                              style={{ color: colors.warning, fontSize: '1.5rem' }}
                            >
                              €{selectedCampaign.revenue}
                            </div>
                            <div 
                              className="small"
                              style={{ color: colors.textSecondary }}
                            >
                              Revenus
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <h6 style={{ color: colors.text }}>Contenu de la campagne</h6>
                  <div 
                    className="p-3 rounded"
                    style={{ 
                      backgroundColor: colors.surface,
                      border: `1px solid ${colors.border}`
                    }}
                  >
                    <div className="mb-2">
                      <strong>Sujet:</strong> {selectedCampaign.subject}
                    </div>
                    <div>
                      <strong>Contenu:</strong>
                      <div 
                        className="mt-2 p-2 rounded"
                        style={{ 
                          backgroundColor: colors.background,
                          border: `1px solid ${colors.border}`,
                          fontSize: '0.9rem'
                        }}
                      >
                        {selectedCampaign.content}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketingTools;
import React, { useState, useEffect } from 'react';
import { useThemeColors } from '../contexts/ThemeContext';
import { 
  BiEnvelope, 
  BiGift, 
  BiHash, 
  BiBullseye, 
  BiTrendingUp, 
  BiCalendar,
  BiGroup,
  BiBarChart,
  BiPlay,
  BiPause,
  BiEdit,
  BiTrash,
  BiShow,
  BiPlus,
  BiRefresh,
  BiFilter,
  BiSearch
} from 'react-icons/bi';

const MarketingTools = () => {
  const colors = useThemeColors();
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [activeTab, setActiveTab] = useState('campaigns');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des campagnes marketing
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      setCampaigns([
        {
          id: 1,
          name: 'Promotion Nike Air Max',
          type: 'email',
          status: 'active',
          targetAudience: 'clients_actifs',
          subject: 'Nouvelle collection Nike - Jusqu\'à -30%',
          content: 'Découvrez notre nouvelle collection Nike avec des réductions exceptionnelles...',
          sentDate: new Date('2024-01-15T10:00:00'),
          openRate: 24.5,
          clickRate: 8.2,
          conversionRate: 3.1,
          revenue: 1250,
          recipients: 2500,
          opens: 612,
          clicks: 205,
          conversions: 78
        },
        {
          id: 2,
          name: 'Code promo Black Friday',
          type: 'promotion',
          status: 'scheduled',
          targetAudience: 'tous_clients',
          subject: 'Black Friday - Code BLACK20',
          content: 'Profitez de 20% de réduction sur tous vos achats avec le code BLACK20',
          sentDate: new Date('2024-01-20T09:00:00'),
          openRate: 0,
          clickRate: 0,
          conversionRate: 0,
          revenue: 0,
          recipients: 5000,
          opens: 0,
          clicks: 0,
          conversions: 0
        },
        {
          id: 3,
          name: 'Abandon de panier - Chaussures',
          type: 'abandoned_cart',
          status: 'active',
          targetAudience: 'abandon_panier',
          subject: 'Vous avez oublié quelque chose ?',
          content: 'Votre panier vous attend ! Complétez votre achat maintenant...',
          sentDate: new Date('2024-01-14T14:30:00'),
          openRate: 18.7,
          clickRate: 12.3,
          conversionRate: 7.8,
          revenue: 890,
          recipients: 450,
          opens: 84,
          clicks: 55,
          conversions: 35
        },
        {
          id: 4,
          name: 'Bienvenue nouveaux clients',
          type: 'welcome',
          status: 'active',
          targetAudience: 'nouveaux_clients',
          subject: 'Bienvenue chez Papasow !',
          content: 'Merci de nous avoir rejoint. Découvrez nos offres spéciales...',
          sentDate: new Date('2024-01-10T08:00:00'),
          openRate: 32.1,
          clickRate: 15.6,
          conversionRate: 9.2,
          revenue: 2100,
          recipients: 800,
          opens: 257,
          clicks: 125,
          conversions: 74
        }
      ]);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getCampaignTypeInfo = (type) => {
    const typeMap = {
      email: { 
        label: 'Email Marketing', 
        icon: BiEnvelope, 
        color: colors.primary,
        bgColor: `${colors.primary}20`
      },
      promotion: { 
        label: 'Promotion', 
        icon: BiHash, 
        color: colors.warning,
        bgColor: `${colors.warning}20`
      },
      abandoned_cart: { 
        label: 'Panier abandonné', 
        icon: BiBullseye, 
        color: colors.info,
        bgColor: `${colors.info}20`
      },
      welcome: { 
        label: 'Bienvenue', 
        icon: BiGift, 
        color: colors.success,
        bgColor: `${colors.success}20`
      }
    };
    return typeMap[type] || typeMap.email;
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      active: { 
        label: 'Active', 
        color: colors.success,
        bgColor: `${colors.success}20`
      },
      paused: { 
        label: 'En pause', 
        color: colors.warning,
        bgColor: `${colors.warning}20`
      },
      scheduled: { 
        label: 'Programmée', 
        color: colors.info,
        bgColor: `${colors.info}20`
      },
      completed: { 
        label: 'Terminée', 
        color: colors.textSecondary,
        bgColor: `${colors.textSecondary}20`
      }
    };
    return statusMap[status] || statusMap.active;
  };

  const getTargetAudienceInfo = (audience) => {
    const audienceMap = {
      tous_clients: 'Tous les clients',
      clients_actifs: 'Clients actifs',
      abandon_panier: 'Abandon de panier',
      nouveaux_clients: 'Nouveaux clients',
      clients_vip: 'Clients VIP'
    };
    return audienceMap[audience] || audience;
  };

  const toggleCampaignStatus = (campaignId) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === campaignId 
        ? { 
            ...campaign, 
            status: campaign.status === 'active' ? 'paused' : 'active' 
          }
        : campaign
    ));
  };

  const getCampaignStats = () => {
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
    const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0);
    const avgOpenRate = campaigns.reduce((sum, c) => sum + c.openRate, 0) / campaigns.length;
    
    return { totalCampaigns, activeCampaigns, totalRevenue, avgOpenRate };
  };

  const stats = getCampaignStats();

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
            Chargement des outils marketing...
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
            <BiTrendingUp className="me-2" />
            Outils Marketing
          </h5>
          <div className="d-flex gap-2">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setActiveTab('campaigns')}
              style={{
                backgroundColor: activeTab === 'campaigns' ? colors.primary : 'transparent',
                borderColor: colors.primary,
                color: activeTab === 'campaigns' ? 'white' : colors.primary
              }}
            >
              <BiBarChart className="me-1" />
              Campagnes
            </button>
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => setActiveTab('analytics')}
              style={{
                backgroundColor: activeTab === 'analytics' ? colors.primary : 'transparent',
                borderColor: colors.primary,
                color: activeTab === 'analytics' ? 'white' : colors.primary
              }}
            >
              <BiBarChart className="me-1" />
              Analytics
            </button>
          </div>
        </div>
      </div>

      <div className="card-body">
        {activeTab === 'campaigns' ? (
          <>
            {/* Statistiques rapides */}
            <div className="row g-3 mb-4">
              <div className="col-md-3">
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
                    {stats.totalCampaigns}
                  </div>
                  <div 
                    className="small"
                    style={{ color: colors.textSecondary }}
                  >
                    Campagnes totales
                  </div>
                </div>
              </div>
              <div className="col-md-3">
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
                    {stats.activeCampaigns}
                  </div>
                  <div 
                    className="small"
                    style={{ color: colors.textSecondary }}
                  >
                    Campagnes actives
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div 
                  className="p-3 rounded text-center"
                  style={{ backgroundColor: colors.surface }}
                >
                  <div 
                    className="fw-bold"
                    style={{ 
                      color: colors.primary,
                      fontSize: '1.5rem'
                    }}
                  >
                    €{stats.totalRevenue.toLocaleString()}
                  </div>
                  <div 
                    className="small"
                    style={{ color: colors.textSecondary }}
                  >
                    Revenus générés
                  </div>
                </div>
              </div>
              <div className="col-md-3">
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
                    {stats.avgOpenRate.toFixed(1)}%
                  </div>
                  <div 
                    className="small"
                    style={{ color: colors.textSecondary }}
                  >
                    Taux d'ouverture moyen
                  </div>
                </div>
              </div>
            </div>

            {/* Liste des campagnes */}
            <div className="row g-3">
              {campaigns.map(campaign => {
                const typeInfo = getCampaignTypeInfo(campaign.type);
                const statusInfo = getStatusInfo(campaign.status);
                const TypeIcon = typeInfo.icon;

                return (
                  <div key={campaign.id} className="col-lg-6">
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
                        <div className="d-flex align-items-center gap-2">
                          <div 
                            className="rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                              width: '32px',
                              height: '32px',
                              backgroundColor: typeInfo.bgColor,
                              color: typeInfo.color
                            }}
                          >
                            <TypeIcon size={16} />
                          </div>
                          <div>
                            <h6 className="mb-0" style={{ color: colors.text }}>
                              {campaign.name}
                            </h6>
                            <small style={{ color: colors.textSecondary }}>
                              {typeInfo.label}
                            </small>
                          </div>
                        </div>
                        
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => toggleCampaignStatus(campaign.id)}
                            style={{
                              borderColor: colors.border,
                              color: colors.text,
                              backgroundColor: 'transparent'
                            }}
                            title={campaign.status === 'active' ? 'Mettre en pause' : 'Activer'}
                          >
                            {campaign.status === 'active' ? <BiPause size={14} /> : <BiPlay size={14} />}
                          </button>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => setSelectedCampaign(campaign)}
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

                      <div className="mb-3">
                        <div 
                          className="badge me-2"
                          style={{
                            backgroundColor: statusInfo.bgColor,
                            color: statusInfo.color,
                            fontSize: '0.8rem'
                          }}
                        >
                          {statusInfo.label}
                        </div>
                        <div 
                          className="badge"
                          style={{
                            backgroundColor: `${colors.info}20`,
                            color: colors.info,
                            fontSize: '0.8rem'
                          }}
                        >
                          {getTargetAudienceInfo(campaign.targetAudience)}
                        </div>
                      </div>

                      <div className="row g-2 mb-3">
                        <div className="col-6">
                          <div 
                            className="small"
                            style={{ color: colors.textSecondary }}
                          >
                            Taux d'ouverture
                          </div>
                          <div 
                            className="fw-bold"
                            style={{ color: colors.text }}
                          >
                            {campaign.openRate}%
                          </div>
                        </div>
                        <div className="col-6">
                          <div 
                            className="small"
                            style={{ color: colors.textSecondary }}
                          >
                            Taux de clic
                          </div>
                          <div 
                            className="fw-bold"
                            style={{ color: colors.text }}
                          >
                            {campaign.clickRate}%
                          </div>
                        </div>
                        <div className="col-6">
                          <div 
                            className="small"
                            style={{ color: colors.textSecondary }}
                          >
                            Conversions
                          </div>
                          <div 
                            className="fw-bold"
                            style={{ color: colors.text }}
                          >
                            {campaign.conversions}
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
                            €{campaign.revenue}
                          </div>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-center">
                        <small style={{ color: colors.textSecondary }}>
                          <BiCalendar className="me-1" />
                          {campaign.sentDate.toLocaleDateString('fr-FR')}
                        </small>
                        <small style={{ color: colors.textSecondary }}>
                          <BiGroup className="me-1" />
                          {campaign.recipients} destinataires
                        </small>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bouton créer une campagne */}
            <div className="text-center mt-4">
              <button
                className="btn btn-primary"
                onClick={() => {
                  // Action pour créer une nouvelle campagne
                  console.log('Créer une nouvelle campagne');
                }}
              >
                <BiPlus className="me-2" />
                Créer une nouvelle campagne
              </button>
            </div>
          </>
        ) : (
          /* Analytics des campagnes */
          <div>
            <h6 className="mb-3" style={{ color: colors.text }}>
              Analytics des campagnes marketing
            </h6>
            
            <div className="row g-3">
              <div className="col-md-6">
                <div 
                  className="p-3 rounded"
                  style={{ backgroundColor: colors.surface }}
                >
                  <h6 style={{ color: colors.text }}>Performance par type</h6>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span style={{ color: colors.textSecondary }}>Email Marketing</span>
                    <span style={{ color: colors.text }}>€1,250</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span style={{ color: colors.textSecondary }}>Panier abandonné</span>
                    <span style={{ color: colors.text }}>€890</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span style={{ color: colors.textSecondary }}>Bienvenue</span>
                    <span style={{ color: colors.text }}>€2,100</span>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6">
                <div 
                  className="p-3 rounded"
                  style={{ backgroundColor: colors.surface }}
                >
                  <h6 style={{ color: colors.text }}>Métriques clés</h6>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span style={{ color: colors.textSecondary }}>Taux d'ouverture moyen</span>
                    <span style={{ color: colors.success }}>23.8%</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span style={{ color: colors.textSecondary }}>Taux de clic moyen</span>
                    <span style={{ color: colors.info }}>9.0%</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span style={{ color: colors.textSecondary }}>Taux de conversion</span>
                    <span style={{ color: colors.primary }}>5.0%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de détails de campagne */}
      {selectedCampaign && (
        <div 
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setSelectedCampaign(null)}
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
                  Détails de la campagne: {selectedCampaign.name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedCampaign(null)}
                  style={{ filter: 'invert(1)' }}
                />
              </div>
              
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6 style={{ color: colors.text }}>Informations générales</h6>
                    <div className="p-3 rounded" style={{ backgroundColor: colors.surface }}>
                      <div className="mb-2">
                        <strong>Type:</strong> {getCampaignTypeInfo(selectedCampaign.type).label}
                      </div>
                      <div className="mb-2">
                        <strong>Statut:</strong> {getStatusInfo(selectedCampaign.status).label}
                      </div>
                      <div className="mb-2">
                        <strong>Cible:</strong> {getTargetAudienceInfo(selectedCampaign.targetAudience)}
                      </div>
                      <div className="mb-2">
                        <strong>Date d'envoi:</strong> {selectedCampaign.sentDate.toLocaleString('fr-FR')}
                      </div>
                      <div className="mb-2">
                        <strong>Destinataires:</strong> {selectedCampaign.recipients}
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <h6 style={{ color: colors.text }}>Performance</h6>
                    <div className="p-3 rounded" style={{ backgroundColor: colors.surface }}>
                      <div className="row g-2">
                        <div className="col-6">
                          <div className="text-center">
                            <div 
                              className="fw-bold"
                              style={{ color: colors.primary, fontSize: '1.5rem' }}
                            >
                              {selectedCampaign.openRate}%
                            </div>
                            <div 
                              className="small"
                              style={{ color: colors.textSecondary }}
                            >
                              Taux d'ouverture
                            </div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="text-center">
                            <div 
                              className="fw-bold"
                              style={{ color: colors.info, fontSize: '1.5rem' }}
                            >
                              {selectedCampaign.clickRate}%
                            </div>
                            <div 
                              className="small"
                              style={{ color: colors.textSecondary }}
                            >
                              Taux de clic
                            </div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="text-center">
                            <div 
                              className="fw-bold"
                              style={{ color: colors.success, fontSize: '1.5rem' }}
                            >
                              {selectedCampaign.conversionRate}%
                            </div>
                            <div 
                              className="small"
                              style={{ color: colors.textSecondary }}
                            >
                              Conversion
                            </div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="text-center">
                            <div 
                              className="fw-bold"
                              style={{ color: colors.warning, fontSize: '1.5rem' }}
                            >
                              €{selectedCampaign.revenue}
                            </div>
                            <div 
                              className="small"
                              style={{ color: colors.textSecondary }}
                            >
                              Revenus
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <h6 style={{ color: colors.text }}>Contenu de la campagne</h6>
                  <div 
                    className="p-3 rounded"
                    style={{ 
                      backgroundColor: colors.surface,
                      border: `1px solid ${colors.border}`
                    }}
                  >
                    <div className="mb-2">
                      <strong>Sujet:</strong> {selectedCampaign.subject}
                    </div>
                    <div>
                      <strong>Contenu:</strong>
                      <div 
                        className="mt-2 p-2 rounded"
                        style={{ 
                          backgroundColor: colors.background,
                          border: `1px solid ${colors.border}`,
                          fontSize: '0.9rem'
                        }}
                      >
                        {selectedCampaign.content}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketingTools;
 
 
 
 
 
 
 
 
 