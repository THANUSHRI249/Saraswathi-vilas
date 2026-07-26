import express from "express";
import Table from "../models/Table.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const tables = await Table.find().sort({ number: 1 });
  res.json(tables);
});

router.patch("/:id", protect, requireRole("staff"), async (req, res) => {
  const { status } = req.body;
  if (!["free", "reserved", "occupied"].includes(status)) {
    return res.status(400).json({ message: "Invalid status." });
  }
  const table = await Table.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!table) return res.status(404).json({ message: "Table not found." });
  res.json(table);
});

export default router;
