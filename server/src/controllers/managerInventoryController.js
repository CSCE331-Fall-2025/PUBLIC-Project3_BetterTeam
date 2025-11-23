// NEED TO IMPORT WHATEVER MODEL YOU WANT TO BE ABLE TO CALL
import { newInventory, getAllInventory, updateInventory, deleteInventory } from "../models/managerInventoryModel.js";

export async function createInventory(req, res){
    try{
        const {item, current_inventory, target_inventory} = req.body;

        if(!item || current_inventory === undefined || target_inventory === undefined) {
            return res.status(400).json({error: "Missing required fields (item, current_inventory, target_inventory)"});
        }

        const createdInventoryResult = await newInventory(item, current_inventory, target_inventory);

        if(createdInventoryResult){
            res.json(createdInventoryResult);
        } else{
            res.status(400).json({error: "Inventory not created"});
        }
    } catch(err){
        console.error("Error creating inventory:", err);
        res.status(500).json({error: "Failed to create inventory"});
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

export async function updateInventoryController(req, res){
    try{
        const {inventory_id} = req.params;
        const {item, current_inventory, target_inventory} = req.body;

        if(!item || current_inventory === undefined || target_inventory === undefined) {
            return res.status(400).json({error: "Missing required fields (item, current_inventory, target_inventory)"});
        }

        const updatedInventoryResult = await updateInventory(inventory_id, item, current_inventory, target_inventory);

        if(updatedInventoryResult){
            res.json(updatedInventoryResult);
        } else{
            res.status(404).json({error: "Inventory not found"});
        }
    } catch(err){
        console.error("Error updating inventory:", err);
        res.status(500).json({error: "Failed to update inventory"});
    }
}

export async function deleteInventoryController(req, res){
    try{
        const{inventory_id} = req.params;

        const deletedInventoryResult = await deleteInventory(inventory_id);

        if(deletedInventoryResult){
            res.json({message: `Inventory ID ${deletedInventoryResult.inventory_id} deleted sucessfully.`});
        } else{
            res.status(404).json({error: "Inventory not found"});
        }
    } catch(err){
        console.error("Error deleting inventory:", err);
        res.status(500).json({error: "Failed to delete inventory"});
    }
}
