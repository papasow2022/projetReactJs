import { Router } from "express";
import { readJson, writeJson } from "../utils/storage.js";

const router = Router();

// Data shape: { [vendorId: string]: Product[] }
const FILE = "vendorsProducts.json";

function sanitizeProductInput(input) {
  const product = { ...input };
  // Drop very large base64 images to keep payload/database small
  const maxDataUrlLength = 250000; // ~250KB
  if (typeof product.image === "string" && product.image.startsWith("data:")) {
    if (product.image.length > maxDataUrlLength) product.image = null;
  }
  if (Array.isArray(product.images)) {
    product.images = product.images
      .slice(0, 4)
      .map(img => (typeof img === "string" && img.startsWith("data:") && img.length > maxDataUrlLength ? null : img))
      .filter(Boolean);
  }
  if (typeof product.description === "string") {
    product.description = product.description.slice(0, 1000);
  }
  return product;
}

router.get("/:vendorId/products", async (req, res) => {
  const vendorId = req.params.vendorId;
  const all = await readJson(FILE, {});
  const list = Array.isArray(all[vendorId]) ? all[vendorId] : [];
  res.json(list);
});

router.post("/:vendorId/products", async (req, res) => {
  const vendorId = req.params.vendorId;
  const body = req.body || {};
  if (!body || !body.name) {
    return res.status(400).json({ error: "Missing product name" });
  }
  const all = await readJson(FILE, {});
  if (!Array.isArray(all[vendorId])) all[vendorId] = [];

  const sanitized = sanitizeProductInput(body);
  const newProduct = {
    id: sanitized.id || `${vendorId}-${Date.now()}`,
    status: sanitized.status || "pending",
    rating: sanitized.rating || 0,
    sales: sanitized.sales || 0,
    submittedAt: new Date().toISOString(),
    vendorId,
    vendor: sanitized.vendor || sanitized.sellerName || "Vendeur",
    ...sanitized,
  };
  all[vendorId].push(newProduct);
  await writeJson(FILE, all);
  res.status(201).json(newProduct);
});

export default router;

