import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    name: String,
    quantity: Number,
    price: Number
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    token: { type: Number, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    guestName: { type: String, required: true },
    items: [orderItemSchema],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["received", "preparing", "ready", "served"],
      default: "received"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
