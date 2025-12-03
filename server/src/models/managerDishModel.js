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
    await pool.query(
        'DELETE FROM transactiondish WHERE fk_dish = $1;',
        [id]
    );
    await pool.query(
        'DELETE FROM dishinventory WHERE fk_dish = $1;',
        [id]
    );
    const result = await pool.query(
        'DELETE FROM dish WHERE dish_id = $1 RETURNING dish_id;',
        [id]
    );
    return result.rows[0];
}

export async function getDishInventory() {
    const result = await pool.query(
        'SELECT fk_dish, fk_inventory FROM dishinventory;'
    );
    return result.rows;
}

const formatDishInventoryInsert = (dishId, inventoryIds) => {
    if(inventoryIds.length === 0) return null;

    const values = inventoryIds.map((_, index) => 
    `($1, $${index + 2})`
    ).join(', ');

    const params = [dishId, ...inventoryIds];

    return{
        query: `INSERT INTO dishinventory (fk_dish, fk_inventory) VALUES ${values};`,
        params: params
    };
};

export async function updateDishInventory(dishId, inventoryIds) {
    const client = await pool.connect();

    try{
        await client.query('BEGIN');

        await client.query('DELETE FROM dishinventory WHERE fk_dish = $1;', [dishId]);

        if(inventoryIds && inventoryIds.length > 0) {
            const insertData = formatDishInventoryInsert(dishId, inventoryIds);
            await client.query(insertData.query, insertData.params);
        }

        await client.query('COMMIT');

        return{success: true};
    } catch(e){
        await client.query('ROLLBACK');
        throw e;
    } finally{
        client.release();
    }
}