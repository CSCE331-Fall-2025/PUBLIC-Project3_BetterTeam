import { pool } from "../db.js";

export async function createUser(email, hashedPassword, name = null) {
	// If name not provided, extract from email (part before @)
	const userName = name || email.split('@')[0];
	
	const result = await pool.query(
		'INSERT INTO customer (name, email, password) VALUES ($1, $2, $3) RETURNING customer_id, name, email',
		[userName, email, hashedPassword]
	);
	return result.rows[0];
}

export async function findUserByEmail(email) {
	const result = await pool.query(
		'SELECT customer_id, name, email, username, password FROM customer WHERE email = $1',
		[email]
	);
	return result.rows[0] || null;
}

export async function findUserById(id) {
	const result = await pool.query(
		'SELECT customer_id, name, email, username FROM customer WHERE customer_id = $1',
		[id]
	);
	return result.rows[0] || null;
}

