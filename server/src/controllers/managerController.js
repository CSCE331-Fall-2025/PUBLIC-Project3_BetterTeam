// NEED TO IMPORT WHATEVER MODEL YOU WANT TO BE ABLE TO CALL
import { getAllEmployees, getAllInventory, getAllDishes } from "../models/managerModel.js";

export async function getEmployees(req, res) {
    try {
        const items = await getAllEmployees();
        res.json(items);
    } catch (err) {
        console.error("Error fetching employees:", err);
        res.status(500).json({ error: "Failed to fetch employees" });
    }
}

export async function getInventory(req, res) {
    try {
        const items = await getAllInventory();
        res.json(items);
    } catch (err) {
        console.error("Error fetching inventory:", err);
        res.status(500).json({ error: "Failed to fetch inventory" });
    }
}

export async function getDishes(req, res) {
    try {
        const items = await getAllDishes();
        res.json(items);
    } catch (err) {
        console.error("Error fetching dishes:", err);
        res.status(500).json({ error: "Failed to fetch dishes" });
    }
}
