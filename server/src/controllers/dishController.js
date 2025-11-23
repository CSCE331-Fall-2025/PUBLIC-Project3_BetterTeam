import { getAllDishes, getDishesByType } from "../models/dishModel.js";
import { getIngredientsForDish } from "../models/inventoryModel.js";

export async function fetchAllDishes(req, res){
    try{
        const dishes = await getAllDishes();
        res.json(dishes);
    } catch (err) {
        console.error("Error fetching all dishes:", err);
        res.status(500).json({ error: "Failed to load dishes" });
    }
}

export async function fetchDishesByType(req, res) {
    try {
        let { type } = req.params;

        if (type === "appetizer") type = "App";
        else if (type === "entree") type = "Entree";
        else if (type === "side") type = "Side";
        else if (type === "drink") type = "Drink";

        const dishes = await getDishesByType(type);

        const normalizeType = (t) => {
            const lowered = t.toLowerCase();
            return lowered === "app" ? "appetizer" : lowered;
        };

        const normalized = dishes.map((d) => ({
            ...d,
            type: normalizeType(d.type)
        }));

        res.json(normalized);

    } catch (err) {
        console.error("Error fetching dishes:", err);
        res.status(500).json({ error: "Failed to fetch dishes" });
    }
}

export async function fetchIngredientsForDish(req, res){
    try{
        const { dishId } = req.params;
        const rows= await getIngredientsForDish(dishId);
        const ingredients = rows.map((row) => ({
            inventory_id: row.inventory_id,
            name: row.item
        }));
        res.json(ingredients);
    } catch(err){
        console.error("Error fetching ingredients:", err);
        res.status(500).json({ error: "Failed to fetch ingredients" });
    }
}