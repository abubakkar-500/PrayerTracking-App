import express from "express";
import PrayerLog from "../models/PrayerLog.js";

const router = express.Router();

// ✅ Log a prayer action
router.post("/log", async (req, res) => {
  try {
    const { prayerName, status } = req.body;
    if (!prayerName || !status) {
      return res.status(400).json({ message: "Prayer name and status are required" });
    }

    const log = new PrayerLog({
      prayerName,
      status,
      date: new Date()
    });

    await log.save();
    res.json({ message: "Prayer log saved ✅", log });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Weekly report
router.get("/report", async (req, res) => {
  try {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 7);

    const logs = await PrayerLog.find({ date: { $gte: startOfWeek } });

    // Initialize report
    const report = {
      Fajr: { alone: 0, with_imam: 0, missed: 0 },
      Dhuhr: { alone: 0, with_imam: 0, missed: 0 },
      Asr: { alone: 0, with_imam: 0, missed: 0 },
      Maghrib: { alone: 0, with_imam: 0, missed: 0 },
      Isha: { alone: 0, with_imam: 0, missed: 0 },
    };

    logs.forEach((log) => {
      if (report[log.prayerName]) {
        report[log.prayerName][log.status] += 1;
      }
    });

    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
