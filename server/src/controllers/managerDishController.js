// NEED TO IMPORT WHATEVER MODEL YOU WANT TO BE ABLE TO CALL
import { newDish, getAllDishes, updateDish, deleteDish, getDishInventory, updateDishInventory } from "../models/managerDishModel.js";

export async function createDish(req, res){
    try{
        const {name, type, price} = req.body;

        if(!name || type === undefined || price === undefined) {
            return res.status(400).json({error: "Missing required fields (name, type, price)"});
        }

        const createdDishResult = await newDish(name, type, price);

        if(createdDishResult){
            res.json(createdDishResult);
        } else{
            res.status(400).json({error: "Dish not created"});
        }
    } catch(err){
        console.error("Error creating dish:", err);
        res.status(500).json({error: "Failed to create dish"});
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

export async function updateDishController(req, res){
    try{
        const {dish_id} = req.params;
        const {name, type, price} = req.body;

        if(!name || type === undefined || price === undefined) {
            return res.status(400).json({error: "Missing required fields (name, type, price)"});
        }

        const updatedDishResult = await updateDish(dish_id, name, type, price);

        if(updatedDishResult){
            res.json(updatedDishResult);
        } else{
            res.status(404).json({error: "Dish not found"});
        }
    } catch(err){
        console.error("Error updating dish:", err);
        res.status(500).json({error: "Failed to update dish"});
    }
}

export async function deleteDishController(req, res){
    try{
        const{dish_id} = req.params;

        const deletedDishResult = await deleteDish(dish_id);

        if(deletedDishResult){
            res.json({message: `Dish ID ${deletedDishResult.dish_id} deleted sucessfully.`});
        } else{
            res.status(404).json({error: "Dish not found"});
        }
    } catch(err){
        console.error("Error deleting dish:", err);
        res.status(500).json({error: "Failed to delete dish"});
    }
}

export async function getDishInventoryController(req, res) {
    try {
        const items = await getDishInventory();
        res.json(items);
    } catch (err) {
        console.error("Error fetching dish inventory:", err);
        res.status(500).json({ error: "Failed to fetch dish inventory" });
    }
}

export async function updateDishInventoryController(req, res){
    try{
        const {dish_id} = req.params;
        const {newInventory} = req.body;

        if(!newInventory || !Array.isArray(newInventory)) {
            return res.status(400).json({error: "Missing or invalid inventory array"});
        }

        await updateDishInventory(dish_id, newInventory);

        res.json({ message: "DishInventory updated successfully."});
    } catch(err){
        console.error("Error updating dish inventory:", err);
        res.status(500).json({error: "Failed to update dish inventory"});
    }
}