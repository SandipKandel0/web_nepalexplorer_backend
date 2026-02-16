import express from "express";
import { UserController } from "../controllers/user_controller";
import { NotificationController } from "../controllers/notification_controller";
import { uploads } from "../middlewares/upload.middleware";
import { authenticateUser } from "../middlewares/auth.middleware";

const router = express.Router();
const userController = new UserController();
const notificationController = new NotificationController();

// Register user
router.post("/register", uploads.single("profileImage"), userController.registerUser);

// Login user
router.post("/login", userController.loginUser);

// Notification routes (protected)
router.get("/notifications", authenticateUser, notificationController.getUserNotifications);
router.put("/notifications/:id/read", authenticateUser, notificationController.markAsRead);
router.delete("/notifications/:id", authenticateUser, notificationController.deleteNotification);

// Get user by ID
router.get("/:id", userController.getUserById);

// Update user
router.put("/:id", uploads.single("profileImage"), userController.updateUser);

// Favourite routes
router.post("/favourite/add", userController.addFavourite);
router.post("/favourite/remove", userController.removeFavourite);
router.get("/:userId/favourites", userController.getFavourites);

export default router;
