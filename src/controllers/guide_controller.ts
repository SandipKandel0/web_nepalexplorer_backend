import { Request, Response } from "express";
import { GuideRequestService, NotificationService } from "../services/guide_service";
import { GuideRequestDTO, GuideRequestStatusDTO } from "../dtos/user_dtos";

const guideRequestService = new GuideRequestService();
const notificationService = new NotificationService();

// Create guide request
export const createGuideRequest = async (req: Request, res: Response) => {
  try {
    const validated = GuideRequestDTO.parse(req.body);
    const guestId = req.userId; // From auth middleware

    const data = {
      guestId,
      guideId: validated.guideId,
      tripDate: validated.tripDate,
      duration: validated.duration,
      location: validated.location,
      description: validated.description,
      budget: validated.budget,
      numberOfPeople: validated.numberOfPeople,
      guestName: req.body.guestName, // For notification message
    };

    const guideRequest = await guideRequestService.createGuideRequest(data);

    res.status(201).json({
      success: true,
      message: "Guide request created successfully",
      data: guideRequest,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message:
        error.errors?.map((e: any) => e.message).join(", ") ||
        error.message ||
        "Failed to create guide request",
    });
  }
};

// Get all guide requests (admin)
export const getAllGuideRequests = async (req: Request, res: Response) => {
  try {
    const requests = await guideRequestService.getAllGuideRequests();
    res.status(200).json({
      success: true,
      message: "Guide requests retrieved successfully",
      data: requests,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to retrieve guide requests",
    });
  }
};

// Get guide requests for logged-in guide
export const getMyGuideRequests = async (req: Request, res: Response) => {
  try {
    const guideId = req.userId;
    const requests = await guideRequestService.getGuideRequestsForGuide(
      guideId!
    );
    res.status(200).json({
      success: true,
      message: "Guide requests retrieved successfully",
      data: requests,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to retrieve guide requests",
    });
  }
};

// Get guide requests by guest
export const getMyRequestedGuides = async (req: Request, res: Response) => {
  try {
    const guestId = req.userId;
    const requests = await guideRequestService.getGuideRequestsByGuest(
      guestId!
    );
    res.status(200).json({
      success: true,
      message: "Guide requests retrieved successfully",
      data: requests,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to retrieve guide requests",
    });
  }
};

// Get single guide request
export const getGuideRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const request = await guideRequestService.getGuideRequestById(id);
    res.status(200).json({
      success: true,
      message: "Guide request retrieved successfully",
      data: request,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to retrieve guide request",
    });
  }
};

// Approve guide request (guide only)
export const approveGuideRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const request = await guideRequestService.approveGuideRequest(id);
    res.status(200).json({
      success: true,
      message: "Guide request approved successfully",
      data: request,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to approve guide request",
    });
  }
};

// Decline guide request (guide only)
export const declineGuideRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const request = await guideRequestService.declineGuideRequest(id);
    res.status(200).json({
      success: true,
      message: "Guide request declined successfully",
      data: request,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to decline guide request",
    });
  }
};

// Delete guide request
export const deleteGuideRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const request = await guideRequestService.deleteGuideRequest(id);
    res.status(200).json({
      success: true,
      message: "Guide request deleted successfully",
      data: request,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to delete guide request",
    });
  }
};

// Get user notifications
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const notifications = await notificationService.getUserNotifications(
      userId!
    );
    res.status(200).json({
      success: true,
      message: "Notifications retrieved successfully",
      data: notifications,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to retrieve notifications",
    });
  }
};

// Get unread notifications count
export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const count = await notificationService.getUnreadCount(userId!);
    res.status(200).json({
      success: true,
      message: "Unread count retrieved successfully",
      data: { count },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to retrieve unread count",
    });
  }
};

// Mark notification as read
export const markNotificationAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notification = await notificationService.markAsRead(id);
    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to mark notification as read",
    });
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.userId;
    const result = await notificationService.markAllAsRead(userId!);
    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to mark all notifications as read",
    });
  }
};

// Delete notification
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notification = await notificationService.deleteNotification(id);
    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
      data: notification,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to delete notification",
    });
  }
};
