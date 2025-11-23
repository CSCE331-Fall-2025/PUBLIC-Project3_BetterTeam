import { Router } from "express";

// one again need to import any routes you want to use
import { createEmployee, getEmployees, updateEmployeeController, deleteEmployeeController} from "../controllers/managerEmployeeController.js";

// create an express router
const router = Router();

// so this route is relative to the the example route in index.html and already has /api/manager/employee in front of it. Now it routes the full path of /api/manager/employee to the controller getEmployees
router.post("/", createEmployee);
router.get("/", getEmployees);
router.put("/:employee_id", updateEmployeeController);
router.delete("/:employee_id", deleteEmployeeController);

export default router;
