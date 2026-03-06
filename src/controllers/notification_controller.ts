import { Request, Response, NextFunction } from "express";
import NotificationModel from "../models/notification";
import { HttpError } from "../errors/http-error";

const isTestEnv = process.env.NODE_ENV === "test" || !!process.env.JEST_WORKER_ID;

export class NotificationController {
  // Get notifications for a guide
  getGuideNotifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!isTestEnv) {
        console.log("=== getGuideNotifications called ===");
        console.log("Request headers:", req.headers.authorization?.substring(0, 50));
      }
      
      const guideId = (req as any).guideId;
      if (!isTestEnv) {
        console.log("Extracted guideId from request:", guideId);
      }
      
      if (!guideId) {
        if (!isTestEnv) {
          console.log("No guideId found - authentication may have failed");
        }
        throw new HttpError(401, "Guide authentication required");
      }

      if (!isTestEnv) {
        console.log("Fetching notifications for guide:", guideId);
      }

      // Fetch notifications for this guide AND system notifications (where guideId is not set for new_request types)
      const notifications = await NotificationModel.find({
        $or: [
          { guideId }, // Notifications specifically for this guide
          { guideId: { $exists: false }, type: "new_request" }, // System requests visible to all guides
          { guideId: null, type: "new_request" } // Alternative null check
        ]
      })
        .sort({ createdAt: -1 })
        .limit(50);

      if (!isTestEnv) {
        console.log(`Found ${notifications.length} notifications for guide`);
      }

      return res.status(200).json({
        success: true,
        data: notifications,
      });
    } catch (error: any) {
      if (!isTestEnv) {
        console.error("=== Error in getGuideNotifications ===");
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      
      next(error);
    }
  };

  // Get notifications for a user
  getUserNotifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      
      if (!userId) {
        throw new HttpError(401, "User authentication required");
      }

      if (!isTestEnv) {
        console.log("Fetching notifications for user:", userId);
      }

      const notifications = await NotificationModel.find({ userId })
        .sort({ createdAt: -1 })
        .limit(50);

      if (!isTestEnv) {
        console.log(`Found ${notifications.length} notifications for user`);
      }

      return res.status(200).json({
        success: true,
        data: notifications,
      });
    } catch (error: any) {
      if (!isTestEnv) {
        console.error("Error fetching user notifications:", error);
      }
      next(error);
    }
  };

  // Mark notification as read
  markAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const guideId = (req as any).guideId;
      const userId = (req as any).userId;

      if (!isTestEnv) {
        console.log("Marking notification as read:", id);
      }

      const notification = await NotificationModel.findById(id);

      if (!notification) {
        throw new HttpError(404, "Notification not found");
      }

      // Verify ownership: can mark as read if you own it OR if it's a system notification
      const isSystemNotification = !notification.guideId && !notification.userId;
      const isOwner = 
        (guideId && notification.guideId?.toString() === guideId) ||
        (userId && notification.userId?.toString() === userId);

      if (!isOwner && !isSystemNotification) {
        throw new HttpError(403, "Not authorized to modify this notification");
      }

      notification.read = true;
      await notification.save();

      return res.status(200).json({
        success: true,
        data: notification,
        message: "Notification marked as read",
      });
    } catch (error: any) {
      if (!isTestEnv) {
        console.error("Error marking notification as read:", error);
      }
      next(error);
    }
  };

  // Delete notification
  deleteNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const guideId = (req as any).guideId;
      const userId = (req as any).userId;

      if (!isTestEnv) {
        console.log("Deleting notification:", id, "by guide:", guideId, "or user:", userId);
      }

      const notification = await NotificationModel.findById(id);

      if (!notification) {
        throw new HttpError(404, "Notification not found");
      }

      // Verify ownership: can delete if you own it OR if it's a system notification
      const isSystemNotification = !notification.guideId && !notification.userId;
      const isOwner = 
        (guideId && notification.guideId?.toString() === guideId) ||
        (userId && notification.userId?.toString() === userId);

      if (!isOwner && !isSystemNotification) {
        throw new HttpError(403, "Not authorized to delete this notification");
      }

      await NotificationModel.findByIdAndDelete(id);

      return res.status(200).json({
        success: true,
        message: "Notification deleted successfully",
      });
    } catch (error: any) {
      if (!isTestEnv) {
        console.error("Error deleting notification:", error);
      }
      next(error);
    }
  };

  // Create a notification (helper method)
  createNotification = async (data: {
    userId?: string;
    guideId?: string;
    guideRequestId?: string;
    type: "approval" | "decline" | "new_request" | "new_booking" | "booking_update" | "system";
    message: string;
  }) => {
    try {
      const notification = new NotificationModel(data);
      await notification.save();
      if (!isTestEnv) {
        console.log("Created notification:", notification);
      }
      return notification;
    } catch (error) {
      if (!isTestEnv) {
        console.error("Error creating notification:", error);
      }
      throw error;
    }
  };
}
