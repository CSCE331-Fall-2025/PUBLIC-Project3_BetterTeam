import { EmployeeModel } from "../models/employeeModel.js";
import bcrypt from "bcrypt";

export async function getProfile(req, res) {
    try {
        const { employee_id } = req.params;
        const employee = await EmployeeModel.getEmployeeById(employee_id);

        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        res.json(employee);
    } catch (err) {
        console.error("Error fetching profile:", err);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
}

export async function updateEmployee(req, res) {
    try {
        const employee_id = req.params.employee_id;
        const { name, email, password } = req.body;

        const existing = await EmployeeModel.getEmployeeById(employee_id);
        if (!existing) {
            return res.status(404).json({ error: "Employee not found" });
        }
        const newName = name?.trim() !== "" ? name : existing.name;
        const newEmail = email?.trim() !== "" ? email : existing.email;

        let hashedPassword = existing.password;
        if (password && password.trim() !== "") {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const updated = await EmployeeModel.updateEmployee(employee_id, {
            name: newName,
            email: newEmail,    
            password: hashedPassword
        });

        res.json(updated);
    } catch (err) {
        console.error("Error updating employee:", err);
        res.status(500).json({ error: "Failed to update profile" });
    }
}

export async function getOrdersForEmployee(req, res) {
    try {
        const { employee_id } = req.params;
        const orders = await EmployeeModel.getOrdersForEmployee(employee_id);
        res.json(orders);
    } catch (err) {
        console.error("Error fetching orders:", err);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
}
