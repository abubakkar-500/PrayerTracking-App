import express from "express";
import PrayerLog from "../models/PrayerLog.js";

const router = express.Router();

// POST: Save log
router.post("/logs", async (req, res) => {
  try {
    const { prayer, action } = req.body;

    if (!prayer || !action) {
      return res.status(400).json({ error: "Prayer and action are required" });
    }

    const log = new PrayerLog({ prayer, action });
    await log.save();

    console.log("✅ Saved Log:", log);
    res.json({ message: "Log saved", log });
  } catch (err) {
    console.error("❌ Error saving log:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET: Weekly report
router.get("/weekly-report", async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const logs = await PrayerLog.find({ date: { $gte: oneWeekAgo } });

    // Aggregate into a report
    const report = {};
    logs.forEach(log => {
      if (!report[log.prayer]) {
        report[log.prayer] = { ALONE: 0, IMAM: 0, MISSED: 0 };
      }
      report[log.prayer][log.action] += 1;
    });

    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
