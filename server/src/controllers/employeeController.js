// NEED TO IMPORT WHATEVER MODEL YOU WANT TO BE ABLE TO CALL
import { getAllEmployees } from "../models/employeeModel.js";

export async function getEmployees(req, res) {
    try {
        const items = await getAllEmployees();
        res.json(items);
    } catch (err) {
        console.error("Error fetching employees:", err);
        res.status(500).json({ error: "Failed to fetch employees" });
    }
}
