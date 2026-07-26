import mongoose from "mongoose";

// Simple shared counter so order & reservation tokens feel like one
// continuous "token board" the way a real tiffen room hands out tokens.
const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  value: { type: Number, default: 20 }
});

const Counter = mongoose.model("Counter", counterSchema);

export async function nextToken() {
  const c = await Counter.findOneAndUpdate(
    { name: "token" },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );
  return c.value;
}
