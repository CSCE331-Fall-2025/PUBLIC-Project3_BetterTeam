import { Router } from "express";

// one again need to import any routes you want to use
import { createInventory, getInventory, updateInventoryController, deleteInventoryController} from "../controllers/managerInventoryController.js";

// create an express router
const router = Router();

// so this route is relative to the the example route in index.html and already has /api/manager/inventory in front of it. Now it routes the full path of /api/manager/inventory to the controller getInventory
router.post("/", createInventory);
router.get("/", getInventory);
router.put("/:inventory_id", updateInventoryController);
router.delete("/:inventory_id", deleteInventoryController);

export default router;
