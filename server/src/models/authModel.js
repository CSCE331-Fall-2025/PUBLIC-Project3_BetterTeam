import { pool } from "../db.js";

// ~~~~~~~~~~~~~~~~~~~~~
// CUSTOMER TABLE 
// ~~~~~~~~~~~~~~~~~~~~~~
export async function createCustomer(email, hashedPassword, name = null) {
  // If name not provided, extract from email (part before @)
  const userName = name || email.split("@")[0];

  const result = await pool.query(
    `
    INSERT INTO customer (name, email, password) 
    VALUES ($1, $2, $3) 
    RETURNING customer_id, name, email
    `,
    [userName, email, hashedPassword]
  );
  return result.rows[0];
}

export async function findCustomerByEmail(email) {
  const result = await pool.query(
    `
    SELECT customer_id, name, email, username, password 
    FROM customer 
    WHERE email = $1
    `,
    [email]
  );
  return result.rows[0] || null;
}

export async function findCustomerById(id) {
  const result = await pool.query(
    `
    SELECT customer_id, name, email, username 
    FROM customer 
    WHERE customer_id = $1
    `,
    [id]
  );
  return result.rows[0] || null;
}


// ~~~~~~~~~~~~~~~~~~~~
// EMPLOYEE TABLE
// ~~~~~~~~~~~~~~~~~~~~
export async function createEmployee({ name, isManager, wage, email, hashedPassword }) {
  const result = await pool.query(
    `
    INSERT INTO employee (name, ismanager, wage, email, password) 
    VALUES ($1, $2, $3, $4, $5) 
    RETURNING employee_id, name, ismanager, wage, email
    `,
    [name, isManager, wage, email, hashedPassword]
  );
  return result.rows[0];
}

export async function findEmployeeByEmail(email) {
  const result = await pool.query(
    `
    SELECT employee_id, name, ismanager, email, password 
    FROM employee 
    WHERE email = $1
    `,
    [email]
  );
  return result.rows[0] || null;
}

// TODO: Be able to remove an employee (hire/fire... the full API)
