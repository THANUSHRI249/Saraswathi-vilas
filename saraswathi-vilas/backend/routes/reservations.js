import express from "express";
import Reservation from "../models/Reservation.js";
import Table from "../models/Table.js";
import { nextToken } from "../models/Counter.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, requireRole("guest"), async (req, res) => {
  try {
    const { tableId, guests, time } = req.body;
    const table = await Table.findById(tableId);
    if (!table) return res.status(404).json({ message: "Table not found." });
    if (table.status !== "free") {
      return res.status(409).json({ message: "That table is no longer free. Please pick another." });
    }

    const token = await nextToken();
    const reservation = await Reservation.create({
      token,
      user: req.user._id,
      guestName: req.user.name,
      table: table._id,
      tableNumber: table.number,
      guests,
      time,
      status: "confirmed"
    });

    table.status = "reserved";
    await table.save();

    res.status(201).json(reservation);
  } catch (err) {
    res.status(500).json({ message: "Could not confirm reservation.", error: err.message });
  }
});

router.get("/mine", protect, requireRole("guest"), async (req, res) => {
  const reservations = await Reservation.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(reservations);
});

router.get("/", protect, requireRole("staff"), async (req, res) => {
  const reservations = await Reservation.find().sort({ createdAt: -1 });
  res.json(reservations);
});

export default router;
