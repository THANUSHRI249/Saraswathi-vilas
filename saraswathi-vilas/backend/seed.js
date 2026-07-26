import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/db.js";
import mongoose from "mongoose";
import MenuItem from "./models/MenuItem.js";
import Table from "./models/Table.js";
import User from "./models/User.js";

dotenv.config();

const menu = [
  { category: "Tiffen", nameTamil: "இட்லி", nameEnglish: "Idli (2 pcs)", description: "Soft steamed rice cakes, served with sambar & chutney", price: 40 },
  { category: "Tiffen", nameTamil: "தோசை", nameEnglish: "Plain Dosai", description: "Crisp golden rice crepe", price: 50 },
  { category: "Tiffen", nameTamil: "வடை", nameEnglish: "Medu Vadai (2 pcs)", description: "Crunchy fried lentil doughnut", price: 35 },
  { category: "Tiffen", nameTamil: "பொங்கல்", nameEnglish: "Ven Pongal", description: "Rice & moong dal, ghee, pepper-cumin", price: 45 },
  { category: "Tiffen", nameTamil: "உப்புமா", nameEnglish: "Rava Uppuma", description: "Savoury semolina, curry leaf tempering", price: 40 },
  { category: "Meals", nameTamil: "சாப்பாடு", nameEnglish: "Full Meals", description: "Rice, sambar, rasam, poriyal, curd, appalam", price: 90 },
  { category: "Meals", nameTamil: "சாம்பார் சாதம்", nameEnglish: "Sambar Rice", description: "Rice tossed in temple-style sambar", price: 60 },
  { category: "Meals", nameTamil: "தயிர் சாதம்", nameEnglish: "Curd Rice", description: "Cooling curd rice with tempering", price: 50 },
  { category: "Beverages", nameTamil: "பில்டர் காபி", nameEnglish: "Filter Coffee", description: "Fresh-brewed degree coffee", price: 25 },
  { category: "Beverages", nameTamil: "மோர்", nameEnglish: "Spiced Buttermilk", description: "Curry leaf & ginger", price: 20 },
  { category: "Beverages", nameTamil: "பால்", nameEnglish: "Hot Milk", description: "", price: 20 },
  { category: "Sweets", nameTamil: "பாயசம்", nameEnglish: "Semiya Payasam", description: "Sweet vermicelli milk pudding", price: 40 },
  { category: "Sweets", nameTamil: "ஜாங்கிரி", nameEnglish: "Jangiri", description: "Crisp, syrup-soaked sweet", price: 30 }
];

const tableCaps = [2, 2, 4, 4, 4, 6, 6, 2];

async function seed() {
  await connectDB();

  await MenuItem.deleteMany({});
  await MenuItem.insertMany(menu);
  console.log(`Seeded ${menu.length} menu items`);

  await Table.deleteMany({});
  await Table.insertMany(tableCaps.map((cap, i) => ({ number: i + 1, capacity: cap, status: "free" })));
  console.log(`Seeded ${tableCaps.length} tables`);

  const staffEmail = "staff@saraswathivilas.com";
  const existingStaff = await User.findOne({ email: staffEmail });
  if (!existingStaff) {
    const hashed = await bcrypt.hash("staff123", 10);
    await User.create({ name: "Kitchen Staff", email: staffEmail, password: hashed, role: "staff" });
    console.log(`Seeded staff login -> email: ${staffEmail} / password: staff123`);
  } else {
    console.log("Staff account already exists, skipped.");
  }

  console.log("Seeding complete.");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
