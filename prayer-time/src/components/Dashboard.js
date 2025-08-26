import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [report, setReport] = useState([]);
  const [prayerTimes, setPrayerTimes] = useState({});

  // Fetch report from backend every 5s
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/prayers/report");
        const data = await res.json();
        setReport(data);
      } catch (err) {
        console.error("Report fetch error:", err);
      }
    };

    fetchReport();
    const interval = setInterval(fetchReport, 5000); // poll every 5s
    return () => clearInterval(interval);
  }, []);

  // Fetch prayer times from Aladhan API
  useEffect(() => {
    const fetchTimes = async () => {
      try {
        const res = await fetch(
          "https://api.aladhan.com/v1/timingsByCity?city=Karachi&country=Pakistan&method=2"
        );
        const data = await res.json();
        setPrayerTimes(data.data.timings);
      } catch (err) {
        console.error("Prayer time fetch error:", err);
      }
    };
    fetchTimes();
  }, []);

  // Reminder alerts 15 min before each prayer
  useEffect(() => {
    if (!prayerTimes) return;

    const checkReminder = () => {
      const now = new Date();
      Object.entries(prayerTimes).forEach(([name, time]) => {
        const [hours, minutes] = time.split(":").map(Number);
        const prayerDate = new Date();
        prayerDate.setHours(hours, minutes, 0, 0);

        // 15 minutes before
        const reminderTime = new Date(prayerDate.getTime() - 15 * 60000);

        if (
          now.getHours() === reminderTime.getHours() &&
          now.getMinutes() === reminderTime.getMinutes()
        ) {
          alert(`⏰ Reminder: ${name} prayer is in 15 minutes`);
        }
      });
    };

    const interval = setInterval(checkReminder, 60000); // check every 1 min
    return () => clearInterval(interval);
  }, [prayerTimes]);

  return (
    <div>
      <h2>📊 Prayer Dashboard</h2>
      <pre>{JSON.stringify(report, null, 2)}</pre>
    </div>
  );
};

export default Dashboard;
