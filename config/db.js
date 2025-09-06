import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config(); // Load .env variables

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test connection
pool.connect()
  .then(() => console.log('PostgreSQL connected'))
  .catch(err => console.error('DB connection error:', err));

export default pool;
