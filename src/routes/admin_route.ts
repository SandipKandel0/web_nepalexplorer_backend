import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/admin_controller";
import {
  createDestination,
  getAllDestinations,
  deleteDestination,
  updateDestination,
} from "../controllers/destination_controller";
import {
  deleteGuideForAdmin,
  getAllGuidesForAdmin,
} from "../controllers/admin_guide_controller";
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

// POST /api/admin/destinations - Upload destination with image
router.post("/destinations", uploads.single("image"), createDestination);

// GET /api/admin/destinations - List uploaded destinations
router.get("/destinations", getAllDestinations);

// DELETE /api/admin/destinations/:id - Delete destination
router.delete("/destinations/:id", deleteDestination);

// PUT /api/admin/destinations/:id - Update destination with optional image
router.put("/destinations/:id", uploads.single("image"), updateDestination);

// GET /api/admin/guides - List all guides
router.get("/guides", getAllGuidesForAdmin);

// DELETE /api/admin/guides/:id - Delete guide
router.delete("/guides/:id", deleteGuideForAdmin);

export default router;
