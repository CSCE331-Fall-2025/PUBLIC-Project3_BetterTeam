import { Router } from "express";

// one againe need to import any routes you want to use
import { getEmployees, getInventory, getDishes } from "../controllers/managerController.js";

// create an express router
const router = Router();

// so this route is relative to the the example route in index.html and already has /api/manager in front of it. Now it routes the full path of /api/manager/ to the controller getEmployees
router.get("/employee", getEmployees);
router.get("/inventory", getInventory);
router.get("/dish", getDishes);

export default router;
