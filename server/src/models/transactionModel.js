import { pool } from "../db.js";

export async function insertTransaction(fk_customer, fk_employee, cost) {
    const result = await pool.query(
        `INSERT INTO "transaction" (fk_customer, fk_employee, cost, "time")
        VALUES ($1, $2, $3, NOW())
        RETURNING transaction_id;`,
        [fk_customer, fk_employee, cost]
    );
    return result.rows[0].transaction_id;
}

export async function insertTransactionDish(fk_transaction, fk_dish){
    await pool.query(
        `INSERT INTO transactiondish (fk_transaction, fk_dish)
        VALUES($1, $2);`,
        [fk_transaction, fk_dish]
    );
}