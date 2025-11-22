import { Router } from "express";
import { fetchAllDishes, fetchDishesByType } from "../controllers/dishController.js";

const router = Router();

router.get("/", fetchAllDishes);

router.get("/:type", fetchDishesByType);

export default router;