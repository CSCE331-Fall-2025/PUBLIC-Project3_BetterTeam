import { CustomerModel } from "../models/customerModel.js";
import bcrypt from "bcrypt";

export async function getProfile(req, res) {
    try {
        const { customer_id } = req.params;
        const customer = await CustomerModel.getCustomerById(customer_id);

        if (!customer) {
            return res.status(404).json({ error: "Customer not found" });
        }

        res.json(customer);
    } catch (err) {
        console.error("Error fetching profile:", err);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
}

export async function updateCustomer(req, res) {
    try {
        const customer_id = req.params.customer_id;
        const { name, email, username, password } = req.body;

        const existing = await CustomerModel.getCustomerById(customer_id);
        if (!existing) {
            return res.status(404).json({ error: "Customer not found" });
        }
        const newName = name?.trim() !== "" ? name : existing.name;
        const newEmail = email?.trim() !== "" ? email : existing.email;
        const newUsername = username?.trim() !== "" ? username : existing.username;

        let hashedPassword = existing.password;
        if (password && password.trim() !== "") {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const updated = await CustomerModel.updateCustomer(customer_id, {
            name: newName,
            email: newEmail,
            username: newUsername,
            password: hashedPassword
        });

        res.json(updated);
    } catch (err) {
        console.error("Error updating customer:", err);
        res.status(500).json({ error: "Failed to update profile" });
    }
}

export async function getOrdersForCustomer(req, res) {
    try {
        const { customer_id } = req.params;
        const orders = await CustomerModel.getOrdersForCustomer(customer_id);
        res.json(orders);
    } catch (err) {
        console.error("Error fetching orders:", err);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
}
