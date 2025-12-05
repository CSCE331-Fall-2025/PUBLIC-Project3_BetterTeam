import { Router } from "express";
import { getProfile, updateCustomer, getOrdersForCustomer } from "../controllers/customerController.js";

const router = Router();

router.get("/:customer_id", getProfile);
router.put("/:customer_id", updateCustomer);
router.get("/:customer_id/orders", getOrdersForCustomer);

export default router;
