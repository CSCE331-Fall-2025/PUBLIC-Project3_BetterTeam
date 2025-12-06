import { pool } from "../db.js";
import bcrypt from "bcrypt";

export const CustomerModel = {
    async getCustomerById(id) {
        const res = await pool.query(
            `SELECT customer_id, name, email, username
             FROM customer WHERE customer_id = $1`,
            [id]
        );
        return res.rows[0];
    },

    async updateCustomer(id, { name, email, username, password }) {
        const existing = await pool.query(
            `SELECT password FROM customer WHERE customer_id = $1`,
            [id]
        );

        if (existing.rows.length === 0) return null;

        const res = await pool.query(
            `UPDATE customer 
             SET name=$1, email=$2, username=$3, password=$4
             WHERE customer_id=$5
             RETURNING customer_id, name, email, username`,
            [name, email, username, password, id]
        );

        return res.rows[0];
    },

    async getOrdersForCustomer(id) {
        const res = await pool.query(
            `SELECT t.transaction_id, t.time, t.cost
             FROM transaction t
             WHERE t.fk_customer = $1
             ORDER BY t.time DESC`,
            [id]
        );
        return res.rows;
    }
};
