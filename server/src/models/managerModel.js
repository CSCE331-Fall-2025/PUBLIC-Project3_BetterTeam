// Need to import this if this file requires the credentials to DB
import { pool } from "../db.js";

export async function getXReport() {
    const result = await pool.query(
        'SELECT EXTRACT(HOUR FROM t.time) AS hour_of_day, COUNT(t.transaction_id) as total_transactions, SUM(t.cost) AS total_sales FROM transaction t WHERE t.is_closed = FALSE GROUP BY hour_of_day ORDER BY hour_of_day;'
    );
    return result.rows;
}

export async function getZReport() {
    const client = await pool.connect();

    try{
        await client.query('BEGIN;');

        const totalResult = await client.query('SELECT COALESCE(SUM(t.cost), 0) AS total_revenue, COUNT(t.transaction_id) AS transaction_count FROM transaction t WHERE t.is_closed = FALSE;');
        
        const { total_revenue, transaction_count } = totalResult.rows[0];

        const insertResult = await client.query('INSERT INTO dailyreports (report_date, total_revenue, transaction_count, closing_time) VALUES (CURRENT_DATE, $1, $2, NOW()) RETURNING *;',
            [total_revenue, transaction_count]
        );

        await client.query('UPDATE transaction SET is_closed = TRUE WHERE is_closed = FALSE;');

        await client.query('COMMIT;');

        return insertResult.rows[0];

    }catch(e){
        await client.query('ROLLBACK;');
        throw e;
    } finally{
        client.release();
    }
}
