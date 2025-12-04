
import { Router } from "express";

import { 
    signup, 
    login, 
    // hireEmployee 
} from "../controllers/authController.js";

import { requireRole } from "../middleware/auth.js";

const router = Router();

// Customer signup
router.post("/signup", signup);

// Unified login (customer + employee)
router.post("/login", login);

// Manager Only req for hiring
// router.post("/hire", requireRole(["manager"]), hireEmployee);
//TODO: router.post("/fire", requireRole(["manager"]), fireEmployee);

export default router;

