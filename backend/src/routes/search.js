import { Router } from "express";

const router = Router();

// Very simple search over in-memory data shared with products route
// To keep things simple, duplicate small dataset here
const products = [
  {
    id: "cl-escarpins-noir-001",
    name: "Christian Louboutin Escarpins",
    category: "Chaussures",
    description: "Escarpins Christian Louboutin en cuir noir avec semelle rouge signature."
  },
  {
    id: "cl-heels-classic-002",
    name: "Christian Louboutin Heels - Classic",
    category: "Chaussures",
    description: "Talons hauts Christian Louboutin classiques en cuir noir."
  }
];

router.get("/", (req, res) => {
  const q = String(req.query.q || "").toLowerCase();
  if (!q) return res.json([]);
  const out = products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    (p.description && p.description.toLowerCase().includes(q))
  );
  res.json(out);
});

export default router;

