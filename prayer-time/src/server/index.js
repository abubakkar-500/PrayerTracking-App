import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import axios from "axios";
import dayjs from "dayjs";
import dotenv from "dotenv";
import prayerRoutes from "./routes/prayerRoutes.js";  // 👈 import
import PrayerLog from "./models/PrayerLog.js"; // ✅ import only, don’t define here
import logsRoutes from "./routes/logs.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/prayers", prayerRoutes);
app.use("/api", logsRoutes);

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("Mongo Error:", err));

// ✅ Schema
const prayerLogSchema = new mongoose.Schema({
  prayer: String,
  action: String, // ALONE | IMAM | MISSED
  date: { type: Date, default: Date.now }
});

// const PrayerLog = mongoose.model("PrayerLog", prayerLogSchema);

// ✅ Fetch today's prayer times from Aladhan
app.get("/api/prayer-times", async (req, res) => {
  try {
    const today = dayjs().format("DD-MM-YYYY");
    const url = `https://api.aladhan.com/v1/timingsByCity/${today}?city=Karachi&country=Pakistan&method=2`;

    const { data } = await axios.get(url);
    const times = data.data.timings;

    res.json({
      fajr: times.Fajr,
      dhuhr: times.Dhuhr,
      asr: times.Asr,
      maghrib: times.Maghrib,
      isha: times.Isha,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch prayer times" });
  }
});

// ✅ Save log (when user clicks a button)
app.post("/api/logs", async (req, res) => {
  try {
    const { prayer, action } = req.body;
    const log = new PrayerLog({ prayer, action });
    await log.save();
    res.json({ message: "Log saved", log });
  } catch (err) {
    res.status(500).json({ error: "Failed to save log" });
  }
});

// ✅ Weekly Report
app.get("/api/weekly-report", async (req, res) => {
  try {
    const start = dayjs().startOf("week").toDate();
    const end = dayjs().endOf("week").toDate();

    const logs = await PrayerLog.aggregate([
      { $match: { date: { $gte: start, $lte: end } } },
      { 
        $group: {
          _id: { prayer: "$prayer", action: "$action" },
          count: { $sum: 1 }
        }
      }
    ]);

    // Structure report
    const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
    const actions = ["ALONE", "IMAM", "MISSED"];
    const report = {};

    prayers.forEach(p => {
      report[p] = { ALONE: 0, IMAM: 0, MISSED: 0 };
    });

    logs.forEach(l => {
      report[l._id.prayer][l._id.action] = l.count;
    });

    res.json(report);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch weekly report" });
  }
});
// Get weekly report
app.get("/api/prayers/report", async (req, res) => {
    try {
      const logs = await PrayerLog.aggregate([
        {
          $group: {
            _id: { prayerName: "$prayerName", status: "$status" },
            count: { $sum: 1 },
          },
        },
      ]);
      res.json(logs);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
