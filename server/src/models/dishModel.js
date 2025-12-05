import { pool } from "../db.js";

export async function getAllDishes() {
    const result = await pool.query(
        `SELECT dish_id, name, price, type, image_url FROM dish;`
    );
    return result.rows;
}

export async function getDishesByType(type) {
    const result = await pool.query(
        `SELECT dish_id, name, price, type, image_url 
         FROM dish 
         WHERE LOWER(type) = LOWER($1);`,
        [type]
    );
    return result.rows;
}
