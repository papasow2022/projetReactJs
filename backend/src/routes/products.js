import { Router } from "express";

const router = Router();

// In-memory mock products for fast backend enablement
const products = [
  {
    id: "cl-escarpins-noir-001",
    name: "Christian Louboutin Escarpins",
    image: "/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Escarpins.jpeg",
    price: 1250000,
    brand: "Christian Louboutin",
    category: "Chaussures",
    subcategory: "femme",
    rating: 4.8,
    reviewCount: 12,
    vendor: "Boutique",
    vendorId: "christian-louboutin",
    stock: 3,
    description: "Escarpins Christian Louboutin en cuir noir avec semelle rouge signature."
  },
  {
    id: "cl-heels-classic-002",
    name: "Christian Louboutin Heels - Classic",
    image: "/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Classic.jpeg",
    price: 1200000,
    brand: "Christian Louboutin",
    category: "Chaussures",
    subcategory: "femme",
    rating: 4.7,
    reviewCount: 8,
    vendor: "Boutique",
    vendorId: "christian-louboutin",
    stock: 2,
    description: "Talons hauts Christian Louboutin classiques en cuir noir."
  }
];

router.get("/", (req, res) => {
  res.json(products);
});

router.get("/:id", (req, res) => {
  const found = products.find(p => p.id === req.params.id);
  if (!found) return res.status(404).json({ error: "Not found" });
  res.json(found);
});

export default router;

