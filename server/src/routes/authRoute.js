import { Router } from "express";
import { signup, login } from "../controllers/userController.js";

const router = Router();

// POST /api/users/signup - Create a new user account
router.post("/signup", signup);

// POST /api/users/login - Authenticate a user
router.post("/login", login);

export default router;