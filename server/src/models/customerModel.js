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

    async getOrdersForCustomer(customerId) {
        const res = await pool.query(
            `
            SELECT
                t.transaction_id,
                t.time,
                t.cost,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'dish_id', d.dish_id,
                            'name', d.name,
                            'price', d.price
                        )
                    ) FILTER (WHERE d.dish_id IS NOT NULL),
                    '[]'
                ) AS dishes
            FROM transaction t
            LEFT JOIN transactiondish td
                ON td.fk_transaction = t.transaction_id
            LEFT JOIN dish d
                ON d.dish_id = td.fk_dish
            WHERE t.fk_customer = $1
            GROUP BY t.transaction_id
            ORDER BY t.time DESC
            `,
            [customerId]
        );

        return res.rows;
    }
};
