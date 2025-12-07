
import { Router } from "express";

import { 
    signup, 
    login, 
} from "../controllers/authController.js";

import { requireRole } from "../middleware/auth.js";

const router = Router();

// Customer signup
router.post("/signup", signup);

// Unified login (customer + employee)
router.post("/login", login);

export default router;

