import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mapping des noms de fichiers vers des noms plus appropriés pour garçons
const renameMappings = {
  // Gucci Blanc
  'Guccienfantblanc': {
    'Gucci - Toddler Ace sneaker.jpeg': 'gucci-ace-toddler-blanc.jpeg',
    'Zapatos niños (1).jpeg': 'gucci-sneakers-blanches-garcon-1.jpeg',
    'Gucci White Leather Sneakers Boys _ SS23.jpeg': 'gucci-sneakers-cuir-blanc-garcon-ss23.jpeg',
    'Zapatos niños.jpeg': 'gucci-sneakers-blanches-garcon-2.jpeg',
    'Designer Luxury Toddler Sneakers  _ GUCCI® US.jpeg': 'gucci-sneakers-luxury-toddler-blanc.jpeg',
    'Gucci - Toddler sneaker with Interlocking G (1).jpeg': 'gucci-sneakers-interlocking-g-toddler-blanc-1.jpeg',
    'Gucci - Children\'s sneaker with Interlocking G.jpeg': 'gucci-sneakers-interlocking-g-enfant-blanc.jpeg',
    'Gucci - Toddler sneaker with Interlocking G.jpeg': 'gucci-sneakers-interlocking-g-toddler-blanc-2.jpeg'
  },
  
  // Gucci Noir
  'Guccienfantnoire': {
    'GUCCI® US Official Site _ Redefining Luxury Fashion.jpeg': 'gucci-sneakers-luxury-noir-garcon.jpeg',
    'Gucci - Toddler Ace sneaker.jpeg': 'gucci-ace-toddler-noir.jpeg',
    'Gucci - Toddler sneaker with Web (1).jpeg': 'gucci-sneakers-web-toddler-noir-1.jpeg',
    'Gucci - Toddler sneaker with Web.jpeg': 'gucci-sneakers-web-toddler-noir-2.jpeg',
    'Gucci Baby Clothes _ Designer Baby Clothes  _ GUCCI® US.jpeg': 'gucci-sneakers-baby-noir-garcon.jpeg',
    'Gucci Black Leather Loafer Shoes With Green & Red Striped Web.jpeg': 'gucci-loafer-cuir-noir-web-vert-rouge.jpeg',
    'Gucci Kids\' Fashion _ Childrensalon.jpeg': 'gucci-sneakers-kids-fashion-noir.jpeg',
    'a996ad0f-2a08-4bfc-bb60-a08e45e35d75.jpeg': 'gucci-sneakers-noir-garcon-1.jpeg'
  },
  
  // Gucci Multicolore
  'Guccimulticoloreenfant': {
    '25f229c6-971e-499f-b969-8376dee3a183.jpeg': 'gucci-sneakers-multicolore-garcon-1.jpeg',
    'Designer Luxury Baby Shoes & Sneakers For Toddlers  _ GUCCI® US.jpeg': 'gucci-sneakers-luxury-baby-multicolore.jpeg',
    'Designer Luxury Toddler Sneakers _ GUCCI® US (1).jpeg': 'gucci-sneakers-luxury-toddler-multicolore-1.jpeg',
    'Designer Luxury Toddler Sneakers _ GUCCI® US.jpeg': 'gucci-sneakers-luxury-toddler-multicolore-2.jpeg',
    'GG leather-trimmed sneakers in multicoloured - Gucci Kids _ Mytheresa.jpeg': 'gucci-sneakers-gg-cuir-multicolore.jpeg',
    'Gucci - Children\'s Ace sneaker (1).jpeg': 'gucci-ace-enfant-multicolore-1.jpeg',
    'Gucci - Children\'s Ace sneaker.jpeg': 'gucci-ace-enfant-multicolore-2.jpeg',
    'Gucci - Teen Ace sneaker.jpeg': 'gucci-ace-teen-multicolore.jpeg',
    'Gucci - Toddler Ace sneaker.jpeg': 'gucci-ace-toddler-multicolore.jpeg'
  },
  
  // Jordan Noir
  'Jordannoireenfant': {
    '094e1afc-d3b9-4e89-92b2-67c231089775.jpeg': 'jordan-sneakers-noir-garcon-1.jpeg',
    '3ceaa4a3-a4c1-46a3-ae7b-f32ce8bbfe39.jpeg': 'jordan-sneakers-noir-garcon-2.jpeg',
    '5b3d6901-5570-4a79-a0dc-059794943482.jpeg': 'jordan-sneakers-noir-garcon-3.jpeg',
    '9d198677-2a99-4a0f-ad7e-4f8b3eb6f7a1.jpeg': 'jordan-sneakers-noir-garcon-4.jpeg',
    'Jordan True Flight Baby_Toddler Shoes (Black).jpeg': 'jordan-true-flight-baby-noir.jpeg',
    'Jordan True Flight Baby_Toddler Shoes.jpeg': 'jordan-true-flight-toddler-noir.jpeg',
    'Luxury fashion & independent designers _ SSENSE.jpeg': 'jordan-sneakers-luxury-noir-garcon.jpeg',
    'NIKE AIR JORDAN Retro 13 XIII red and black.jpeg': 'jordan-retro-13-rouge-noir-garcon.jpeg',
    'Nike Boys\' Toddler Jordan Jumpman Pro Basketball Shoes.jpeg': 'jordan-jumpman-pro-basketball-garcon.jpeg',
    'e6685760-cc33-43e6-aee0-1bfcffe7c4f7.jpeg': 'jordan-sneakers-noir-garcon-5.jpeg',
    'f7205549-60d0-43d8-b0c6-6cd330bfb00d.jpeg': 'jordan-sneakers-noir-garcon-6.jpeg'
  },
  
  // Nike Blanc
  'Nikeenfantblanc': {
    '0fc099dc-c03e-4bc3-a6a3-13f6bfcabd1a.jpeg': 'nike-sneakers-blanc-garcon-1.jpeg',
    '108a4919-4d1a-4b1e-ab6b-bef9c655a9e0.jpeg': 'nike-sneakers-blanc-garcon-2.jpeg',
    'Babies & Toddlers (0-3 yrs) Girls Shoes_ Nike.com.jpg': 'nike-sneakers-baby-blanc-garcon-1.jpg',
    'Babies & Toddlers (0-3 yrs) Kids Shoes_ Nike.com (1).jpg': 'nike-sneakers-baby-blanc-garcon-2.jpg',
    'Babies & Toddlers (0-3 yrs) Kids Shoes_ Nike.com.jpg': 'nike-sneakers-baby-blanc-garcon-3.jpg',
    'Hibbett _ City Gear.jpeg': 'nike-sneakers-city-gear-blanc-garcon.jpeg',
    'Nike Sportswear FORCE 1 EASYON UNISEX - Baskets montantes - white.jpeg': 'nike-force-1-easyon-blanc-garcon.jpeg',
    'White Nike Air Force 1 Infant\'s - JD Sports.jpeg': 'nike-air-force-1-infant-blanc-garcon.jpeg'
  },
  
  // Nike Couleur/Noir
  'Nikeenfantcouleurnoire': {
    '0e7a2dc3-bf35-4106-ada2-43f81c6739ad.jpeg': 'nike-sneakers-couleur-garcon-1.jpeg',
    '19de2917-af3b-4202-bbf2-20128cbd7c77.jpeg': 'nike-sneakers-couleur-garcon-2.jpeg',
    '1fb575c3-00f3-4aab-afc4-fc5cd5f2d6c3.jpeg': 'nike-sneakers-couleur-garcon-3.jpeg',
    '4aef2ff3-bb0c-402a-906a-e003cdb90564.jpeg': 'nike-sneakers-couleur-garcon-4.jpeg',
    '626ae2b8-2074-4bd6-b0bc-64ff48c2dad6.jpeg': 'nike-sneakers-couleur-garcon-5.jpeg',
    '6667dbe0-f4aa-45d5-b44d-a4eade43417b.jpeg': 'nike-sneakers-couleur-garcon-6.jpeg',
    '8db68617-f20f-4879-9f68-78582b87d0e2.jpeg': 'nike-sneakers-couleur-garcon-7.jpeg',
    'Air Jordan 4 "Royalty" Releasing In Full Family Sizes - mini_licious by wendy lam.jpeg': 'jordan-4-royalty-garcon.jpeg',
    'Babies & Toddlers (0-3 yrs) Girls Shoes_ Nike.com.jpg': 'nike-sneakers-baby-couleur-garcon-1.jpg',
    'Babies & Toddlers (0-3 yrs) Kids Shoes_ Nike.com.jpg': 'nike-sneakers-baby-couleur-garcon-2.jpg',
    'Nike Sportswear Force 1 06 Toddlers TD.jpeg': 'nike-force-1-06-toddler-garcon.jpeg',
    'The volt detailing really pops on these ADORABLE mini Air Max 95s! Are you grabbing a pair for the minis_ Hit the link in bio to purchase_….jpeg': 'nike-air-max-95-mini-volt-garcon.jpeg',
    'intéresser par une customisation de chaussure 👟 envoie moi un message ✅.jpeg': 'nike-sneakers-custom-garcon.jpeg'
  },
  
  // Nike Rose (pour filles mais on peut les renommer pour garçons aussi)
  'Nikeenfantrose': {
    '2b694e44-4f75-4b5c-acbe-0c0eecf8d865.jpeg': 'nike-sneakers-rose-garcon-1.jpeg',
    '320c8356-15d2-47b0-8438-e0460c4a7db2.jpeg': 'nike-sneakers-rose-garcon-2.jpeg',
    '44529196-0ea2-4fcb-b8c5-d390ab45dec0.jpeg': 'nike-sneakers-rose-garcon-3.jpeg',
    '4acec619-410d-4b7b-97c3-c86ae15b8e2e.jpeg': 'nike-sneakers-rose-garcon-4.jpeg',
    '60702763-d7a4-4dc8-bffc-c70985b13687.jpeg': 'nike-sneakers-rose-garcon-5.jpeg',
    'Cutest toddler shoes ever!.jpeg': 'nike-sneakers-toddler-rose-garcon.jpeg',
    'bb25446d-a04a-4470-bcb3-7c4ad97b3777.jpeg': 'nike-sneakers-rose-garcon-6.jpeg',
    'c05822ea-2a74-44da-8f98-84e70686cf83.jpeg': 'nike-sneakers-rose-garcon-7.jpeg',
    'c3f67e2e-d119-4fba-86cb-adfbb747a909.jpeg': 'nike-sneakers-rose-garcon-8.jpeg',
    'f9087430-2d8b-473d-a831-7fb0edb3cccb.jpeg': 'nike-sneakers-rose-garcon-9.jpeg'
  }
};

