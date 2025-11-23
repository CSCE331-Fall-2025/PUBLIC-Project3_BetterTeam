import { Router } from "express";

// one again need to import any routes you want to use
import { getDishes } from "../controllers/managerDishController.js";

// create an express router
const router = Router();

// so this route is relative to the the example route in index.html and already has /api/manager/dish in front of it. Now it routes the full path of /api/manager/dish/ to the controller getDishes.
router.get("/", getDishes);

export default router;
