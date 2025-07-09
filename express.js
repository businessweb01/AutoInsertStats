// express.js
import express from 'express';
import { pool } from './db.js';

const router = express.Router();

router.post('/generate-daily-stat', async (req, res) => {
  try {
    const [[{ count }]] = await pool.query(
      'SELECT COUNT(*) AS count FROM riders WHERE isOnline = 1'
    );

    const [[last]] = await pool.query(
      'SELECT ors_id FROM onlineRiderStats ORDER BY date_inserted DESC LIMIT 1'
    );

    const year = new Date().getFullYear();
    let sequence = 1;

    if (last?.ors_id) {
      const lastSeq = parseInt(last.ors_id.slice(7));
      sequence = lastSeq + 1;
    }

    const ors_id = `ORS${year}${String(sequence).padStart(4, '0')}`;

    await pool.query(
      'INSERT INTO onlineRiderStats (ors_id, onlineCount, date_inserted) VALUES (?, ?, NOW())',
      [ors_id, count]
    );

    res.json({ message: 'Inserted', ors_id, onlineCount: count });
  } catch (err) {
    res.status(500).json({ message: 'Insert failed', error: err.message });
  }
});

export default router;
