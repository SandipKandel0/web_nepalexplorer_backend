import { Router } from "express";
import { registerUser, loginUser, updateUserProfile } from "../controllers/user_controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { uploads } from "../middlewares/upload.middleware";

const router = Router();

// Register endpoint
router.post("/register", registerUser);

// Login endpoint
router.post("/login", loginUser);

// Update user profile with optional image
router.put("/:id", authenticateToken, uploads.single("image"), updateUserProfile);

export default router;
