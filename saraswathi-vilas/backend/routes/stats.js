import express from "express";
import Order from "../models/Order.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, requireRole("staff"), async (req, res) => {
  const orders = await Order.find();
  const totalOrders = orders.length;
  const revenue = orders.reduce((sum, o) => sum + o.total, 0);
  const served = orders.filter((o) => o.status === "served").length;

  const counts = {};
  orders.forEach((o) => o.items.forEach((it) => {
    counts[it.name] = (counts[it.name] || 0) + it.quantity;
  }));
  let topItem = "—";
  let max = 0;
  for (const [name, qty] of Object.entries(counts)) {
    if (qty > max) { max = qty; topItem = name; }
  }

  res.json({ totalOrders, revenue, served, topItem });
});

export default router;
