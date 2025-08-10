import React from 'react';

const CategoryFilters = ({ selectedCategory, onCategoryChange, collections = [] }) => {
  // Catégories avec leurs images
  const categoriesWithImages = [
    {
      name: 'Pantalons',
      image: 'assets/categorie/pantalons/pantalon1.png',
      label: 'Pantalons'
    },
    {
      name: 'Vestes',
      image: 'assets/categorie/vestes/veste1.png',
      label: 'Vestes'
    },
    {
      name: 'Montres',
      image: 'assets/categorie/montres/montre1.png',
      label: 'Montres'
    },
    {
      name: 'Accessoires',
      image: 'assets/categorie/accessoires/arriver (2).png',
      label: 'Accessoires'
    },
    {
      name: 'Chaussures',
      image: 'assets/categorie/chaussures/nike-air-max.png',
      label: 'Chaussures'
    },
    {
      name: 'Électronique',
      image: 'assets/categorie/electronique/samsung-s23.png',
      label: 'Électronique'
    }
  ];

  return (
    <div className="category-filters">
      <h3>Catégories</h3>
      <div className="category-grid">
        {categoriesWithImages.map((category) => (
          <div
            key={category.name}
            className={`category-item ${selectedCategory === category.name ? 'selected' : ''}`}
            onClick={() => onCategoryChange(category.name)}
          >
            <div className="category-image">
              <img src={category.image} alt={category.label} />
            </div>
            <div className="category-label">{category.label}</div>
          </div>
        ))}
      </div>
      <style>
        {`
          .category-filters {
            margin: 20px 0;
          }
          .category-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-top: 15px;
          }
          .category-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            padding: 10px;
            border-radius: 8px;
            border: 1px solid #ddd;
            transition: all 0.3s ease;
          }
          .category-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          .category-item.selected {
            border-color: #f0c14b;
            background-color: #fef8e7;
          }
          .category-image {
            width: 80px;
            height: 80px;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .category-image img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
          }
          .category-label {
            font-size: 0.9rem;
            color: #333;
            text-align: center;
          }
          h3 {
            margin-bottom: 10px;
            font-size: 1.1rem;
            color: #333;
          }
        `}
      </style>
    </div>
  );
};

export default CategoryFilters;
