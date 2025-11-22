import { pool } from "../db.js";

export async function getInventoryForDish(dish_id){
    const result = await pool.query(
        `SELECT fk_inventory FROM dishinventory WHERE fk_dish = $1;`,
        [dish_id]
    );
    return result.rows;
}

export async function decrementInventory(inventory_id){
    await pool.query(
        `UPDATE inventory SET current_inventory = current_inventory - 1 WHERE inventory_id = $1;`,
        [inventory_id]
    );
}