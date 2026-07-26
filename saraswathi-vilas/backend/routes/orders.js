import express from "express";
import Order from "../models/Order.js";
import MenuItem from "../models/MenuItem.js";
import { nextToken } from "../models/Counter.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Guest places an order: { items: [{ menuItemId, quantity }] }
router.post("/", protect, requireRole("guest"), async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty." });
    }

    const resolvedItems = [];
    let total = 0;
    for (const line of items) {
      const menuItem = await MenuItem.findById(line.menuItemId);
      if (!menuItem) continue;
      const qty = Math.max(1, parseInt(line.quantity, 10) || 1);
      resolvedItems.push({
        name: `${menuItem.nameTamil} / ${menuItem.nameEnglish}`,
        quantity: qty,
        price: menuItem.price
      });
      total += menuItem.price * qty;
    }

    if (resolvedItems.length === 0) {
      return res.status(400).json({ message: "No valid items in cart." });
    }

    const token = await nextToken();
    const order = await Order.create({
      token,
      user: req.user._id,
      guestName: req.user.name,
      items: resolvedItems,
      total,
      status: "received"
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Could not place order.", error: err.message });
  }
});

router.get("/mine", protect, requireRole("guest"), async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

router.get("/", protect, requireRole("staff"), async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

const NEXT_STATUS = { received: "preparing", preparing: "ready", ready: "served" };

router.patch("/:id/advance", protect, requireRole("staff"), async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found." });
  const next = NEXT_STATUS[order.status];
  if (!next) return res.status(400).json({ message: "Order is already served." });
  order.status = next;
  await order.save();
  res.json(order);
});

export default router;
