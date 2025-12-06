import { Router } from "express";
import { getProfile, updateEmployee, getOrdersForEmployee } from "../controllers/employeeController.js";

const router = Router();

router.get("/:employee_id", getProfile);
router.put("/:employee_id", updateEmployee);
router.get("/:employee_id/orders", getOrdersForEmployee);

export default router;
