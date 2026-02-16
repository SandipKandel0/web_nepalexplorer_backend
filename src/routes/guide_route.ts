import express from "express";
import { GuideController } from "../controllers/guide_controller";
import { NotificationController } from "../controllers/notification_controller";
import { uploads } from "../middlewares/upload.middleware";
import { authenticateGuide } from "../middlewares/auth.middleware";

const router = express.Router();
const guideController = new GuideController();
const notificationController = new NotificationController();

// Register guide
router.post("/register", uploads.single("profileImage"), guideController.registerGuide);

// Login guide
router.post("/login", guideController.loginGuide);

// Notification routes (protected) - MUST be before /:id route
router.get("/notifications", authenticateGuide, notificationController.getGuideNotifications);
router.put("/notifications/:id/read", authenticateGuide, notificationController.markAsRead);
router.delete("/notifications/:id", authenticateGuide, notificationController.deleteNotification);

// Get all guides
router.get("/", guideController.getAllGuides);

// Get guide by ID
router.get("/:id", guideController.getGuideById);

// Update guide
router.put("/:id", uploads.single("profileImage"), guideController.updateGuide);

export default router;
