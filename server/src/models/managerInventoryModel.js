// Need to import this if this file requires the credentials to DB
import { pool } from "../db.js";


export async function newInventory(item, current_inventory, target_inventory) {
    const result = await pool.query(
        'INSERT INTO inventory (item, current_inventory, target_inventory) VALUES ($1, $2, $3) RETURNING *;',
        [item, current_inventory, target_inventory]
    );
    return result.rows[0];
}

// Simple return the inventory table
export async function getAllInventory() {
    const result = await pool.query(
        'SELECT inventory_id, item, current_inventory, target_inventory FROM inventory;'
    );
    return result.rows;
}

export async function updateInventory(id, item, current_inventory, target_inventory){
    const result = await pool.query(
        'UPDATE inventory SET item = $1, current_inventory = $2, target_inventory = $3 WHERE inventory_id = $4 RETURNING *;',
        [item, current_inventory, target_inventory, id]
    );
    return result.rows[0];
}

export async function deleteInventory(id){
    const result = await pool.query(
        'DELETE FROM inventory WHERE inventory_id = $1 RETURNING inventory_id;',
        [id]
    );
    return result.rows[0];
}