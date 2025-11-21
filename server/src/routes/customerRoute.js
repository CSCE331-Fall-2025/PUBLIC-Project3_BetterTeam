import { Router } from "express";
import { fetchAllDishes, fetchDishesByType } from "../controllers/customerController.js";

const router = Router();

router.get("/", fetchAllDishes);

router.get("/:type", fetchDishesByType);

export default router;