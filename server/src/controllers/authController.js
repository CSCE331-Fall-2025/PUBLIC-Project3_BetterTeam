
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  createCustomer,
  findCustomerByEmail,
  createEmployee,
  findEmployeeByEmail,
} from "../models/authModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

// Standardized the resopnse object for all types of accounts (customers, cashiers, managers)
function makeAuthPayload(table, data) {
  if (table === "customer") {
    return {
      id: data.customer_id,
      table: "customer",
      role: "customer",
      name: data.name,
      email: data.email,
    };
  }
  else {
    const role = data.ismanager ? "manager" : "cashier";
    return {
      id: data.employee_id,
      table: "employee",
      role,
      name: data.name,
      email: data.email,
    };
  }
}

// Customer Sign up (onyl customer create accoutns via the signup page)
export async function signup(req, res) {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    // Check existing accounts (both customer & employee table) for duplicate attempt of email
    const existingCustomer = await findCustomerByEmail(email);
    const existingEmployee = await findEmployeeByEmail(email);

    if (existingCustomer || existingEmployee) {
      return res
        .status(409)
        .json({ error: "An account with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newCustomer = await createCustomer(email, hashedPassword, name);
    const payload = makeAuthPayload("customer", newCustomer);
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      message: "Customer created successfully",
      user: payload,
      token,
    });
  } catch (err) {
    console.error("Error in signup:", err);
    res.status(500).json({ error: "Failed to create account" });
  }
}


// Login... should work for both employee and customers
export async function login(req, res) {
  try {
    const { email, password } = req.body; 

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required" });
    }

    // Look up the accoutn in both employee table and the customer table
    // Try Employee
    let table = null;
    let data = await findEmployeeByEmail(email);

    if (data && data.password) {
      const ok = await bcrypt.compare(password, data.password);
      if (!ok) {
        return res
          .status(401)
          .json({ error: "Invalid email or password" });
      }
        table = "employee";
    } else {
      // Try customer
      data = await findCustomerByEmail(email);
      if (!data || !data.password) {
        return res
          .status(401)
          .json({ error: "Invalid email or password" });
      }
      const ok = await bcrypt.compare(password, data.password);
      if (!ok) {
        return res
          .status(401)
          .json({ error: "Invalid email or password" });
      }
      table = "customer";
    }

    const payload = makeAuthPayload(table, data);
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login successful",
      user: payload,
      token,
    });
  } catch (err) {
    console.error("Error in login:", err);
    res.status(500).json({ error: "Failed to authenticate user" });
  }
}


// Creating a new employee --> TODO: need to add the client side capabilities to do this
export async function hireEmployee(req, res) {
  try {
    const { name, wage, email, password, isManager } = req.body;

    if (!name || !wage || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Ensure no one else is using this email
    const existingCustomer = await findCustomerByEmail(email);
    const existingEmployee = await findEmployeeByEmail(email);
    if (existingCustomer || existingEmployee) {
      return res
        .status(409)
        .json({ error: "An account with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = await createEmployee({
      name,
      isManager: !!isManager,
      wage,
      email,
      hashedPassword,
    });

    const payload = makeAuthPayload("employee", newEmployee);

    res.status(201).json({
      message: "Employee created successfully",
      employee: payload,
    });
  } catch (err) {
    console.error("Error in hireEmployee:", err);
    res.status(500).json({ error: "Failed to create employee" });
  }
}

