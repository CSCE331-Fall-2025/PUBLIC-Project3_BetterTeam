import { getInventoryItemById } from "../models/inventoryModel.js";

export async function getInventoryItem(req, res) {
    try {
        const id = Number(req.params.id);
        const item = await getInventoryItemById(id);

        if (!item) {
            return res.status(404).json({ error: "Inventory item not found" });
        }

        return res.json(item);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to fetch inventory item" });
    }
}
