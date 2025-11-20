import { Router } from "express";

// one againe need to import any routes you want to use
import { getEmployees } from "../controllers/employeeController.js";

// create an express router
const router = Router();

// so this route is relative to the the example route in index.html and already has /api/employee in front of it. Now it routes the full path of /api/employee/ to the controller getEmployees
router.get("/", getEmployees);

export default router;
