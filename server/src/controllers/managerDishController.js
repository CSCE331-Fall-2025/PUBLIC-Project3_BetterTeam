// NEED TO IMPORT WHATEVER MODEL YOU WANT TO BE ABLE TO CALL
import { getAllDishes } from "../models/managerDishModel.js";

export async function getDishes(req, res) {
    try {
        const items = await getAllDishes();
        res.json(items);
    } catch (err) {
        console.error("Error fetching dishes:", err);
        res.status(500).json({ error: "Failed to fetch dishes" });
    }
}
