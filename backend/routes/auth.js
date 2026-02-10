const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {pool} = require('../db');
require('dotenv').config();

const router = express.Router();

router.post('/signup',async (req,res) => {
    try {
        const {email,password} = req.body;

        const userExists = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if(userExists.rows.length > 0) {
            return res.status(400).json({message: 'User already exists'});
        }
        const hashedPassword = await bcrypt.hash(password,10);

        const result = await pool.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id,email',
            [email, hashedPassword]
        );

        const user = result.rows[0];

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        );

        res.json({token,user});
    } catch(e) {
        res.status(500).json({message: 'Server error', error: e.message});
    }
});


router.post('/login', async (req,res) => {
    try {
        const {email,password} = req.body;

        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if(result.rows.length === 0) {
            return res.status(400).json({message: 'Invalid credentials'});
        }

        const user = result.rows[0];

        const passwordMatch = await bcrypt.compare(password, user.password);

        if(!passwordMatch) {
            return res.status(401).json({message: 'Invalid credentials'});
        }

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        );
        res.json({token,user: {id: user.id, email: user.email}});
    } catch(e) {
        res.status(500).json({message: 'Internal Server error', error: e.message});
    }
})

module.exports = router;