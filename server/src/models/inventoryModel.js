import { pool } from "../db.js";

export async function getInventoryForDish(dish_id){
    const result = await pool.query(
        `SELECT fk_inventory FROM dishinventory WHERE fk_dish = $1;`,
        [dish_id]
    );
    return result.rows;
}

export async function getIngredientsForDish(dish_id){
    const result = await pool.query(
        `SELECT i.inventory_id, i.item, i.current_inventory FROM dishinventory di JOIN inventory i ON di.fk_inventory = i.inventory_id WHERE di.fk_dish = $1;`,
        [dish_id]
    );
    return result.rows;
}

export async function decrementInventory(inventory_id, amount = 1){
    await pool.query(
        `UPDATE inventory SET current_inventory = current_inventory - $2 WHERE inventory_id = $1;`,
        [inventory_id, amount]
    );
}

export async function getInventoryItemById(id) {
    const result = await pool.query(
        `SELECT inventory_id, item, current_inventory
         FROM inventory
         WHERE inventory_id = $1`,
        [id]
    );

    return result.rows[0];
}
