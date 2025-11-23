// NEED TO IMPORT WHATEVER MODEL YOU WANT TO BE ABLE TO CALL
import { getAllInventory } from "../models/managerInventoryModel.js";

export async function getInventory(req, res) {
    try {
        const items = await getAllInventory();
        res.json(items);
    } catch (err) {
        console.error("Error fetching inventory:", err);
        res.status(500).json({ error: "Failed to fetch inventory" });
    }
}