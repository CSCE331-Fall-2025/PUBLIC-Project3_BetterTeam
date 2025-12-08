import { Router } from "express";

// one again need to import any routes you want to use
import { createDish, getDishes, updateDishController, deleteDishController, getDishInventoryController, updateDishInventoryController, getSalesDishController } from "../controllers/managerDishController.js";

// create an express router
const router = Router();

// so this route is relative to the the example route in index.html and already has /api/manager/dish in front of it. Now it routes the full path of /api/manager/dish/ to the controller getDishes
router.post("/", createDish);
router.get("/", getDishes);
router.put("/:dish_id", updateDishController);
router.delete("/:dish_id", deleteDishController);

router.get("/dishInventory", getDishInventoryController);
router.put("/:dish_id/ingredients", updateDishInventoryController);

router.get("/sales", getSalesDishController)

export default router;
