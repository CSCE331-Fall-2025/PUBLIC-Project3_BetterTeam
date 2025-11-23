// Need to import this if this file requires the credentials to DB
import { pool } from "../db.js";

export async function getAllInventory() {
    const result = await pool.query(
        'SELECT * FROM inventory;'
    );
    return result.rows;
}