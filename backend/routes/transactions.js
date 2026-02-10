const express = require('express');
const {pool} = require('../db');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

router.use(authenticateToken);

router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC',
            [req.user.userId]
        );
        res.json(result.rows);
    } catch (e) {
        res.status(500).json({message: 'Server error', error: e.message});
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