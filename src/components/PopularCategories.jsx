import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const PopularCategories = () => {
  const { t } = useLanguage();

  // Sample categories with images
  const categories = [
    {
      id: 1,
      name: 'electronics',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      color: '#e3f2fd',
      count: 120
    },
    {
      id: 2,
      name: 'clothing',
      image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      color: '#fff8e1',
      count: 350
    },
    {
      id: 3,
      name: 'home_garden',
      image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80',
      color: '#e8f5e9',
      count: 210
    },
    {
      id: 4,
      name: 'beauty',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80',
      color: '#fce4ec',
      count: 180
    },
    {
      id: 5,
      name: 'sports',
      image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      color: '#e3f2fd',
      count: 95
    },
    {
      id: 6,
      name: 'books',
      image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      color: '#f3e5f5',
      count: 240
    }
  ];

  return (
    <section className="popular-categories py-5" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold mb-2" style={{ color: '#232f3e' }}>{t('popular_categories')}</h2>
          <p className="text-muted">{t('discover_categories')}</p>
        </div>

        <div className="row g-4">
          {categories.map((category) => (
            <div key={category.id} className="col-6 col-md-4 col-lg-2">
              <Link 
                to={`/catalogue?category=${category.name}`} 
                className="text-decoration-none"
              >
                <div 
                  className="category-card text-center p-3 h-100 rounded shadow-sm" 
                  style={{ backgroundColor: category.color }}
                >
                  <div className="category-img-container mb-3">
                    <img 
                      src={category.image} 
                      alt={t(category.name)} 
                      className="img-fluid rounded-circle" 
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                    />
                  </div>
                  <h5 className="category-title fw-bold mb-1" style={{ color: '#232f3e' }}>
                    {t(category.name)}
                  </h5>
                  <p className="text-muted small mb-0">
                    {category.count} {t('products')}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-4">
          <Link to="/catalogue" className="btn btn-primary px-4 py-2">
            {t('view_all_categories')} <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>
      </div>

      <style jsx="true">{`
        .category-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border-radius: 12px;
        }
        .category-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
        }
        .category-img-container {
          transition: transform 0.5s ease;
        }
        .category-card:hover .category-img-container {
          transform: scale(1.1);
        }
      `}</style>
    </section>
  );
};

export default PopularCategories;