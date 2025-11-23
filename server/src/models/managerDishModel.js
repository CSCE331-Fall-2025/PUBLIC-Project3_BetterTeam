// Need to import this if this file requires the credentials to DB
import { pool } from "../db.js";

export async function getAllDishes() {
    const result = await pool.query(
        'SELECT * FROM dish;'
    );
    return result.rows;
}