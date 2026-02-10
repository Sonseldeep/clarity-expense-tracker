const express = require('express');
const {pool} = require('../db');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

router.use(authenticateToken);

router.get('/', async (req, res) => {
    try {
        const {category,startDate, endDate} = req.query;
        let query = 'SELECT * FROM transactions WHERE user_id = $1';
        const params = [req.user.userId];
        let paramIndex = 2;

        if(category) {
            query += ` AND category = $${paramIndex}`;
            params.push(category);
            paramIndex++;
        }
        if(startDate) {
            query += ` AND date >= $${paramIndex}`;
            params.push(startDate);
            paramIndex++;
        }
        if(endDate) {
            query += ` AND date <= $${paramIndex}`;
            params.push(endDate);
            paramIndex++;
        }
        query += ' ORDER BY date DESC';

        const result = await pool.query(query, params);
        res.json(result.rows);
        
    } catch (e) {
        res.status(500).json({message: 'Server error', error: e.message});
    }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM transactions WHERE id = $1 AND user_id = $2',
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post('/', async(req, res) => {
    try {
        const {type, amount, category, description, date} = req.body;

        if(!type || !amount || !category || !date) {
            return res.status(400).json({message: 'Missing required fields'});
        }
        const result = await pool.query(
            'INSERT INTO transactions (user_id, type, amount, category, description, date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [req.user.userId, type, amount, category, description, date]
        );
        res.status(201).json(result.rows[0]);

    } catch(e) {
        res.status(500).json({message: 'Server error', error: e.message});
    }
});

router.put('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const {type, amount, category, description, date} = req.body;

        const result = await pool.query(
            'UPDATE transactions SET type = $1, amount = $2, category = $3, description = $4, date = $5 WHERE id = $6 AND user_id = $7 RETURNING *',
            [type, amount, category, description, date, id, req.user.userId]
        );

        if(result.rows.length === 0) {
            return res.status(404).json({message: 'Transaction not found'});
        }
        res.json(result.rows[0]);
    } catch(e) {
        res.status(500).json({message: 'Server error', error: e.message});
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const result = await pool.query(
            'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING id',
            [id, req.user.userId]
        );
        if(result.rows.length === 0) {
            return res.status(404).json({message: 'Transaction not found'});
        }
        res.json({message: 'Transaction deleted successfully'});
    } catch(e) {
        res.status(500).json({message: 'Server error', error: e.message});
    }
});

module.exports = router;