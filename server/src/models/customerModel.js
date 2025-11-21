import { pool } from "../db.js";

export async function getAllDishes(){
    const result = await pool.query(
        `SELECT name, price, type FROM dish;`
    );
    return result.rows;
}

export async function getDishesByType(type){
    const result = await pool.query(
        `SELECT name, price, type FROM dish WHERE LOWER(type) = LOWER($1);`,
        [type]
    );
    return result.rows;
}