async function renameImages() {
  const projectRoot = path.resolve(__dirname, '../../../');
  const enfantDir = path.join(projectRoot, 'public', 'chaussures', 'enfant');
  
  console.log('🔄 Début du renommage des images enfant...');
  console.log('📁 Dossier source:', enfantDir);
  
  let totalRenamed = 0;
  let totalErrors = 0;
  
  // Parcourir chaque dossier de marque
  for (const [folderName, fileMappings] of Object.entries(renameMappings)) {
    const brandDir = path.join(enfantDir, folderName);
    
    if (!fs.existsSync(brandDir)) {
      console.log(`⚠️  Dossier non trouvé: ${folderName}`);
      continue;
    }
    
    console.log(`\n📂 Traitement du dossier: ${folderName}`);
    
    // Parcourir chaque mapping de fichier
    for (const [oldName, newName] of Object.entries(fileMappings)) {
      const oldPath = path.join(brandDir, oldName);
      const newPath = path.join(brandDir, newName);
      
      try {
        if (fs.existsSync(oldPath)) {
          // Vérifier si le nouveau nom existe déjà
          if (fs.existsSync(newPath)) {
            console.log(`⚠️  Le fichier ${newName} existe déjà, suppression de l'ancien...`);
            fs.unlinkSync(oldPath);
          } else {
            // Renommer le fichier
            fs.renameSync(oldPath, newPath);
            console.log(`✅ ${oldName} → ${newName}`);
            totalRenamed++;
          }
        } else {
          console.log(`⚠️  Fichier non trouvé: ${oldName}`);
        }
      } catch (error) {
        console.error(`❌ Erreur lors du renommage de ${oldName}:`, error.message);
        totalErrors++;
      }
    }
  }
  
  console.log(`\n🎉 Renommage terminé!`);
  console.log(`✅ ${totalRenamed} fichiers renommés`);
  console.log(`❌ ${totalErrors} erreurs`);
  
  return { totalRenamed, totalErrors };
}

// Exécuter le script
renameImages().catch(console.error);