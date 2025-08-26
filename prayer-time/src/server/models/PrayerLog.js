import mongoose from "mongoose";

const prayerLogSchema = new mongoose.Schema({
  prayer: { type: String, required: true },
  action: { type: String, enum: ["ALONE", "IMAM", "MISSED"], required: true },
  date: { type: Date, default: Date.now },
});

// ✅ Prevent OverwriteModelError
const PrayerLog =
  mongoose.models.PrayerLog || mongoose.model("PrayerLog", prayerLogSchema);

export default PrayerLog;
