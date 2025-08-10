import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { useLanguage } from './LanguageContext';

const DailyDealsContext = createContext();

export const useDailyDeals = () => {
  const context = useContext(DailyDealsContext);
  if (!context) {
    throw new Error('useDailyDeals doit être utilisé dans un DailyDealsProvider');
  }
  return context;
};

// Données d'exemple pour les offres du jour
const dailyDealsData = [
  {
    id: 'dd-001',
    nom: "Nike Air Max 270",
    image: "/assets/categorie/arriver (1).png",
    prix: 129.99,
    ancienPrix: 159.99,
    reduction: 19,
    note: 4.5,
    stock: 8,
    stockInitial: 15,
    categorie: "Chaussures",
    sousCategorie: "Running",
    badge: "Offre du jour",
    description: "Chaussure running homme, confort et style, idéale pour le sport et la ville.",
    vendeur: "Nike Store",
    livraison: "Prime",
    livraisonGratuite: true,
    dateDebut: "2024-01-01",
    dateFin: "2024-12-31",
    heuresRestantes: 24,
    tags: ["sport", "running", "confort"],
    specifications: {
      couleur: "Noir/Blanc",
      taille: "42-46",
      materiau: "Mesh respirant",
      poids: "280g"
    },
    images: [
      "/assets/categorie/arriver (1).png",
      "/assets/categorie/arriver (2).png",
      "/assets/categorie/arriver (3).png"
    ],
    avis: [
      { note: 5, commentaire: "Excellent confort", utilisateur: "Jean D." },
      { note: 4, commentaire: "Très bien pour le running", utilisateur: "Marie L." }
    ]
  },
  {
    id: 'dd-002',
    nom: "Adidas Ultraboost 22",
    image: "/assets/categorie/arriver (2).png",
    prix: 149.99,
    ancienPrix: 179.99,
    reduction: 17,
    note: 4.3,
    stock: 5,
    stockInitial: 12,
    categorie: "Chaussures",
    sousCategorie: "Running",
    badge: "-17%",
    description: "Performance et amorti maximal, chaussure running nouvelle génération.",
    vendeur: "Adidas Store",
    livraison: "Prime",
    livraisonGratuite: true,
    dateDebut: "2024-01-01",
    dateFin: "2024-12-31",
    heuresRestantes: 18,
    tags: ["performance", "amorti", "technologie"],
    specifications: {
      couleur: "Bleu/Blanc",
      taille: "39-45",
      materiau: "Primeknit",
      poids: "310g"
    },
    images: [
      "/assets/categorie/arriver (2).png",
      "/assets/categorie/arriver (1).png"
    ],
    avis: [
      { note: 5, commentaire: "Amorti exceptionnel", utilisateur: "Pierre M." }
    ]
  },
  {
    id: 'dd-003',
    nom: "Puma RS-X",
    image: "/assets/categorie/arriver (3).png",
    prix: 89.99,
    ancienPrix: 119.99,
    reduction: 25,
    note: 4.1,
    stock: 12,
    stockInitial: 20,
    categorie: "Chaussures",
    sousCategorie: "Lifestyle",
    badge: "-25%",
    description: "Sneaker rétro, look urbain, confort moderne pour tous les jours.",
    vendeur: "Puma Store",
    livraison: "Standard",
    livraisonGratuite: false,
    dateDebut: "2024-01-01",
    dateFin: "2024-12-31",
    heuresRestantes: 4,
    tags: ["retro", "lifestyle", "urbain"],
    specifications: {
      couleur: "Blanc/Rouge",
      taille: "36-44",
      materiau: "Cuir synthétique",
      poids: "350g"
    },
    images: [
      "/assets/categorie/arriver (3).png"
    ],
    avis: [
      { note: 4, commentaire: "Style rétro parfait", utilisateur: "Sophie R." }
    ]
  },
  {
    id: 'dd-004',
    nom: "Veste légère Nike",
    image: "/assets/categorie/arriver (1).png",
    prix: 59.99,
    ancienPrix: 79.99,
    reduction: 25,
    note: 4.6,
    stock: 10,
    stockInitial: 18,
    categorie: "Vestes",
    sousCategorie: "Sport",
    badge: "-25%",
    description: "Veste légère coupe-vent, idéale pour le sport ou la ville.",
    vendeur: "Nike Store",
    livraison: "Prime",
    livraisonGratuite: true,
    dateDebut: "2024-01-01",
    dateFin: "2024-12-31",
    heuresRestantes: 2,
    tags: ["coupe-vent", "léger", "sport"],
    specifications: {
      couleur: "Noir",
      taille: "S-XXL",
      materiau: "Polyester",
      poids: "180g"
    },
    images: [
      "/assets/categorie/arriver (1).png"
    ],
    avis: [
      { note: 5, commentaire: "Parfaite pour le running", utilisateur: "Thomas B." }
    ]
  },
  {
    id: 'dd-005',
    nom: "Sac à dos Adidas",
    image: "/assets/categorie/arriver (2).png",
    prix: 39.99,
    ancienPrix: 49.99,
    reduction: 20,
    note: 4.2,
    stock: 7,
    stockInitial: 15,
    categorie: "Accessoires",
    sousCategorie: "Sacs",
    badge: "-20%",
    description: "Sac à dos pratique pour le quotidien, compartiment ordinateur.",
    vendeur: "Adidas Store",
    livraison: "Standard",
    livraisonGratuite: false,
    dateDebut: "2024-01-01",
    dateFin: "2024-12-31",
    heuresRestantes: 1,
    tags: ["pratique", "quotidien", "ordinateur"],
    specifications: {
      couleur: "Gris",
      capacite: "25L",
      materiau: "Polyester",
      poids: "800g"
    },
    images: [
      "/assets/categorie/arriver (2).png"
    ],
    avis: [
      { note: 4, commentaire: "Très pratique", utilisateur: "Emma L." }
    ]
  },
  {
    id: 'dd-006',
    nom: "Montre Casio G-Shock",
    image: "/assets/categorie/arriver (3).png",
    prix: 89.99,
    ancienPrix: 129.99,
    reduction: 31,
    note: 4.7,
    stock: 4,
    stockInitial: 12,
    categorie: "Montres",
    sousCategorie: "Sport",
    badge: "-31%",
    description: "Montre robuste et résistante, parfaite pour le sport et les activités outdoor.",
    vendeur: "Casio Store",
    livraison: "Prime",
    livraisonGratuite: true,
    dateDebut: "2024-01-01",
    dateFin: "2024-12-31",
    heuresRestantes: 8,
    tags: ["robuste", "sport", "outdoor"],
    specifications: {
      couleur: "Noir",
      resistance: "200m",
      materiau: "Résine",
      poids: "65g"
    },
    images: [
      "/assets/categorie/arriver (3).png"
    ],
    avis: [
      { note: 5, commentaire: "Indestructible !", utilisateur: "Marc D." },
      { note: 4, commentaire: "Parfaite pour le sport", utilisateur: "Julie M." }
    ]
  },
  {
    id: 'dd-007',
    nom: "Pantalon Nike Dri-FIT",
    image: "/assets/categorie/arriver (1).png",
    prix: 44.99,
    ancienPrix: 59.99,
    reduction: 25,
    note: 4.4,
    stock: 15,
    stockInitial: 25,
    categorie: "Pantalons",
    sousCategorie: "Sport",
    badge: "-25%",
    description: "Pantalon de sport respirant, technologie Dri-FIT pour évacuer la transpiration.",
    vendeur: "Nike Store",
    livraison: "Prime",
    livraisonGratuite: true,
    dateDebut: "2024-01-01",
    dateFin: "2024-12-31",
    heuresRestantes: 15,
    tags: ["respirant", "sport", "confort"],
    specifications: {
      couleur: "Gris",
      taille: "S-XXL",
      materiau: "Polyester",
      poids: "220g"
    },
    images: [
      "/assets/categorie/arriver (1).png"
    ],
    avis: [
      { note: 4, commentaire: "Très confortable", utilisateur: "Alex R." }
    ]
  },
  {
    id: 'dd-008',
    nom: "Smartphone Samsung Galaxy",
    image: "/assets/categorie/arriver (2).png",
    prix: 299.99,
    ancienPrix: 399.99,
    reduction: 25,
    note: 4.6,
    stock: 3,
    stockInitial: 8,
    categorie: "Électronique",
    sousCategorie: "Smartphones",
    badge: "-25%",
    description: "Smartphone dernière génération, appareil photo haute résolution, batterie longue durée.",
    vendeur: "Samsung Store",
    livraison: "Prime",
    livraisonGratuite: true,
    dateDebut: "2024-01-01",
    dateFin: "2024-12-31",
    heuresRestantes: 2,
    tags: ["smartphone", "photo", "batterie"],
    specifications: {
      couleur: "Noir",
      stockage: "128GB",
      ecran: "6.1 pouces",
      poids: "168g"
    },
    images: [
      "/assets/categorie/arriver (2).png"
    ],
    avis: [
      { note: 5, commentaire: "Excellent rapport qualité-prix", utilisateur: "David L." },
      { note: 4, commentaire: "Photo exceptionnelle", utilisateur: "Sarah K." }
    ]
  }
];

