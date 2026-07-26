import express from "express";
import MenuItem from "../models/MenuItem.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const items = await MenuItem.find().sort({ category: 1 });
  res.json(items);
});

export default router;
