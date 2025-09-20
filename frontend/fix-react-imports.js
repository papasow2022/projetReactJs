import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fonction pour vérifier si un fichier utilise JSX
function usesJSX(content) {
  return /return\s*\(?\s*<|return\s*<|const\s+\w+\s*=\s*\(?\s*<|const\s+\w+\s*=\s*</.test(content);
}

// Fonction pour vérifier si React est importé
function hasReactImport(content) {
  return /import\s+React\s*,?\s*{/.test(content) || /import\s+React\s+from\s+['"]react['"]/.test(content);
}

// Fonction pour ajouter l'import React
function addReactImport(content) {
  // Chercher la première ligne d'import
  const lines = content.split('\n');
  let insertIndex = 0;
  
  // Trouver où insérer l'import React
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('import ')) {
      insertIndex = i;
    } else if (lines[i].trim() === '' && insertIndex > 0) {
      break;
    }
  }
  
  // Insérer l'import React
  lines.splice(insertIndex, 0, "import React from 'react';");
  
  return lines.join('\n');
}

// Fonction pour corriger un fichier
function fixFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (usesJSX(content) && !hasReactImport(content)) {
      console.log(`🔧 Correction de: ${filePath}`);
      const fixedContent = addReactImport(content);
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Erreur avec ${filePath}:`, error.message);
    return false;
  }
}

// Fonction pour parcourir récursivement les dossiers
function walkDirectory(dir, extensions = ['.jsx', '.tsx']) {
  const files = [];
  
  function walk(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        walk(fullPath);
      } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }
  
  walk(dir);
  return files;
}

// Fonction principale
function main() {
  console.log('🔍 Recherche de fichiers JSX sans import React...\n');
  
  const srcDir = path.join(__dirname, 'src');
  const jsxFiles = walkDirectory(srcDir);
  
  let fixedCount = 0;
  
  for (const file of jsxFiles) {
    if (fixFile(file)) {
      fixedCount++;
    }
  }
  
  console.log(`\n✅ Correction terminée ! ${fixedCount} fichiers corrigés.`);
}

main();
