import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    token: { type: Number, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    guestName: { type: String, required: true },
    table: { type: mongoose.Schema.Types.ObjectId, ref: "Table", required: true },
    tableNumber: { type: Number, required: true },
    guests: { type: Number, required: true },
    time: { type: String, required: true },
    status: { type: String, enum: ["confirmed", "cancelled"], default: "confirmed" }
  },
  { timestamps: true }
);

export default mongoose.model("Reservation", reservationSchema);
