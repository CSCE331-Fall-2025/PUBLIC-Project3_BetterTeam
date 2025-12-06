// Need to import this if this file requires the credentials to DB
import { pool } from "../db.js";


export async function newEmployee(name, ismanager, wage, email, password) {
    const result = await pool.query(
        'INSERT INTO employee (name, ismanager, wage, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING employee_id, name, ismanager, wage, email;',
        [name, ismanager, wage, email, password]
    );
    return result.rows[0];
}

// Simple return the employee table
export async function getAllEmployees() {
    const result = await pool.query(
        'SELECT employee_id, name, ismanager, wage, email FROM employee;'
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

export async function deleteEmployee(id){
    const client = await pool.connect();

    try{
        await client.query('BEGIN;');

        await client.query('UPDATE transaction SET fk_employee = NULL WHERE fk_employee = $1;', [id]);

        const result = await client.query(
            'DELETE FROM employee WHERE employee_id = $1 RETURNING employee_id;',
            [id]
        );
        await client.query('COMMIT;');

        return result.rows[0];
    } catch(e){
        await client.query('ROLLBACK;');
        throw e;
    } finally{
        client.release();
    }
}