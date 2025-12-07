// Need to import this if this file requires the credentials to DB
import { pool } from "../db.js";

export async function getXReport() {
    const client = await pool.connect();

    try{
        await client.query('BEGIN;');

        const result = await client.query(
            'SELECT EXTRACT(HOUR FROM t.time) AS hour_of_day, COUNT(t.transaction_id) as total_transactions, SUM(t.cost) AS total_sales FROM transaction t WHERE t.is_closed = FALSE GROUP BY hour_of_day ORDER BY hour_of_day;'
        );

        await client.query('COMMIT;');

        return result.rows;
    } catch(e){
        await client.query('ROLLBACK;');
        throw e;
    } finally{
        client.release();
    }
}

export async function getZReport(managerId) {
    const client = await pool.connect();

    try{
        await client.query('BEGIN;');

        const totalResult = await client.query('SELECT COALESCE(SUM(t.cost), 0) AS total_revenue, COUNT(t.transaction_id) AS transaction_count FROM transaction t WHERE t.is_closed = FALSE;');
        
        const { total_revenue, transaction_count } = totalResult.rows[0];

        const insertResult = await client.query('INSERT INTO dailyreports (report_date, total_revenue, transaction_count, closing_time, fk_employee) VALUES (CURRENT_DATE, $1, $2, NOW(), $3) RETURNING *;',
            [total_revenue, transaction_count, managerId]
        );

        await client.query('UPDATE transaction SET is_closed = TRUE WHERE is_closed = FALSE;');

        await client.query('COMMIT;');

        return insertResult.rows[0];

    } catch(e){
        await client.query('ROLLBACK;');
        throw e;
    } finally{
        client.release();
    }
}

export async function getDailyReportDates() {
    const result = await pool.query(
        'SELECT report_date::text from dailyreports ORDER BY report_date DESC;'
    );
    return result.rows.map(d => d.report_date.slice(0, 10));
}

export async function getDailyReportByDate(date) {
    const result = await pool.query(
        'SELECT dr.report_date::text, dr.total_revenue, dr.transaction_count, e.name as manager_name FROM dailyreports dr JOIN employee e ON dr.fk_employee = e.employee_id WHERE dr.report_date = $1;',
        [date]
    );
    return result.rows[0];
}