# Images Christian Louboutin Cliquables

## Fonctionnalité Implémentée

Les images Christian Louboutin dans la page Chaussures sont maintenant **cliquables** et redirigent vers les pages de détail des produits correspondants.

## Comment ça fonctionne

### 1. Images Disponibles
Les images Christian Louboutin suivantes sont maintenant cliquables :
- `Christian Louboutin Escarpins - Noir.jpeg`
- `Christian Louboutin Heels - Noir.jpeg`
- `Christian Louboutin Heels - Noir 2.jpeg`
- `Christian Louboutin Heels - Noir 3.jpeg`
- `Christian Louboutin Heels - Noir 4.jpeg`
- `Christian Louboutin Heels - Noir 5.jpeg`

### 2. Correspondance Produit-Image
Chaque image est liée à un produit spécifique dans la base de données :
- **Christian Louboutin Escarpins** → Produit "Christian Louboutin Escarpins" (1,250,000 GNF)
- **Christian Louboutin Heels** → Produit "Christian Louboutin Heels" (1,200,000 GNF)
- **Christian Louboutin Heels - Collection Spéciale** → Produit "Christian Louboutin Heels - Collection Spéciale" (1,180,000 GNF)
- **Christian Louboutin Heels - Édition Limitée** → Produit "Christian Louboutin Heels - Édition Limitée" (1,220,000 GNF)
- **Christian Louboutin Heels - Design Exclusif** → Produit "Christian Louboutin Heels - Design Exclusif" (1,190,000 GNF)
- **Christian Louboutin Heels - Collection Premium** → Produit "Christian Louboutin Heels - Collection Premium" (1,210,000 GNF)

### 3. Fonctionnement du Clic
Quand un utilisateur clique sur une image Christian Louboutin :
1. La fonction `handleFemmeImageClick()` est déclenchée
2. La fonction `findProductForImage()` recherche le produit correspondant
3. Si un produit est trouvé, l'utilisateur est redirigé vers la page de détail du produit
4. Si aucun produit n'est trouvé, un filtre par marque est appliqué

### 4. Indicateurs Visuels
- **Curseur pointer** : Indique que l'image est cliquable
- **Effet de survol** : L'image se soulève légèrement avec une ombre
- **Message "Cliquer pour voir le produit"** : Indication claire de l'action
- **Transition fluide** : Animation douce lors du survol

## Utilisation

### Pour l'utilisateur :
1. Aller sur la page Chaussures
2. Sélectionner le genre "Femme"
3. Cliquer sur n'importe quelle image Christian Louboutin
4. Être redirigé vers la page de détail du produit correspondant

### Pour le développeur :
- Les images sont définies dans `femmeImagePaths` (lignes 99-104)
- La logique de correspondance est dans `findProductForImage()` (lignes 185-220)
- Le gestionnaire de clic est dans `handleFemmeImageClick()` (lignes 222-230)
- Les produits sont définis dans `ProductsContext.jsx`

## Avantages

✅ **Correspondance exacte** : Chaque image correspond à un produit spécifique
✅ **Navigation intuitive** : Clic direct vers la page produit
✅ **UX améliorée** : Indicateurs visuels clairs
✅ **Performance** : Recherche optimisée des produits
✅ **Maintenabilité** : Code structuré et documenté

## Test

Pour tester la fonctionnalité :
1. Démarrer l'application : `npm run dev`
2. Naviguer vers `/chaussures`
3. Sélectionner "Femme" comme genre
4. Cliquer sur une image Christian Louboutin
5. Vérifier la redirection vers la page produit correspondante 