// src/components/ResponsiveDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useThemeColors } from '../contexts/ThemeContext';
import { 
  BiMenu, 
  BiX, 
  BiGrid, 
  BiList,
  BiFullscreen,
  BiFullscreenExit,
  BiColumns,
  BiLayout
} from 'react-icons/bi';

const ResponsiveDashboard = ({ children, title = "Dashboard" }) => {
  const colors = useThemeColors();
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid, list, compact
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  const getViewModeClass = () => {
    switch (viewMode) {
      case 'list': return 'list-view';
      case 'compact': return 'compact-view';
      default: return 'grid-view';
    }
  };

  const getResponsiveColumns = () => {
    if (isMobile) return 'col-12';
    if (isTablet) return 'col-md-6';
    return 'col-lg-4 col-md-6';
  };

  return (
    <div 
      className={`responsive-dashboard ${getViewModeClass()} ${isFullscreen ? 'fullscreen' : ''}`}
      style={{
        minHeight: '100vh',
        backgroundColor: colors.background,
        color: colors.text,
        transition: 'all 0.3s ease'
      }}
    >
      {/* Header responsive */}
      <div 
        className="dashboard-header"
        style={{
          backgroundColor: colors.card,
          borderBottom: `1px solid ${colors.border}`,
          padding: '1rem',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          boxShadow: `0 2px 4px ${colors.shadow}`
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            {/* Bouton menu mobile */}
            {isMobile && (
              <button
                className="btn btn-outline-secondary"
                onClick={toggleSidebar}
                style={{
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: 'transparent'
                }}
              >
                {sidebarOpen ? <BiX size={20} /> : <BiMenu size={20} />}
              </button>
            )}

            <h4 className="mb-0" style={{ color: colors.text }}>
              {title}
            </h4>

            {/* Indicateur de taille d'écran */}
            <div 
              className="badge"
              style={{
                backgroundColor: isMobile ? colors.danger : isTablet ? colors.warning : colors.success,
                color: 'white',
                fontSize: '0.7rem'
              }}
            >
              {isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            {/* Sélecteur de vue */}
            <div className="btn-group" role="group">
              <button
                className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setViewMode('grid')}
                style={{
                  borderColor: colors.border,
                  color: viewMode === 'grid' ? 'white' : colors.text,
                  backgroundColor: viewMode === 'grid' ? colors.primary : 'transparent'
                }}
                title="Vue grille"
              >
                <BiGrid size={16} />
              </button>
              <button
                className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setViewMode('list')}
                style={{
                  borderColor: colors.border,
                  color: viewMode === 'list' ? 'white' : colors.text,
                  backgroundColor: viewMode === 'list' ? colors.primary : 'transparent'
                }}
                title="Vue liste"
              >
                <BiList size={16} />
              </button>
              <button
                className={`btn btn-sm ${viewMode === 'compact' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setViewMode('compact')}
                style={{
                  borderColor: colors.border,
                  color: viewMode === 'compact' ? 'white' : colors.text,
                  backgroundColor: viewMode === 'compact' ? colors.primary : 'transparent'
                }}
                title="Vue compacte"
              >
                <BiColumns size={16} />
              </button>
            </div>

            {/* Bouton plein écran */}
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={toggleFullscreen}
              style={{
                borderColor: colors.border,
                color: colors.text,
                backgroundColor: 'transparent'
              }}
              title={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
            >
              {isFullscreen ? <BiFullscreenExit size={16} /> : <BiFullscreen size={16} />}
            </button>
          </div>
        </div>
      </div>

      <div className="d-flex">
        {/* Sidebar mobile */}
        {isMobile && sidebarOpen && (
          <div 
            className="mobile-sidebar"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '280px',
              height: '100vh',
              backgroundColor: colors.card,
              borderRight: `1px solid ${colors.border}`,
              zIndex: 1001,
              padding: '1rem',
              overflowY: 'auto'
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h6 style={{ color: colors.text, margin: 0 }}>Navigation</h6>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={toggleSidebar}
                style={{
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: 'transparent'
                }}
              >
                <BiX size={16} />
              </button>
            </div>
            
            {/* Menu de navigation mobile */}
            <nav>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a 
                    href="#overview" 
                    className="d-block p-2 rounded text-decoration-none"
                    style={{
                      color: colors.text,
                      backgroundColor: colors.surface
                    }}
                  >
                    Vue d'ensemble
                  </a>
                </li>
                <li className="mb-2">
                  <a 
                    href="#analytics" 
                    className="d-block p-2 rounded text-decoration-none"
                    style={{
                      color: colors.text,
                      backgroundColor: colors.surface
                    }}
                  >
                    Analytics
                  </a>
                </li>
                <li className="mb-2">
                  <a 
                    href="#orders" 
                    className="d-block p-2 rounded text-decoration-none"
                    style={{
                      color: colors.text,
                      backgroundColor: colors.surface
                    }}
                  >
                    Commandes
                  </a>
                </li>
                <li className="mb-2">
                  <a 
                    href="#products" 
                    className="d-block p-2 rounded text-decoration-none"
                    style={{
                      color: colors.text,
                      backgroundColor: colors.surface
                    }}
                  >
                    Produits
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        )}

        {/* Overlay mobile */}
        {isMobile && sidebarOpen && (
          <div
            className="mobile-overlay"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1000
            }}
            onClick={toggleSidebar}
          />
        )}

        {/* Contenu principal */}
        <div 
          className="flex-grow-1"
          style={{
            padding: isMobile ? '1rem' : '2rem',
            transition: 'all 0.3s ease'
          }}
        >
          <div className={`row g-3 ${getViewModeClass()}`}>
            {React.Children.map(children, (child, index) => (
              <div key={index} className={getResponsiveColumns()}>
                {child}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Styles CSS intégrés */}
      <style jsx>{`
        .responsive-dashboard {
          transition: all 0.3s ease;
        }

        .responsive-dashboard.fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
          background-color: var(--theme-background);
        }

        .grid-view .col-lg-4 {
          display: block;
        }

        .list-view .col-lg-4 {
          flex: 0 0 100%;
          max-width: 100%;
        }

        .list-view .card {
          margin-bottom: 1rem;
        }

        .compact-view .col-lg-4 {
          flex: 0 0 50%;
          max-width: 50%;
        }

        .compact-view .card-body {
          padding: 1rem;
        }

        .compact-view .card-title {
          font-size: 0.9rem;
        }

        .compact-view .card-text {
          font-size: 0.8rem;
        }

        @media (max-width: 768px) {
          .responsive-dashboard .col-lg-4 {
            flex: 0 0 100%;
            max-width: 100%;
          }
          
          .compact-view .col-lg-4 {
            flex: 0 0 100%;
            max-width: 100%;
          }
        }

        @media (max-width: 576px) {
          .responsive-dashboard .card-body {
            padding: 0.75rem;
          }
          
          .responsive-dashboard .card-title {
            font-size: 0.9rem;
          }
          
          .responsive-dashboard .card-text {
            font-size: 0.8rem;
          }
        }

        .mobile-sidebar {
          animation: slideInLeft 0.3s ease-out;
        }

        .mobile-overlay {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ResponsiveDashboard;
import React, { useState, useEffect } from 'react';
import { useThemeColors } from '../contexts/ThemeContext';
import { 
  BiMenu, 
  BiX, 
  BiGrid, 
  BiList,
  BiFullscreen,
  BiFullscreenExit,
  BiColumns,
  BiLayout
} from 'react-icons/bi';

const ResponsiveDashboard = ({ children, title = "Dashboard" }) => {
  const colors = useThemeColors();
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid, list, compact
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  const getViewModeClass = () => {
    switch (viewMode) {
      case 'list': return 'list-view';
      case 'compact': return 'compact-view';
      default: return 'grid-view';
    }
  };

  const getResponsiveColumns = () => {
    if (isMobile) return 'col-12';
    if (isTablet) return 'col-md-6';
    return 'col-lg-4 col-md-6';
  };

  return (
    <div 
      className={`responsive-dashboard ${getViewModeClass()} ${isFullscreen ? 'fullscreen' : ''}`}
      style={{
        minHeight: '100vh',
        backgroundColor: colors.background,
        color: colors.text,
        transition: 'all 0.3s ease'
      }}
    >
      {/* Header responsive */}
      <div 
        className="dashboard-header"
        style={{
          backgroundColor: colors.card,
          borderBottom: `1px solid ${colors.border}`,
          padding: '1rem',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          boxShadow: `0 2px 4px ${colors.shadow}`
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            {/* Bouton menu mobile */}
            {isMobile && (
              <button
                className="btn btn-outline-secondary"
                onClick={toggleSidebar}
                style={{
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: 'transparent'
                }}
              >
                {sidebarOpen ? <BiX size={20} /> : <BiMenu size={20} />}
              </button>
            )}

            <h4 className="mb-0" style={{ color: colors.text }}>
              {title}
            </h4>

            {/* Indicateur de taille d'écran */}
            <div 
              className="badge"
              style={{
                backgroundColor: isMobile ? colors.danger : isTablet ? colors.warning : colors.success,
                color: 'white',
                fontSize: '0.7rem'
              }}
            >
              {isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            {/* Sélecteur de vue */}
            <div className="btn-group" role="group">
              <button
                className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setViewMode('grid')}
                style={{
                  borderColor: colors.border,
                  color: viewMode === 'grid' ? 'white' : colors.text,
                  backgroundColor: viewMode === 'grid' ? colors.primary : 'transparent'
                }}
                title="Vue grille"
              >
                <BiGrid size={16} />
              </button>
              <button
                className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setViewMode('list')}
                style={{
                  borderColor: colors.border,
                  color: viewMode === 'list' ? 'white' : colors.text,
                  backgroundColor: viewMode === 'list' ? colors.primary : 'transparent'
                }}
                title="Vue liste"
              >
                <BiList size={16} />
              </button>
              <button
                className={`btn btn-sm ${viewMode === 'compact' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setViewMode('compact')}
                style={{
                  borderColor: colors.border,
                  color: viewMode === 'compact' ? 'white' : colors.text,
                  backgroundColor: viewMode === 'compact' ? colors.primary : 'transparent'
                }}
                title="Vue compacte"
              >
                <BiColumns size={16} />
              </button>
            </div>

            {/* Bouton plein écran */}
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={toggleFullscreen}
              style={{
                borderColor: colors.border,
                color: colors.text,
                backgroundColor: 'transparent'
              }}
              title={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
            >
              {isFullscreen ? <BiFullscreenExit size={16} /> : <BiFullscreen size={16} />}
            </button>
          </div>
        </div>
      </div>

      <div className="d-flex">
        {/* Sidebar mobile */}
        {isMobile && sidebarOpen && (
          <div 
            className="mobile-sidebar"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '280px',
              height: '100vh',
              backgroundColor: colors.card,
              borderRight: `1px solid ${colors.border}`,
              zIndex: 1001,
              padding: '1rem',
              overflowY: 'auto'
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h6 style={{ color: colors.text, margin: 0 }}>Navigation</h6>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={toggleSidebar}
                style={{
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: 'transparent'
                }}
              >
                <BiX size={16} />
              </button>
            </div>
            
            {/* Menu de navigation mobile */}
            <nav>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a 
                    href="#overview" 
                    className="d-block p-2 rounded text-decoration-none"
                    style={{
                      color: colors.text,
                      backgroundColor: colors.surface
                    }}
                  >
                    Vue d'ensemble
                  </a>
                </li>
                <li className="mb-2">
                  <a 
                    href="#analytics" 
                    className="d-block p-2 rounded text-decoration-none"
                    style={{
                      color: colors.text,
                      backgroundColor: colors.surface
                    }}
                  >
                    Analytics
                  </a>
                </li>
                <li className="mb-2">
                  <a 
                    href="#orders" 
                    className="d-block p-2 rounded text-decoration-none"
                    style={{
                      color: colors.text,
                      backgroundColor: colors.surface
                    }}
                  >
                    Commandes
                  </a>
                </li>
                <li className="mb-2">
                  <a 
                    href="#products" 
                    className="d-block p-2 rounded text-decoration-none"
                    style={{
                      color: colors.text,
                      backgroundColor: colors.surface
                    }}
                  >
                    Produits
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        )}

        {/* Overlay mobile */}
        {isMobile && sidebarOpen && (
          <div
            className="mobile-overlay"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1000
            }}
            onClick={toggleSidebar}
          />
        )}

        {/* Contenu principal */}
        <div 
          className="flex-grow-1"
          style={{
            padding: isMobile ? '1rem' : '2rem',
            transition: 'all 0.3s ease'
          }}
        >
          <div className={`row g-3 ${getViewModeClass()}`}>
            {React.Children.map(children, (child, index) => (
              <div key={index} className={getResponsiveColumns()}>
                {child}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Styles CSS intégrés */}
      <style jsx>{`
        .responsive-dashboard {
          transition: all 0.3s ease;
        }

        .responsive-dashboard.fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
          background-color: var(--theme-background);
        }

        .grid-view .col-lg-4 {
          display: block;
        }

        .list-view .col-lg-4 {
          flex: 0 0 100%;
          max-width: 100%;
        }

        .list-view .card {
          margin-bottom: 1rem;
        }

        .compact-view .col-lg-4 {
          flex: 0 0 50%;
          max-width: 50%;
        }

        .compact-view .card-body {
          padding: 1rem;
        }

        .compact-view .card-title {
          font-size: 0.9rem;
        }

        .compact-view .card-text {
          font-size: 0.8rem;
        }

        @media (max-width: 768px) {
          .responsive-dashboard .col-lg-4 {
            flex: 0 0 100%;
            max-width: 100%;
          }
          
          .compact-view .col-lg-4 {
            flex: 0 0 100%;
            max-width: 100%;
          }
        }

        @media (max-width: 576px) {
          .responsive-dashboard .card-body {
            padding: 0.75rem;
          }
          
          .responsive-dashboard .card-title {
            font-size: 0.9rem;
          }
          
          .responsive-dashboard .card-text {
            font-size: 0.8rem;
          }
        }

        .mobile-sidebar {
          animation: slideInLeft 0.3s ease-out;
        }

        .mobile-overlay {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ResponsiveDashboard;
 
 
 
 
 
 
 
 
 