export const DailyDealsProvider = ({ children }) => {
  const [dailyDeals, setDailyDeals] = useState([]);
  const [featuredDeal, setFeaturedDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { t, currentLanguage } = useLanguage();
  
  // Fonction pour traduire les noms des produits
  const translateProductName = (originalName) => {
    const translations = {
      "Veste légère Nike": {
        FR: "Veste légère Nike",
        EN: "Nike Light Jacket",
        ES: "Chaqueta ligera Nike",
        DE: "Nike Leichte Jacke"
      },
      "Sac à dos Adidas": {
        FR: "Sac à dos Adidas",
        EN: "Adidas Backpack",
        ES: "Mochila Adidas",
        DE: "Adidas Rucksack"
      },
      "Montre Casio G-Shock": {
        FR: "Montre Casio G-Shock",
        EN: "Casio G-Shock Watch",
        ES: "Reloj Casio G-Shock",
        DE: "Casio G-Shock Uhr"
      }
    };
    
    return translations[originalName]?.[currentLanguage] || originalName;
  };
  
  // Fonction pour traduire les descriptions
  const translateDescription = (originalDesc) => {
    const translations = {
      "Veste légère coupe-vent, idéale pour le sport ou la ville.": {
        FR: "Veste légère coupe-vent, idéale pour le sport ou la ville.",
        EN: "Light windbreaker jacket, perfect for sports or city wear.",
        ES: "Chaqueta ligera cortavientos, ideal para deportes o ciudad.",
        DE: "Leichte Windjacke, perfekt für Sport oder Stadt."
      },
      "Sac à dos pratique pour le quotidien, compartiment ordinateur.": {
        FR: "Sac à dos pratique pour le quotidien, compartiment ordinateur.",
        EN: "Practical backpack for everyday use, laptop compartment.",
        ES: "Mochila práctica para el día a día, compartimento para portátil.",
        DE: "Praktischer Rucksack für den Alltag, Laptop-Fach."
      },
      "Montre robuste et résistante, parfaite pour le sport et les activités outdoor.": {
        FR: "Montre robuste et résistante, parfaite pour le sport et les activités outdoor.",
        EN: "Robust and durable watch, perfect for sports and outdoor activities.",
        ES: "Reloj robusto y resistente, perfecto para deportes y actividades al aire libre.",
        DE: "Robuste und langlebige Uhr, perfekt für Sport und Outdoor-Aktivitäten."
      }
    };
    
    return translations[originalDesc]?.[currentLanguage] || originalDesc;
  };
  
  // Fonction pour traduire les tags
  const translateTags = (originalTags) => {
    const tagTranslations = {
      "coupe-vent": { FR: "coupe-vent", EN: "windbreaker", ES: "cortavientos", DE: "winddicht" },
      "léger": { FR: "léger", EN: "light", ES: "ligero", DE: "leicht" },
      "sport": { FR: "sport", EN: "sport", ES: "deporte", DE: "sport" },
      "pratique": { FR: "pratique", EN: "practical", ES: "práctico", DE: "praktisch" },
      "quotidien": { FR: "quotidien", EN: "everyday", ES: "diario", DE: "alltag" },
      "ordinateur": { FR: "ordinateur", EN: "laptop", ES: "portátil", DE: "laptop" },
      "robuste": { FR: "robuste", EN: "robust", ES: "robusto", DE: "robust" },
      "outdoor": { FR: "outdoor", EN: "outdoor", ES: "aire libre", DE: "outdoor" }
    };
    
    return originalTags.map(tag => tagTranslations[tag]?.[currentLanguage] || tag);
  };

  // Charger les offres du jour depuis le localStorage
  useEffect(() => {
    const loadDailyDeals = () => {
      try {
        const stored = localStorage.getItem('dailyDeals');
        if (stored) {
          const parsed = JSON.parse(stored);
          setDailyDeals(parsed);
          
          // Définir l'offre vedette (celle avec le moins d'heures restantes)
          const featured = parsed.reduce((min, deal) => 
            deal.heuresRestantes < min.heuresRestantes ? deal : min
          );
          setFeaturedDeal(featured);
        } else {
          // Initialiser avec les données d'exemple
          setDailyDeals(dailyDealsData);
          setFeaturedDeal(dailyDealsData[0]);
          localStorage.setItem('dailyDeals', JSON.stringify(dailyDealsData));
        }
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des offres du jour:', err);
        setError('Erreur lors du chargement des offres du jour');
        setLoading(false);
      }
    };

    loadDailyDeals();
  }, []);

  // Mettre à jour le timer toutes les heures
  useEffect(() => {
    const updateTimers = () => {
      setDailyDeals(prev => {
        const updated = prev.map(deal => ({
          ...deal,
          heuresRestantes: Math.max(0, deal.heuresRestantes - 1)
        }));
        
        // Sauvegarder dans localStorage
        localStorage.setItem('dailyDeals', JSON.stringify(updated));
        
        // Mettre à jour l'offre vedette
        const featured = updated.reduce((min, deal) => 
          deal.heuresRestantes < min.heuresRestantes ? deal : min
        );
        setFeaturedDeal(featured);
        
        return updated;
      });
    };

    const interval = setInterval(updateTimers, 3600000); // 1 heure
    return () => clearInterval(interval);
  }, []);

  // Fonction pour ajouter une offre au panier
  const addToCart = (dealId) => {
    const deal = dailyDeals.find(d => d.id === dealId);
    if (!deal || deal.stock <= 0) {
      throw new Error('Produit non disponible');
    }

    // Mettre à jour le stock
    setDailyDeals(prev => {
      const updated = prev.map(d => 
        d.id === dealId ? { ...d, stock: d.stock - 1 } : d
      );
      localStorage.setItem('dailyDeals', JSON.stringify(updated));
      return updated;
    });

    // Ajouter au panier
    const stored = localStorage.getItem('cart');
    let cart = stored ? JSON.parse(stored) : [];
    const existingIndex = cart.findIndex(item => item.id === dealId);
    
    if (existingIndex !== -1) {
      cart[existingIndex].qty = (cart[existingIndex].qty || 1) + 1;
    } else {
      cart.push({
        id: dealId,
        name: deal.nom,
        price: deal.prix,
        image: deal.image,
        qty: 1,
        type: 'daily-deal'
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  // Fonction pour filtrer les offres
  const filterDeals = (filters) => {
    return dailyDeals.filter(deal => {
      // Filtre par statut d'offre (active/expirée)
      if (filters.status && filters.status !== 'Toutes') {
        const isExpired = deal.heuresRestantes <= 0;
        if (filters.status === 'Actives' && isExpired) {
          return false;
        }
        if (filters.status === 'Expirées' && !isExpired) {
          return false;
        }
      }
      
      // Filtre pour les offres qui se terminent bientôt (si demandé)
      if (filters.endingSoon && deal.heuresRestantes > 6) {
        return false;
      }
      
      if (filters.categorie && filters.categorie !== 'Toutes' && deal.categorie !== filters.categorie) {
        return false;
      }
      if (filters.prixMin && deal.prix < filters.prixMin) {
        return false;
      }
      if (filters.prixMax && deal.prix > filters.prixMax) {
        return false;
      }
      if (filters.reductionMin && deal.reduction < filters.reductionMin) {
        return false;
      }
      if (filters.noteMin && deal.note < filters.noteMin) {
        return false;
      }
      if (filters.livraison && filters.livraison !== 'Toutes' && deal.livraison !== filters.livraison) {
        return false;
      }
      if (filters.stock && deal.stock === 0) {
        return false;
      }
      return true;
    });
  };

  // Fonction pour trier les offres
  const sortDeals = (deals, sortBy) => {
    const sorted = [...deals];
    switch (sortBy) {
      case 'prix-asc':
        return sorted.sort((a, b) => a.prix - b.prix);
      case 'prix-desc':
        return sorted.sort((a, b) => b.prix - a.prix);
      case 'reduction-desc':
        return sorted.sort((a, b) => b.reduction - a.reduction);
      case 'note-desc':
        return sorted.sort((a, b) => b.note - a.note);
      case 'temps-restant':
        return sorted.sort((a, b) => a.heuresRestantes - b.heuresRestantes);
      case 'stock':
        return sorted.sort((a, b) => a.stock - b.stock);
      default:
        return sorted;
    }
  };

  // Fonction pour obtenir les statistiques des offres
  const getDealsStats = () => {
    const totalDeals = dailyDeals.length;
    const activeDeals = dailyDeals.filter(d => d.heuresRestantes > 0).length;
    const expiredDeals = dailyDeals.filter(d => d.heuresRestantes <= 0).length;
    const totalReduction = dailyDeals.filter(d => d.heuresRestantes > 0).reduce((sum, d) => sum + (d.reduction || 0), 0);
    const avgReduction = activeDeals > 0 ? totalReduction / activeDeals : 0;
    const lowStockDeals = dailyDeals.filter(d => d.stock <= 3 && d.heuresRestantes > 0).length;
    
    const stats = {
      totalDeals,
      activeDeals,
      expiredDeals,
      avgReduction: Math.round(avgReduction),
      lowStockDeals
    };
    
    console.log('Statistiques calculées:', stats);
    return stats;
  };

  // Fonction pour obtenir les offres populaires (basées sur les avis)
  const getPopularDeals = (limit = 3) => {
    return dailyDeals
      .filter(d => d.avis && d.avis.length > 0)
      .sort((a, b) => {
        const avgA = a.avis.reduce((sum, avis) => sum + avis.note, 0) / a.avis.length;
        const avgB = b.avis.reduce((sum, avis) => sum + avis.note, 0) / b.avis.length;
        return avgB - avgA;
      })
      .slice(0, limit);
  };

  // Fonction pour obtenir les offres par catégorie
  const getDealsByCategory = (category) => {
    return dailyDeals.filter(d => d.categorie === category);
  };

  // Fonction pour obtenir les offres en rupture de stock
  const getOutOfStockDeals = () => {
    return dailyDeals.filter(d => d.stock === 0);
  };

  // Fonction pour obtenir les offres qui se terminent bientôt
  const getEndingSoonDeals = (hours = 6) => {
    return dailyDeals.filter(d => d.heuresRestantes <= hours && d.heuresRestantes > 0);
  };

  // Fonction pour obtenir les offres expirées
  const getExpiredDeals = () => {
    return dailyDeals.filter(d => d.heuresRestantes <= 0);
  };

  const value = {
    dailyDeals,
    featuredDeal,
    loading,
    error,
    addToCart,
    filterDeals,
    sortDeals,
    getDealsStats,
    getPopularDeals,
    getDealsByCategory,
    getOutOfStockDeals,
    getEndingSoonDeals,
    getExpiredDeals,
    translateProductName,
    translateDescription,
    translateTags
  };

  return (
    <DailyDealsContext.Provider value={value}>
      {children}
    </DailyDealsContext.Provider>
  );
}; 