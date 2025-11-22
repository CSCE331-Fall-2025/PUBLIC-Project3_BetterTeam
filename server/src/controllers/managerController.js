// NEED TO IMPORT WHATEVER MODEL YOU WANT TO BE ABLE TO CALL
import { getAllEmployees, getAllInventory, getAllDishes, updateEmployee } from "../models/managerModel.js";

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

export async function updateEmployeeController(req, res){
    try{
        const {employee_id} = req.params;
        const {name, ismanager, wage} = req.body;

        if(!name || !ismanager === undefined || wage === undefined) {
            return res.status(400).json({error: "Missing required fields (name, ismanager, wage)"});
        }

        const updatedEmployeeResult = await updateEmployee(employee_id, name, ismanager, wage);

        if(updatedEmployeeResult){
            res.json(updatedEmployeeResult);
        } else{
            res.status(404).json({error: "Employee not found"});
        }
    } catch(err){
        console.error("Error updating employee:", err);
        res.status(500).json({error: "Failed to update employee"});
    }
}
