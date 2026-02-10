const {Pool} = require('pg');
require('dotenv').config();

const pool = new Pool ({
    connectionString: process.env.DATABASE_URL,
});

async function initDatabase() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            `
        );

        await pool.query(`
            CREATE TABLE IF NOT EXISTS transactions (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            type VARCHAR(50) NOT NULL, -- 'income' or 'expense'
            amount   DECIMAL(10, 2) NOT NULL,
            category VARCHAR(50) NOT NULL,
            description TEXT,
            date DATE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Database table created!");
        
    } catch (e) {
        console.error("Database initialization error:", e);
    }
}

module.exports = {
    pool,
    initDatabase
};