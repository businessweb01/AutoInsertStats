// index.js
import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import routes from './express.js';
import './db.js'; // ensure DB connection is checked on startup

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  startSelfPingLoop(`http://localhost:${PORT}`);
});

// 🔁 Self-ping every 8 hours to insert online rider stat
function startSelfPingLoop(baseUrl) {
  const INTERVAL = 8 * 60 * 60 * 1000; // 8 hours

  const ping = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/generate-daily-stat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      console.log('[✔] Stat inserted:', data);
    } catch (err) {
      console.error('[✖] Self-ping error:', err.message);
    }

    setTimeout(ping, INTERVAL);
  };

  ping(); // initial trigger
}
