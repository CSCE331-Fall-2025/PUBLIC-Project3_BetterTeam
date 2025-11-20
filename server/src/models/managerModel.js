// Need to import this if this file requires the credentials to DB
import { pool } from "../db.js";

// Simple return the employee table
export async function getAllEmployees() {
    const result = await pool.query(
        'SELECT employee_id, name, ismanager, wage FROM employee;'
    );
    return result.rows;
}

export async function getAllInventory() {
    const result = await pool.query(
        'SELECT * FROM inventory;'
    );
    return result.rows;
}

export async function getAllDishes() {
    const result = await pool.query(
        'SELECT * FROM dish;'
    );
    return result.rows;
}
