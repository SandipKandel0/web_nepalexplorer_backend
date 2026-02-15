import express from "express";
import { UserController } from "../controllers/user_controller";
import { uploads } from "../middlewares/upload.middleware";

const router = express.Router();
const userController = new UserController();

// Register user
router.post("/register", uploads.single("profileImage"), userController.registerUser);

// Login user
router.post("/login", userController.loginUser);

// Get user by ID
router.get("/:id", userController.getUserById);

// Update user
router.put("/:id", uploads.single("profileImage"), userController.updateUser);

// Favourite routes
router.post("/favourite/add", userController.addFavourite);
router.post("/favourite/remove", userController.removeFavourite);
router.get("/:userId/favourites", userController.getFavourites);

export default router;
