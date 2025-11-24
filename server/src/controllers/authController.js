import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../models/userModel.js";

// Signup controller - creates a new user account
export async function signup(req, res) {
	try {
		const { email, password } = req.body;

		// Validate input
		if (!email || !password) {
			return res.status(400).json({ error: "Email and password are required" });
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({ error: "Invalid email format" });
		}

		// Validate password length
		if (password.length < 6) {
			return res.status(400).json({ error: "Password must be at least 6 characters long" });
		}

		// Check if user already exists
		const existingUser = await findUserByEmail(email);
		if (existingUser) {
			return res.status(409).json({ error: "User with this email already exists" });
		}

		// Hash password
		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		// Create user (name will be extracted from email if not provided)
		const { name } = req.body;
		const newUser = await createUser(email, hashedPassword, name);

		// Generate JWT token
		const token = jwt.sign(
			{ userId: newUser.customer_id, email: newUser.email },
			process.env.JWT_SECRET || "your-secret-key-change-in-production",
			{ expiresIn: "7d" }
		);

		// Return user data and token (without password)
		res.status(201).json({
			message: "User created successfully",
			user: {
				id: newUser.customer_id,
				name: newUser.name,
				email: newUser.email,
			},
			token,
		});
	} catch (err) {
		console.error("Error in signup:", err);
		res.status(500).json({ error: "Failed to create user account" });
	}
}

// Login controller - authenticates a user
export async function login(req, res) {
	try {
		const { email, password } = req.body;

		// Validate input
		if (!email || !password) {
			return res.status(400).json({ error: "Email and password are required" });
		}

		// Find user by email
		const user = await findUserByEmail(email);
		if (!user) {
			return res.status(401).json({ error: "Invalid email or password" });
		}

		// Verify password (check if password exists and is valid)
		if (!user.password) {
			return res.status(401).json({ error: "Invalid email or password" });
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(401).json({ error: "Invalid email or password" });
		}

		// Generate JWT token
		const token = jwt.sign(
			{ userId: user.customer_id, email: user.email },
			process.env.JWT_SECRET || "your-secret-key-change-in-production",
			{ expiresIn: "7d" }
		);

		// Return user data and token (without password)
		res.json({
			message: "Login successful",
			user: {
				id: user.customer_id,
				name: user.name,
				email: user.email,
			},
			token,
		});
	} catch (err) {
		console.error("Error in login:", err);
		res.status(500).json({ error: "Failed to authenticate user" });
	}
}

