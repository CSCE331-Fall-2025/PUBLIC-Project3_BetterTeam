import { Router } from "express";
import { fetchAllDishes, fetchDishesByType, fetchIngredientsForDish } from "../controllers/dishController.js";

const router = Router();

router.get("/", fetchAllDishes);

router.get("/:type", fetchDishesByType);

router.get("/:dishId/ingredients", fetchIngredientsForDish);

export default router;