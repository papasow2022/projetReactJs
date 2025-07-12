import React, { createContext, useContext, useState } from "react";

const CommandesContext = createContext();

const commandesInitiales = [
  {
    id: "CMD-2024-001",
    date: "2024-01-15",
    statut: "livrée",
    total: 129.99,
    produits: [
      {
        nom: "Nike Air Max 270",
        prix: 129.99,
        qte: 1,
        image: "/assets/images/product1.jpg",
        avis: null
      }
    ]
  },
  {
    id: "CMD-2024-003",
    date: "2024-01-05",
    statut: "livrée",
    total: 179.99,
    produits: [
      {
        nom: "Adidas Ultraboost 22",
        prix: 179.99,
        qte: 1,
        image: "/assets/images/product4.jpg",
        avis: {
          note: 5,
          titre: "Super confort !",
          commentaire: "Très satisfait, je recommande."
        }
      }
    ]
  }
];

export function CommandesProvider({ children }) {
  const [commandes, setCommandes] = useState(commandesInitiales);
  return (
    <CommandesContext.Provider value={{ commandes, setCommandes }}>
      {children}
    </CommandesContext.Provider>
  );
}

export function useCommandes() {
  return useContext(CommandesContext);
} 