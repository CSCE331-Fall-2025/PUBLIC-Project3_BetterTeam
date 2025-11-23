// Need to import this if this file requires the credentials to DB
import { pool } from "../db.js";


export async function newDish(name, type, price) {
    const result = await pool.query(
        'INSERT INTO dish (name, price, type) VALUES ($1, $2, $3) RETURNING *;',
        [name, price, type]
    );
    return result.rows[0];
}

// Simple return the dish table
export async function getAllDishes() {
    const result = await pool.query(
        'SELECT dish_id, name, type, price FROM dish;'
    );
    return result.rows;
}

export async function updateDish(id, name, type, price){
    const result = await pool.query(
        'UPDATE dish SET name = $1, type = $2, price = $3 WHERE dish_id = $4 RETURNING *;',
        [name, type, price, id]
    );
    return result.rows[0];
}

export async function deleteDish(id){
    const result = await pool.query(
        'DELETE FROM dish WHERE dish_id = $1 RETURNING dish_id;',
        [id]
    );
    return result.rows[0];
}