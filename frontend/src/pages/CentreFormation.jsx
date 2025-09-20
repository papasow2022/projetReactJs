import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BiArrowBack, 
  BiPlay, 
  BiBookOpen, 
  BiFile, 
  BiCheckCircle,
  BiTime,
  BiUser,
  BiStar,
  BiDownload,
  BiSearch
} from 'react-icons/bi';

const CentreFormation = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('tous');
  const [completedCourses, setCompletedCourses] = useState(['getting-started', 'product-listing']);

  const categories = [
    { id: 'tous', label: 'Tous les cours' },
    { id: 'debutant', label: 'Débutant' },
    { id: 'intermediaire', label: 'Intermédiaire' },
    { id: 'avance', label: 'Avancé' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'logistique', label: 'Logistique' }
  ];

  const courses = [
    {
      id: 'getting-started',
      title: 'Bienvenue sur papasow - Guide de démarrage',
      description: 'Apprenez les bases pour commencer à vendre sur papasow',
      duration: '15 min',
      level: 'debutant',
      type: 'video',
      instructor: 'Équipe papasow',
      rating: 4.8,
      students: 1247,
      thumbnail: '🎯',
      completed: true
    },
    {
      id: 'product-listing',
      title: 'Créer des fiches produits optimisées',
      description: 'Maîtrisez l\'art de créer des fiches produits qui se vendent',
      duration: '25 min',
      level: 'debutant',
      type: 'video',
      instructor: 'Marie Dubois',
      rating: 4.9,
      students: 892,
      thumbnail: '📝',
      completed: true
    },
    {
      id: 'pricing-strategy',
      title: 'Stratégies de prix compétitives',
      description: 'Découvrez comment fixer des prix qui maximisent vos ventes',
      duration: '30 min',
      level: 'intermediaire',
      type: 'video',
      instructor: 'Pierre Martin',
      rating: 4.7,
      students: 654,
      thumbnail: '💰',
      completed: false
    },
    {
      id: 'inventory-management',
      title: 'Gestion des stocks et inventaire',
      description: 'Optimisez votre gestion de stock pour éviter les ruptures',
      duration: '20 min',
      level: 'intermediaire',
      type: 'video',
      instructor: 'Sophie Bernard',
      rating: 4.6,
      students: 543,
      thumbnail: '📦',
      completed: false
    },
    {
      id: 'customer-service',
      title: 'Service client d\'excellence',
      description: 'Développez un service client qui fidélise vos acheteurs',
      duration: '35 min',
      level: 'intermediaire',
      type: 'video',
      instructor: 'Lucie Moreau',
      rating: 4.8,
      students: 456,
      thumbnail: '🎧',
      completed: false
    },
    {
      id: 'marketing-tools',
      title: 'Outils marketing papasow',
      description: 'Utilisez les outils marketing pour booster vos ventes',
      duration: '40 min',
      level: 'avance',
      type: 'video',
      instructor: 'Thomas Leroy',
      rating: 4.5,
      students: 234,
      thumbnail: '📊',
      completed: false
    }
  ];

  const webinars = [
    {
      id: 'webinar-1',
      title: 'Webinaire : Stratégies de vente pour les fêtes',
      date: '15 décembre 2024',
      time: '14h00 - 15h30',
      instructor: 'Équipe papasow',
      attendees: 156,
      thumbnail: '🎄'
    },
    {
      id: 'webinar-2',
      title: 'Webinaire : Optimisation SEO pour vos produits',
      date: '20 décembre 2024',
      time: '10h00 - 11h30',
      instructor: 'Marie Dubois',
      attendees: 89,
      thumbnail: '🔍'
    }
  ];

  const resources = [
    {
      id: 'guide-1',
      title: 'Guide complet du vendeur papasow',
      type: 'pdf',
      size: '2.3 MB',
      downloads: 1247
    },
    {
      id: 'guide-2',
      title: 'Checklist de mise en ligne d\'un produit',
      type: 'pdf',
      size: '1.1 MB',
      downloads: 892
    },
    {
      id: 'template-1',
      title: 'Templates de fiches produits',
      type: 'zip',
      size: '5.2 MB',
      downloads: 654
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'tous' || course.level === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const progress = Math.round((completedCourses.length / courses.length) * 100);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e0e0e0', padding: '1rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/vendeur/dashboard" style={{ textDecoration: 'none', color: '#666' }}>
              <BiArrowBack style={{ fontSize: '1.5rem' }} />
            </Link>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '600', color: '#232f3e' }}>
                Centre de Formation
              </h1>
              <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                Développez vos compétences de vendeur avec nos formations
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 0' }}>
        {/* Progression */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600' }}>Votre progression</h3>
            <span style={{ color: '#28a745', fontWeight: '600' }}>{progress}%</span>
          </div>
          <div style={{ 
            width: '100%', 
            height: '8px', 
            backgroundColor: '#e9ecef', 
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: `${progress}%`, 
              height: '100%', 
              backgroundColor: '#28a745',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
          <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
            {completedCourses.length} sur {courses.length} cours terminés
          </p>
        </div>

        {/* Recherche et filtres */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <BiSearch style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: '#666' 
              }} />
              <input
                type="text"
                placeholder="Rechercher un cours..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '0.9rem'
                }}
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: 'white',
                minWidth: '150px'
              }}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          {/* Cours */}
          <div>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '600' }}>
              Cours disponibles ({filteredCourses.length})
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredCourses.map(course => (
                <div key={course.id} style={{ 
                  backgroundColor: 'white', 
                  padding: '1.5rem', 
                  borderRadius: '8px', 
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  border: course.completed ? '2px solid #28a745' : '1px solid #e0e0e0'
                }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ 
                      fontSize: '2rem', 
                      width: '60px', 
                      height: '60px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '8px'
                    }}>
                      {course.thumbnail}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>
                          {course.title}
                        </h3>
                        {course.completed && (
                          <BiCheckCircle style={{ color: '#28a745', fontSize: '1.2rem' }} />
                        )}
                      </div>
                      
                      <p style={{ margin: '0 0 0.75rem 0', color: '#666', fontSize: '0.9rem' }}>
                        {course.description}
                      </p>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: '#666' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <BiTime />
                          {typeof course.duration === 'string' ? course.duration : JSON.stringify(course.duration)}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <BiUser />
                          {course.instructor}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <BiStar />
                          {course.rating} ({course.students} étudiants)
                        </span>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                      <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: course.completed ? '#28a745' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}>
                        <BiPlay />
                        {course.completed ? 'Revoir' : 'Commencer'}
                      </button>
                      
                      <span style={{ 
                        fontSize: '0.8rem', 
                        padding: '0.25rem 0.5rem',
                        backgroundColor: course.level === 'debutant' ? '#d1ecf1' : 
                                        course.level === 'intermediaire' ? '#fff3cd' : '#f8d7da',
                        color: course.level === 'debutant' ? '#0c5460' : 
                               course.level === 'intermediaire' ? '#856404' : '#721c24',
                        borderRadius: '4px',
                        fontWeight: '500'
                      }}>
                        {course.level}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Webinaires */}
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: '600' }}>
                Webinaires à venir
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {webinars.map(webinar => (
                  <div key={webinar.id} style={{ 
                    padding: '1rem',
                    border: '1px solid #e0e0e0',
                    borderRadius: '6px'
                  }}>
                    <div style={{ 
                      fontSize: '1.5rem', 
                      marginBottom: '0.5rem' 
                    }}>
                      {webinar.thumbnail}
                    </div>
                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: '600' }}>
                      {webinar.title}
                    </h4>
                    <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>
                      <div>{webinar.date}</div>
                      <div>{webinar.time}</div>
                      <div>Par {webinar.instructor}</div>
                    </div>
                    <button style={{
                      width: '100%',
                      padding: '0.5rem',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}>
                      S'inscrire ({webinar.attendees} participants)
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Ressources */}
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: '600' }}>
                Ressources téléchargeables
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {resources.map(resource => (
                  <div key={resource.id} style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    border: '1px solid #e0e0e0',
                    borderRadius: '6px'
                  }}>
                    <BiFile style={{ fontSize: '1.2rem', color: '#007bff' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                        {resource.title}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#666' }}>
                        {resource.size} • {resource.downloads} téléchargements
                      </div>
                    </div>
                    <BiDownload style={{ fontSize: '1.2rem', color: '#666', cursor: 'pointer' }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Support */}
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: '600' }}>
                Besoin d'aide ?
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link to="/vendeur/support" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  backgroundColor: '#f8f9fa',
                  color: '#333',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontWeight: '500'
                }}>
                  <BiBookOpen />
                  Centre d'aide vendeur
                </Link>
                
                <Link to="/vendeur/support" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  backgroundColor: '#f8f9fa',
                  color: '#333',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontWeight: '500'
                }}>
                  <BiUser />
                  Contacter le support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CentreFormation; 