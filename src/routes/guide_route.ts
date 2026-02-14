import { Router } from "express";
import {
  createGuideRequest,
  getAllGuideRequests,
  getMyGuideRequests,
  getMyRequestedGuides,
  getGuideRequest,
  approveGuideRequest,
  declineGuideRequest,
  deleteGuideRequest,
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../controllers/guide_controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

// Guide Request Routes (protected)
router.post("/requests", authenticateToken, createGuideRequest);
router.get("/requests/all", authenticateToken, getAllGuideRequests);
router.get("/requests/my-guide-requests", authenticateToken, getMyGuideRequests);
router.get("/requests/my-requested-guides", authenticateToken, getMyRequestedGuides);
router.get("/requests/:id", authenticateToken, getGuideRequest);
router.put("/requests/:id/approve", authenticateToken, approveGuideRequest);
router.put("/requests/:id/decline", authenticateToken, declineGuideRequest);
router.delete("/requests/:id", authenticateToken, deleteGuideRequest);

// Notification Routes (protected)
router.get("/notifications", authenticateToken, getNotifications);
router.get("/notifications/unread-count", authenticateToken, getUnreadCount);
router.put("/notifications/:id/read", authenticateToken, markNotificationAsRead);
router.put("/notifications/mark-all-read", authenticateToken, markAllNotificationsAsRead);
router.delete("/notifications/:id", authenticateToken, deleteNotification);

export default router;
