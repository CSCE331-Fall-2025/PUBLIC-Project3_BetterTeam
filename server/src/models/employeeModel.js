import { pool } from "../db.js";
import bcrypt from "bcrypt";

export const EmployeeModel = {
    async getEmployeeById(id) {
        const res = await pool.query(
            `SELECT employee_id, name, email
             FROM employee WHERE employee_id = $1`,
            [id]
        );
        return res.rows[0];
    },

    async updateEmployee(id, { name, email, password }) {
        const existing = await pool.query(
            `SELECT password FROM employee WHERE employee_id = $1`,
            [id]
        );

        if (existing.rows.length === 0) return null;

        const res = await pool.query(
            `UPDATE employee 
             SET name=$1, email=$2, password=$3
             WHERE employee_id=$4
             RETURNING employee_id, name, email`,
            [name, email, password, id]
        );

        return res.rows[0];
    },

    async getOrdersForEmployee(id) {
        const res = await pool.query(
            `SELECT t.transaction_id, t.time, t.cost
             FROM transaction t
             WHERE t.fk_employee = $1
             ORDER BY t.time DESC`,
            [id]
        );
        return res.rows;
    }
};
