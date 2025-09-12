import React, { useState, useEffect } from 'react';
import { 
  BiBrain, 
  BiSearch, 
  BiFilter, 
  BiRefresh,
  BiDownload,
  BiTrendingUp,
  BiTrendingDown,
  BiUser,
  BiPackage,
  BiShoppingBag,
  BiStar,
  BiBarChart,
  BiCrosshair,
  BiBulb,
  BiCog,
  BiPlay,
  BiPause,
  BiStop,
  BiCheckCircle,
  BiXCircle,
  BiInfoCircle,
  BiDollar,
  BiHash
} from 'react-icons/bi';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { exportToCsv } from '../utils/csvExport';

export default function AdminAIRecommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [aiModels, setAiModels] = useState([]);
  const [performance, setPerformance] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);

    // Charger les vraies données depuis localStorage
    try {
      const storedModels = JSON.parse(localStorage.getItem('aiModels') || '[]');
      const storedRecommendations = JSON.parse(localStorage.getItem('aiRecommendations') || '[]');
      const storedPerformance = JSON.parse(localStorage.getItem('aiPerformance') || '{}');
      
      setAiModels(storedModels);
      setRecommendations(storedRecommendations);
      setPerformance(storedPerformance);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des recommandations IA:', error);
      setAiModels([]);
      setRecommendations([]);
      setPerformance({});
      setLoading(false);
    }
    if (storedModels.length === 0 && storedRecommendations.length === 0) {
      setAiModels([]);
      setRecommendations([]);
      setPerformance({});
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'critical':
        return <span className="badge bg-danger">Critique</span>;
      case 'high':
        return <span className="badge bg-warning">Élevée</span>;
      case 'medium':
        return <span className="badge bg-info">Moyenne</span>;
      case 'low':
        return <span className="badge bg-secondary">Faible</span>;
      default:
        return <span className="badge bg-light text-dark">Inconnue</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="badge bg-success">Actif</span>;
      case 'training':
        return <span className="badge bg-warning">Entraînement</span>;
      case 'inactive':
        return <span className="badge bg-secondary">Inactif</span>;
      case 'error':
        return <span className="badge bg-danger">Erreur</span>;
      case 'pending':
        return <span className="badge bg-warning">En attente</span>;
      case 'approved':
        return <span className="badge bg-success">Approuvé</span>;
      case 'in_progress':
        return <span className="badge bg-info">En cours</span>;
      case 'urgent':
        return <span className="badge bg-danger">Urgent</span>;
      case 'investigating':
        return <span className="badge bg-warning">Enquête</span>;
      default:
        return <span className="badge bg-secondary">Inconnu</span>;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'marketing':
        return <BiCrosshair className="text-primary" />;
      case 'pricing':
        return <BiDollar className="text-success" />;
      case 'retention':
        return <BiUser className="text-info" />;
      case 'inventory':
        return <BiPackage className="text-warning" />;
      case 'security':
        return <BiXCircle className="text-danger" />;
      default:
        return <BiBulb className="text-muted" />;
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'critical':
        return 'danger';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'secondary';
      default:
        return 'light';
    }
  };

  const getEffortColor = (effort) => {
    switch (effort) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const filteredRecommendations = selectedModel === 'all' 
    ? recommendations 
    : recommendations.filter(r => r.modelId === selectedModel);

  const getChartData = () => {
    const categories = ['marketing', 'pricing', 'retention', 'inventory', 'security'];
    const categoryCounts = categories.map(cat => 
      recommendations.filter(r => r.category === cat).length
    );

    return {
      labels: ['Marketing', 'Pricing', 'Rétention', 'Inventaire', 'Sécurité'],
      datasets: [{
        data: categoryCounts,
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
        ]
      }]
    };
  };

  const exportRecommendations = () => {
    const rows = filteredRecommendations.map(rec => ({
      id: rec.id,
      title: rec.title,
      type: rec.type,
      priority: rec.priority,
      impact: rec.impact,
      effort: rec.effort,
      estimatedRevenue: rec.estimatedRevenue,
      confidence: rec.confidence,
      category: rec.category,
      status: rec.status,
      createdAt: rec.createdAt
    }));
    exportToCsv('ai_recommendations.csv', rows);
  };

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-1">IA & Recommandations</h1>
          <p className="text-muted mb-0">Intelligence artificielle et recommandations automatisées</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={exportRecommendations}>
            <BiDownload className="me-2" />
            Export CSV
          </button>
          <button className="btn btn-outline-primary" onClick={loadData}>
            <BiRefresh className="me-2" />
            Actualiser
          </button>
          <button className="btn btn-primary">
            <BiCog className="me-2" />
            Configuration IA
          </button>
        </div>
      </div>

      {/* Métriques de performance */}
      <div className="row g-3 mb-4">
        <div className="col-md-2">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-primary mb-1">{performance.totalRecommendations}</h4>
              <small className="text-muted">Recommandations totales</small>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-success mb-1">{performance.implementedRecommendations}</h4>
              <small className="text-muted">Implémentées</small>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-warning mb-1">{performance.pendingRecommendations}</h4>
              <small className="text-muted">En attente</small>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-info mb-1">{performance.accuracy}%</h4>
              <small className="text-muted">Précision IA</small>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-success mb-1">€{performance.totalRevenue?.toLocaleString() || '0'}</h4>
              <small className="text-muted">Revenus générés</small>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-primary mb-1">{performance.modelsActive}</h4>
              <small className="text-muted">Modèles actifs</small>
            </div>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <BiBarChart className="me-2" />
            Vue d'ensemble
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'recommendations' ? 'active' : ''}`}
            onClick={() => setActiveTab('recommendations')}
          >
                <BiBulb className="me-2" />
            Recommandations ({recommendations.length})
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'models' ? 'active' : ''}`}
            onClick={() => setActiveTab('models')}
          >
            <BiBrain className="me-2" />
            Modèles IA ({aiModels.length})
          </button>
        </li>
      </ul>

      {/* Vue d'ensemble */}
      {activeTab === 'overview' && (
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0">
                <h5 className="mb-0">Performance des modèles IA</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  {aiModels.map((model) => (
                    <div key={model.id} className="col-md-6">
                      <div className="card border-0 shadow-sm">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="card-title mb-0">{model.name}</h6>
                            {getStatusBadge(model.status)}
                          </div>
                          <p className="card-text small text-muted mb-3">{model.description}</p>
                          <div className="row g-2">
                            <div className="col-6">
                              <div className="text-center">
                                <h5 className="text-primary mb-0">{model.accuracy}%</h5>
                                <small className="text-muted">Précision</small>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="text-center">
                                <h5 className="text-success mb-0">{model.predictions?.toLocaleString() || '0'}</h5>
                                <small className="text-muted">Prédictions</small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0">
                <h5 className="mb-0">Répartition par catégorie</h5>
              </div>
              <div className="card-body">
                {getChartData() && (
                  <Doughnut 
                    data={getChartData()} 
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: 'bottom' }
                      }
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommandations */}
      {activeTab === 'recommendations' && (
        <>
          {/* Filtres */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <select
                    className="form-select"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                  >
                    <option value="all">Tous les modèles</option>
                    {aiModels.map(model => (
                      <option key={model.id} value={model.id}>{model.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <button className="btn btn-outline-secondary w-100">
                    <BiFilter className="me-2" />
                    Plus de filtres
                  </button>
                </div>
                <div className="col-md-4">
                  <button className="btn btn-outline-primary w-100">
                    <BiSearch className="me-2" />
                    Rechercher
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Liste des recommandations */}
          <div className="row g-4">
            {filteredRecommendations.map((recommendation) => (
              <div key={recommendation.id} className="col-lg-6">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white border-0">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="mb-1">{recommendation.title}</h6>
                        <small className="text-muted">
                          {getCategoryIcon(recommendation.category)} {recommendation.category}
                        </small>
                      </div>
                      <div className="d-flex gap-2">
                        {getPriorityBadge(recommendation.priority)}
                        {getStatusBadge(recommendation.status)}
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <p className="card-text small mb-3">{recommendation.description}</p>
                    
                    <div className="row g-2 mb-3">
                      <div className="col-4">
                        <div className="text-center">
                          <h6 className={`text-${getImpactColor(recommendation.impact)} mb-0`}>
                            {recommendation.impact}
                          </h6>
                          <small className="text-muted">Impact</small>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="text-center">
                          <h6 className={`text-${getEffortColor(recommendation.effort)} mb-0`}>
                            {recommendation.effort}
                          </h6>
                          <small className="text-muted">Effort</small>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="text-center">
                          <h6 className="text-primary mb-0">{recommendation.confidence}%</h6>
                          <small className="text-muted">Confiance</small>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <span className="fw-medium">
                          {recommendation.estimatedRevenue > 0 ? '+' : ''}€{recommendation.estimatedRevenue?.toLocaleString() || '0'}
                        </span>
                        <small className="text-muted ms-2">Revenus estimés</small>
                      </div>
                      <small className="text-muted">
                        {new Date(recommendation.createdAt).toLocaleDateString()}
                      </small>
                    </div>

                    {/* Actions */}
                    <div className="mb-3">
                      <h6 className="small mb-2">Actions recommandées:</h6>
                      {recommendation.actions.map((action) => (
                        <div key={action.id} className="d-flex align-items-center mb-1">
                          <div className="flex-shrink-0 me-2">
                            {action.status === 'completed' && <BiCheckCircle className="text-success" />}
                            {action.status === 'in_progress' && <BiPlay className="text-warning" />}
                            {action.status === 'pending' && <BiPause className="text-secondary" />}
                          </div>
                          <div className="flex-grow-1">
                            <small className={action.status === 'completed' ? 'text-success' : 'text-muted'}>
                              {action.description}
                            </small>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-success">
                        <BiCheckCircle className="me-1" />
                        Approuver
                      </button>
                      <button className="btn btn-sm btn-outline-primary">
                        <BiInfoCircle className="me-1" />
                        Détails
                      </button>
                      <button className="btn btn-sm btn-outline-secondary">
                        <BiCog className="me-1" />
                        Configurer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modèles IA */}
      {activeTab === 'models' && (
        <div className="row g-4">
          {aiModels.map((model) => (
            <div key={model.id} className="col-lg-6">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">{model.name}</h5>
                    <div className="d-flex gap-2">
                      {getStatusBadge(model.status)}
                      <button className="btn btn-sm btn-outline-primary">
                        <BiCog />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <p className="card-text mb-3">{model.description}</p>
                  
                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <div className="text-center">
                        <h4 className="text-primary mb-1">{model.accuracy}%</h4>
                        <small className="text-muted">Précision</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="text-center">
                        <h4 className="text-success mb-1">{model.predictions?.toLocaleString() || '0'}</h4>
                        <small className="text-muted">Prédictions</small>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h6 className="small mb-2">Fonctionnalités:</h6>
                    <div className="d-flex flex-wrap gap-1">
                      {model.features.map((feature, index) => (
                        <span key={index} className="badge bg-light text-dark">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <h6 className="small mb-2">Performance:</h6>
                    {Object.entries(model.performance).map(([key, value]) => (
                      <div key={key} className="d-flex justify-content-between mb-1">
                        <small className="text-muted">{key}:</small>
                        <small className="fw-medium">
                          {typeof value === 'number' && value > 1000 
                            ? value?.toLocaleString() || '0'
                            : typeof value === 'number' && value < 1 
                            ? (value * 100).toFixed(1) + '%'
                            : value}
                        </small>
                      </div>
                    ))}
                  </div>

                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-primary">
                      <BiPlay className="me-1" />
                      {model.status === 'active' ? 'Pause' : 'Démarrer'}
                    </button>
                    <button className="btn btn-sm btn-outline-info">
                      <BiBarChart className="me-1" />
                      Analytics
                    </button>
                    <button className="btn btn-sm btn-outline-secondary">
                      <BiCog className="me-1" />
                      Paramètres
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}