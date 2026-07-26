import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
  number: { type: Number, required: true, unique: true },
  capacity: { type: Number, required: true },
  status: { type: String, enum: ["free", "reserved", "occupied"], default: "free" }
});

export default mongoose.model("Table", tableSchema);
