import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import "./App.css";

const API = import.meta.env.VITE_API_URL || "prayer-tracking-app-backend.vercel.app";

const PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

export default function App() {
  const [times, setTimes] = useState({});
  const [report, setReport] = useState({});
  const [now, setNow] = useState(dayjs().format("HH:mm:ss"));
  const [reminderSet, setReminderSet] = useState(false);

  // Fetch times on mount
  useEffect(() => {
    axios.get(`${API}/api/prayer-times`).then((res) => setTimes(res.data));
    fetchReport();
  }, []);

  // Update digital clock
  useEffect(() => {
    const timer = setInterval(() => setNow(dayjs().format("HH:mm:ss")), 1000);
    return () => clearInterval(timer);
  }, []);

  // Set prayer reminders (once per day)
  useEffect(() => {
    if (!times || reminderSet) return;

    Object.entries(times).forEach(([prayer, time]) => {
      const reminderTime = dayjs(time, "HH:mm").subtract(15, "minute");
      const diff = reminderTime.diff(dayjs(), "millisecond");

      if (diff > 0) {
        setTimeout(() => {
          alert(`⏰ Reminder: ${prayer} in 15 minutes`);
        }, diff);
      }
    });

    setReminderSet(true);
  }, [times, reminderSet]);

  // Log a prayer action
  const logPrayer = (prayer, action) => {
    axios.post(`${API}/api/logs`, { prayer, action }).then(() => {
      fetchReport();
    });
  };

  // Fetch weekly report
  const fetchReport = () => {
    axios.get(`${API}/api/weekly-report`).then((res) => setReport(res.data));
  };

  return (
    <div className="app-container">
      <h2>🕌 Prayer Tracker</h2>
      <h3>Current Time: {now}</h3>

      <h3>Today's Prayers</h3>
      {Object.entries(times).map(([prayer, time]) => (
        <div key={prayer} style={{ margin: "10px 0" }}>
          <strong>
            {prayer}: {time}
          </strong>{" "}
          <button onClick={() => logPrayer(prayer, "ALONE")}>✅ Alone</button>
          <button onClick={() => logPrayer(prayer, "IMAM")}>🕌 Imam</button>
          <button onClick={() => logPrayer(prayer, "MISSED")}>❌ Missed</button>
        </div>
      ))}

      <h3>📊 Monthly Report</h3>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Prayer</th>
            <th>Alone</th>
            <th>With Imam</th>
            <th>Missed</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(report).map(([prayer, stats]) => (
            <tr key={prayer}>
              <td>{prayer}</td>
              <td>{stats.ALONE || 0}</td>
              <td>{stats.IMAM || 0}</td>
              <td>{stats.MISSED || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}
