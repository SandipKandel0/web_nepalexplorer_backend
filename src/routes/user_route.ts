import { Router } from "express";
import { registerUser, loginUser } from "../controllers/user_controller";

const router = Router();

// Register endpoint
router.post("/register", registerUser);

// Login endpoint
router.post("/login", loginUser);

export default router;
