
import dotenv from "dotenv";
import pkg from "pg";

// Add the .env variables to the process envrionemtn
dotenv.config();

// Create Database Connection Object
const { Pool } = pkg;
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});


