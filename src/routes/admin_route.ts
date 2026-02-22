import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/admin_controller";
import { authorizeAdmin } from "../middlewares/auth.middleware";
import { uploads } from "../middlewares/upload.middleware";

const router = Router();

// All admin routes are protected by authorizeAdmin middleware
router.use(authorizeAdmin);

// POST /api/admin/users - Create user with image
router.post("/users", uploads.single("image"), createUser);

// GET /api/admin/users - Get all users
router.get("/users", getAllUsers);

// GET /api/admin/users/:id - Get user by ID
router.get("/users/:id", getUserById);

// PUT /api/admin/users/:id - Update user with optional image
router.put("/users/:id", uploads.single("image"), updateUser);

// DELETE /api/admin/users/:id - Delete user
router.delete("/users/:id", deleteUser);

export default router;
