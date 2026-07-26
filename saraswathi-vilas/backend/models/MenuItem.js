import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  category: { type: String, required: true },
  nameTamil: { type: String, required: true },
  nameEnglish: { type: String, required: true },
  description: { type: String, default: "" },
  price: { type: Number, required: true },
  isVeg: { type: Boolean, default: true }
});

export default mongoose.model("MenuItem", menuItemSchema);
