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

export async function updateEmployee(id, name, ismanager, wage){
    const result = await pool.query(
        'UPDATE employee SET name = $1, ismanager = $2, wage = $3 WHERE employee_id = $4 RETURNING *;',
        [name, ismanager, wage, id]
    );
    return result.rows[0];
}