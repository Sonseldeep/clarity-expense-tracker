const express = require('express');
const cors = require('cors');
require('dotenv').config();
const {initDatabase} = require('./db');
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');

const app = express();

app.use(cors());
app.use(express.json());

initDatabase();

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

app.get('/api/health', (req,res) => {
    res.json({status: 'Backend is running'});
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});