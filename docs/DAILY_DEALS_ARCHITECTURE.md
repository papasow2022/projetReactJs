# Architecture des Offres du Jour

## Vue d'ensemble

L'architecture des "Offres du jour" suit le modèle Amazon avec une gestion centralisée des offres limitées dans le temps, incluant des timers, des stocks dynamiques, et une rotation automatique des offres.

## Structure des fichiers

```
src/
├── contexts/
│   └── DailyDealsContext.jsx          # Contexte principal pour la gestion des offres
├── components/
│   ├── DailyDealCard.jsx              # Composant carte d'offre réutilisable
│   ├── DailyDealsFilters.jsx          # Composant filtres et tri
│   ├── DailyDealsStats.jsx            # Composant statistiques
│   ├── DailyDealsHomeSection.jsx      # Section pour la page d'accueil
│   └── DailyDealsWidget.jsx           # Widget compact pour sidebar/header
└── pages/
    └── OffreDuJour.jsx                # Page unique des offres du jour (offre vedette + toutes les autres)
```

## Contexte DailyDealsContext

### Fonctionnalités principales

- **Gestion des données** : Stockage et synchronisation avec localStorage
- **Rotation automatique** : Mise à jour des timers toutes les heures
- **Gestion des stocks** : Suivi en temps réel des stocks
- **Filtrage et tri** : Fonctions avancées de recherche
- **Statistiques** : Calculs automatiques des métriques

### API du contexte

```javascript
const {
  dailyDeals,           // Toutes les offres
  featuredDeal,         // Offre vedette (temps le plus limité)
  loading,              // État de chargement
  error,                // Erreurs éventuelles
  addToCart,            // Ajouter au panier
  filterDeals,          // Filtrer les offres
  sortDeals,            // Trier les offres
  getDealsStats,        // Obtenir les statistiques
  getPopularDeals,      // Offres populaires
  getDealsByCategory,   // Par catégorie
  getOutOfStockDeals,   // En rupture de stock
  getEndingSoonDeals    // Se terminent bientôt
} = useDailyDeals();
```

## Structure des données

### Objet Offre

```javascript
{
  id: 'dd-001',                    // Identifiant unique
  nom: "Nike Air Max 270",         // Nom du produit
  image: "/assets/...",            // Image principale
  prix: 129.99,                    // Prix actuel
  ancienPrix: 159.99,              // Prix original
  reduction: 19,                   // Pourcentage de réduction
  note: 4.5,                       // Note moyenne
  stock: 8,                        // Stock actuel
  stockInitial: 15,                // Stock initial
  categorie: "Chaussures",         // Catégorie principale
  sousCategorie: "Running",        // Sous-catégorie
  badge: "Offre du jour",          // Badge affiché
  description: "...",              // Description
  vendeur: "Nike Store",           // Nom du vendeur
  livraison: "Prime",              // Type de livraison
  livraisonGratuite: true,         // Livraison gratuite
  dateDebut: "2024-01-01",         // Date de début
  dateFin: "2024-12-31",           // Date de fin
  heuresRestantes: 24,             // Heures restantes
  tags: ["sport", "running"],      // Tags pour le filtrage
  specifications: {                // Spécifications techniques
    couleur: "Noir/Blanc",
    taille: "42-46",
    materiau: "Mesh respirant",
    poids: "280g"
  },
  images: ["/assets/..."],         // Galerie d'images
  avis: [                          // Avis clients
    {
      note: 5,
      commentaire: "Excellent confort",
      utilisateur: "Jean D."
    }
  ]
}
```

## Composants

### DailyDealCard

Composant réutilisable pour afficher une offre avec plusieurs variantes :

- `default` : Affichage standard
- `featured` : Offre vedette avec plus de détails
- `ending-soon` : Offre qui se termine bientôt
- `compact` : Version compacte pour les widgets

**Props :**
- `deal` : Objet offre
- `variant` : Type d'affichage
- `showTimer` : Afficher le timer
- `showStock` : Afficher le stock

### DailyDealsFilters

Interface de filtrage avancée avec :

- Filtres par catégorie, prix, réduction, note
- Tri par pertinence, prix, réduction, temps restant
- Filtres rapides (moins de 50 GNF, -50% et plus, etc.)
- Compteur de filtres actifs

### DailyDealsStats

Affichage des statistiques globales :

- Nombre d'offres actives
- Réduction moyenne
- Offres qui se terminent bientôt
- Stock limité

## Pages

### OffreDuJour.jsx

Page unique qui combine :

- **Offre vedette** mise en avant en haut de page
- **Toutes les autres offres** avec filtres avancés
- **Mode grille/liste** pour l'affichage
- **Pagination** pour la navigation
- **Statistiques** et informations

## Intégration

### Dans App.jsx

```javascript
<DailyDealsProvider>
  <CommandesProvider>
    <ProductsProvider>
      {/* Routes et composants */}
    </ProductsProvider>
  </CommandesProvider>
</DailyDealsProvider>
```

### Routes

```javascript
<Route path="/offres-du-jour" element={<OffreDuJour />} />
```

### Dans Home.jsx

```javascript
<DailyDealsHomeSection />
```

## Fonctionnalités avancées

### Timer automatique

- Mise à jour toutes les heures
- Calcul en temps réel du temps restant
- Synchronisation avec localStorage

### Gestion des stocks

- Décrémentation automatique lors de l'ajout au panier
- Alertes pour stock limité
- Affichage du pourcentage de stock restant

### Filtrage intelligent

- Filtres multiples combinables
- Tri par différents critères
- Recherche par tags et catégories

### Notifications

- Intégration avec le système de notifications
- Alertes pour offres qui se terminent
- Confirmations d'ajout au panier

## Personnalisation

### Ajouter de nouvelles offres

1. Modifier le tableau `dailyDealsData` dans `DailyDealsContext.jsx`
2. Ajouter les nouvelles propriétés selon le modèle
3. Les offres seront automatiquement intégrées

### Modifier l'affichage

- Personnaliser les variantes de `DailyDealCard`
- Ajouter de nouveaux filtres dans `DailyDealsFilters`
- Modifier les statistiques dans `DailyDealsStats`

### Intégrer dans d'autres pages

```javascript
import { useDailyDeals } from '../contexts/DailyDealsContext';
import DailyDealCard from '../components/DailyDealCard';

const { dailyDeals, featuredDeal } = useDailyDeals();
```

## Performance

- Chargement asynchrone des données
- Mise en cache dans localStorage
- Optimisation des re-renders avec React.memo
- Lazy loading des images

## Sécurité

- Validation des données côté client
- Gestion des erreurs de chargement
- Protection contre les manipulations de localStorage

## Tests

Pour tester l'architecture :

1. Vérifier le chargement des offres
2. Tester les filtres et le tri
3. Vérifier la gestion des stocks
4. Tester l'ajout au panier
5. Vérifier les timers et la rotation

## Évolutions futures

- Intégration avec une API backend
- Système de notifications push
- Historique des offres
- Recommandations personnalisées
- Système de favoris
- Partage sur les réseaux sociaux 