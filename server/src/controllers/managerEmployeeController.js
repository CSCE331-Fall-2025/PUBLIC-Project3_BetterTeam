// NEED TO IMPORT WHATEVER MODEL YOU WANT TO BE ABLE TO CALL
import { newEmployee, getAllEmployees, updateEmployee, deleteEmployee } from "../models/managerEmployeeModel.js";

export async function createEmployee(req, res){
    try{
        const {name, ismanager, wage} = req.body;

        if(!name || ismanager === undefined || wage === undefined) {
            return res.status(400).json({error: "Missing required fields (name, ismanager, wage)"});
        }

        const createdEmployeeResult = await newEmployee(name, ismanager, wage);

        if(createdEmployeeResult){
            res.json(createdEmployeeResult);
        } else{
            res.status(400).json({error: "Employee not created"});
        }
    } catch(err){
        console.error("Error creating employee:", err);
        res.status(500).json({error: "Failed to create employee"});
    }
}

export async function getEmployees(req, res) {
    try {
        const items = await getAllEmployees();
        res.json(items);
    } catch (err) {
        console.error("Error fetching employees:", err);
        res.status(500).json({ error: "Failed to fetch employees" });
    }
}

export async function updateEmployeeController(req, res){
    try{
        const {employee_id} = req.params;
        const {name, ismanager, wage} = req.body;

        if(!name || ismanager === undefined || wage === undefined) {
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

export async function deleteEmployeeController(req, res){
    try{
        const{employee_id} = req.params;

        const deletedEmployeeResult = await deleteEmployee(employee_id);

        if(deletedEmployeeResult){
            res.json({message: `Employee ID ${deletedEmployeeResult.employee_id} deleted sucessfully.`});
        } else{
            res.status(404).json({error: "Employee not found"});
        }
    } catch(err){
        console.error("Error deleting employee:", err);
        res.status(500).json({error: "Failed to delete employee"});
    }
}
