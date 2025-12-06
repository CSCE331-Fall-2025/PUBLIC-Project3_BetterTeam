import { Router } from "express";
import { getInventoryItem } from "../controllers/inventoryController.js";

const router = Router();

router.get("/:id", getInventoryItem);

export default router;
